import { notFound } from "next/navigation";
import { Badge, statusLabel, statusTone } from "@/components/ui/Badge";
import { IconExternal } from "@/components/ui/Icons";
import { RichText } from "@/components/ui/RichText";
import { PageHeader } from "@/components/shell/AppShell";
import { formatDate } from "@/lib/format";
import { GUIDE_CATEGORY_LABEL } from "@/lib/constants";
import { getGuideBySlug } from "@/modules/guides/server";
import { guideBanner } from "@/modules/guides/images";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const g = await getGuideBySlug(slug).catch(() => null);
  return { title: g?.title ?? "Guide" };
}

export default async function GuideDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const g = await getGuideBySlug(slug);
  if (!g) notFound();
  const risky = g.category === "glitches" || g.category === "gctf";
  const banner = guideBanner(g.slug, g.category, g.imageUrl);
  return (
    <article className="pb-10">
      <PageHeader title={GUIDE_CATEGORY_LABEL[g.category]} back="/guides" />
      {banner && (
        <div className="mx-4 overflow-hidden rounded-card border border-border">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={banner} alt="" className="aspect-[2/1] h-auto w-full object-cover" />
        </div>
      )}
      <div className="px-safe mt-4 space-y-4">
        <div className="flex flex-wrap items-center gap-1.5">
          <Badge tone={statusTone(g.status)}>{statusLabel(g.status)}</Badge>
          {g.stale && g.status !== "outdated" && <Badge tone="neutral">Outdated</Badge>}
          {g.difficulty && <Badge tone="neutral">{g.difficulty}</Badge>}
          {g.platforms.map((p) => (
            <Badge key={p} tone={p === "ps5" ? "purple" : "blue"}>
              {p}
            </Badge>
          ))}
        </div>
        <h1 className="text-2xl font-black leading-tight tracking-tight">{g.title}</h1>
        <p className="text-[15px] text-muted">{g.summary}</p>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="card p-3">
            <p className="text-faint">Last updated</p>
            <p className="mt-0.5 font-semibold">{formatDate(g.updatedAt)}</p>
          </div>
          <div className="card p-3">
            <p className="text-faint">{g.payout ? "Payout" : "Read time"}</p>
            <p className="mt-0.5 truncate font-semibold text-neon-green">{g.payout ?? `${g.readMinutes} min`}</p>
          </div>
        </div>
        {risky && (
          <p className="rounded-xl border border-neon-amber/30 bg-neon-amber/10 p-3 text-xs leading-relaxed text-[#fcd34d]">
            {g.status === "patched"
              ? "This method is reported as patched. It is kept for reference only."
              : "This is an exploit-type method. It is NOT confirmed working — it may be patched at any time and can lead to Rockstar penalties. Verify in-game and share results with your platform and date in chat."}
          </p>
        )}
        {g.stale && !risky && <p className="rounded-xl border border-border bg-surface-2 p-3 text-xs text-muted">This guide hasn&apos;t been updated recently. Details such as prices and payouts may have changed.</p>}
        <RichText text={g.body} />
        {g.sourceUrl && (
          <div className="card p-3.5">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-faint">Source</p>
            <a href={g.sourceUrl} target="_blank" rel="noopener noreferrer" className="tap mt-1 inline-flex min-h-10 max-w-full items-center gap-1.5 text-sm font-semibold text-neon-blue">
              <span className="truncate">{g.sourceName ?? g.sourceUrl}</span> <IconExternal size={16} className="shrink-0" />
            </a>
          </div>
        )}
      </div>
    </article>
  );
}
