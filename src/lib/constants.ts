/**
 * Shared constants & domain types used by both server and client code.
 * Keep this file free of server-only imports.
 */
export const APP_NAME = "GTA Online Community";
export const APP_SHORT_NAME = "GTA Community";
export const DEVELOPER = "professor_ji96";

export const PLATFORMS = ["ps4", "ps5"] as const;
export type Platform = (typeof PLATFORMS)[number];
export const PLATFORM_LABEL: Record<Platform, string> = { ps4: "PS4", ps5: "PS5" };

export const CHANNELS = ["ps4", "ps5"] as const;
export type Channel = (typeof CHANNELS)[number];

export const BOTS = ["lester", "pavel"] as const;
export type BotId = (typeof BOTS)[number];

export const NEWS_KINDS = ["daily", "weekly", "event"] as const;
export type NewsKind = (typeof NEWS_KINDS)[number];

export const GUIDE_CATEGORIES = ["money", "outfits", "glitches", "gctf"] as const;
export type GuideCategory = (typeof GUIDE_CATEGORIES)[number];
export const GUIDE_CATEGORY_LABEL: Record<GuideCategory, string> = {
  money: "Money",
  outfits: "Outfits",
  glitches: "Glitches",
  gctf: "GCTF",
};

export const GUIDE_STATUSES = ["verified", "unverified", "patched", "outdated"] as const;
export type GuideStatus = (typeof GUIDE_STATUSES)[number];

export const GAMERTAG_MIN = 3;
export const GAMERTAG_MAX = 16;
export const GAMERTAG_REGEX = /^[A-Za-z0-9_-]+$/;
export const MESSAGE_MAX = 500;
export const AI_PROMPT_MAX = 2000;

/** httpOnly cookie (preferred when the browser allows it). */
export const SESSION_COOKIE = "gtac_session";
/**
 * Client-readable token storage key. Used when third-party / partitioned
 * cookies are blocked (Arena preview iframe, Brave shields, etc.).
 * The same UUID is what the server stores in the `sessions` table.
 */
export const SESSION_TOKEN_KEY = "gtac_session_token";
export const SESSION_TTL_DAYS = 90;

export function isPlatform(v: unknown): v is Platform {
  return typeof v === "string" && (PLATFORMS as readonly string[]).includes(v);
}
export function isChannel(v: unknown): v is Channel {
  return typeof v === "string" && (CHANNELS as readonly string[]).includes(v);
}
export function isBot(v: unknown): v is BotId {
  return typeof v === "string" && (BOTS as readonly string[]).includes(v);
}
export function isGuideCategory(v: unknown): v is GuideCategory {
  return typeof v === "string" && (GUIDE_CATEGORIES as readonly string[]).includes(v);
}
export function isNewsKind(v: unknown): v is NewsKind {
  return typeof v === "string" && (NEWS_KINDS as readonly string[]).includes(v);
}

export function validateGamertag(raw: string): { ok: true; value: string } | { ok: false; error: string } {
  const value = raw.trim();
  if (value.length < GAMERTAG_MIN) return { ok: false, error: `Gamertag must be at least ${GAMERTAG_MIN} characters.` };
  if (value.length > GAMERTAG_MAX) return { ok: false, error: `Gamertag must be ${GAMERTAG_MAX} characters or fewer.` };
  if (!GAMERTAG_REGEX.test(value)) return { ok: false, error: "Only letters, numbers, dashes and underscores are allowed." };
  return { ok: true, value };
}
