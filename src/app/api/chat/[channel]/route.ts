import { NextResponse } from "next/server";
import { handleApi, badRequest, readJson, unauthorized } from "@/lib/api/errors";
import { getCurrentUser } from "@/modules/session/server";
import { createMessage, listAfter, listRecent, validateMessageBody } from "@/modules/chat/server";
import { isChannel } from "@/lib/constants";
import { db } from "@/db";
import { sessions, users } from "@/db/schema";
import { and, eq, gt } from "drizzle-orm";

export const dynamic = "force-dynamic";

type Ctx = { params: Promise<{ channel: string }> };

// Simple per-user rate limit (in-memory, per server instance)
const lastSent = new Map<string, number>();

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

async function resolveUser(req: Request, bodyToken?: unknown) {
  // 1) Normal auth path (Bearer / header / cookie / query)
  const user = await getCurrentUser(req);
  if (user) return user;

  // 2) Explicit token in JSON body — last resort for iframe clients that
  //    couldn't attach headers (rare) or lost storage mid-session.
  if (typeof bodyToken === "string" && UUID_RE.test(bodyToken)) {
    const rows = await db
      .select({ user: users })
      .from(sessions)
      .innerJoin(users, eq(sessions.userId, users.id))
      .where(and(eq(sessions.id, bodyToken), gt(sessions.expiresAt, new Date())))
      .limit(1);
    const row = rows[0];
    if (row) {
      return {
        id: row.user.id,
        gamertag: row.user.gamertag,
        platform: row.user.platform as "ps4" | "ps5",
        createdAt: row.user.createdAt.toISOString(),
      };
    }
  }
  return null;
}

export const GET = handleApi<Ctx>(async (req, { params }) => {
  const { channel } = await params;
  if (!isChannel(channel)) throw badRequest("Unknown channel.");
  const after = Number(new URL(req.url).searchParams.get("after") ?? "");
  const items = Number.isFinite(after) && after > 0 ? await listAfter(channel, after) : await listRecent(channel);
  return NextResponse.json({ messages: items });
});

export const POST = handleApi<Ctx>(async (req, { params }) => {
  const { channel } = await params;
  if (!isChannel(channel)) throw badRequest("Unknown channel.");

  const body = await readJson<{ body?: unknown; token?: unknown; sessionToken?: unknown }>(req);
  const user = await resolveUser(req, body.token ?? body.sessionToken);
  if (!user) throw unauthorized("You need an active session. Go back to Home and sign in again.");

  const v = validateMessageBody(body.body);
  if (!v.ok) throw badRequest(v.error);

  const now = Date.now();
  const prev = lastSent.get(user.id) ?? 0;
  if (now - prev < 400) throw badRequest("You're sending messages too quickly. Wait a moment.");
  lastSent.set(user.id, now);

  const message = await createMessage({
    channel,
    userId: user.id,
    gamertag: user.gamertag,
    platform: user.platform,
    body: v.value,
  });
  return NextResponse.json({ message }, { status: 201 });
});
