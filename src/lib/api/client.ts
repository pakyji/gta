/**
 * Client-side fetch helper with hard timeouts so UI never spins forever.
 */
import { readSessionToken } from "@/modules/session/token";

export class ClientApiError extends Error {
  status: number;
  code: string;
  constructor(status: number, message: string, code = "error") {
    super(message);
    this.status = status;
    this.code = code;
  }
}

interface Options extends Omit<RequestInit, "body"> {
  body?: unknown;
  timeoutMs?: number;
  skipAuth?: boolean;
}

export async function apiFetch<T>(url: string, opts: Options = {}): Promise<T> {
  const { body, timeoutMs = 12000, headers, skipAuth, ...rest } = opts;
  if (typeof navigator !== "undefined" && navigator.onLine === false) {
    throw new ClientApiError(0, "You're offline. Check your connection and try again.", "offline");
  }
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  const hdrs: Record<string, string> = {
    ...(body !== undefined ? { "Content-Type": "application/json" } : {}),
    ...(headers as Record<string, string> | undefined),
  };

  let finalUrl = url;
  if (!skipAuth) {
    const token = readSessionToken();
    if (token) {
      // The token travels only in headers, never in the URL (URLs end up in logs and history).
      hdrs.Authorization = `Bearer ${token}`;
      hdrs["x-session-token"] = token;
    }
  }

  try {
    const res = await fetch(finalUrl, {
      ...rest,
      signal: rest.signal ?? controller.signal,
      headers: hdrs,
      body: body !== undefined ? JSON.stringify(body) : undefined,
      cache: "no-store",
      credentials: "include",
    });
    const text = await res.text();
    let data: unknown = null;
    try {
      data = text ? JSON.parse(text) : null;
    } catch {
      data = null;
    }
    if (!res.ok) {
      const d = (data ?? {}) as { error?: string; code?: string };
      throw new ClientApiError(res.status, d.error ?? `Request failed (${res.status}).`, d.code ?? "error");
    }
    return data as T;
  } catch (err) {
    if (err instanceof ClientApiError) throw err;
    if (err instanceof DOMException && err.name === "AbortError") {
      throw new ClientApiError(0, "The request timed out. Your connection may be slow.", "timeout");
    }
    throw new ClientApiError(0, "Network error. Could not reach the server.", "network");
  } finally {
    clearTimeout(timer);
  }
}
