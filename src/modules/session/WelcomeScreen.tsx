"use client";
/**
 * Welcome / onboarding — never hangs on "Restoring…".
 * Restore attempt is capped at 2.5s; on any failure we show the form.
 */
import Image from "next/image";
import { useEffect, useState, type FormEvent } from "react";
import { Button } from "@/components/ui/Button";
import { InlineError } from "@/components/ui/States";
import { IconGamepad } from "@/components/ui/Icons";
import { apiFetch, ClientApiError } from "@/lib/api/client";
import { DEVELOPER, GAMERTAG_MAX, PLATFORM_LABEL, PLATFORMS, type Platform, validateGamertag } from "@/lib/constants";
import { captureTokenFromUrl, clearSessionToken, readSessionToken, writeSessionToken } from "./token";
import type { ClientUser } from "./SessionProvider";

export function WelcomeScreen({ dbError }: { dbError: string | null }) {
  const [platform, setPlatform] = useState<Platform | null>(null);
  const [gamertag, setGamertag] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(dbError);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [restoring, setRestoring] = useState(true);
  const [hint, setHint] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    const finish = () => {
      if (!cancelled) setRestoring(false);
    };
    // Absolute safety: never leave the user on "Restoring…" longer than 2.5s
    const hard = window.setTimeout(finish, 2500);

    (async () => {
      try {
        captureTokenFromUrl();
        const token = readSessionToken();
        if (!token) {
          finish();
          return;
        }
        const res = await apiFetch<{ user: ClientUser | null }>("/api/session", { timeoutMs: 2000 });
        if (cancelled) return;
        if (res.user) {
          window.location.replace(`/home?t=${encodeURIComponent(token)}`);
          // keep restoring=true until navigation completes; hard timeout still clears
          return;
        }
        clearSessionToken();
      } catch {
        // stale token / offline / timeout → just show the form
        try {
          clearSessionToken();
        } catch {
          /* ignore */
        }
      } finally {
        finish();
      }
    })();

    return () => {
      cancelled = true;
      window.clearTimeout(hard);
    };
  }, []);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setHint(null);
    if (!platform) return setError("Choose your platform first.");
    const v = validateGamertag(gamertag);
    if (!v.ok) return setError(v.error);
    if (password.length < 6) return setError("Password needs at least 6 characters.");
    setLoading(true);
    try {
      const res = await apiFetch<{ user: ClientUser; token: string; cookieSet: boolean }>("/api/session", {
        method: "POST",
        body: { gamertag: v.value, platform, password },
        timeoutMs: 10000,
      });
      if (!res.token) throw new ClientApiError(500, "Server did not return a session token.", "internal");
      writeSessionToken(res.token);
      setDone(true);
      if (readSessionToken()) {
        // Token is in storage: go straight to /home with no token in the URL.
        window.location.assign("/home");
      } else {
        // Storage is blocked: the one-time link is the only way to pass the session on.
        setHint("Storage blocked — continuing with a secure link…");
        window.location.assign(`/home?t=${encodeURIComponent(res.token)}`);
      }
    } catch (err) {
      setError(err instanceof ClientApiError ? err.message : "Could not start your session.");
      setLoading(false);
      setDone(false);
    }
  };

  if (restoring) {
    return (
      <main className="flex min-h-dvh flex-col items-center justify-center gap-3 px-6">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-violet-400/30 border-t-violet-400" />
        <p className="text-[15px] text-muted">Checking session…</p>
        <button type="button" className="tap mt-4 text-xs font-semibold text-neon-blue" onClick={() => setRestoring(false)}>
          Skip — show login
        </button>
      </main>
    );
  }

  return (
    <main className="flex min-h-dvh flex-col">
      <div className="relative h-[42dvh] min-h-[240px] w-full overflow-hidden">
        <Image src="/images/hero.jpg" alt="" fill priority sizes="100vw" className="object-cover object-center" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/40 to-bg" />
        <div className="pt-safe absolute inset-x-0 top-0 flex items-center justify-between px-4 pt-3">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/40 px-3 py-1.5 text-xs font-semibold backdrop-blur">
            <IconGamepad size={16} className="text-neon-purple" /> PS4 · PS5
          </span>
          <span className="rounded-full border border-white/10 bg-black/40 px-3 py-1.5 text-[11px] font-semibold text-muted backdrop-blur">by {DEVELOPER}</span>
        </div>
        <div className="absolute inset-x-0 bottom-0 px-5 pb-2">
          <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-neon-blue">Welcome to</p>
          <h1 className="mt-1 title-xl">
            GTA Online <span className="neon-text">Community</span>
          </h1>
        </div>
      </div>

      <form onSubmit={submit} className="px-safe flex flex-1 flex-col gap-5 pt-4" style={{ paddingBottom: "calc(1.5rem + var(--sab))" }} noValidate>
        <p className="text-[15px] text-muted">Live PS4 &amp; PS5 chat, AI assistants, weekly updates and guides. Pick your platform and a gamertag to jump in.</p>

        <fieldset>
          <legend className="mb-2 font-label text-faint">1 · Platform</legend>
          <div className="grid grid-cols-2 gap-3">
            {PLATFORMS.map((p) => {
              const active = platform === p;
              return (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPlatform(p)}
                  aria-pressed={active}
                  className={`tap card flex min-h-[72px] flex-col items-start justify-center gap-1 px-4 transition-[box-shadow,border-color,transform] active:scale-[0.98] ${
                    active ? (p === "ps5" ? "border-neon-purple shadow-glow-purple" : "border-neon-blue shadow-glow-blue") : ""
                  }`}
                >
                  <span className={`text-xl font-black ${active ? (p === "ps5" ? "text-neon-purple" : "text-neon-blue") : "text-text"}`}>{PLATFORM_LABEL[p]}</span>
                  <span className="text-xs text-muted">{p === "ps5" ? "PlayStation 5" : "PlayStation 4"}</span>
                </button>
              );
            })}
          </div>
        </fieldset>

        <div>
          <label htmlFor="gamertag" className="mb-2 block font-label text-faint">
            2 · Gamertag (PSN ID)
          </label>
          <input
            id="gamertag"
            className="field"
            placeholder="e.g. professor_ji96"
            value={gamertag}
            maxLength={GAMERTAG_MAX}
            autoCapitalize="none"
            autoCorrect="off"
            autoComplete="username"
            spellCheck={false}
            enterKeyHint="go"
            inputMode="text"
            aria-invalid={!!error && !dbError}
            onChange={(e) => setGamertag(e.target.value)}
          />
          <InlineError message={error} />
          {hint && <p className="mt-1.5 text-xs text-neon-amber">{hint}</p>}
        </div>

        <div>
          <label htmlFor="password" className="mb-2 block font-label text-faint">
            3 · Password
          </label>
          <input
            id="password"
            type="password"
            className="field"
            placeholder="At least 6 characters"
            value={password}
            maxLength={72}
            autoComplete="current-password"
            enterKeyHint="go"
            aria-invalid={!!error && !dbError}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <div className="mt-auto space-y-3">
          <Button type="submit" size="lg" block loading={loading} success={done} disabled={!!dbError}>
            {done ? "Entering…" : "ENTER THE COMMUNITY"}
          </Button>
<p className="text-center text-[11px] leading-relaxed text-faint">
            Your gamertag is locked by a password. Use the same password next time to sign in. If your gamertag is new, this password sets it. Not affiliated with Rockstar Games.
          </p>
        </div>
      </form>
    </main>
  );
}
