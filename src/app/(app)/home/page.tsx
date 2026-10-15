import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { IconBook, IconBot, IconChat, IconChevron, IconFeed, IconGamepad, IconMusic, IconNews, IconSpark } from "@/components/ui/Icons";
import { listNews } from "@/modules/news/server";
import { listGuides } from "@/modules/guides/server";
import { BOT_PROFILES } from "@/modules/ai/bots";
import { HomeHero } from "@/modules/session/HomeHero";

export const metadata = { title: "Home" };
export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [news, guides] = await Promise.all([listNews({ limit: 3 }).catch(() => []), listGuides({ limit: 4 }).catch(() => [])]);

  return (
    <div className="px-safe space-y-6 pb-10 pt-4 swirl-bg">
      <HomeHero />

      <div className="mix-line" />

      <section>
        <p className="font-label text-violet-300">Quick play</p>
        <h2 className="title-lg mt-1">Jump in</h2>
        <div className="mt-3 grid grid-cols-2 gap-3">
          <QuickTile href="/feed" icon={<IconFeed size={22} />} label="Feed" sub="Twitter-style channel" tone="pink" />
          <QuickTile href="/chat/ps4" icon={<IconChat size={22} />} label="PS4 Chat" sub="Live lobby" tone="blue" />
          <QuickTile href="/chat/ps5" icon={<IconChat size={22} />} label="PS5 Chat" sub="Live lobby" tone="pink" />
          <QuickTile href="/vehicles" icon={<IconGamepad size={22} />} label="Vehicles" sub="Prices A–Z" tone="orange" />
          <QuickTile href="/guides?category=outfits" icon={<IconBook size={22} />} label="Merges" sub="Outfits A–Z" tone="pink" />
          <QuickTile href="/guides?category=glitches" icon={<IconBook size={22} />} label="Glitches" sub="Status tagged" tone="orange" />
          <QuickTile href="/guides?category=gctf" icon={<IconBook size={22} />} label="GCTF" sub="Car transfer" tone="red" />
          <QuickTile href="/news" icon={<IconNews size={22} />} label="News" sub="Weekly reset" tone="red" />
          <QuickTile href="/fun" icon={<IconSpark size={22} />} label="Fun Zone" sub="Weather & pets" tone="cyan" />
          <QuickTile href="/music" icon={<IconMusic size={22} />} label="Music" sub="Full radio stations" tone="pink" />
        </div>
      </section>

      <section className="card card-glow overflow-hidden border-violet-500/25 p-0">
        <div className="mix-line" />
        <div className="p-4">
          <p className="font-label text-fuchsia-300">AI always on</p>
          <h2 className="title-lg mt-1">Chatbots</h2>
          <p className="mt-1 text-[15px] text-muted">Also pinned at the bottom of every screen.</p>
          <div className="mt-3 space-y-2.5">
            {Object.values(BOT_PROFILES).map((b) => {
              const grad = b.accent === "purple" ? "from-violet-600 to-fuchsia-500" : "from-cyan-500 to-blue-500";
              return (
                <Link key={b.id} href={`/ai/${b.id}`} className="tap flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.04] p-3 active:scale-[0.99]">
                  <span className={`inline-flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${grad} text-white shadow-lg`}>
                    <IconBot size={28} />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-[17px] font-black tracking-tight">{b.name}</span>
                    <span className="block text-[13px] font-semibold text-muted">{b.title}</span>
                    <span className="text-clamp-2 mt-0.5 block text-[13px] text-faint">{b.tagline}</span>
                  </span>
                  <IconChevron size={20} className="shrink-0 text-faint" />
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section>
        <SectionTitle title="Latest updates" href="/news" />
        {news.length === 0 ? (
          <p className="text-[15px] text-muted">No news loaded yet.</p>
        ) : (
          <div className="space-y-2.5">
            {news.map((n) => (
              <Link key={n.id} href={`/news/${n.slug}`} className="tap card card-glow block p-3.5 active:bg-surface-2">
                <div className="flex items-center gap-2">
                  <Badge tone={n.kind === "weekly" ? "purple" : n.kind === "daily" ? "blue" : "red"}>{n.kind}</Badge>
                  {n.outdated && <Badge tone="neutral">Outdated</Badge>}
                  <span className="ml-auto shrink-0 text-[12px] font-semibold text-faint">{new Date(n.publishedAt).toLocaleDateString()}</span>
                </div>
                <p className="text-clamp-2 mt-2 text-[16px] font-bold leading-snug">{n.title}</p>
              </Link>
            ))}
          </div>
        )}
      </section>

      <section>
        <SectionTitle title="Featured guides" href="/guides" />
        <div className="space-y-2.5">
          {guides.map((g) => (
            <Link key={g.id} href={`/guides/${g.slug}`} className="tap card flex items-center gap-3 overflow-hidden active:bg-surface-2">
              <div className="h-20 w-24 shrink-0 overflow-hidden bg-surface-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={g.imageUrl || "/images/glitch-banner.jpg"} alt="" className="h-full w-full object-cover" />
              </div>
              <div className="min-w-0 flex-1 py-2.5 pr-3">
                <p className="truncate text-[16px] font-bold">{g.title}</p>
                <p className="text-clamp-2 text-[13px] text-muted">{g.summary}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}

function SectionTitle({ title, href }: { title: string; href: string }) {
  return (
    <div className="mb-2.5 flex items-center justify-between gap-2">
      <h2 className="title-lg">{title}</h2>
      <Link href={href} className="tap inline-flex min-h-10 items-center gap-0.5 text-[13px] font-bold text-neon-blue">
        See all <IconChevron size={16} />
      </Link>
    </div>
  );
}

function QuickTile({
  href,
  icon,
  label,
  sub,
  tone,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
  sub: string;
  tone: "blue" | "purple" | "red" | "green" | "pink" | "orange" | "cyan";
}) {
  const tones: Record<string, string> = {
    blue: "text-sky-300 bg-sky-400/15 border-sky-400/30",
    purple: "text-violet-300 bg-violet-400/15 border-violet-400/30",
    red: "text-rose-300 bg-rose-400/15 border-rose-400/30",
    green: "text-emerald-300 bg-emerald-400/15 border-emerald-400/30",
    pink: "text-pink-300 bg-pink-400/15 border-pink-400/30",
    orange: "text-orange-300 bg-orange-400/15 border-orange-400/30",
    cyan: "text-cyan-300 bg-cyan-400/15 border-cyan-400/30",
  };
  const iconTone: Record<string, string> = {
    blue: "text-sky-300 bg-sky-400/20",
    purple: "text-violet-300 bg-violet-400/20",
    red: "text-rose-300 bg-rose-400/20",
    green: "text-emerald-300 bg-emerald-400/20",
    pink: "text-pink-300 bg-pink-400/20",
    orange: "text-orange-300 bg-orange-400/20",
    cyan: "text-cyan-300 bg-cyan-400/20",
  };
  return (
    <Link href={href} className={`tap card flex min-h-[100px] flex-col justify-between border p-3.5 active:scale-[0.98] ${tones[tone]}`}>
      <span className={`inline-flex h-10 w-10 items-center justify-center rounded-xl ${iconTone[tone]}`}>{icon}</span>
      <span>
        <span className="block truncate text-[16px] font-black tracking-tight">{label}</span>
        <span className="block truncate text-[12px] font-semibold text-muted">{sub}</span>
      </span>
    </Link>
  );
}
