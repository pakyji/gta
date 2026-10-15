"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useState, type ReactNode } from "react";
import { MobileMenu } from "./MobileMenu";
import { BotDock } from "./BotDock";
import { MusicMiniPlayer } from "@/modules/music/MusicMiniPlayer";
import { IconBack, IconMenu, IconWifiOff } from "@/components/ui/Icons";
import { useOnline } from "@/lib/hooks/useOnline";

export function AppShell({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const close = useCallback(() => setOpen(false), []);
  const online = useOnline();
  return (
    <div className="flex min-h-dvh flex-col">
      <header className="sticky top-0 z-40 border-b border-white/5 bg-bg/90 backdrop-blur-md">
        <div className="menu-rainbow-bar h-[2px] w-full" />
        <div className="pt-safe" />
        <div
          className="mx-auto flex h-14 w-full max-w-[640px] items-center justify-between gap-2"
          style={{ paddingLeft: "max(0.85rem, var(--sal))", paddingRight: "max(0.85rem, var(--sar))" }}
        >
          <Link href="/home" className="tap flex min-w-0 items-center gap-2.5 rounded-lg py-1 pr-2">
            <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 via-cyan-400 to-rose-400 text-[12px] font-black text-white shadow-[0_0_18px_rgba(168,85,247,0.4)]">
              GC
            </span>
            <span className="truncate text-[16px] font-black tracking-tight">
              GTA <span className="neon-text menu-hue-live">Community</span>
            </span>
          </Link>
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="tap inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-text active:scale-95"
            aria-label="Open menu"
            aria-expanded={open}
          >
            <IconMenu />
          </button>
        </div>
        {!online && (
          <div className="flex items-center justify-center gap-2 bg-neon-red/15 px-3 py-1.5 text-xs font-bold text-[#ff8fa3]">
            <IconWifiOff size={14} /> You&apos;re offline — some features won&apos;t work until you reconnect.
          </div>
        )}
      </header>
      <main className="mx-auto flex w-full max-w-[640px] flex-1 flex-col" style={{ paddingBottom: "calc(var(--botdock-h) + var(--sab) + 1.25rem)" }}>{children}</main>
      <MusicMiniPlayer />
      <BotDock />
      <MobileMenu open={open} onClose={close} />
    </div>
  );
}

export function PageHeader({ title, subtitle, back, action }: { title: string; subtitle?: string; back?: string | true; action?: ReactNode }) {
  const router = useRouter();
  return (
    <div className="px-safe flex items-start gap-2 pb-3 pt-4">
      {back && (
        <button
          type="button"
          onClick={() => (back === true ? router.back() : router.push(back))}
          className="tap -ml-1 inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-muted active:bg-surface-2"
          aria-label="Go back"
        >
          <IconBack />
        </button>
      )}
      <div className="min-w-0 flex-1">
        <h1 className="title-lg truncate">{title}</h1>
        {subtitle && <p className="mt-0.5 text-[15px] text-muted">{subtitle}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
