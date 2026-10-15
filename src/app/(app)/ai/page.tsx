import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { IconBot, IconChevron } from "@/components/ui/Icons";
import { BOT_PROFILES } from "@/modules/ai/bots";
import { providerStatus } from "@/modules/ai/providers";

export const metadata = { title: "AI assistants" };
export const dynamic = "force-dynamic";

export default function AiIndexPage() {
  const status = providerStatus();
  const ready = status.available?.filter((a) => a.ready) ?? [];
  return (
    <div className="px-safe space-y-4 pb-10 pt-4">
      <div>
        <h1 className="text-xl font-bold">AI assistants</h1>
        <p className="mt-1 text-sm text-muted">Lester plans the money. Pavel handles style and lobby life.</p>
      </div>

      <div className="card space-y-2 border-violet-500/20 bg-gradient-to-br from-violet-600/10 to-cyan-500/5 p-4">
        <div className="flex flex-wrap items-center gap-2">
          <Badge tone="purple">Active: {status.label}</Badge>
          {status.model && <Badge tone="neutral">{status.model}</Badge>}
        </div>
        {status.help && <p className="text-xs text-muted">{status.help}</p>}
        {ready.length > 0 && (
          <p className="text-[11px] text-faint">
            Ready engines: {ready.map((r) => r.label).join(" · ")}
          </p>
        )}
      </div>

      <div className="space-y-3">
        {Object.values(BOT_PROFILES).map((b) => {
          const grad = b.accent === "purple" ? "from-violet-600 to-fuchsia-500" : "from-cyan-500 to-blue-500";
          const border = b.accent === "purple" ? "border-violet-500/30" : "border-cyan-400/30";
          return (
            <Link key={b.id} href={`/ai/${b.id}`} className={`tap card flex items-center gap-3 border p-4 active:scale-[0.99] ${border}`}>
              <span className="relative inline-flex h-16 w-16 shrink-0 items-center justify-center">
                <span className={`anim-spin-slow absolute inset-0 rounded-full bg-gradient-to-br ${grad}`} />
                <span className="anim-spin-rev absolute inset-1 rounded-full bg-gradient-to-br from-amber-300 via-pink-400 to-cyan-400 opacity-80" />
                <span className="absolute inset-2 rounded-full bg-[#0a0a12]" />
                <span className={`relative z-[1] inline-flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br ${grad} text-white anim-bob-y`}>
                  <IconBot size={24} />
                </span>
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-lg font-black">{b.name}</span>
                <span className="block text-xs font-semibold text-muted">{b.title}</span>
                <span className="text-clamp-2 mt-1 block text-xs text-faint">{b.tagline}</span>
              </span>
              <IconChevron className="shrink-0 text-faint" />
            </Link>
          );
        })}
      </div>
    </div>
  );
}
