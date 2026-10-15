import { NextResponse } from "next/server";
import { handleApi } from "@/lib/api/errors";
import { feedStatus, listNews } from "@/modules/news/server";
import { isNewsKind } from "@/lib/constants";

export const dynamic = "force-dynamic";

export const GET = handleApi(async (req) => {
  const sp = new URL(req.url).searchParams;
  const kind = sp.get("kind");
  const q = sp.get("q")?.trim() || undefined;
  const items = await listNews({ kind: isNewsKind(kind) ? kind : undefined, q });
  return NextResponse.json({ items, feed: feedStatus() });
});
