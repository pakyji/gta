import { NextResponse } from "next/server";
import { handleApi, badRequest } from "@/lib/api/errors";

export const dynamic = "force-dynamic";

export type MusicSearchHit = {
  id: string;
  title: string;
  artist: string;
  artwork: string | null;
  duration: number | null;
  streamUrl: string;
  source: "audius" | "itunes" | "url";
};

function isDirectMediaUrl(q: string): boolean {
  try {
    const u = new URL(q);
    if (!/^https?:$/i.test(u.protocol)) return false;
    const path = u.pathname.toLowerCase();
    if (/\.(mp3|m4a|aac|ogg|opus|wav|flac)(\?|$)/i.test(path)) return true;
    if (/\/stream|\/listen|\/radio|icecast|somafm|\.pls|\.m3u/i.test(q)) return true;
    return false;
  } catch {
    return false;
  }
}

async function searchAudius(q: string): Promise<MusicSearchHit[]> {
  const url = `https://discoveryprovider.audius.co/v1/tracks/search?query=${encodeURIComponent(q)}&limit=20`;
  const controller = new AbortController();
  const t = setTimeout(() => controller.abort(), 12000);
  try {
    const res = await fetch(url, {
      signal: controller.signal,
      headers: { Accept: "application/json" },
      cache: "no-store",
    });
    if (!res.ok) return [];
    const data = (await res.json()) as {
      data?: Array<{
        id?: string;
        title?: string;
        user?: { name?: string };
        artwork?: { "150x150"?: string; "480x480"?: string };
        duration?: number;
      }>;
    };
    const hits: MusicSearchHit[] = [];
    for (const tr of data.data ?? []) {
      if (!tr.id || !tr.title) continue;
      hits.push({
        id: `audius-${tr.id}`,
        title: tr.title,
        artist: tr.user?.name ?? "Unknown",
        artwork: tr.artwork?.["480x480"] || tr.artwork?.["150x150"] || null,
        duration: tr.duration ?? null,
        streamUrl: `https://discoveryprovider.audius.co/v1/tracks/${tr.id}/stream`,
        source: "audius",
      });
    }
    return hits;
  } catch {
    return [];
  } finally {
    clearTimeout(t);
  }
}

async function searchItunes(q: string): Promise<MusicSearchHit[]> {
  const url = `https://itunes.apple.com/search?term=${encodeURIComponent(q)}&media=music&entity=song&limit=20`;
  const controller = new AbortController();
  const t = setTimeout(() => controller.abort(), 10000);
  try {
    const res = await fetch(url, { signal: controller.signal, cache: "no-store" });
    if (!res.ok) return [];
    const data = (await res.json()) as {
      results?: Array<{
        trackId?: number;
        trackName?: string;
        artistName?: string;
        artworkUrl100?: string;
        previewUrl?: string;
        trackTimeMillis?: number;
      }>;
    };
    const hits: MusicSearchHit[] = [];
    for (const r of data.results ?? []) {
      if (!r.previewUrl || !r.trackName) continue;
      hits.push({
        id: `itunes-${r.trackId ?? r.trackName}`,
        title: r.trackName,
        artist: r.artistName ?? "Unknown",
        artwork: r.artworkUrl100 || null,
        duration: r.trackTimeMillis ? Math.round(r.trackTimeMillis / 1000) : null,
        streamUrl: r.previewUrl,
        source: "itunes",
      });
    }
    return hits;
  } catch {
    return [];
  } finally {
    clearTimeout(t);
  }
}

export const GET = handleApi(async (req) => {
  const q = new URL(req.url).searchParams.get("q")?.trim() ?? "";
  if (!q) throw badRequest("Type a song, artist, or paste a music URL.");

  if (/^https?:\/\//i.test(q)) {
    let title = "Direct stream";
    try {
      title = decodeURIComponent(new URL(q).pathname.split("/").filter(Boolean).pop() || title);
    } catch {
      /* ignore */
    }
    const hit: MusicSearchHit = {
      id: `url-${Buffer.from(q).toString("base64url").slice(0, 24)}`,
      title: isDirectMediaUrl(q) ? title : "Custom URL",
      artist: "Direct URL",
      artwork: null,
      duration: null,
      streamUrl: q,
      source: "url",
    };
    return NextResponse.json({ items: [hit], total: 1, query: "url" });
  }

  const [audius, itunes] = await Promise.all([searchAudius(q), searchItunes(q)]);
  const items = [...audius, ...itunes].slice(0, 40);
  return NextResponse.json({
    items,
    total: items.length,
    query: q,
    note:
      items.length === 0
        ? "No tracks found. Try another name, or paste a direct https://…mp3 / stream URL."
        : "Audius = full tracks when available. iTunes = 30s previews. Paste any audio URL to play full file/stream.",
  });
});
