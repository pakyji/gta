"use client";
/**
 * Live chat room for a PS4 / PS5 channel.
 *
 * Send path is deliberately defensive for iframe / Brave environments:
 *  - Bearer + x-session-token headers (apiFetch)
 *  - token also included in the JSON body as a fallback
 *  - never silently no-ops: every failure shows an error under the composer
 *  - optimistic local echo so the UI feels instant
 *  - large send button with both form submit and onClick handlers
 *  - visualViewport-aware height so the composer stays above the mobile keyboard
 */
import { useCallback, useEffect, useRef, useState, type FormEvent, type KeyboardEvent } from "react";
import { Button } from "@/components/ui/Button";
import { IconSend } from "@/components/ui/Icons";
import { ErrorState, LoadingState } from "@/components/ui/States";
import { apiFetch, ClientApiError } from "@/lib/api/client";
import { MESSAGE_MAX, PLATFORM_LABEL, type Channel } from "@/lib/constants";
import { useOnline } from "@/lib/hooks/useOnline";
import { fullScreenUnderTopbar, useViewportHeight } from "@/lib/hooks/useViewportHeight";
import { useSession } from "@/modules/session/SessionProvider";
import { captureTokenFromUrl, readSessionToken, writeSessionToken } from "@/modules/session/token";
import type { ChatMessage } from "./types";

type Conn = "connecting" | "live" | "polling" | "reconnecting" | "offline" | "error";

export function ChatRoom({ channel }: { channel: Channel }) {
  const { user, ready } = useSession();
  const online = useOnline();
  useViewportHeight();

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [conn, setConn] = useState<Conn>("connecting");
  const shownConn: Conn = online ? conn : "offline";
  const [draft, setDraft] = useState("");
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState<string | null>(null);
  const [unseen, setUnseen] = useState(0);

  const cursorRef = useRef<number>(-1);
  const listRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const stickToBottomRef = useRef(true);
  const esRef = useRef<EventSource | null>(null);
  const failuresRef = useRef(0);
  const pollTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pollRef = useRef<() => void>(() => {});
  const draftRef = useRef(draft);
  useEffect(() => {
    draftRef.current = draft;
  }, [draft]);
  const sendingRef = useRef(false);
  // Monotonic temp ids for optimistic messages
  const tempIdRef = useRef(-1);

  const ensureToken = useCallback((): string | null => {
    captureTokenFromUrl();
    return readSessionToken();
  }, []);

  const append = useCallback(
    (fresh: ChatMessage[]) => {
      if (!fresh.length) return;
      setMessages((prev) => {
        const byId = new Map<number, ChatMessage>();
        for (const m of prev) byId.set(m.id, m);
        for (const m of fresh) {
          // Drop matching optimistic temp messages (negative ids) with same body+gamertag
          if (m.id > 0) {
            for (const [id, existing] of byId) {
              if (id < 0 && existing.body === m.body && existing.gamertag === m.gamertag) {
                byId.delete(id);
              }
            }
          }
          byId.set(m.id, m);
        }
        const next = [...byId.values()].sort((a, b) => a.id - b.id).slice(-300);
        const positive = next.filter((m) => m.id > 0);
        if (positive.length) cursorRef.current = Math.max(cursorRef.current, positive[positive.length - 1].id);
        if (!stickToBottomRef.current) {
          setUnseen((u) => u + fresh.filter((m) => m.id > 0 && m.userId !== user?.id).length);
        }
        return next;
      });
    },
    [user?.id],
  );

  const scrollToBottom = useCallback((smooth = false) => {
    bottomRef.current?.scrollIntoView({ behavior: smooth ? "smooth" : "auto", block: "end" });
    setUnseen(0);
  }, []);

  const onScroll = () => {
    const el = listRef.current;
    if (!el) return;
    const dist = el.scrollHeight - el.scrollTop - el.clientHeight;
    stickToBottomRef.current = dist < 120;
    if (stickToBottomRef.current) setUnseen(0);
  };

  useEffect(() => {
    if (stickToBottomRef.current) scrollToBottom(loaded);
  }, [messages, loaded, scrollToBottom]);

  // Polling fallback
  const startPolling = useCallback(() => {
    if (pollTimerRef.current) return;
    setConn("polling");
    const tick = async () => {
      try {
        const token = ensureToken();
        const q = new URLSearchParams();
        q.set("after", String(Math.max(cursorRef.current, 0)));
        if (token) q.set("token", token);
        const res = await apiFetch<{ messages: ChatMessage[] }>(`/api/chat/${channel}?${q}`, { timeoutMs: 12000 });
        if (cursorRef.current < 0 && res.messages.length === 0) cursorRef.current = 0;
        append(res.messages);
        setLoaded(true);
        setLoadError(null);
        setConn("polling");
      } catch (err) {
        if (!(err instanceof ClientApiError && err.code === "offline")) setConn("error");
      }
      pollTimerRef.current = setTimeout(tick, 2500);
    };
    tick();
  }, [channel, append, ensureToken]);
  useEffect(() => {
    pollRef.current = startPolling;
  }, [startPolling]);

  const stopPolling = () => {
    if (pollTimerRef.current) clearTimeout(pollTimerRef.current);
    pollTimerRef.current = null;
  };

  // Initial REST load (don't wait solely on SSE — SSE can be flaky in iframes)
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        ensureToken();
        const res = await apiFetch<{ messages: ChatMessage[] }>(`/api/chat/${channel}`);
        if (cancelled) return;
        setMessages(res.messages);
        if (res.messages.length) cursorRef.current = res.messages[res.messages.length - 1].id;
        else cursorRef.current = 0;
        setLoaded(true);
        requestAnimationFrame(() => scrollToBottom(false));
      } catch (err) {
        if (!cancelled) {
          setLoadError(err instanceof ClientApiError ? err.message : "Could not load messages.");
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [channel, ensureToken, scrollToBottom]);

  // SSE for live updates
  useEffect(() => {
    if (!online) return;
    let cancelled = false;
    const connect = () => {
      if (cancelled) return;
      if (typeof EventSource === "undefined") {
        pollRef.current();
        return;
      }
      const params = new URLSearchParams();
      if (cursorRef.current >= 0) params.set("after", String(cursorRef.current));
      ensureToken();
      const url = `/api/chat/${channel}/stream?${params}`;
      const es = new EventSource(url);
      esRef.current = es;
      setConn((c) => (c === "live" || c === "polling" ? c : loaded ? "reconnecting" : "connecting"));

      es.addEventListener("init", (e) => {
        const data = JSON.parse((e as MessageEvent).data) as { messages: ChatMessage[]; cursor: number };
        failuresRef.current = 0;
        // Merge, don't replace — keep any optimistic messages
        append(data.messages);
        cursorRef.current = Math.max(cursorRef.current, data.cursor);
        setLoaded(true);
        setLoadError(null);
        setConn("live");
      });
      es.addEventListener("ready", () => {
        failuresRef.current = 0;
        setConn("live");
      });
      es.addEventListener("messages", (e) => {
        const data = JSON.parse((e as MessageEvent).data) as { messages: ChatMessage[]; cursor: number };
        append(data.messages);
        setConn("live");
      });
      es.addEventListener("error", (e) => {
        const me = e as MessageEvent;
        if (typeof me.data === "string") {
          try {
            const d = JSON.parse(me.data) as { error: string };
            setLoadError(d.error);
          } catch {
            /* ignore */
          }
        }
      });
      es.onerror = () => {
        failuresRef.current += 1;
        setConn("reconnecting");
        if (failuresRef.current >= 3) {
          es.close();
          esRef.current = null;
          pollRef.current();
        }
      };
    };
    // Delay SSE slightly so the initial REST load can set the cursor first
    const t = setTimeout(connect, 400);
    return () => {
      cancelled = true;
      clearTimeout(t);
      esRef.current?.close();
      esRef.current = null;
      stopPolling();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [channel, online]);

  const send = async () => {
    const body = draftRef.current.trim();
    if (!body) {
      setSendError("Type a message first.");
      return;
    }
    if (sendingRef.current) return;
    if (!online) {
      setSendError("You're offline. Reconnect and try again.");
      return;
    }

    const token = ensureToken();
    if (!token && !user) {
      setSendError("Session expired. Go to Home or reopen the app, then try again.");
      return;
    }

    sendingRef.current = true;
    setSending(true);
    setSendError(null);

    // Optimistic echo
    const tempId = tempIdRef.current--;
    const optimistic: ChatMessage = {
      id: tempId,
      channel,
      userId: user?.id ?? null,
      gamertag: user?.gamertag ?? "You",
      platform: user?.platform ?? channel,
      body,
      createdAt: new Date().toISOString(),
    };
    stickToBottomRef.current = true;
    append([optimistic]);
    setDraft("");
    if (inputRef.current) {
      inputRef.current.style.height = "auto";
    }

    try {
      const res = await apiFetch<{ message: ChatMessage }>(`/api/chat/${channel}`, {
        method: "POST",
        body: { body, token: token ?? undefined, sessionToken: token ?? undefined },
        timeoutMs: 20000,
      });
      // If server returned a token somehow we don't care; replace optimistic
      append([res.message]);
      // Persist token again in case it was only in memory
      if (token) writeSessionToken(token);
      requestAnimationFrame(() => scrollToBottom(true));
      inputRef.current?.focus();
    } catch (err) {
      // Remove optimistic message
      setMessages((prev) => prev.filter((m) => m.id !== tempId));
      setDraft(body); // restore what they typed
      const msg =
        err instanceof ClientApiError
          ? err.status === 401
            ? "Session expired. Open the menu → Home, or sign in again from the welcome screen."
            : err.message
          : "Could not send your message.";
      setSendError(msg);
    } finally {
      sendingRef.current = false;
      setSending(false);
    }
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    void send();
  };

  const onKey = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    // Mobile: Enter often means newline. Only intercept plain Enter on non-touch / desktop.
    // Always allow the send button. On mobile keyboards with "Send" enterKeyHint, Enter fires send.
    if (e.key === "Enter" && !e.shiftKey) {
      const isMobile = typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches;
      if (!isMobile || e.nativeEvent.isComposing === false) {
        // On mobile with enterKeyHint=send, still send on Enter
        e.preventDefault();
        void send();
      }
    }
  };

  const connLabel: Record<Conn, { text: string; cls: string }> = {
    connecting: { text: "Connecting…", cls: "bg-neon-amber" },
    live: { text: "Live", cls: "bg-neon-green" },
    polling: { text: "Live", cls: "bg-neon-green" },
    reconnecting: { text: "Reconnecting…", cls: "bg-neon-amber" },
    offline: { text: "Offline", cls: "bg-neon-red" },
    error: { text: "Connection problem", cls: "bg-neon-red" },
  };

  const canSend = draft.trim().length > 0 && !sending && online;

  return (
    <div className="flex flex-col" style={fullScreenUnderTopbar}>
      {/* Channel header */}
      <div className="px-safe flex shrink-0 items-center justify-between gap-3 border-b border-border py-2.5">
        <div className="min-w-0">
          <h1 className="truncate text-base font-bold">{PLATFORM_LABEL[channel]} Chat</h1>
          <p className="truncate text-xs text-muted">
            {user ? `Chatting as ${user.gamertag}` : ready ? "Public lobby" : "Signing in…"}
          </p>
        </div>
        <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-border bg-surface-2 px-2.5 py-1 text-[11px] font-semibold text-muted">
          <span className={`h-2 w-2 rounded-full ${connLabel[shownConn].cls} ${shownConn === "live" || shownConn === "polling" ? "" : "anim-dot"}`} />
          {connLabel[shownConn].text}
        </span>
      </div>

      {/* Messages */}
      <div
        ref={listRef}
        onScroll={onScroll}
        className="scrollbar-thin relative min-h-0 flex-1 overflow-y-auto overscroll-contain px-3 py-3"
        style={{ paddingLeft: "max(0.75rem, var(--sal))", paddingRight: "max(0.75rem, var(--sar))" }}
      >
        {!loaded && !loadError && <LoadingState label="Loading messages…" />}
        {loadError && !loaded && (
          <ErrorState
            title="Couldn't load the chat"
            message={loadError}
            onRetry={() => {
              setLoadError(null);
              setLoaded(false);
              failuresRef.current = 0;
              esRef.current?.close();
              stopPolling();
              void (async () => {
                try {
                  ensureToken();
                  const res = await apiFetch<{ messages: ChatMessage[] }>(`/api/chat/${channel}`);
                  setMessages(res.messages);
                  cursorRef.current = res.messages.length ? res.messages[res.messages.length - 1].id : 0;
                  setLoaded(true);
                  pollRef.current();
                } catch (err) {
                  setLoadError(err instanceof ClientApiError ? err.message : "Could not load messages.");
                }
              })();
            }}
          />
        )}
        {loaded && messages.length === 0 && (
          <div className="py-12 text-center">
            <p className="text-3xl">👋</p>
            <p className="mt-2 text-sm font-semibold">No messages yet</p>
            <p className="text-xs text-muted">Be the first to say hi to the {PLATFORM_LABEL[channel]} lobby.</p>
          </div>
        )}
        <ul className="space-y-2">
          {messages.map((m, i) => {
            const mine = (user && m.userId === user.id) || m.id < 0;
            const prev = messages[i - 1];
            const grouped =
              prev &&
              prev.userId === m.userId &&
              prev.gamertag === m.gamertag &&
              new Date(m.createdAt).getTime() - new Date(prev.createdAt).getTime() < 120_000;
            const pending = m.id < 0;
            return (
              <li key={m.id} className={`flex ${mine ? "justify-end" : "justify-start"}`}>
                <div className={`flex max-w-[85%] flex-col ${mine ? "items-end" : "items-start"}`}>
                  {!grouped && (
                    <div className={`mb-1 flex items-center gap-1.5 px-1 text-[11px] ${mine ? "flex-row-reverse" : ""}`}>
                      <span className="max-w-[160px] truncate font-semibold text-text">{mine ? "You" : m.gamertag}</span>
                      <span
                        className={`rounded px-1 py-px text-[9px] font-bold ${
                          m.platform === "ps5" ? "bg-neon-purple/20 text-[#d8b4fe]" : "bg-neon-blue/20 text-[#7dd3fc]"
                        }`}
                      >
                        {m.platform.toUpperCase()}
                      </span>
                      <span className="text-faint">
                        {pending ? "Sending…" : new Date(m.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </span>
                    </div>
                  )}
                  <div
                    className={`whitespace-pre-wrap break-words rounded-2xl px-3.5 py-2 text-[15px] leading-snug ${
                      mine
                        ? `rounded-br-md bg-gradient-to-br from-neon-purple-deep to-neon-purple text-white ${pending ? "opacity-70" : ""}`
                        : "rounded-bl-md border border-border bg-surface-2 text-text"
                    }`}
                  >
                    {m.body}
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
        <div ref={bottomRef} className="h-px" />
      </div>

      {unseen > 0 && (
        <button
          type="button"
          onClick={() => scrollToBottom(true)}
          className="tap mx-auto -mt-10 mb-2 inline-flex min-h-9 items-center rounded-full bg-neon-purple px-4 text-xs font-bold text-white shadow-glow-purple"
        >
          {unseen} new message{unseen > 1 ? "s" : ""} ↓
        </button>
      )}

      {/* Composer — sticky, always above keyboard via --vvh */}
      <form
        onSubmit={onSubmit}
        className="shrink-0 border-t border-border bg-surface"
        style={{
          paddingBottom: "max(0.5rem, var(--sab))",
          paddingLeft: "max(0.75rem, var(--sal))",
          paddingRight: "max(0.75rem, var(--sar))",
        }}
      >
        {sendError && (
          <div className="flex items-start gap-2 pt-2" role="alert">
            <p className="min-w-0 flex-1 text-xs leading-snug text-neon-red">{sendError}</p>
            <button type="button" className="tap shrink-0 text-xs font-semibold text-muted" onClick={() => setSendError(null)}>
              Dismiss
            </button>
          </div>
        )}
        <div className="flex items-end gap-2 pt-2">
          <textarea
            ref={inputRef}
            value={draft}
            onChange={(e) => {
              setDraft(e.target.value.slice(0, MESSAGE_MAX));
              setSendError(null);
            }}
            onKeyDown={onKey}
            placeholder={online ? `Message ${PLATFORM_LABEL[channel]}…` : "You're offline"}
            rows={1}
            maxLength={MESSAGE_MAX}
            enterKeyHint="send"
            autoCapitalize="sentences"
            autoCorrect="on"
            className="field max-h-32 min-h-12 flex-1 resize-none py-3 leading-snug"
            style={{ height: "auto" }}
            onInput={(e) => {
              const el = e.currentTarget;
              el.style.height = "auto";
              el.style.height = Math.min(el.scrollHeight, 128) + "px";
            }}
            aria-label="Message"
          />
          <button
            type="submit"
            disabled={!canSend}
            onClick={(e) => {
              // Extra path in case form submit is swallowed by a parent handler
              if (!canSend) return;
              e.preventDefault();
              void send();
            }}
            aria-label="Send message"
            className={`tap inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-btn text-white transition-[transform,opacity,background] active:scale-95 disabled:cursor-not-allowed disabled:opacity-40 ${
              canSend ? "bg-gradient-to-br from-neon-purple-deep to-neon-purple shadow-glow-purple" : "bg-surface-3"
            }`}
          >
            {sending ? (
              <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
            ) : (
              <IconSend size={20} />
            )}
          </button>
        </div>
        <div className="flex items-center justify-between pb-1 pt-1 text-[10px] text-faint">
          <span>{online ? "Tap send or press Enter" : "Offline — sending disabled"}</span>
          <span className={draft.length > MESSAGE_MAX - 50 ? "text-neon-amber" : ""}>
            {draft.length}/{MESSAGE_MAX}
          </span>
        </div>
      </form>
    </div>
  );
}
