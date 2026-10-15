"use client";
/**
 * Auth gate — never stuck. 2.5s max wait then redirect home/welcome.
 */
import { useEffect, useState, type ReactNode } from "react";
import { LoadingState } from "@/components/ui/States";
import { apiFetch } from "@/lib/api/client";
import { captureTokenFromUrl, readSessionToken, writeSessionToken } from "./token";
import { useSession, type ClientUser } from "./SessionProvider";

export function AuthGate({ children }: { children: ReactNode }) {
  const { user, ready, setUser } = useSession();
  const [retrying, setRetrying] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    captureTokenFromUrl();
  }, []);

  useEffect(() => {
    if (!ready || user || failed || retrying) return;

    let urlToken: string | null = null;
    try {
      const u = new URL(window.location.href);
      urlToken = u.searchParams.get("t") || u.searchParams.get("token");
    } catch {
      /* ignore */
    }
    const t = readSessionToken() || urlToken;
    if (!t) {
      // Storage is client-only, so the "no token" result is known only inside this effect.
      const none = window.setTimeout(() => setFailed(true), 0);
      return () => window.clearTimeout(none);
    }

    let hard: number | undefined;
    const start = window.setTimeout(() => {
      setRetrying(true);
      hard = window.setTimeout(() => {
        setRetrying(false);
        setFailed(true);
      }, 2500);

      (async () => {
      try {
        if (urlToken) writeSessionToken(urlToken);
        // The token goes in the Authorization header (apiFetch adds it), never in the URL.
        const res = await apiFetch<{ user: ClientUser | null }>("/api/session", { timeoutMs: 2000 });
        if (res.user) {
          writeSessionToken(t);
          setUser(res.user);
          try {
            const u = new URL(window.location.href);
            u.searchParams.delete("t");
            u.searchParams.delete("token");
            window.history.replaceState({}, "", u.pathname + u.search + u.hash);
          } catch {
            /* ignore */
          }
        } else {
          setFailed(true);
        }
      } catch {
        setFailed(true);
      } finally {
        if (hard !== undefined) window.clearTimeout(hard);
        setRetrying(false);
      }
      })();
    }, 0);

    return () => {
      window.clearTimeout(start);
      if (hard !== undefined) window.clearTimeout(hard);
    };
  }, [ready, user, failed, retrying, setUser]);

  useEffect(() => {
    if (failed && !user) {
      const id = window.setTimeout(() => {
        window.location.replace("/");
      }, 400);
      return () => window.clearTimeout(id);
    }
  }, [failed, user]);

  if (user) return <>{children}</>;

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-3 py-20">
      <LoadingState label={retrying || !ready ? "Signing you in…" : "Redirecting…"} />
      <button
        type="button"
        className="tap text-xs font-semibold text-neon-blue"
        onClick={() => {
          window.location.replace("/");
        }}
      >
        Back to welcome
      </button>
    </div>
  );
}
