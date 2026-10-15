"use client";
/**
 * Full-screen menu with continuously shifting rainbow accents.
 */
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { useSession } from "@/modules/session/SessionProvider";
import { NAV_SECTIONS, type NavItem, type Accent } from "./nav";
import { IconClose, IconChevron, IconLogout } from "@/components/ui/Icons";
import { APP_NAME, DEVELOPER, PLATFORM_LABEL } from "@/lib/constants";
import { useScrollLock } from "@/lib/hooks/useScrollLock";

const HUE_SHIFT: Record<Accent, number> = {
  purple: 0,
  blue: 40,
  cyan: 60,
  green: 100,
  amber: 140,
  orange: 170,
  red: 200,
  pink: 300,
};

function isItemActive(item: NavItem, pathname: string, search: string): boolean {
  const [path, query = ""] = item.href.split("?");
  if (!query) return pathname === path || pathname.startsWith(path + "/");
  if (pathname !== path) return false;
  const want = new URLSearchParams(query);
  const have = new URLSearchParams(search.startsWith("?") ? search.slice(1) : search);
  for (const [k, v] of want.entries()) {
    if (have.get(k) !== v) return false;
  }
  return true;
}

function MenuInner({ open, onClose }: { open: boolean; onClose: () => void }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const search = searchParams?.toString() ? `?${searchParams.toString()}` : "";
  const { user } = useSession();
  useScrollLock(open);
  const [hue, setHue] = useState(0);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  // continuous hue cycle while menu open
  useEffect(() => {
    if (!open) return;
    let raf = 0;
    let start = performance.now();
    const tick = (t: number) => {
      const elapsed = t - start;
      setHue((elapsed / 18) % 360); // full cycle ~6.5s — obvious live colors
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [open]);

  if (!open) return null;

  const live = (accent: Accent, sat = 85, lit = 62) =>
    `hsl(${(hue + HUE_SHIFT[accent]) % 360} ${sat}% ${lit}%)`;
  const liveBg = (accent: Accent) =>
    `hsla(${(hue + HUE_SHIFT[accent]) % 360} 90% 55% / 0.18)`;
  const liveBorder = (accent: Accent) =>
    `hsla(${(hue + HUE_SHIFT[accent]) % 360} 90% 60% / 0.45)`;
  const liveGlow = (accent: Accent) =>
    `0 0 22px hsla(${(hue + HUE_SHIFT[accent]) % 360} 95% 55% / 0.35)`;

  return (
    <div className="fixed inset-0 z-[100]" role="dialog" aria-modal="true" aria-label="Main menu">
      <button type="button" className="absolute inset-0 bg-black/75 backdrop-blur-sm" aria-label="Close menu" onClick={onClose} />
      <aside
        className="anim-slide-in absolute inset-y-0 right-0 flex w-full max-w-[420px] flex-col overflow-hidden border-l border-white/10 bg-[#08080f] shadow-[-20px_0_60px_rgba(0,0,0,0.75)]"
        style={{ height: "100dvh" }}
      >
        <div className="menu-rainbow-bar h-1.5 w-full shrink-0" />

        <div
          className="pt-safe relative shrink-0 overflow-hidden border-b border-white/5 px-4"
          style={{ paddingLeft: "max(1rem, var(--sal))", paddingRight: "max(1rem, var(--sar))" }}
        >
          <div
            className="pointer-events-none absolute -right-10 -top-10 h-36 w-36 rounded-full blur-3xl"
            style={{ background: live("purple", 90, 50), opacity: 0.35 }}
          />
          <div
            className="pointer-events-none absolute -left-8 top-8 h-28 w-28 rounded-full blur-3xl"
            style={{ background: live("cyan", 90, 50), opacity: 0.3 }}
          />
          <div className="relative flex h-14 items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="truncate text-[10px] font-bold uppercase tracking-[0.22em]" style={{ color: live("pink") }}>
                Menu · unlimited live colors
              </p>
              <p className="truncate text-sm font-black tracking-tight">{APP_NAME}</p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="tap inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/15 bg-white/5 text-text active:scale-95"
              aria-label="Close menu"
            >
              <IconClose />
            </button>
          </div>
        </div>

        <nav
          className="scrollbar-thin min-h-0 flex-1 overflow-y-auto overscroll-contain px-3 py-3"
          style={{ paddingLeft: "max(0.75rem, var(--sal))", paddingRight: "max(0.75rem, var(--sar))" }}
        >
          {user && (
            <div
              className="relative mb-4 overflow-hidden rounded-2xl border p-3.5"
              style={{
                borderColor: liveBorder("purple"),
                background: `linear-gradient(135deg, ${liveBg("purple")}, #12121a 50%, ${liveBg("cyan")})`,
                boxShadow: liveGlow("purple"),
              }}
            >
              <div className="flex items-center gap-3">
                <div
                  className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-base font-black text-white"
                  style={{
                    background: `linear-gradient(135deg, ${live("purple")}, ${live("cyan")}, ${live("pink")})`,
                    boxShadow: liveGlow("pink"),
                  }}
                >
                  {user.gamertag.slice(0, 2).toUpperCase()}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-base font-bold">{user.gamertag}</p>
                  <p className="text-xs text-muted">
                    <span style={{ color: live(user.platform === "ps5" ? "pink" : "blue") }}>{PLATFORM_LABEL[user.platform]}</span>
                    {" · "}ready to play
                  </p>
                </div>
              </div>
            </div>
          )}

          {NAV_SECTIONS.map((section) => (
            <div key={section.title} className="mb-4">
              <div className="mb-2 flex items-center gap-2 px-1">
                <span className="h-2 w-2 rounded-full" style={{ background: live(section.accent), boxShadow: liveGlow(section.accent) }} />
                <p className="text-[10px] font-bold uppercase tracking-[0.2em]" style={{ color: live(section.accent) }}>
                  {section.title}
                </p>
                <span
                  className="h-px flex-1"
                  style={{
                    background: `linear-gradient(90deg, ${live(section.accent)}, transparent)`,
                  }}
                />
              </div>
              <ul className="space-y-1.5">
                {section.items.map((item) => {
                  const on = isItemActive(item, pathname, search);
                  const Icon = item.icon;
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        onClick={onClose}
                        aria-current={on ? "page" : undefined}
                        className="tap group relative flex min-h-[56px] items-center gap-3 overflow-hidden rounded-2xl border px-2.5 py-2 transition-transform active:scale-[0.98]"
                        style={{
                          borderColor: on ? liveBorder(item.accent) : "rgba(255,255,255,0.08)",
                          background: on
                            ? liveBg(item.accent)
                            : "rgba(255,255,255,0.03)",
                          boxShadow: on ? liveGlow(item.accent) : undefined,
                        }}
                      >
                        <span
                          className="relative inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border"
                          style={{
                            borderColor: liveBorder(item.accent),
                            background: liveBg(item.accent),
                            color: live(item.accent, 90, 70),
                          }}
                        >
                          <Icon size={20} />
                        </span>
                        <span className="relative min-w-0 flex-1">
                          <span
                            className="block truncate text-[15px] font-bold"
                            style={{ color: on ? live(item.accent, 90, 75) : undefined }}
                          >
                            {item.label}
                          </span>
                          {item.description && <span className="block truncate text-[11px] text-muted">{item.description}</span>}
                        </span>
                        <IconChevron size={18} className="relative shrink-0 text-faint" style={{ color: on ? live(item.accent) : undefined }} />
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>

        <div
          className="pb-safe shrink-0 border-t border-white/5 bg-black/50 px-4 pt-3 backdrop-blur"
          style={{ paddingLeft: "max(1rem, var(--sal))", paddingRight: "max(1rem, var(--sar))" }}
        >
          <div className="menu-rainbow-bar mb-3 h-0.5 w-full rounded-full" />
          <div className="mb-3 flex items-center justify-between gap-3">
            <p className="truncate text-[11px] text-faint">
              by <span className="font-semibold text-muted">{DEVELOPER}</span>
            </p>
            <Link
              href="/settings#account"
              onClick={onClose}
              className="tap inline-flex min-h-10 items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-3 text-xs font-semibold text-muted active:text-text"
            >
              <IconLogout size={14} /> Switch
            </Link>
          </div>
        </div>
      </aside>
    </div>
  );
}

export function MobileMenu(props: { open: boolean; onClose: () => void }) {
  return (
    <Suspense fallback={null}>
      <MenuInner {...props} />
    </Suspense>
  );
}
