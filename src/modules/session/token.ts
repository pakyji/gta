/**
 * Client-side session token storage.
 *
 * We write the same opaque session id to several places because preview
 * iframes / Brave / Safari ITP each block a different subset:
 *   1. localStorage   (survives reloads when storage is allowed)
 *   2. sessionStorage (often allowed even when localStorage is partitioned)
 *   3. document.cookie with SameSite=None; Secure; Partitioned (CHIPS)
 *   4. in-memory cache (same JS realm, survives soft navigations)
 *
 * The server still prefers the httpOnly cookie when the browser accepts it.
 */
import { SESSION_COOKIE, SESSION_TOKEN_KEY, SESSION_TTL_DAYS } from "@/lib/constants";

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

let memoryToken: string | null = null;

export function isSessionId(v: unknown): v is string {
  return typeof v === "string" && UUID_RE.test(v);
}

function readClientCookie(): string | null {
  if (typeof document === "undefined") return null;
  try {
    const match = document.cookie.match(new RegExp(`(?:^|; )${SESSION_TOKEN_KEY}=([^;]*)`));
    const v = match ? decodeURIComponent(match[1]) : null;
    return isSessionId(v) ? v : null;
  } catch {
    return null;
  }
}

function writeClientCookie(token: string | null): void {
  if (typeof document === "undefined") return;
  try {
    const secure = typeof location !== "undefined" && location.protocol === "https:";
    if (token && isSessionId(token)) {
      // Partitioned = CHIPS so Chrome accepts it inside a cross-site iframe.
      const parts = [
        `${SESSION_TOKEN_KEY}=${encodeURIComponent(token)}`,
        "Path=/",
        `Max-Age=${SESSION_TTL_DAYS * 86400}`,
        "SameSite=None",
      ];
      if (secure) {
        parts.push("Secure");
        parts.push("Partitioned");
      }
      document.cookie = parts.join("; ");
      // Also mirror under the server cookie name as a non-httpOnly fallback the
      // server can read if the httpOnly write was dropped.
      const mirror = [
        `${SESSION_COOKIE}=${encodeURIComponent(token)}`,
        "Path=/",
        `Max-Age=${SESSION_TTL_DAYS * 86400}`,
        "SameSite=None",
      ];
      if (secure) {
        mirror.push("Secure");
        mirror.push("Partitioned");
      }
      document.cookie = mirror.join("; ");
    } else {
      document.cookie = `${SESSION_TOKEN_KEY}=; Path=/; Max-Age=0; SameSite=None; Secure`;
      document.cookie = `${SESSION_COOKIE}=; Path=/; Max-Age=0; SameSite=None; Secure`;
    }
  } catch {
    /* ignore */
  }
}

export function readSessionToken(): string | null {
  if (memoryToken && isSessionId(memoryToken)) return memoryToken;
  if (typeof window === "undefined") return null;
  try {
    const ls = window.localStorage.getItem(SESSION_TOKEN_KEY);
    if (isSessionId(ls)) {
      memoryToken = ls;
      return ls;
    }
  } catch {
    /* ignore */
  }
  try {
    const ss = window.sessionStorage.getItem(SESSION_TOKEN_KEY);
    if (isSessionId(ss)) {
      memoryToken = ss;
      return ss;
    }
  } catch {
    /* ignore */
  }
  const c = readClientCookie();
  if (c) {
    memoryToken = c;
    return c;
  }
  return null;
}

export function writeSessionToken(token: string | null): void {
  memoryToken = isSessionId(token) ? token : null;
  if (typeof window === "undefined") return;
  try {
    if (memoryToken) window.localStorage.setItem(SESSION_TOKEN_KEY, memoryToken);
    else window.localStorage.removeItem(SESSION_TOKEN_KEY);
  } catch {
    /* ignore */
  }
  try {
    if (memoryToken) window.sessionStorage.setItem(SESSION_TOKEN_KEY, memoryToken);
    else window.sessionStorage.removeItem(SESSION_TOKEN_KEY);
  } catch {
    /* ignore */
  }
  writeClientCookie(memoryToken);
}

export function clearSessionToken(): void {
  writeSessionToken(null);
}

/**
 * Pull a one-time bootstrap token out of the URL (?t= or #t=) and persist it.
 * Returns the token if one was found.
 */
export function captureTokenFromUrl(): string | null {
  if (typeof window === "undefined") return null;
  try {
    const url = new URL(window.location.href);
    const fromQuery = url.searchParams.get("t") || url.searchParams.get("token");
    let fromHash: string | null = null;
    if (url.hash) {
      const hp = new URLSearchParams(url.hash.replace(/^#/, ""));
      fromHash = hp.get("t") || hp.get("token");
    }
    const raw = fromQuery || fromHash;
    if (!isSessionId(raw)) return null;
    writeSessionToken(raw);
    // Strip the token from the address bar so it isn't shared / bookmarked.
    url.searchParams.delete("t");
    url.searchParams.delete("token");
    if (url.hash && (url.hash.includes("t=") || url.hash.includes("token="))) url.hash = "";
    window.history.replaceState({}, "", url.pathname + url.search + url.hash);
    return raw;
  } catch {
    return null;
  }
}
