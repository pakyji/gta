import { NextResponse } from "next/server";
import { and, eq, gt } from "drizzle-orm";
import { ApiError, handleApi, badRequest, readJson, unauthorized } from "@/lib/api/errors";
import { db } from "@/db";
import { sessions, users } from "@/db/schema";
import { getCurrentUser } from "@/modules/session/server";
import { ask, clearHistory, getHistory } from "@/modules/ai/server";
import { ProviderError } from "@/modules/ai/providers";
import { AI_PROMPT_MAX, isBot, type Platform } from "@/lib/constants";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

type Ctx = { params: Promise<{ bot: string }> };

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

async function resolveUser(req: Request, bodyToken?: unknown) {
  const user = await getCurrentUser(req);
  if (user) return user;
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
        platform: row.user.platform as Platform,
        createdAt: row.user.createdAt.toISOString(),
      };
    }
  }
  return null;
}

export const GET = handleApi<Ctx>(async (req, { params }) => {
  const { bot } = await params;
  if (!isBot(bot)) throw badRequest("Unknown assistant.");
  const user = await getCurrentUser(req);
  if (!user) throw unauthorized();
  return NextResponse.json({ history: await getHistory(user.id, bot) });
});

export const DELETE = handleApi<Ctx>(async (req, { params }) => {
  const { bot } = await params;
  if (!isBot(bot)) throw badRequest("Unknown assistant.");
  const user = await getCurrentUser(req);
  if (!user) throw unauthorized();
  await clearHistory(user.id, bot);
  return NextResponse.json({ ok: true });
});

export const POST = handleApi<Ctx>(async (req, { params }) => {
  const { bot } = await params;
  if (!isBot(bot)) throw badRequest("Unknown assistant.");
  const body = await readJson<{ prompt?: unknown; token?: unknown }>(req);
  const user = await resolveUser(req, body.token);
  if (!user) throw unauthorized("You need an active session. Go back to Home and sign in again.");
  const prompt = typeof body.prompt === "string" ? body.prompt.trim() : "";
  if (!prompt) throw badRequest("Type a question first.");
  if (prompt.length > AI_PROMPT_MAX) throw badRequest(`Keep questions under ${AI_PROMPT_MAX} characters.`);
  try {
    const result = await ask({ userId: user.id, gamertag: user.gamertag, platform: user.platform, bot, prompt });
    return NextResponse.json(result);
  } catch (err) {
    if (err instanceof ProviderError) {
      throw new ApiError(err.status, err.message, err.retryable ? "provider_retryable" : "provider_config");
    }
    throw err;
  }
});
