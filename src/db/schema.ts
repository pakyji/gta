/**
 * Database schema (Drizzle ORM / PostgreSQL)
 *
 * Tables:
 *  - users        profiles (gamertag + platform + password hash)
 *  - sessions     cookie-backed guest sessions
 *  - messages     PS4 / PS5 community chat messages
 *  - ai_messages  per-user conversation history for each AI assistant
 *  - news_posts   GTA Online daily / weekly updates
 *  - guides       money, outfit, glitch and GCTF guides
 *
 * Schema changes: edit this file, then run `npx drizzle-kit generate`
 * (creates a migration under ./drizzle) and `npx drizzle-kit push` / `migrate`.
 */
import {
  pgTable,
  uuid,
  text,
  timestamp,
  serial,
  integer,
  boolean,
  index,
} from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  gamertag: text("gamertag").notNull(),
  platform: text("platform").notNull(), // 'ps4' | 'ps5'
  // scrypt hash of the account password. Null only for accounts created before passwords existed.
  passwordHash: text("password_hash"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  lastSeenAt: timestamp("last_seen_at", { withTimezone: true }).notNull().defaultNow(),
});

export const sessions = pgTable(
  "sessions",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  },
  (t) => [index("sessions_user_idx").on(t.userId)],
);

export const messages = pgTable(
  "messages",
  {
    id: serial("id").primaryKey(),
    channel: text("channel").notNull(), // 'ps4' | 'ps5'
    userId: uuid("user_id").references(() => users.id, { onDelete: "set null" }),
    gamertag: text("gamertag").notNull(),
    platform: text("platform").notNull(),
    body: text("body").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index("messages_channel_id_idx").on(t.channel, t.id)],
);

export const aiMessages = pgTable(
  "ai_messages",
  {
    id: serial("id").primaryKey(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    bot: text("bot").notNull(), // 'lester' | 'pavel'
    role: text("role").notNull(), // 'user' | 'assistant'
    content: text("content").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index("ai_messages_user_bot_idx").on(t.userId, t.bot, t.id)],
);

export const newsPosts = pgTable(
  "news_posts",
  {
    id: serial("id").primaryKey(),
    slug: text("slug").notNull().unique(),
    kind: text("kind").notNull(), // 'daily' | 'weekly' | 'event'
    title: text("title").notNull(),
    summary: text("summary").notNull(),
    body: text("body").notNull(),
    imageUrl: text("image_url"),
    sourceName: text("source_name").notNull(),
    sourceUrl: text("source_url").notNull(),
    publishedAt: timestamp("published_at", { withTimezone: true }).notNull(),
    expiresAt: timestamp("expires_at", { withTimezone: true }),
    tags: text("tags").array().notNull().default([]),
  },
  (t) => [index("news_kind_published_idx").on(t.kind, t.publishedAt)],
);

export const guides = pgTable(
  "guides",
  {
    id: serial("id").primaryKey(),
    slug: text("slug").notNull().unique(),
    category: text("category").notNull(), // 'money' | 'outfits' | 'glitches' | 'gctf'
    title: text("title").notNull(),
    summary: text("summary").notNull(),
    body: text("body").notNull(),
    imageUrl: text("image_url"),
    status: text("status").notNull().default("verified"), // 'verified' | 'unverified' | 'patched' | 'outdated'
    difficulty: text("difficulty"), // 'easy' | 'medium' | 'hard'
    payout: text("payout"),
    platforms: text("platforms").array().notNull().default([]),
    sourceName: text("source_name"),
    sourceUrl: text("source_url"),
    featured: boolean("featured").notNull().default(false),
    readMinutes: integer("read_minutes").notNull().default(3),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index("guides_category_idx").on(t.category)],
);

export type User = typeof users.$inferSelect;
export type Session = typeof sessions.$inferSelect;
export type Message = typeof messages.$inferSelect;
export type AiMessage = typeof aiMessages.$inferSelect;
export type NewsPost = typeof newsPosts.$inferSelect;
export type Guide = typeof guides.$inferSelect;

export const feedPosts = pgTable(
  "feed_posts",
  {
    id: serial("id").primaryKey(),
    userId: uuid("user_id").references(() => users.id, { onDelete: "set null" }),
    gamertag: text("gamertag").notNull(),
    platform: text("platform").notNull(),
    body: text("body").notNull(),
    likeCount: integer("like_count").notNull().default(0),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index("feed_posts_created_idx").on(t.createdAt), index("feed_posts_id_idx").on(t.id)],
);

export const feedLikes = pgTable(
  "feed_likes",
  {
    id: serial("id").primaryKey(),
    postId: integer("post_id")
      .notNull()
      .references(() => feedPosts.id, { onDelete: "cascade" }),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index("feed_likes_post_user_idx").on(t.postId, t.userId)],
);

export type FeedPost = typeof feedPosts.$inferSelect;
export type FeedLike = typeof feedLikes.$inferSelect;
