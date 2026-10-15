"use client";
/**
 * Session context — boots fast, never blocks the UI more than ~2.5s.
 */
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { apiFetch } from "@/lib/api/client";
import type { Platform } from "@/lib/constants";
import { captureTokenFromUrl, clearSessionToken, readSessionToken, writeSessionToken } from "./token";

export interface ClientUser {
  id: string;
  gamertag: string;
  platform: Platform;
  createdAt: string;
}

interface Ctx {
  user: ClientUser | null;
  ready: boolean;
  setUser: (u: ClientUser | null) => void;
  acceptSession: (user: ClientUser, token: string) => void;
  updateProfile: (patch: { gamertag?: string; platform?: Platform }) => Promise<ClientUser>;
  signOut: () => Promise<void>;
}

const SessionContext = createContext<Ctx | null>(null);

export function SessionProvider({ initialUser = null, children }: { initialUser?: ClientUser | null; children: ReactNode }) {
  const [user, setUser] = useState<ClientUser | null>(initialUser);
  const [ready, setReady] = useState(!!initialUser); // if server already gave us a user, we're ready

  useEffect(() => {
    let cancelled = false;
    const done = () => {
      if (!cancelled) setReady(true);
    };
    const hard = window.setTimeout(done, 2500);

    (async () => {
      try {
        captureTokenFromUrl();
        // If we already have a user from the server and no client token work to do, finish fast
        const token = readSessionToken();
        if (!token && initialUser) {
          done();
          return;
        }
        const res = await apiFetch<{ user: ClientUser | null }>("/api/session", { timeoutMs: 2000 });
        if (cancelled) return;
        if (res.user) {
          setUser(res.user);
          if (token) writeSessionToken(token);
        } else {
          if (token) clearSessionToken();
          if (!initialUser) setUser(null);
        }
      } catch {
        if (!cancelled && !initialUser) setUser(null);
      } finally {
        done();
      }
    })();

    return () => {
      cancelled = true;
      window.clearTimeout(hard);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const acceptSession = useCallback((u: ClientUser, token: string) => {
    writeSessionToken(token);
    setUser(u);
    setReady(true);
  }, []);

  const updateProfile = useCallback(async (patch: { gamertag?: string; platform?: Platform }) => {
    const res = await apiFetch<{ user: ClientUser }>("/api/session", { method: "PATCH", body: patch, timeoutMs: 8000 });
    setUser(res.user);
    return res.user;
  }, []);

  const signOut = useCallback(async () => {
    try {
      await apiFetch("/api/session", { method: "DELETE", timeoutMs: 5000 });
    } finally {
      clearSessionToken();
      setUser(null);
      window.location.assign("/");
    }
  }, []);

  const value = useMemo(
    () => ({ user, ready, setUser, acceptSession, updateProfile, signOut }),
    [user, ready, acceptSession, updateProfile, signOut],
  );
  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

export function useSession(): Ctx {
  const ctx = useContext(SessionContext);
  if (!ctx) throw new Error("useSession must be used inside SessionProvider");
  return ctx;
}
