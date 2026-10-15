"use client";
import { useCallback, useMemo, useState } from "react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { IconMusic, IconPause, IconPlay, IconSkipBack, IconSkipFwd, IconVolume } from "@/components/ui/Icons";
import { FilterChips, SearchBar } from "@/components/ui/SearchBar";
import { EmptyState, ErrorState, LoadingState } from "@/components/ui/States";
import { apiFetch, ClientApiError } from "@/lib/api/client";
import { GENRE_LABEL, type RadioStation } from "./stations";
import { useMusic, type Playable } from "./MusicPlayerContext";

type Hit = {
  id: string;
  title: string;
  artist: string;
  artwork: string | null;
  duration: number | null;
  streamUrl: string;
  source: "audius" | "itunes" | "url";
};

const GENRES: { value: string; label: string }[] = [
  { value: "all", label: "Stations" },
  ...Object.entries(GENRE_LABEL).map(([value, label]) => ({ value, label })),
];

export function MusicPage() {
  const { stations, current, playing, loading, error, volume, muted, playStation, playTrack, playUrl, toggle, next, prev, setVolume, toggleMute } =
    useMusic();
  const [q, setQ] = useState("");
  const [genre, setGenre] = useState("all");
  const [tab, setTab] = useState<"stations" | "search">("stations");
  const [hits, setHits] = useState<Hit[] | null>(null);
  const [searching, setSearching] = useState(false);
  const [searchErr, setSearchErr] = useState<string | null>(null);
  const [searchNote, setSearchNote] = useState<string | null>(null);

  const list = useMemo(() => {
    let s = stations;
    if (genre !== "all") s = s.filter((x) => x.genre === genre);
    const qq = q.trim().toLowerCase();
    if (tab === "stations" && qq) {
      s = s.filter(
        (x) =>
          x.name.toLowerCase().includes(qq) ||
          x.tagline.toLowerCase().includes(qq) ||
          x.genreLabel.toLowerCase().includes(qq) ||
          (x.dj && x.dj.toLowerCase().includes(qq)) ||
          (x.location && x.location.toLowerCase().includes(qq)),
      );
    }
    return s;
  }, [stations, genre, q, tab]);

  const runSearch = useCallback(async (query: string) => {
    const qq = query.trim();
    if (!qq) {
      setHits(null);
      setSearchErr(null);
      return;
    }
    // If looks like URL, play immediately
    if (/^https?:\/\//i.test(qq)) {
      playUrl(qq, "Custom URL");
      setTab("search");
      setHits([
        {
          id: "direct",
          title: "Custom URL",
          artist: "Direct play",
          artwork: null,
          duration: null,
          streamUrl: qq,
          source: "url",
        },
      ]);
      setSearchNote("Playing your URL…");
      return;
    }
    setTab("search");
    setSearching(true);
    setSearchErr(null);
    setSearchNote(null);
    try {
      const res = await apiFetch<{ items: Hit[]; note?: string }>(`/api/music/search?q=${encodeURIComponent(qq)}`, {
        skipAuth: true,
        timeoutMs: 20000,
      });
      setHits(res.items);
      setSearchNote(res.note ?? null);
      if (res.items.length === 1 && res.items[0].source === "url") {
        playTrack({
          id: res.items[0].id,
          title: res.items[0].title,
          subtitle: res.items[0].artist,
          streamUrl: res.items[0].streamUrl,
          artwork: res.items[0].artwork,
          kind: "url",
          accent: "from-cyan-500 to-blue-600",
          color: "#06b6d4",
        });
      }
    } catch (err) {
      setHits([]);
      setSearchErr(err instanceof ClientApiError ? err.message : "Search failed.");
    } finally {
      setSearching(false);
    }
  }, [playUrl, playTrack]);

  const onSubmitSearch = (value: string) => {
    setQ(value);
    void runSearch(value);
  };

  const playHit = (h: Hit) => {
    const item: Playable = {
      id: h.id,
      title: h.title,
      subtitle: h.artist + (h.source === "itunes" ? " · preview" : h.source === "audius" ? " · Audius" : " · URL"),
      streamUrl: h.streamUrl,
      artwork: h.artwork,
      kind: h.source === "url" ? "url" : "track",
      accent: h.source === "audius" ? "from-violet-600 to-fuchsia-500" : h.source === "itunes" ? "from-pink-500 to-rose-500" : "from-cyan-500 to-blue-600",
      color: h.source === "audius" ? "#a855f7" : "#ec4899",
    };
    playTrack(item);
  };

  return (
    <div className="px-safe space-y-4 pb-28 pt-4">
      <div>
        <div className="mix-line mb-3" />
        <p className="font-label text-fuchsia-300">Complete music</p>
        <h1 className="title-xl neon-text mt-1">Music</h1>
        <p className="body-lg mt-2">Search any artist, song, or paste a music URL — or pick a GTA-style radio station.</p>
      </div>

      {/* Now playing */}
      <div
        className="card card-glow relative overflow-hidden border border-white/10 p-4"
        style={{
          background: current?.color
            ? `linear-gradient(145deg, ${current.color}44, #0a0a12 55%)`
            : "linear-gradient(145deg, rgba(168,85,247,0.2), #0a0a12 60%)",
        }}
      >
        <div className="relative flex items-center gap-4">
          {current?.artwork ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={current.artwork} alt="" className="h-20 w-20 shrink-0 rounded-2xl object-cover shadow-xl" />
          ) : (
            <div
              className={`flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${current?.accent ?? "from-violet-600 to-cyan-500"} text-white shadow-xl ${playing ? "anim-spin-slow" : ""}`}
              style={{ animationDuration: "14s" }}
            >
              <IconMusic size={36} />
            </div>
          )}
          <div className="min-w-0 flex-1">
            <p className="font-label text-white/70">{playing || loading ? "Now playing" : "Ready"}</p>
            <h2 className="truncate text-[1.25rem] font-black tracking-tight text-white">{current?.title ?? "Search or pick a station"}</h2>
            <p className="truncate text-[14px] text-white/75">
              {loading ? "Connecting…" : current?.subtitle ?? "Artist · song · or https URL"}
            </p>
          </div>
        </div>

        <div className="relative mt-4 flex items-center justify-center gap-3">
          <button type="button" onClick={prev} className="tap inline-flex h-12 w-12 items-center justify-center rounded-full border border-white/15 bg-black/30 text-white" aria-label="Previous">
            <IconSkipBack size={22} />
          </button>
          <button
            type="button"
            onClick={toggle}
            className={`tap inline-flex h-16 w-16 items-center justify-center rounded-full text-white shadow-lg ${current?.accent ? `bg-gradient-to-br ${current.accent}` : "bg-gradient-to-br from-violet-600 to-fuchsia-500"}`}
            aria-label={playing ? "Pause" : "Play"}
          >
            {playing ? <IconPause size={28} /> : <IconPlay size={28} />}
          </button>
          <button type="button" onClick={next} className="tap inline-flex h-12 w-12 items-center justify-center rounded-full border border-white/15 bg-black/30 text-white" aria-label="Next">
            <IconSkipFwd size={22} />
          </button>
        </div>

        <div className="relative mt-4 flex items-center gap-3">
          <button type="button" onClick={toggleMute} className="tap text-white/80" aria-label="Mute">
            <IconVolume size={20} />
          </button>
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={muted ? 0 : volume}
            onChange={(e) => setVolume(Number(e.target.value))}
            className="h-2 w-full cursor-pointer appearance-none rounded-full bg-white/20 accent-fuchsia-400"
            aria-label="Volume"
          />
          <span className="w-10 text-right text-[12px] font-bold text-white/70">{Math.round((muted ? 0 : volume) * 100)}</span>
        </div>
        {error && <p className="relative mt-2 text-[13px] font-semibold text-rose-300">{error}</p>}
      </div>

      {/* Search */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          void runSearch(q);
        }}
        className="space-y-2"
      >
        <SearchBar value={q} onChange={setQ} placeholder="Artist, song name, OR paste https:// music URL…" />
        <div className="flex gap-2">
          <Button type="submit" className="flex-1" loading={searching}>
            Search & Play
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={() => {
              setTab("stations");
              setHits(null);
              setSearchErr(null);
            }}
          >
            Stations
          </Button>
        </div>
      </form>

      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => setTab("search")}
          className={`tap rounded-full border px-4 py-2 text-sm font-bold ${tab === "search" ? "border-fuchsia-400/50 bg-fuchsia-500/20 text-fuchsia-200" : "border-white/10 bg-white/5 text-muted"}`}
        >
          Songs
        </button>
        <button
          type="button"
          onClick={() => setTab("stations")}
          className={`tap rounded-full border px-4 py-2 text-sm font-bold ${tab === "stations" ? "border-cyan-400/50 bg-cyan-500/20 text-cyan-200" : "border-white/10 bg-white/5 text-muted"}`}
        >
          Radio stations
        </button>
      </div>

      {tab === "search" && (
        <div className="space-y-3">
          {searching && <LoadingState label="Searching songs…" />}
          {searchErr && <ErrorState message={searchErr} onRetry={() => void runSearch(q)} />}
          {searchNote && !searching && <p className="text-[12px] text-muted">{searchNote}</p>}
          {hits && hits.length === 0 && !searching && !searchErr && (
            <EmptyState icon="🎵" title="No tracks found" body="Try another artist/song, or paste a direct mp3/stream URL." />
          )}
          <ul className="space-y-2">
            {hits?.map((h) => {
              const on = current?.id === h.id;
              return (
                <li key={h.id}>
                  <button
                    type="button"
                    onClick={() => playHit(h)}
                    className={`tap flex w-full items-center gap-3 rounded-2xl border p-2.5 text-left active:scale-[0.99] ${
                      on ? "border-fuchsia-400/40 bg-fuchsia-500/15" : "border-white/10 bg-white/[0.04]"
                    }`}
                  >
                    {h.artwork ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={h.artwork} alt="" className="h-14 w-14 shrink-0 rounded-xl object-cover" />
                    ) : (
                      <span className="inline-flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-pink-500 text-white">
                        <IconMusic size={22} />
                      </span>
                    )}
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[15px] font-black">{h.title}</span>
                      <span className="block truncate text-[13px] text-muted">{h.artist}</span>
                      <span className="mt-1 flex gap-1">
                        <Badge tone={h.source === "audius" ? "purple" : h.source === "itunes" ? "red" : "blue"}>
                          {h.source === "audius" ? "Full" : h.source === "itunes" ? "Preview" : "URL"}
                        </Badge>
                        {h.duration ? <Badge tone="neutral">{Math.floor(h.duration / 60)}:{String(h.duration % 60).padStart(2, "0")}</Badge> : null}
                      </span>
                    </span>
                    <span className={`inline-flex h-10 w-10 items-center justify-center rounded-full ${on && playing ? "bg-fuchsia-500 text-white" : "bg-white/10 text-muted"}`}>
                      {on && playing ? <IconPause size={16} /> : <IconPlay size={16} />}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      )}

      {tab === "stations" && (
        <>
          <FilterChips value={genre} onChange={setGenre} options={GENRES} />
          <p className="text-[13px] font-bold text-faint">{list.length} stations</p>
          <ul className="space-y-2.5">
            {list.map((s) => (
              <StationRow key={s.id} station={s} active={current?.id === s.id} playing={playing && current?.id === s.id} onPlay={() => playStation(s.id)} />
            ))}
          </ul>
        </>
      )}
    </div>
  );
}

function StationRow({
  station,
  active,
  playing,
  onPlay,
}: {
  station: RadioStation;
  active: boolean;
  playing: boolean;
  onPlay: () => void;
}) {
  return (
    <li>
      <button
        type="button"
        onClick={onPlay}
        className={`tap flex w-full items-center gap-3 overflow-hidden rounded-2xl border p-3 text-left active:scale-[0.99] ${
          active ? "border-white/25 bg-white/10 shadow-lg" : "border-white/10 bg-white/[0.04]"
        }`}
        style={active ? { boxShadow: `0 0 28px ${station.color}44` } : undefined}
      >
        <span className={`relative inline-flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${station.accent} text-white shadow-md`}>
          <IconMusic size={24} />
          {playing && <span className="absolute -right-1 -top-1 h-3 w-3 animate-pulse rounded-full bg-neon-green ring-2 ring-black" />}
        </span>
        <span className="min-w-0 flex-1">
          <span className="block truncate text-[16px] font-black tracking-tight">{station.name}</span>
          <span className="block truncate text-[13px] text-muted">{station.tagline}</span>
          <span className="mt-1 flex flex-wrap gap-1">
            <Badge tone="neutral">{station.genreLabel}</Badge>
            {station.location && <Badge tone="blue">{station.location}</Badge>}
          </span>
        </span>
        <span className={`inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${active ? `bg-gradient-to-br ${station.accent} text-white` : "bg-white/10 text-muted"}`}>
          {playing ? <IconPause size={18} /> : <IconPlay size={18} />}
        </span>
      </button>
    </li>
  );
}
