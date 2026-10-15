"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { IconMusic, IconPause, IconPlay, IconSkipBack, IconSkipFwd } from "@/components/ui/Icons";
import { useMusic } from "./MusicPlayerContext";

/**
 * Simple always-on music bar.
 * - Fixed near bottom (stable on mobile)
 * - Swipe left/right on the bar to move vertically (drag)
 * - Big play button always works
 */
export function MusicMiniPlayer() {
  const pathname = usePathname();
  const { current, playing, loading, error, toggle, next, prev, playStation, stations } = useMusic();
  const [offsetY, setOffsetY] = useState(0);
  const startY = useRef(0);
  const base = useRef(0);
  const dragging = useRef(false);

  useEffect(() => {
    const t = window.setTimeout(() => {
      try {
        const v = Number(localStorage.getItem("gtac_music_y") || "0");
        if (!Number.isNaN(v)) setOffsetY(v);
      } catch {
        /* ignore */
      }
    }, 0);
    return () => window.clearTimeout(t);
  }, []);

  if (pathname?.startsWith("/music")) return null;

  const onPlay = () => {
    if (!current) {
      if (stations[0]) playStation(stations[0].id);
      return;
    }
    toggle();
  };

  return (
    <div
      className="fixed inset-x-0 z-[60] px-3"
      style={{
        bottom: `calc(5.5rem + env(safe-area-inset-bottom, 0px) + ${-offsetY}px)`,
      }}
    >
      <div
        className="mx-auto flex max-w-[640px] items-center gap-2 rounded-2xl border border-white/20 bg-black/90 p-2 shadow-2xl backdrop-blur-xl"
        style={{
          backgroundImage: current?.color
            ? `linear-gradient(90deg, ${current.color}66, #000 70%)`
            : "linear-gradient(90deg, rgba(168,85,247,0.5), #000 70%)",
        }}
        onTouchStart={(e) => {
          dragging.current = true;
          startY.current = e.touches[0].clientY;
          base.current = offsetY;
        }}
        onTouchMove={(e) => {
          if (!dragging.current) return;
          const dy = startY.current - e.touches[0].clientY; // up = positive offset
          const next = Math.max(-80, Math.min(220, base.current + dy));
          setOffsetY(next);
        }}
        onTouchEnd={() => {
          dragging.current = false;
          try {
            localStorage.setItem("gtac_music_y", String(offsetY));
          } catch {
            /* ignore */
          }
        }}
      >
        <Link href="/music" className="flex min-w-0 flex-1 items-center gap-2 px-1">
          <span
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-white"
            style={{
              background: current?.color
                ? `linear-gradient(135deg, ${current.color}, #7c3aed)`
                : "linear-gradient(135deg, #7c3aed, #06b6d4)",
            }}
          >
            <IconMusic size={22} />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block truncate text-[14px] font-black text-white">{current?.title ?? "Music Radio"}</span>
            <span className="block truncate text-[11px] font-semibold text-white/70">
              {loading ? "Connecting…" : error ? "Tap play" : playing ? current?.subtitle ?? "Playing" : "Tap play · swipe bar up/down"}
            </span>
          </span>
        </Link>
        <button type="button" className="flex h-11 w-10 items-center justify-center text-white/80" onClick={prev} aria-label="Prev">
          <IconSkipBack size={18} />
        </button>
        <button
          type="button"
          className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-black shadow-lg"
          onClick={onPlay}
          aria-label={playing ? "Pause" : "Play"}
        >
          {playing ? <IconPause size={20} /> : <IconPlay size={20} />}
        </button>
        <button type="button" className="flex h-11 w-10 items-center justify-center text-white/80" onClick={next} aria-label="Next">
          <IconSkipFwd size={18} />
        </button>
      </div>
    </div>
  );
}
