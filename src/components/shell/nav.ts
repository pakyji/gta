import type { ComponentType, SVGProps } from "react";
import { IconBook, IconBot, IconChat, IconFeed, IconHome, IconNews, IconSettings, IconSpark, IconGamepad, IconMusic } from "@/components/ui/Icons";

export type Accent = "purple" | "blue" | "red" | "green" | "amber" | "pink" | "cyan" | "orange";

export interface NavItem {
  href: string;
  label: string;
  description?: string;
  icon: ComponentType<SVGProps<SVGSVGElement> & { size?: number }>;
  accent: Accent;
}

export const NAV_SECTIONS: { title: string; accent: Accent; items: NavItem[] }[] = [
  {
    title: "Main",
    accent: "purple",
    items: [
      { href: "/home", label: "Home", description: "Dashboard & quick actions", icon: IconHome, accent: "purple" },
      { href: "/feed", label: "Feed", description: "Twitter-style community channel", icon: IconFeed, accent: "pink" },
      { href: "/fun", label: "Fun Zone", description: "Weather · cats · dogs", icon: IconSpark, accent: "cyan" },
      { href: "/music", label: "Music", description: "Complete GTA radio", icon: IconMusic, accent: "pink" },
      { href: "/vehicles", label: "Vehicles", description: "All cars · prices", icon: IconGamepad, accent: "orange" },
      { href: "/settings", label: "Settings", description: "Profile & about", icon: IconSettings, accent: "amber" },
    ],
  },
  {
    title: "Community",
    accent: "pink",
    items: [
      { href: "/feed", label: "Feed", description: "Twitter-style posts channel", icon: IconFeed, accent: "pink" },
      { href: "/chat/ps4", label: "PS4 Chat", description: "PlayStation 4 lobby", icon: IconChat, accent: "blue" },
      { href: "/chat/ps5", label: "PS5 Chat", description: "PlayStation 5 lobby", icon: IconChat, accent: "cyan" },
    ],
  },
  {
    title: "AI assistants",
    accent: "purple",
    items: [
      { href: "/ai/lester", label: "Lester AI", description: "Money · heists · businesses", icon: IconBot, accent: "purple" },
      { href: "/ai/pavel", label: "Pavel AI", description: "Outfits · lobby · community", icon: IconBot, accent: "cyan" },
    ],
  },
  {
    title: "Guides & intel",
    accent: "green",
    items: [
      { href: "/news", label: "News & Updates", description: "Daily · weekly bonuses", icon: IconNews, accent: "red" },
      { href: "/guides", label: "All Guides", description: "Browse every guide", icon: IconBook, accent: "green" },
      { href: "/guides?category=money", label: "Money Methods", description: "Cayo · businesses · agency", icon: IconBook, accent: "amber" },
      { href: "/guides?category=outfits", label: "Outfit Merges A–Z", description: "Merges · fits · style", icon: IconBook, accent: "pink" },
      { href: "/guides?category=glitches", label: "Glitch Guides", description: "Unverified · patched status", icon: IconBook, accent: "orange" },
      { href: "/guides?category=gctf", label: "GCTF Guides", description: "Car transfer methods", icon: IconBook, accent: "red" },
    ],
  },
];

export const ACCENT_TEXT: Record<Accent, string> = {
  purple: "text-neon-purple",
  blue: "text-neon-blue",
  red: "text-neon-red",
  green: "text-neon-green",
  amber: "text-neon-amber",
  pink: "text-pink-400",
  cyan: "text-cyan-400",
  orange: "text-orange-400",
};

export const ACCENT_BG: Record<Accent, string> = {
  purple: "bg-neon-purple/20",
  blue: "bg-neon-blue/20",
  red: "bg-neon-red/20",
  green: "bg-neon-green/20",
  amber: "bg-neon-amber/20",
  pink: "bg-pink-500/20",
  cyan: "bg-cyan-400/20",
  orange: "bg-orange-400/20",
};

export const ACCENT_BORDER: Record<Accent, string> = {
  purple: "border-neon-purple/40",
  blue: "border-neon-blue/40",
  red: "border-neon-red/40",
  green: "border-neon-green/40",
  amber: "border-neon-amber/40",
  pink: "border-pink-400/40",
  cyan: "border-cyan-400/40",
  orange: "border-orange-400/40",
};

export const ACCENT_GLOW: Record<Accent, string> = {
  purple: "shadow-[0_0_20px_rgba(168,85,247,0.25)]",
  blue: "shadow-[0_0_20px_rgba(56,189,248,0.25)]",
  red: "shadow-[0_0_20px_rgba(255,59,92,0.25)]",
  green: "shadow-[0_0_20px_rgba(52,211,153,0.25)]",
  amber: "shadow-[0_0_20px_rgba(251,191,36,0.25)]",
  pink: "shadow-[0_0_20px_rgba(244,114,182,0.25)]",
  cyan: "shadow-[0_0_20px_rgba(34,211,238,0.25)]",
  orange: "shadow-[0_0_20px_rgba(251,146,60,0.25)]",
};

export const ACCENT_GRADIENT: Record<Accent, string> = {
  purple: "from-violet-600/30 via-fuchsia-600/10 to-transparent",
  blue: "from-sky-600/30 via-blue-600/10 to-transparent",
  red: "from-rose-600/30 via-red-600/10 to-transparent",
  green: "from-emerald-600/30 via-green-600/10 to-transparent",
  amber: "from-amber-500/30 via-yellow-600/10 to-transparent",
  pink: "from-pink-600/30 via-fuchsia-600/10 to-transparent",
  cyan: "from-cyan-500/30 via-teal-600/10 to-transparent",
  orange: "from-orange-500/30 via-amber-600/10 to-transparent",
};

export const SECTION_DOT: Record<Accent, string> = {
  purple: "bg-neon-purple",
  blue: "bg-neon-blue",
  red: "bg-neon-red",
  green: "bg-neon-green",
  amber: "bg-neon-amber",
  pink: "bg-pink-400",
  cyan: "bg-cyan-400",
  orange: "bg-orange-400",
};
