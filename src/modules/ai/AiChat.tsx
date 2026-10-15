"use client";
/**
 * Premium AI assistant UI — cinematic header, spinning avatar, glass composer.
 */
import Image from "next/image";
import { useCallback, useEffect, useRef, useState, type FormEvent, type KeyboardEvent } from "react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { IconBot, IconSend, IconTrash } from "@/components/ui/Icons";
import { RichText } from "@/components/ui/RichText";
import { ErrorState, LoadingState } from "@/components/ui/States";
import { TypingDots } from "@/components/ui/Spinner";
import { apiFetch, ClientApiError } from "@/lib/api/client";
import { AI_PROMPT_MAX } from "@/lib/constants";
import { useOnline } from "@/lib/hooks/useOnline";
import { fullScreenUnderTopbar, useViewportHeight } from "@/lib/hooks/useViewportHeight";
import { readSessionToken } from "@/modules/session/token";
import type { BotProfile } from "./bots";
import type { AiHistoryItem } from "./types";

type Status = {
  configured: boolean;
  provider?: string | null;
  label?: string | null;
  model?: string | null;
  localFallback?: boolean;
  help?: string;
  available?: Array<{ id: string; label: string; ready: boolean }>;
};

export function AiChat({ bot }: { bot: BotProfile }) {
  const online = useOnline();
  useViewportHeight();
  const [history, setHistory] = useState<AiHistoryItem[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [status, setStatus] = useState<Status | null>(null);
  const [draft, setDraft] = useState("");
  const [pending, setPending] = useState<string | null>(null);
  const [error, setError] = useState<{ message: string; prompt: string; retryable: boolean } | null>(null);
  const [clearing, setClearing] = useState(false);
  const [lastProvider, setLastProvider] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const draftRef = useRef("");
  useEffect(() => {
    draftRef.current = draft;
  }, [draft]);
  const pendingRef = useRef(false);

  const isPurple = bot.accent === "purple";
  const accentGrad = isPurple ? "from-violet-500 via-fuchsia-500 to-rose-400" : "from-cyan-400 via-sky-500 to-indigo-500";
  const accentRing = isPurple ? "border-fuchsia-400/40" : "border-cyan-400/40";
  const accentSoft = isPurple ? "bg-fuchsia-500/10" : "bg-cyan-400/10";
  const accentText = isPurple ? "text-fuchsia-300" : "text-cyan-300";

  const load = useCallback(async () => {
    setLoadError(null);
    try {
      const [h, s] = await Promise.all([
        apiFetch<{ history: AiHistoryItem[] }>(`/api/ai/${bot.id}`),
        apiFetch<Status>("/api/ai/status"),
      ]);
      setHistory(h.history);
      setStatus(s);
      setLoaded(true);
    } catch (err) {
      setLoadError(err instanceof ClientApiError ? err.message : "Could not load this assistant.");
    }
  }, [bot.id]);

  useEffect(() => {
    // Start the load after mount so state updates never run synchronously inside the effect.
    const boot = window.setTimeout(() => void load(), 0);
    return () => window.clearTimeout(boot);
  }, [load]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ block: "end" });
  }, [history, pending, error]);

  const ask = async (prompt: string) => {
    const p = prompt.trim();
    if (!p || pendingRef.current) return;
    if (!online) {
      setError({ message: "You're offline. Reconnect and try again.", prompt: p, retryable: true });
      return;
    }
    setError(null);
    pendingRef.current = true;
    setPending(p);
    setDraft("");
    try {
      const token = readSessionToken();
      const res = await apiFetch<{ user: AiHistoryItem; assistant: AiHistoryItem; provider?: string }>(`/api/ai/${bot.id}`, {
        method: "POST",
        body: { prompt: p, token: token ?? undefined },
        timeoutMs: 60000,
      });
      setHistory((h) => [...h, res.user, res.assistant]);
      if (res.provider) setLastProvider(res.provider);
    } catch (err) {
      const e = err as ClientApiError;
      setError({
        message: e.message ?? "The assistant did not respond.",
        prompt: p,
        retryable: e.code !== "bad_request" && e.status !== 401,
      });
    } finally {
      pendingRef.current = false;
      setPending(null);
    }
  };

  const clear = async () => {
    if (!confirm("Clear this conversation?")) return;
    setClearing(true);
    try {
      await apiFetch(`/api/ai/${bot.id}`, { method: "DELETE" });
      setHistory([]);
      setError(null);
    } catch (err) {
      setError({ message: err instanceof ClientApiError ? err.message : "Could not clear.", prompt: "", retryable: false });
    } finally {
      setClearing(false);
    }
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    void ask(draftRef.current);
  };
  const onKey = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      void ask(draftRef.current);
    }
  };

  const canSend = draft.trim().length > 0 && !pending && online;
  const providerLabel = lastProvider || status?.label || status?.provider || "AI";

  return (
    <div className="flex flex-col" style={fullScreenUnderTopbar}>
      {/* Cinematic header */}
      <div className={`relative shrink-0 overflow-hidden border-b ${accentRing}`}>
        <div className="absolute inset-0">
          <Image src="/images/ai-chat-bg.jpg" alt="" fill priority sizes="640px" className="object-cover opacity-80" />
          <div className={`absolute inset-0 bg-gradient-to-r ${accentGrad} opacity-35 mix-blend-screen`} />
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/50 to-[#05050a]" />
        </div>
        <div className="bot-orb anim-bob-x -right-6 top-2 h-20 w-20 bg-white/20" />
        <div className="bot-orb anim-orbit left-10 bottom-0 h-12 w-12 bg-amber-300/30" />

        <div className="px-safe relative flex items-center gap-3 py-3">
          <span className="relative inline-flex h-14 w-14 shrink-0 items-center justify-center">
            <span className={`anim-spin-slow absolute inset-0 rounded-full bg-gradient-to-br ${accentGrad} ${isPurple ? "shadow-[0_0_30px_rgba(232,121,249,0.6)]" : "shadow-[0_0_30px_rgba(34,211,238,0.55)]"}`} />
            <span className="anim-spin-rev absolute inset-[3px] rounded-full bg-gradient-to-br from-amber-200 via-pink-400 to-cyan-300 opacity-80" />
            <span className="absolute inset-[6px] rounded-full bg-[#0a0a12]" />
            <span className={`relative z-[1] inline-flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br ${accentGrad} text-white anim-bob-y`}>
              <IconBot size={20} />
            </span>
          </span>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="truncate text-[1.2rem] font-black tracking-tight text-white">{bot.name}</h1>
              <Badge tone={isPurple ? "purple" : "blue"} className="!normal-case">
                {providerLabel}
              </Badge>
            </div>
            <p className={`truncate text-[13px] font-semibold ${accentText}`}>{bot.title}</p>
            <p className="truncate text-[11px] text-white/60">Live advisor · glitch-aware</p>
          </div>
          {history.length > 0 && (
            <button
              type="button"
              onClick={() => void clear()}
              disabled={clearing}
              className="tap inline-flex h-11 w-11 items-center justify-center rounded-xl border border-white/15 bg-black/40 text-white/80 backdrop-blur active:bg-white/10"
              aria-label="Clear conversation"
            >
              <IconTrash size={18} />
            </button>
          )}
        </div>
        <div className="mix-line anim-hue" />
      </div>

      {/* Messages */}
      <div
        className="scrollbar-thin min-h-0 flex-1 overflow-y-auto overscroll-contain px-3 py-3 swirl-bg"
        style={{ paddingLeft: "max(0.75rem, var(--sal))", paddingRight: "max(0.75rem, var(--sar))" }}
      >
        {!loaded && !loadError && <LoadingState label="Loading conversation…" />}
        {loadError && <ErrorState title="Couldn't load" message={loadError} onRetry={() => void load()} />}

        {loaded && status?.help && (
          <div className={`mb-3 rounded-2xl border ${accentRing} ${accentSoft} p-3 backdrop-blur`} role="status">
            <p className={`text-[12px] font-black uppercase tracking-wider ${accentText}`}>Engine · {status.label}</p>
            <p className="mt-1 text-[12px] leading-relaxed text-muted">{status.help}</p>
          </div>
        )}

        {loaded && history.length === 0 && !pending && (
          <div className="py-5">
            <div className="relative mx-auto mb-5 h-24 w-24">
              <div className={`anim-spin-slow absolute inset-0 rounded-full bg-gradient-to-br ${accentGrad} opacity-90`} />
              <div className="anim-spin-rev absolute inset-1 rounded-full bg-gradient-to-br from-amber-300 via-pink-400 to-cyan-400 opacity-75" />
              <div className="absolute inset-2.5 rounded-full bg-[#05050a]" />
              <div className={`absolute inset-4 flex items-center justify-center rounded-full bg-gradient-to-br ${accentGrad} text-white shadow-lg anim-bob-y`}>
                <IconBot size={30} />
              </div>
            </div>
            <p className="text-center text-[16px] font-bold text-text">{bot.name} is ready</p>
            <p className="mx-auto mt-1 max-w-xs text-center text-[14px] text-muted">{bot.tagline}</p>
            <div className="mt-5 flex flex-col gap-2.5">
              {bot.starters.map((s, i) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => void ask(s)}
                  disabled={!!pending || !online}
                  className={`tap rounded-2xl border px-4 py-3.5 text-left text-[15px] font-semibold active:scale-[0.99] disabled:opacity-50 ${
                    i === 0 ? `${accentRing} ${accentSoft}` : "border-white/10 bg-white/[0.04]"
                  }`}
                >
                  <span className={`mr-2 text-[11px] font-black ${accentText}`}>{String(i + 1).padStart(2, "0")}</span>
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        <ul className="space-y-3.5">
          {history.map((m) => (
            <Bubble key={m.id} role={m.role} content={m.content} accentGrad={accentGrad} />
          ))}
          {pending && (
            <>
              <Bubble role="user" content={pending} accentGrad={accentGrad} />
              <li className="flex justify-start">
                <div className="rounded-2xl rounded-bl-md border border-white/10 bg-white/[0.06] px-4 py-3 backdrop-blur">
                  <TypingDots />
                  <p className="mt-1 text-[11px] font-semibold text-faint">{bot.name} is thinking…</p>
                </div>
              </li>
            </>
          )}
          {error && (
            <li>
              <ErrorState
                title={error.retryable ? "No reply" : "Assistant unavailable"}
                message={error.message}
                onRetry={error.retryable && error.prompt ? () => void ask(error.prompt) : undefined}
              />
              {error.prompt && (
                <Button variant="ghost" size="sm" className="mt-2" onClick={() => setDraft(error.prompt)}>
                  Restore my message
                </Button>
              )}
            </li>
          )}
        </ul>
        <div ref={bottomRef} className="h-px" />
      </div>

      {/* Glass composer */}
      <form
        onSubmit={onSubmit}
        className="shrink-0 border-t border-white/10 bg-[#07070e]/95 backdrop-blur-xl"
        style={{
          paddingBottom: "max(0.5rem, var(--sab))",
          paddingLeft: "max(0.75rem, var(--sal))",
          paddingRight: "max(0.75rem, var(--sar))",
        }}
      >
        <div className="mix-line-thin mb-2 opacity-80" />
        <div className="flex items-end gap-2 pt-1">
          <textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value.slice(0, AI_PROMPT_MAX))}
            onKeyDown={onKey}
            rows={1}
            placeholder={online ? `Message ${bot.name}…` : "You're offline"}
            disabled={!!pending}
            enterKeyHint="send"
            className="field max-h-32 min-h-12 flex-1 resize-none border-white/10 bg-white/[0.05] py-3 text-[16px] leading-snug"
            onInput={(e) => {
              const el = e.currentTarget;
              el.style.height = "auto";
              el.style.height = Math.min(el.scrollHeight, 128) + "px";
            }}
            aria-label="Your question"
          />
          <button
            type="submit"
            disabled={!canSend}
            onClick={(e) => {
              if (!canSend) return;
              e.preventDefault();
              void ask(draftRef.current);
            }}
            aria-label="Send"
            className={`tap relative inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-white active:scale-95 disabled:opacity-40 ${
              canSend ? `bg-gradient-to-br ${accentGrad} shadow-lg` : "bg-white/10"
            }`}
          >
            {canSend && <span className={`anim-spin-slow absolute inset-0 rounded-2xl bg-gradient-to-br ${accentGrad} opacity-50 blur-[2px]`} />}
            <span className="relative z-[1]">
              {pending ? <span className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" /> : <IconSend size={20} />}
            </span>
          </button>
        </div>
        <p className="pb-1 pt-1.5 text-[11px] font-semibold text-faint">Verify payouts in-game · glitches stay unverified</p>
      </form>
    </div>
  );
}

function Bubble({ role, content, accentGrad }: { role: "user" | "assistant"; content: string; accentGrad: string }) {
  const mine = role === "user";
  return (
    <li className={`flex ${mine ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[90%] overflow-hidden rounded-2xl px-4 py-3 ${
          mine
            ? `rounded-br-md bg-gradient-to-br ${accentGrad} text-white shadow-lg`
            : "rounded-bl-md border border-white/10 bg-white/[0.06] shadow-md backdrop-blur"
        }`}
      >
        {mine ? (
          <p className="whitespace-pre-wrap break-words text-[15px] font-medium leading-snug">{content}</p>
        ) : (
          <RichText text={content} className="[&_p]:text-[15px] [&_p]:text-text/95 [&_li]:text-[15px] [&_li]:text-text/95 [&_h3]:text-base [&_h3]:font-black" />
        )}
      </div>
    </li>
  );
}
