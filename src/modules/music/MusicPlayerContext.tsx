"use client";
/**
 * Global audio player for radio stations + searched tracks + direct URLs.
 */
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { STATIONS, getStation, type RadioStation } from "./stations";

const STORAGE_KEY = "gtac_radio_v2";

export type Playable = {
  id: string;
  title: string;
  subtitle: string;
  streamUrl: string;
  artwork?: string | null;
  color?: string;
  accent?: string;
  kind: "station" | "track" | "url";
};

type Ctx = {
  stations: RadioStation[];
  current: Playable | null;
  playing: boolean;
  loading: boolean;
  error: string | null;
  volume: number;
  muted: boolean;
  playStation: (id: string) => void;
  playTrack: (track: Playable) => void;
  playUrl: (url: string, title?: string) => void;
  toggle: () => void;
  pause: () => void;
  next: () => void;
  prev: () => void;
  setVolume: (v: number) => void;
  toggleMute: () => void;
};

const MusicCtx = createContext<Ctx | null>(null);

function stationToPlayable(s: RadioStation): Playable {
  return {
    id: s.id,
    title: s.name,
    subtitle: s.tagline,
    streamUrl: s.streamUrl,
    color: s.color,
    accent: s.accent,
    kind: "station",
  };
}

export function MusicPlayerProvider({ children }: { children: ReactNode }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [current, setCurrent] = useState<Playable | null>(null);
  const [playing, setPlaying] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [volume, setVol] = useState(0.85);
  const [muted, setMuted] = useState(false);
  const queueRef = useRef<Playable[]>([]);
  const playInternalRef = useRef<(item: Playable) => Promise<void>>(async () => {});

  useEffect(() => {
    const t = window.setTimeout(() => {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return;
        const d = JSON.parse(raw) as { volume?: number; muted?: boolean; stationId?: string };
        if (typeof d.volume === "number") setVol(Math.min(1, Math.max(0, d.volume)));
        if (typeof d.muted === "boolean") setMuted(d.muted);
        if (d.stationId && getStation(d.stationId)) {
          setCurrent(stationToPlayable(getStation(d.stationId)!));
        }
      } catch {
        /* ignore */
      }
    }, 0);
    return () => window.clearTimeout(t);
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          volume,
          muted,
          stationId: current?.kind === "station" ? current.id : undefined,
        }),
      );
    } catch {
      /* ignore */
    }
  }, [volume, muted, current]);

  useEffect(() => {
    const a = new Audio();
    a.preload = "none";
    audioRef.current = a;

    const onPlaying = () => {
      setLoading(false);
      setPlaying(true);
      setError(null);
    };
    const onPause = () => setPlaying(false);
    const onWaiting = () => setLoading(true);
    const onError = () => {
      setLoading(false);
      setPlaying(false);
      setError("Could not play this audio. Try another result or a direct .mp3 URL.");
    };
    const onEnded = () => {
      setPlaying(false);
      // auto-next in queue if any
      const q = queueRef.current;
      if (q.length) {
        const nextItem = q.shift()!;
        void playInternalRef.current(nextItem);
      }
    };

    a.addEventListener("playing", onPlaying);
    a.addEventListener("pause", onPause);
    a.addEventListener("waiting", onWaiting);
    a.addEventListener("error", onError);
    a.addEventListener("ended", onEnded);

    return () => {
      a.pause();
      a.removeAttribute("src");
      a.load();
      a.removeEventListener("playing", onPlaying);
      a.removeEventListener("pause", onPause);
      a.removeEventListener("waiting", onWaiting);
      a.removeEventListener("error", onError);
      a.removeEventListener("ended", onEnded);
      audioRef.current = null;
    };
  }, []);

  useEffect(() => {
    const a = audioRef.current;
    if (!a) return;
    a.volume = muted ? 0 : volume;
  }, [volume, muted]);

  const playInternal = useCallback(async (item: Playable) => {
    const a = audioRef.current;
    if (!a) return;
    setError(null);
    setCurrent(item);
    setLoading(true);
    const tryPlay = async (url: string) => {
      a.pause();
      a.removeAttribute("src");
      a.src = url;
      a.load();
      await a.play();
    };
    try {
      await tryPlay(item.streamUrl);
      setPlaying(true);
      setLoading(false);
    } catch (e1) {
      // Retry once after short delay (mobile autoplay / slow mount)
      try {
        await new Promise((r) => setTimeout(r, 250));
        await tryPlay(item.streamUrl);
        setPlaying(true);
        setLoading(false);
      } catch {
        setLoading(false);
        setPlaying(false);
        setError("Station stream failed. Try another station, or search a song/URL.");
      }
    }
  }, []);

  useEffect(() => {
    playInternalRef.current = playInternal;
  }, [playInternal]);

  const playStation = useCallback(
    (id: string) => {
      const st = getStation(id);
      if (!st) return;
      queueRef.current = [];
      void playInternal(stationToPlayable(st));
    },
    [playInternal],
  );

  const playTrack = useCallback(
    (track: Playable) => {
      void playInternal(track);
    },
    [playInternal],
  );

  const playUrl = useCallback(
    (url: string, title?: string) => {
      void playInternal({
        id: `url-${Date.now()}`,
        title: title || "Direct URL",
        subtitle: "Custom stream",
        streamUrl: url,
        kind: "url",
        accent: "from-cyan-500 to-blue-600",
        color: "#06b6d4",
      });
    },
    [playInternal],
  );

  const pause = useCallback(() => {
    audioRef.current?.pause();
    setPlaying(false);
  }, []);

  const toggle = useCallback(() => {
    const a = audioRef.current;
    if (!a || !current) {
      void playStation(STATIONS[0].id);
      return;
    }
    if (playing) pause();
    else {
      void a.play().then(() => setPlaying(true)).catch(() => void playInternal(current));
    }
  }, [current, playing, pause, playStation, playInternal]);

  const next = useCallback(() => {
    if (current?.kind === "station" || !current) {
      const idx = STATIONS.findIndex((s) => s.id === current?.id);
      const n = STATIONS[(idx + 1 + STATIONS.length) % STATIONS.length];
      void playStation(n.id);
      return;
    }
    if (queueRef.current.length) {
      const n = queueRef.current.shift()!;
      void playInternal(n);
    }
  }, [current, playStation, playInternal]);

  const prev = useCallback(() => {
    if (current?.kind === "station" || !current) {
      const idx = STATIONS.findIndex((s) => s.id === current?.id);
      const n = STATIONS[(idx - 1 + STATIONS.length) % STATIONS.length];
      void playStation(n.id);
    }
  }, [current, playStation]);

  const setVolume = useCallback((v: number) => {
    setVol(Math.min(1, Math.max(0, v)));
    if (v > 0) setMuted(false);
  }, []);

  const toggleMute = useCallback(() => setMuted((m) => !m), []);

  const value = useMemo(
    () => ({
      stations: STATIONS,
      current,
      playing,
      loading,
      error,
      volume,
      muted,
      playStation,
      playTrack,
      playUrl,
      toggle,
      pause,
      next,
      prev,
      setVolume,
      toggleMute,
    }),
    [current, playing, loading, error, volume, muted, playStation, playTrack, playUrl, toggle, pause, next, prev, setVolume, toggleMute],
  );

  return <MusicCtx.Provider value={value}>{children}</MusicCtx.Provider>;
}

export function useMusic(): Ctx {
  const ctx = useContext(MusicCtx);
  if (!ctx) throw new Error("useMusic must be used within MusicPlayerProvider");
  return ctx;
}
