"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { IconBot } from "@/components/ui/Icons";

const BOTS = [
  {
    href: "/ai/lester",
    name: "Lester",
    sub: "Money · Heists · Glitches",
    grad: "from-violet-500 via-fuchsia-500 to-rose-400",
    ring: "ring-fuchsia-400/60",
    glow: "shadow-[0_0_32px_rgba(232,121,249,0.55)]",
  },
  {
    href: "/ai/pavel",
    name: "Pavel",
    sub: "Outfits · GCTF · Lobby",
    grad: "from-cyan-400 via-sky-500 to-indigo-500",
    ring: "ring-cyan-300/60",
    glow: "shadow-[0_0_32px_rgba(34,211,238,0.5)]",
  },
] as const;

export function BotDock() {
  const pathname = usePathname();
  if (pathname?.startsWith("/ai/")) return null;

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-50" style={{ paddingBottom: "max(0.3rem, var(--sab))" }}>
      <div className="pointer-events-auto mx-auto w-full max-w-[640px] px-3">
        <div className="mix-line mb-1.5 anim-hue" />
        <div className="relative overflow-hidden rounded-[1.25rem] border border-white/15 bg-[#06060d]/95 shadow-[0_-12px_50px_rgba(0,0,0,0.7)] backdrop-blur-2xl">
          <div className="bot-orb anim-bob-x -left-3 top-0 h-16 w-16 bg-violet-500/45" />
          <div className="bot-orb anim-bob-y right-4 top-0 h-14 w-14 bg-cyan-400/40" style={{ animationDelay: "0.35s" }} />
          <div className="bot-orb anim-orbit bottom-0 left-[40%] h-11 w-11 bg-rose-400/35" />
          <div className="pointer-events-none absolute inset-0 swirl-bg" />
          <div className="relative grid grid-cols-2 gap-2 p-2">
            {BOTS.map((b, i) => {
              const on = pathname === b.href;
              return (
                <Link
                  key={b.href}
                  href={b.href}
                  className={`tap relative flex min-h-[4rem] items-center gap-2.5 overflow-hidden rounded-xl border px-2.5 py-2 transition-transform active:scale-[0.97] ${
                    on ? `border-white/25 bg-white/10 ring-2 ${b.ring} ${b.glow}` : "border-white/10 bg-white/[0.05]"
                  }`}
                >
                  <span className="relative inline-flex h-12 w-12 shrink-0 items-center justify-center">
                    <span className={`anim-spin-slow absolute inset-0 rounded-full bg-gradient-to-br ${b.grad} opacity-95 ${b.glow}`} />
                    <span className="anim-spin-rev absolute inset-[3px] rounded-full bg-gradient-to-br from-amber-200 via-pink-400 to-cyan-300 opacity-70" />
                    <span className="absolute inset-[6px] rounded-full bg-[#07070e]" />
                    <span
                      className={`relative z-[1] inline-flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br ${b.grad} text-white anim-bob-y`}
                      style={{ animationDelay: `${i * 0.25}s` }}
                    >
                      <IconBot size={18} />
                    </span>
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate text-[16px] font-black tracking-tight">{b.name}</span>
                    <span className="block truncate text-[11px] font-bold text-muted">{b.sub}</span>
                    <span className="mt-0.5 block text-[10px] font-black uppercase tracking-[0.14em] text-faint">Chat now</span>
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
