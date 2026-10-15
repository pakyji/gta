"use client";
/**
 * Settings: edit gamertag / platform, system status, sign out.
 */
import { useRouter } from "next/navigation";
import { useEffect, useState, type FormEvent } from "react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { IconLogout } from "@/components/ui/Icons";
import { InlineError } from "@/components/ui/States";
import { apiFetch, ClientApiError } from "@/lib/api/client";
import { DEVELOPER, GAMERTAG_MAX, PLATFORM_LABEL, PLATFORMS, type Platform, validateGamertag } from "@/lib/constants";
import { useSession } from "./SessionProvider";

type AiStatus = { configured: boolean; label?: string | null; model?: string | null; help?: string; provider?: string | null; available?: Array<{id:string;label:string;ready:boolean}> };

export function SettingsPanel({ newsFeedConfigured }: { newsFeedConfigured: boolean }) {
  const router = useRouter();
  const { user, updateProfile, signOut } = useSession();
  const [gamertag, setGamertag] = useState(user?.gamertag ?? "");
  const [platform, setPlatform] = useState<Platform>(user?.platform ?? "ps5");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [signingOut, setSigningOut] = useState(false);
  const [ai, setAi] = useState<AiStatus | null>(null);
  const [health, setHealth] = useState<"ok" | "down" | null>(null);

  useEffect(() => {
    apiFetch<AiStatus>("/api/ai/status").then(setAi).catch(() => setAi(null));
    apiFetch<{ ok: boolean }>("/api/health").then((h) => setHealth(h.ok ? "ok" : "down")).catch(() => setHealth("down"));
  }, []);

  const dirty = user ? gamertag.trim() !== user.gamertag || platform !== user.platform : false;

  const save = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    const v = validateGamertag(gamertag);
    if (!v.ok) return setError(v.error);
    setSaving(true);
    try {
      await updateProfile({ gamertag: v.value, platform });
      setSaved(true);
      setTimeout(() => setSaved(false), 1800);
      router.refresh();
    } catch (err) {
      setError(err instanceof ClientApiError ? err.message : "Could not save.");
    } finally {
      setSaving(false);
    }
  };

  const out = async () => {
    if (!confirm("Sign out and choose a new gamertag?")) return;
    setSigningOut(true);
    try {
      await signOut();
      router.replace("/");
      router.refresh();
    } catch (err) {
      setError(err instanceof ClientApiError ? err.message : "Could not sign out.");
      setSigningOut(false);
    }
  };

  return (
    <div className="space-y-5">

      <section id="account" className="card p-4">
        <h2 className="text-sm font-bold uppercase tracking-wide text-faint">Profile</h2>
        <form onSubmit={save} className="mt-3 space-y-4" noValidate>
          <div>
            <label htmlFor="s-gamertag" className="mb-1.5 block text-xs font-semibold text-muted">
              Gamertag
            </label>
            <input id="s-gamertag" className="field" value={gamertag} maxLength={GAMERTAG_MAX} autoCapitalize="none" autoCorrect="off" spellCheck={false} onChange={(e) => setGamertag(e.target.value)} aria-invalid={!!error} />
            <InlineError message={error} />
          </div>
          <div>
            <p className="mb-1.5 text-xs font-semibold text-muted">Platform</p>
            <div className="grid grid-cols-2 gap-2">
              {PLATFORMS.map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPlatform(p)}
                  aria-pressed={platform === p}
                  className={`tap min-h-12 rounded-btn border text-sm font-bold ${platform === p ? (p === "ps5" ? "border-neon-purple bg-neon-purple/15 text-[#e9d5ff]" : "border-neon-blue bg-neon-blue/15 text-[#bae6fd]") : "border-border bg-surface-2 text-muted"}`}
                >
                  {PLATFORM_LABEL[p]}
                </button>
              ))}
            </div>
          </div>
          <Button type="submit" block loading={saving} success={saved} disabled={!dirty && !saved}>
            {saved ? "Saved" : "Save changes"}
          </Button>
        </form>
      </section>

      <section className="card p-4">
        <h2 className="text-sm font-bold uppercase tracking-wide text-faint">System status</h2>
        <ul className="mt-3 space-y-2.5 text-sm">
          <StatusRow label="Database" ok={health === "ok"} pending={health === null} okText="Connected" badText="Unreachable" />
          <StatusRow label="Live chat" ok={health === "ok"} pending={health === null} okText="Server-sent events" badText="Needs database" />
          <StatusRow label="AI engine" ok={true} pending={ai === null} okText={ai?.label ? `${ai.label}${ai.model ? ` · ${ai.model}` : ""}` : "Ready"} badText="Checking…" />
          <StatusRow label="News feed" ok={newsFeedConfigured} pending={false} okText="NEWS_FEED_URL set" badText="Curated bulletins" />
        </ul>
        {ai?.available && (
          <p className="mt-3 text-[11px] leading-relaxed text-faint">
            Engines: {ai.available.filter((a) => a.ready).map((a) => a.label).join(" · ") || "Built-in only"}
          </p>
        )}
        {ai?.help && <p className="mt-2 text-xs leading-relaxed text-muted">{ai.help}</p>}
        {!newsFeedConfigured && <p className="mt-2 text-xs leading-relaxed text-muted">To enable live news refresh, set NEWS_FEED_URL to an RSS/Atom feed URL on the server.</p>}
      </section>

      <section className="card p-4">
        <h2 className="text-sm font-bold uppercase tracking-wide text-faint">About</h2>
        <p className="mt-2 text-sm text-muted">GTA Online Community — a fan-made PS4 / PS5 companion web app. Not affiliated with Rockstar Games or Take-Two Interactive.</p>
        <p className="mt-2 text-xs text-faint">Developer: {DEVELOPER}</p>
      </section>

      <Button variant="danger" block loading={signingOut} onClick={out} icon={<IconLogout size={18} />}>
        Sign out / switch gamertag
      </Button>
    </div>
  );
}

function StatusRow({ label, ok, pending, okText, badText }: { label: string; ok: boolean; pending: boolean; okText: string; badText: string }) {
  return (
    <li className="flex items-center justify-between gap-3">
      <span className="text-muted">{label}</span>
      {pending ? <Badge tone="neutral">Checking…</Badge> : <Badge tone={ok ? "green" : "amber"} className="max-w-[60%]">{ok ? okText : badText}</Badge>}
    </li>
  );
}
