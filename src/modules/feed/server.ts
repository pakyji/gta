import "server-only";
import { and, desc, eq, sql } from "drizzle-orm";
import { db } from "@/db";
import { feedLikes, feedPosts, users } from "@/db/schema";
import type { Platform } from "@/lib/constants";

export type FeedPostDTO = {
  id: number;
  userId: string | null;
  gamertag: string;
  platform: Platform;
  body: string;
  likeCount: number;
  likedByMe: boolean;
  createdAt: string;
};

const BODY_MAX = 280;

export function validateBody(raw: unknown): { ok: true; value: string } | { ok: false; error: string } {
  if (typeof raw !== "string") return { ok: false, error: "Post must be text." };
  const value = raw.trim().replace(/\s+/g, " ");
  if (!value) return { ok: false, error: "Write something first." };
  if (value.length > BODY_MAX) return { ok: false, error: `Max ${BODY_MAX} characters.` };
  return { ok: true, value };
}

export async function listFeed(opts: { limit?: number; beforeId?: number; viewerId?: string | null } = {}): Promise<FeedPostDTO[]> {
  const limit = Math.min(opts.limit ?? 40, 80);
  const rows = await db
    .select()
    .from(feedPosts)
    .where(opts.beforeId ? sql`${feedPosts.id} < ${opts.beforeId}` : undefined)
    .orderBy(desc(feedPosts.id))
    .limit(limit);

  let liked = new Set<number>();
  if (opts.viewerId && rows.length) {
    const ids = rows.map((r) => r.id);
    const likeRows = await db
      .select({ postId: feedLikes.postId })
      .from(feedLikes)
      .where(and(eq(feedLikes.userId, opts.viewerId), sql`${feedLikes.postId} in (${sql.join(ids.map((i) => sql`${i}`), sql`, `)})`));
    liked = new Set(likeRows.map((l) => l.postId));
  }

  return rows.map((r) => ({
    id: r.id,
    userId: r.userId,
    gamertag: r.gamertag,
    platform: r.platform as Platform,
    body: r.body,
    likeCount: r.likeCount,
    likedByMe: liked.has(r.id),
    createdAt: r.createdAt.toISOString(),
  }));
}

export async function createPost(input: {
  userId: string;
  gamertag: string;
  platform: Platform;
  body: string;
}): Promise<FeedPostDTO> {
  const [row] = await db
    .insert(feedPosts)
    .values({
      userId: input.userId,
      gamertag: input.gamertag,
      platform: input.platform,
      body: input.body,
    })
    .returning();
  return {
    id: row.id,
    userId: row.userId,
    gamertag: row.gamertag,
    platform: row.platform as Platform,
    body: row.body,
    likeCount: row.likeCount,
    likedByMe: false,
    createdAt: row.createdAt.toISOString(),
  };
}

export async function toggleLike(postId: number, userId: string): Promise<{ likeCount: number; likedByMe: boolean }> {
  const existing = await db
    .select()
    .from(feedLikes)
    .where(and(eq(feedLikes.postId, postId), eq(feedLikes.userId, userId)))
    .limit(1);

  if (existing[0]) {
    await db.delete(feedLikes).where(and(eq(feedLikes.postId, postId), eq(feedLikes.userId, userId)));
    const [p] = await db
      .update(feedPosts)
      .set({ likeCount: sql`greatest(${feedPosts.likeCount} - 1, 0)` })
      .where(eq(feedPosts.id, postId))
      .returning();
    return { likeCount: p?.likeCount ?? 0, likedByMe: false };
  }

  await db.insert(feedLikes).values({ postId, userId });
  const [p] = await db
    .update(feedPosts)
    .set({ likeCount: sql`${feedPosts.likeCount} + 1` })
    .where(eq(feedPosts.id, postId))
    .returning();
  return { likeCount: p?.likeCount ?? 1, likedByMe: true };
}

export async function deletePost(postId: number, userId: string): Promise<boolean> {
  const res = await db.delete(feedPosts).where(and(eq(feedPosts.id, postId), eq(feedPosts.userId, userId))).returning();
  return res.length > 0;
}
