import { NextResponse } from "next/server";
import { handleApi } from "@/lib/api/errors";

export const dynamic = "force-dynamic";

/** TheCatAPI public endpoint — works without a key (rate-limited). */
export const GET = handleApi(async () => {
  const headers: Record<string, string> = { Accept: "application/json" };
  const key = process.env.CAT_API_KEY?.trim() || process.env.THECATAPI_KEY?.trim();
  if (key) headers["x-api-key"] = key;

  const controller = new AbortController();
  const t = setTimeout(() => controller.abort(), 8000);
  try {
    const res = await fetch("https://api.thecatapi.com/v1/images/search?limit=1", {
      signal: controller.signal,
      headers,
      cache: "no-store",
    });
    if (!res.ok) throw new Error(`Cat API ${res.status}`);
    const data = (await res.json()) as Array<{ id?: string; url?: string; width?: number; height?: number }>;
    const item = data[0];
    if (!item?.url) throw new Error("No cat image returned.");
    return NextResponse.json({
      id: item.id ?? null,
      url: item.url,
      width: item.width ?? null,
      height: item.height ?? null,
      source: key ? "TheCatAPI (keyed)" : "TheCatAPI (public)",
    });
  } finally {
    clearTimeout(t);
  }
});
