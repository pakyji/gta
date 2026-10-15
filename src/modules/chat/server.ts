/**
 * Chat module (server only): persistence for PS4 / PS5 community channels.
 */
import "server-only";
import { and, asc, desc, eq, gt } from "drizzle-orm";
import { db } from "@/db";
import { messages, type Message } from "@/db/schema";
import { MESSAGE_MAX, type Channel, type Platform } from "@/lib/constants";
import type { ChatMessage } from "./types";

export function toChatMessage(m: Message): ChatMessage {
  return {
    id: m.id,
    channel: m.channel as Channel,
    userId: m.userId,
    gamertag: m.gamertag,
    platform: m.platform as Platform,
    body: m.body,
    createdAt: m.createdAt.toISOString(),
  };
}

export async function listRecent(channel: Channel, limit = 60): Promise<ChatMessage[]> {
  const rows = await db
    .select()
    .from(messages)
    .where(eq(messages.channel, channel))
    .orderBy(desc(messages.id))
    .limit(limit);
  return rows.reverse().map(toChatMessage);
}

export async function listAfter(channel: Channel, afterId: number, limit = 100): Promise<ChatMessage[]> {
  const rows = await db
    .select()
    .from(messages)
    .where(and(eq(messages.channel, channel), gt(messages.id, afterId)))
    .orderBy(asc(messages.id))
    .limit(limit);
  return rows.map(toChatMessage);
}

export function validateMessageBody(raw: unknown): { ok: true; value: string } | { ok: false; error: string } {
  if (typeof raw !== "string") return { ok: false, error: "Message must be text." };
  const value = raw.replace(/\s+$/g, "").replace(/^\s+/g, "");
  if (!value) return { ok: false, error: "Message can't be empty." };
  if (value.length > MESSAGE_MAX) return { ok: false, error: `Message must be ${MESSAGE_MAX} characters or fewer.` };
  return { ok: true, value };
}

export async function createMessage(input: {
  channel: Channel;
  userId: string;
  gamertag: string;
  platform: Platform;
  body: string;
}): Promise<ChatMessage> {
  const [row] = await db.insert(messages).values(input).returning();
  return toChatMessage(row);
}
