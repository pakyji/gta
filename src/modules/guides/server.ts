/**
 * Guides module (server only).
 */
import "server-only";
import { and, desc, eq, ilike, notInArray, or, sql } from "drizzle-orm";
import { db } from "@/db";
import { guides, type Guide } from "@/db/schema";
import type { GuideCategory } from "@/lib/constants";
import { GUIDE_SEEDS } from "./seed";
import { GTAGLITCHES_SOURCE_NAME } from "./gtaglitchesCatalog";
import type { GuideItem } from "./types";
import { guideBanner } from "./images";
export type { GuideItem };

const STALE_DAYS = 400;

export function toGuideItem(g: Guide): GuideItem {
  const ageDays = (Date.now() - g.updatedAt.getTime()) / 86400_000;
  return {
    id: g.id,
    slug: g.slug,
    category: g.category as GuideCategory,
    title: g.title,
    summary: g.summary,
    body: g.body,
    imageUrl: guideBanner(g.slug, g.category, g.imageUrl),
    status: g.status as GuideItem["status"],
    difficulty: g.difficulty,
    payout: g.payout,
    platforms: g.platforms,
    sourceName: g.sourceName,
    sourceUrl: g.sourceUrl,
    featured: g.featured,
    readMinutes: g.readMinutes,
    updatedAt: g.updatedAt.toISOString(),
    stale: g.status === "outdated" || (g.status === "verified" && ageDays > STALE_DAYS),
  };
}

let seedRun: Promise<void> | null = null;

/**
 * Seeds the guides table once per server instance. Concurrent callers share the
 * same run, and a failed run is retried on the next request.
 * Rows are upserted in parallel batches, not one database round trip per row.
 */
export function ensureGuidesSeeded(): Promise<void> {
  if (!seedRun) {
    seedRun = seedGuides().catch((err) => {
      seedRun = null;
      throw err;
    });
  }
  return seedRun;
}

async function seedGuides(): Promise<void> {
  const BATCH = 20;
  for (let i = 0; i < GUIDE_SEEDS.length; i += BATCH) {
    const batch = GUIDE_SEEDS.slice(i, i + BATCH);
    await Promise.all(
      batch.map((s) =>
        db
          .insert(guides)
          .values({
            slug: s.slug,
            category: s.category,
            title: s.title,
            summary: s.summary,
            body: s.body,
            imageUrl: s.imageUrl ?? null,
            status: s.status,
            difficulty: s.difficulty ?? null,
            payout: s.payout ?? null,
            platforms: s.platforms,
            sourceName: s.sourceName ?? null,
            sourceUrl: s.sourceUrl ?? null,
            featured: s.featured ?? false,
            readMinutes: s.readMinutes,
            updatedAt: new Date(),
          })
          .onConflictDoUpdate({
            target: guides.slug,
            set: {
              title: s.title,
              summary: s.summary,
              body: s.body,
              category: s.category,
              status: s.status,
              difficulty: s.difficulty ?? null,
              payout: s.payout ?? null,
              platforms: s.platforms,
              sourceName: s.sourceName ?? null,
              sourceUrl: s.sourceUrl ?? null,
              featured: s.featured ?? false,
              readMinutes: s.readMinutes,
              imageUrl: s.imageUrl ?? null,
              updatedAt: new Date(),
            },
          }),
      ),
    );
  }

  // Remove glitch rows from older imports that are no longer in the index.
  // Old rows carried copied text from gtaglitches.com, so they must not stay in the DB.
  const keepSlugs = GUIDE_SEEDS.map((s) => s.slug);
  await db
    .delete(guides)
    .where(
      and(
        or(eq(guides.sourceName, GTAGLITCHES_SOURCE_NAME), eq(guides.sourceName, "gtaglitches.com")),
        notInArray(guides.slug, keepSlugs),
      ),
    );
}

export async function listGuides(opts: { category?: GuideCategory; q?: string; limit?: number } = {}): Promise<GuideItem[]> {
  await ensureGuidesSeeded();
  const conds = [];
  if (opts.category) conds.push(eq(guides.category, opts.category));
  if (opts.q) {
    const like = `%${opts.q.replace(/[%_]/g, "")}%`;
    conds.push(or(ilike(guides.title, like), ilike(guides.summary, like), ilike(guides.body, like)));
  }
  const rows = await db
    .select()
    .from(guides)
    .where(conds.length ? and(...conds) : undefined)
    .orderBy(desc(guides.featured), desc(guides.updatedAt))
    .limit(opts.limit ?? 500);
  return rows.map(toGuideItem);
}

export async function getGuideBySlug(slug: string): Promise<GuideItem | null> {
  await ensureGuidesSeeded();
  const [row] = await db.select().from(guides).where(eq(guides.slug, slug)).limit(1);
  return row ? toGuideItem(row) : null;
}
