"use client";
/**
 * Twitter-style community feed / channel.
 * Compose post, infinite-ish list, like, delete own posts.
 */
import { useCallback, useEffect, useState, type FormEvent } from "react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { IconHeart, IconHeartSolid, IconTrash } from "@/components/ui/Icons";
import { EmptyState, ErrorState, LoadingState } from "@/components/ui/States";
import { apiFetch, ClientApiError } from "@/lib/api/client";
import { PLATFORM_LABEL, type Platform } from "@/lib/constants";
import { useSession } from "@/modules/session/SessionProvider";
import { readSessionToken } from "@/modules/session/token";

type Post = {
  id: number;
  userId: string | null;
  gamertag: string;
  platform: Platform;
  body: string;
  likeCount: number;
  likedByMe: boolean;
  createdAt: string;
};

const MAX = 280;

function timeAgo(iso: string): string {
  const s = Math.max(0, Math.floor((Date.now() - new Date(iso).getTime()) / 1000));
  if (s < 60) return `${s}s`;
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h`;
  const d = Math.floor(h / 24);
  return `${d}d`;
}

export function FeedPage() {
  const { user } = useSession();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [draft, setDraft] = useState("");
  const [posting, setPosting] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);

  const load = useCallback(async (before?: number) => {
    if (before) setLoadingMore(true);
    else {
      setLoading(true);
      setError(null);
    }
    try {
      const q = before ? `?before=${before}` : "";
      const res = await apiFetch<{ items: Post[] }>(`/api/feed/posts${q}`);
      setPosts((prev) => {
        if (!before) return res.items;
        const seen = new Set(prev.map((p) => p.id));
        return [...prev, ...res.items.filter((p) => !seen.has(p.id))];
      });
    } catch (err) {
      setError(err instanceof ClientApiError ? err.message : "Could not load feed.");
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, []);

  useEffect(() => {
    const boot = window.setTimeout(() => void load(), 0);
    const t = window.setInterval(() => {
      // soft refresh top without wiping scroll if user is composing
      if (document.hidden) return;
      void (async () => {
        try {
          const res = await apiFetch<{ items: Post[] }>("/api/feed/posts");
          setPosts((prev) => {
            if (!prev.length) return res.items;
            const map = new Map(prev.map((p) => [p.id, p]));
            for (const p of res.items) map.set(p.id, { ...map.get(p.id), ...p });
            // keep order: newest first from merge of new ids + old
            const ids = [...new Set([...res.items.map((p) => p.id), ...prev.map((p) => p.id)])];
            return ids.map((id) => map.get(id)!).filter(Boolean).sort((a, b) => b.id - a.id);
          });
        } catch {
          /* ignore poll errors */
        }
      })();
    }, 8000);
    return () => {
      window.clearTimeout(boot);
      window.clearInterval(t);
    };
  }, [load]);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    const body = draft.trim();
    if (!body || posting) return;
    setPosting(true);
    try {
      const token = readSessionToken();
      const res = await apiFetch<{ post: Post }>("/api/feed/posts", {
        method: "POST",
        body: { body, token: token ?? undefined },
      });
      setDraft("");
      setPosts((prev) => [res.post, ...prev.filter((p) => p.id !== res.post.id)]);
    } catch (err) {
      setError(err instanceof ClientApiError ? err.message : "Could not post.");
    } finally {
      setPosting(false);
    }
  };

  const like = async (id: number) => {
    // optimistic
    setPosts((prev) =>
      prev.map((p) =>
        p.id === id
          ? {
              ...p,
              likedByMe: !p.likedByMe,
              likeCount: p.likeCount + (p.likedByMe ? -1 : 1),
            }
          : p,
      ),
    );
    try {
      const token = readSessionToken();
      const res = await apiFetch<{ likeCount: number; likedByMe: boolean }>(`/api/feed/posts/${id}/like`, {
        method: "POST",
        body: { token: token ?? undefined },
      });
      setPosts((prev) => prev.map((p) => (p.id === id ? { ...p, ...res } : p)));
    } catch {
      // revert by reload top
      void load();
    }
  };

  const remove = async (id: number) => {
    if (!confirm("Delete this post?")) return;
    setPosts((prev) => prev.filter((p) => p.id !== id));
    try {
      await apiFetch(`/api/feed/posts/${id}`, { method: "DELETE" });
    } catch {
      void load();
    }
  };

  const left = MAX - draft.length;

  return (
    <div className="mx-auto flex w-full max-w-[640px] flex-col pb-24">
      {/* Header */}
      <div className="sticky top-0 z-20 border-b border-white/10 bg-bg/90 px-4 py-3 backdrop-blur-md">
        <p className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-fuchsia-300">Community channel</p>
        <h1 className="text-xl font-black tracking-tight">Feed</h1>
        <p className="text-[13px] text-muted">Twitter-style posts from the lobby · like · delete yours</p>
      </div>

      {/* Composer */}
      <form onSubmit={submit} className="border-b border-white/10 px-4 py-3">
        <div className="flex gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-violet-600 to-cyan-400 text-sm font-black text-white">
            {(user?.gamertag ?? "?").slice(0, 2).toUpperCase()}
          </div>
          <div className="min-w-0 flex-1">
            <textarea
              value={draft}
              onChange={(e) => setDraft(e.target.value.slice(0, MAX))}
              placeholder="What's happening in LS?"
              rows={3}
              className="w-full resize-none rounded-xl border border-white/10 bg-white/[0.04] p-3 text-[16px] leading-snug text-text outline-none placeholder:text-faint focus:border-fuchsia-400/50"
            />
            <div className="mt-2 flex items-center justify-between gap-2">
              <span className={`text-[12px] font-bold ${left < 20 ? "text-amber-300" : "text-faint"}`}>{left}</span>
              <Button type="submit" size="sm" loading={posting} disabled={!draft.trim() || left < 0}>
                Post
              </Button>
            </div>
          </div>
        </div>
      </form>

      {loading && <LoadingState label="Loading feed…" />}
      {error && !loading && <div className="p-4"><ErrorState message={error} onRetry={() => void load()} /></div>}
      {!loading && !error && posts.length === 0 && (
        <div className="p-4">
          <EmptyState icon="💬" title="No posts yet" body="Be the first — drop a message for the community." />
        </div>
      )}

      <ul>
        {posts.map((p) => {
          const mine = user && p.userId === user.id;
          return (
            <li key={p.id} className="border-b border-white/10 px-4 py-3.5 hover:bg-white/[0.02]">
              <div className="flex gap-3">
                <div
                  className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-sm font-black text-white ${
                    p.platform === "ps5" ? "bg-gradient-to-br from-violet-600 to-fuchsia-500" : "bg-gradient-to-br from-sky-600 to-blue-500"
                  }`}
                >
                  {p.gamertag.slice(0, 2).toUpperCase()}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="truncate text-[15px] font-black">{p.gamertag}</span>
                    <Badge tone={p.platform === "ps5" ? "purple" : "blue"}>{PLATFORM_LABEL[p.platform]}</Badge>
                    <span className="text-[12px] text-faint">· {timeAgo(p.createdAt)}</span>
                  </div>
                  <p className="mt-1 whitespace-pre-wrap break-words text-[16px] leading-snug text-text">{p.body}</p>
                  <div className="mt-3 flex items-center gap-4">
                    <button
                      type="button"
                      onClick={() => void like(p.id)}
                      className={`tap inline-flex items-center gap-1.5 rounded-full px-2 py-1 text-[13px] font-bold active:scale-95 ${
                        p.likedByMe ? "text-rose-400" : "text-muted hover:text-rose-300"
                      }`}
                      aria-label="Like"
                    >
                      {p.likedByMe ? <IconHeartSolid size={18} /> : <IconHeart size={18} />}
                      {p.likeCount}
                    </button>
                    {mine && (
                      <button
                        type="button"
                        onClick={() => void remove(p.id)}
                        className="tap inline-flex items-center gap-1 rounded-full px-2 py-1 text-[13px] font-bold text-muted hover:text-rose-300"
                        aria-label="Delete"
                      >
                        <IconTrash size={16} /> Delete
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </li>
          );
        })}
      </ul>

      {posts.length > 0 && (
        <div className="p-4">
          <Button
            variant="secondary"
            block
            loading={loadingMore}
            onClick={() => {
              const last = posts[posts.length - 1];
              if (last) void load(last.id);
            }}
          >
            Load older posts
          </Button>
        </div>
      )}
    </div>
  );
}
