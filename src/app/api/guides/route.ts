import { NextResponse } from "next/server";
import { handleApi } from "@/lib/api/errors";
import { listGuides } from "@/modules/guides/server";
import { isGuideCategory } from "@/lib/constants";

export const dynamic = "force-dynamic";

export const GET = handleApi(async (req) => {
  const sp = new URL(req.url).searchParams;
  const category = sp.get("category");
  const q = sp.get("q")?.trim() || undefined;
  const limit = Math.min(Number(sp.get("limit") ?? 500) || 500, 1000);
  const items = await listGuides({ category: isGuideCategory(category) ? category : undefined, q, limit });
  return NextResponse.json({ items, total: items.length });
});
