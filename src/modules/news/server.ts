/**
 * News module — curated GTA Online bulletins with proper images.
 * Optional NEWS_FEED_URL can import extra RSS items.
 */
import "server-only";
import { desc, eq, ilike, or, and, sql } from "drizzle-orm";
import { db } from "@/db";
import { newsPosts, type NewsPost } from "@/db/schema";
import type { NewsKind } from "@/lib/constants";
import { NEWS_SEEDS } from "./seed";
import type { NewsItem } from "./types";
export type { NewsItem };

function pickImage(kind: string, imageUrl: string | null | undefined, slug: string): string {
  if (imageUrl && !imageUrl.includes("glitch") && !imageUrl.includes("cat-glitch")) return imageUrl;
  if (slug.includes("cayo") || slug.includes("business") || slug.includes("money")) return "/images/news-money.jpg";
  if (slug.includes("podium") || slug.includes("prize") || slug.includes("gun-van") || slug.includes("export")) return "/images/news-cars.jpg";
  if (kind === "daily") return "/images/news-daily.jpg";
  if (kind === "weekly") return "/images/news-weekly.jpg";
  return "/images/news-event.jpg";
}

export function toNewsItem(n: NewsPost): NewsItem {
  return {
    id: n.id,
    slug: n.slug,
    kind: n.kind as NewsKind,
    title: n.title,
    summary: n.summary,
    body: n.body,
    imageUrl: pickImage(n.kind, n.imageUrl, n.slug),
    sourceName: n.sourceName,
    sourceUrl: n.sourceUrl,
    publishedAt: n.publishedAt.toISOString(),
    expiresAt: n.expiresAt ? n.expiresAt.toISOString() : null,
    tags: n.tags,
    outdated: false,
  };
}

let seedRun: Promise<void> | null = null;

/**
 * Seeds news once per server instance. Concurrent callers share the same run,
 * and a failed run is retried on the next request.
 */
export function ensureNewsSeeded(): Promise<void> {
  if (!seedRun) {
    seedRun = seedNews().catch((err) => {
      seedRun = null;
      throw err;
    });
  }
  return seedRun;
}

async function seedNews(): Promise<void> {
  await Promise.all(
    NEWS_SEEDS.map((s) =>
      db
        .insert(newsPosts)
        .values({
          slug: s.slug,
          kind: s.kind,
          title: s.title,
          summary: s.summary,
          body: s.body,
          imageUrl: s.imageUrl ?? null,
          sourceName: s.sourceName,
          sourceUrl: s.sourceUrl,
          publishedAt: new Date(s.publishedAt),
          expiresAt: s.expiresAt ? new Date(s.expiresAt) : null,
          tags: s.tags,
        })
        .onConflictDoUpdate({
          target: newsPosts.slug,
          set: {
            kind: s.kind,
            title: s.title,
            summary: s.summary,
            body: s.body,
            imageUrl: s.imageUrl ?? null,
            sourceName: s.sourceName,
            sourceUrl: s.sourceUrl,
            publishedAt: new Date(s.publishedAt),
            tags: s.tags,
          },
        }),
    ),
  );
  // scrub old broken seed rows that used glitch art
  await db.execute(sql`update news_posts set image_url = '/images/news-weekly.jpg' where image_url is null or image_url like '%glitch%' or image_url like '%cat-glitch%'`);
}

export async function listNews(opts: { kind?: NewsKind; q?: string; limit?: number } = {}): Promise<NewsItem[]> {
  await ensureNewsSeeded();
  const conds = [];
  if (opts.kind) conds.push(eq(newsPosts.kind, opts.kind));
  if (opts.q) {
    const like = `%${opts.q.replace(/[%_]/g, "")}%`;
    conds.push(or(ilike(newsPosts.title, like), ilike(newsPosts.summary, like), ilike(newsPosts.body, like)));
  }
  const rows = await db
    .select()
    .from(newsPosts)
    .where(conds.length ? and(...conds) : undefined)
    .orderBy(desc(newsPosts.publishedAt))
    .limit(opts.limit ?? 50);
  return rows.map(toNewsItem);
}

export async function getNewsBySlug(slug: string): Promise<NewsItem | null> {
  await ensureNewsSeeded();
  const [row] = await db.select().from(newsPosts).where(eq(newsPosts.slug, slug)).limit(1);
  return row ? toNewsItem(row) : null;
}

export function feedStatus() {
  const url = process.env.NEWS_FEED_URL?.trim();
  return url ? { configured: true as const, url } : { configured: false as const, url: null };
}

function pick(xml: string, tag: string): string | null {
  const m = xml.match(new RegExp(`<${tag}(?:\\s[^>]*)?>([\\s\\S]*?)</${tag}>`, "i"));
  if (!m) return null;
  return m[1].replace(/^<!\[CDATA\[([\s\S]*?)\]\]>$/, "$1").trim();
}
function stripHtml(s: string): string {
  return s.replace(/<[^>]+>/g, " ").replace(/&nbsp;/g, " ").replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/\s+/g, " ").trim();
}
function slugify(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 80);
}
function guessKind(title: string): NewsKind {
  const t = title.toLowerCase();
  if (/this week|weekly|bonuses|double|triple|2x|3x|discount/.test(t)) return "weekly";
  if (/daily|today/.test(t)) return "daily";
  return "event";
}

export async function refreshFromFeed(): Promise<{ imported: number; sourceName: string }> {
  const status = feedStatus();
  if (!status.configured) throw new Error("NEWS_FEED_URL is not configured.");
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 15_000);
  let xml: string;
  try {
    const res = await fetch(status.url!, { signal: controller.signal, headers: { "User-Agent": "GTA-Community-App/1.0" } });
    if (!res.ok) throw new Error(`Feed responded with ${res.status}.`);
    xml = await res.text();
  } finally {
    clearTimeout(timer);
  }
  const sourceName = stripHtml(pick(xml, "title") ?? new URL(status.url!).hostname);
  const entries = [...xml.matchAll(/<(item|entry)(?:\s[^>]*)?>([\s\S]*?)<\/\1>/gi)].map((m) => m[2]).slice(0, 30);
  let imported = 0;
  for (const e of entries) {
    const title = stripHtml(pick(e, "title") ?? "");
    if (!title) continue;
    let link = pick(e, "link") ?? "";
    if (!link) {
      const alt = e.match(/<link[^>]*href="([^"]+)"/i);
      link = alt ? alt[1] : status.url!;
    }
    const descRaw = pick(e, "content:encoded") ?? pick(e, "content") ?? pick(e, "description") ?? pick(e, "summary") ?? "";
    const text = stripHtml(descRaw);
    const dateStr = pick(e, "pubDate") ?? pick(e, "published") ?? pick(e, "updated") ?? pick(e, "dc:date");
    const publishedAt = dateStr && !Number.isNaN(Date.parse(dateStr)) ? new Date(dateStr) : new Date();
    const img = e.match(/<(?:media:content|media:thumbnail|enclosure)[^>]*url="([^"]+)"/i)?.[1] ?? descRaw.match(/<img[^>]*src="([^"]+)"/i)?.[1] ?? null;
    const kind = guessKind(title);
    const slug = `feed-${slugify(title)}-${publishedAt.toISOString().slice(0, 10)}`;
    await db
      .insert(newsPosts)
      .values({
        slug,
        kind,
        title: title.slice(0, 200),
        summary: text.slice(0, 220) + (text.length > 220 ? "…" : ""),
        body: text || title,
        imageUrl: img || pickImage(kind, null, slug),
        sourceName: sourceName.slice(0, 120),
        sourceUrl: link.trim(),
        publishedAt,
        tags: ["feed"],
      })
      .onConflictDoUpdate({
        target: newsPosts.slug,
        set: { title: title.slice(0, 200), summary: text.slice(0, 220), body: text || title, imageUrl: img || pickImage(kind, null, slug), sourceUrl: link.trim() },
      });
    imported++;
  }
  return { imported, sourceName };
}
