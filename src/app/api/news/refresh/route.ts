import { NextResponse } from "next/server";
import { timingSafeEqual } from "crypto";
import { handleApi, serviceUnavailable, ApiError } from "@/lib/api/errors";
import { feedStatus, refreshFromFeed } from "@/modules/news/server";

export const dynamic = "force-dynamic";

function bearerMatches(header: string | null, secret: string): boolean {
  const m = (header ?? "").match(/^Bearer\s+(.+)$/i);
  if (!m) return false;
  const given = Buffer.from(m[1].trim());
  const expected = Buffer.from(secret);
  return given.length === expected.length && timingSafeEqual(given, expected);
}

export const POST = handleApi(async (req) => {
  const secret = process.env.NEWS_REFRESH_SECRET;
  // Refresh is off unless the server owner sets a secret. Anyone else gets a 401.
  if (!secret || secret.length < 16) {
    throw serviceUnavailable("News refresh is disabled. Set NEWS_REFRESH_SECRET (16+ characters) on the server.");
  }
  if (!bearerMatches(req.headers.get("authorization"), secret)) {
    throw new ApiError(401, "Missing or wrong refresh secret.", "unauthorized");
  }
  if (!feedStatus().configured) {
    throw serviceUnavailable("No news feed is configured. Set NEWS_FEED_URL (an RSS/Atom feed URL) on the server to enable live refresh.");
  }
  try {
    const result = await refreshFromFeed();
    return NextResponse.json(result);
  } catch (err) {
    throw serviceUnavailable(`Feed refresh failed: ${err instanceof Error ? err.message : "unknown error"}`);
  }
});
