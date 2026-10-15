import type { ReactNode } from "react";

type Tone = "purple" | "red" | "blue" | "green" | "amber" | "neutral";

const tones: Record<Tone, string> = {
  purple: "bg-neon-purple/15 text-[#d8b4fe] border-neon-purple/30",
  red: "bg-neon-red/15 text-[#ff8fa3] border-neon-red/30",
  blue: "bg-neon-blue/15 text-[#7dd3fc] border-neon-blue/30",
  green: "bg-neon-green/15 text-[#6ee7b7] border-neon-green/30",
  amber: "bg-neon-amber/15 text-[#fcd34d] border-neon-amber/30",
  neutral: "bg-surface-3 text-muted border-border",
};

export function Badge({ tone = "neutral", children, className = "" }: { tone?: Tone; children: ReactNode; className?: string }) {
  return (
    <span
      className={`inline-flex max-w-full items-center gap-1 truncate rounded-full border px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide ${tones[tone]} ${className}`}
    >
      {children}
    </span>
  );
}

export function statusTone(status: string): Tone {
  switch (status) {
    case "verified":
      return "green";
    case "unverified":
      return "amber";
    case "patched":
      return "red";
    case "outdated":
      return "neutral";
    default:
      return "neutral";
  }
}

export function statusLabel(status: string): string {
  switch (status) {
    case "verified":
      return "Verified method";
    case "unverified":
      return "Unverified";
    case "patched":
      return "Patched";
    case "outdated":
      return "Outdated";
    default:
      return status;
  }
}
