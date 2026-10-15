/**
 * AI module (server only).
 * Cloud providers (Groq, OpenAI, Pollinations, …) first; local brain last.
 */
import "server-only";
import { and, asc, eq } from "drizzle-orm";
import { db } from "@/db";
import { aiMessages } from "@/db/schema";
import { type BotId, type Platform, PLATFORM_LABEL } from "@/lib/constants";
import { complete, providerStatus, type ChatTurn } from "./providers";
import { localReply } from "./localBrain";
import type { AiHistoryItem } from "./types";
export type { AiHistoryItem };

const SYSTEM_PROMPTS: Record<BotId, string> = {
  lester: `You are "Lester Crest", the GTA Online money and heist strategist inside a PlayStation community mobile app.

VOICE: dry, sharp, efficient. Short sentences. No corporate fluff. Occasional sarcasm is fine.

KNOWLEDGE FOCUS:
- Cayo Perico solo (drainage tunnel), payouts, elite challenge, cooldown usage
- Nightclub / Bunker / Acid Lab / Agency / payphone hits / auto shop / salvage yard
- Weekly bonus awareness (don't invent exact weekly numbers — give ranges)
- PS4 vs PS5 differences when relevant (GTA+, load times)

FORMAT (mobile):
- Use ## headings, numbered steps, and short bullets
- Keep answers under ~250 words unless the user asks for deep detail
- Lead with the action, then the why

RULES:
- Never claim a glitch/exploit is "confirmed working"
- Never help with real-money trading, mod menus, account selling, or cheats
- If unsure about a patch status, say so
- Address the player by gamertag when natural
- For glitch/GCTF/outfit merge questions: summarize setup + risk, send them to in-app Guides (GCTF / Glitches / Outfits A–Z), never claim a method is live without caveats`,
  pavel: `You are "Pavel", the friendly GTA Online community helper (Kosatka crewmate energy) inside a PlayStation community mobile app.

VOICE: warm, upbeat, concise. Call the player "Kapitan" occasionally. Helpful without being childish.

KNOWLEDGE FOCUS:
- Outfits (store items, merges overview, Car Meet fits) — never claim merge glitches still work
- Lobby survival, Mk2 griefers, defensive tactics, Invite Only sells
- Finding crews, heist partners, LS Car Meet rep
- GCTF awareness: explain risks, never mark methods as working

FORMAT (mobile):
- ## headings, bullets, short paragraphs
- Under ~250 words unless asked for more

RULES:
- No cheating, mod menus, account selling
- Glitch/GCTF = unverified, may be patched, can cause wipes
- Be encouraging and practical
- For GCTF/outfit glitches: list requirements (MOC PV storage, Invite Only, junk cars) and point to Guides; always say unverified`,
};

export async function getHistory(userId: string, bot: BotId, limit = 40): Promise<AiHistoryItem[]> {
  const rows = await db
    .select()
    .from(aiMessages)
    .where(and(eq(aiMessages.userId, userId), eq(aiMessages.bot, bot)))
    .orderBy(asc(aiMessages.id))
    .limit(limit);
  return rows.map((r) => ({
    id: r.id,
    role: r.role as "user" | "assistant",
    content: r.content,
    createdAt: r.createdAt.toISOString(),
  }));
}

export async function clearHistory(userId: string, bot: BotId): Promise<void> {
  await db.delete(aiMessages).where(and(eq(aiMessages.userId, userId), eq(aiMessages.bot, bot)));
}

export async function ask(input: {
  userId: string;
  gamertag: string;
  platform: Platform;
  bot: BotId;
  prompt: string;
}): Promise<{ user: AiHistoryItem; assistant: AiHistoryItem; provider: string; model: string }> {
  const prior = await getHistory(input.userId, input.bot, 12);
  const turns: ChatTurn[] = [
    {
      role: "system",
      content: `${SYSTEM_PROMPTS[input.bot]}\n\nPlayer gamertag: "${input.gamertag}" · Platform: ${PLATFORM_LABEL[input.platform]}.`,
    },
    ...prior.map((m) => ({ role: m.role, content: m.content }) as ChatTurn),
    { role: "user", content: input.prompt },
  ];

  let text: string;
  let provider: string;
  let model: string;

  try {
    const result = await complete(turns, 20_000);
    text = result.text;
    provider = result.provider;
    model = result.model;
  } catch (err) {
    console.error("[ai] all providers failed, local brain", err);
    text = localReply(input);
    provider = "local-fallback";
    model = "gtac-local";
  }

  // Guard empty
  if (!text?.trim()) {
    text = localReply(input);
    provider = "local-fallback";
    model = "gtac-local";
  }

  const [u] = await db
    .insert(aiMessages)
    .values({ userId: input.userId, bot: input.bot, role: "user", content: input.prompt })
    .returning();
  const [a] = await db
    .insert(aiMessages)
    .values({ userId: input.userId, bot: input.bot, role: "assistant", content: text })
    .returning();

  const map = (r: typeof u): AiHistoryItem => ({
    id: r.id,
    role: r.role as "user" | "assistant",
    content: r.content,
    createdAt: r.createdAt.toISOString(),
  });

  // Touch providerStatus so cold paths stay warm (no-op read)
  void providerStatus();

  return { user: map(u), assistant: map(a), provider, model };
}
