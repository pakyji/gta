import Link from "next/link";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/Badge";
import { IconExternal } from "@/components/ui/Icons";
import { RichText } from "@/components/ui/RichText";
import { PageHeader } from "@/components/shell/AppShell";
import { formatDate } from "@/lib/format";
import { getNewsBySlug } from "@/modules/news/server";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const item = await getNewsBySlug(slug).catch(() => null);
  return { title: item?.title ?? "News" };
}

export default async function NewsDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const item = await getNewsBySlug(slug);
  if (!item) notFound();
  const external = /^https?:\/\//.test(item.sourceUrl);
  return (
    <article className="pb-10">
      <PageHeader
        title={item.kind === "weekly" ? "Weekly update" : item.kind === "daily" ? "Daily update" : "Info"}
        back="/news"
      />
      {item.imageUrl && (
        <div className="mx-4 overflow-hidden rounded-2xl border border-white/10">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={item.imageUrl} alt="" className="aspect-[2/1] w-full object-cover" />
        </div>
      )}
      <div className="px-safe mt-4 space-y-4">
        <div className="flex flex-wrap items-center gap-1.5">
          <Badge tone={item.kind === "weekly" ? "purple" : item.kind === "daily" ? "blue" : "red"}>{item.kind}</Badge>
          <span className="ml-auto text-xs text-faint">Published {formatDate(item.publishedAt)}</span>
        </div>
        <h1 className="text-2xl font-black leading-tight tracking-tight">{item.title}</h1>
        <p className="text-[15px] text-muted">{item.summary}</p>
        <RichText text={item.body} />
        <div className="card p-3.5">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-faint">Source</p>
          {external ? (
            <a
              href={item.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="tap mt-1 inline-flex min-h-10 max-w-full items-center gap-1.5 text-sm font-semibold text-neon-blue"
            >
              <span className="truncate">{item.sourceName}</span> <IconExternal size={16} className="shrink-0" />
            </a>
          ) : (
            <Link href={item.sourceUrl} className="tap mt-1 inline-flex min-h-10 items-center text-sm font-semibold text-neon-blue">
              {item.sourceName}
            </Link>
          )}
        </div>
      </div>
    </article>
  );
}
