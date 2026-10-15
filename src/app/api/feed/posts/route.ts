import { NextResponse } from "next/server";
import { handleApi, badRequest, readJson, unauthorized } from "@/lib/api/errors";
import { getCurrentUser } from "@/modules/session/server";
import { createPost, listFeed, validateBody } from "@/modules/feed/server";

export const dynamic = "force-dynamic";

export const GET = handleApi(async (req) => {
  const user = await getCurrentUser(req);
  const sp = new URL(req.url).searchParams;
  const beforeId = Number(sp.get("before") ?? "");
  const items = await listFeed({
    beforeId: Number.isFinite(beforeId) && beforeId > 0 ? beforeId : undefined,
    viewerId: user?.id ?? null,
  });
  return NextResponse.json({ items });
});

export const POST = handleApi(async (req) => {
  const user = await getCurrentUser(req);
  if (!user) throw unauthorized();
  const body = await readJson<{ body?: unknown }>(req);
  const v = validateBody(body.body);
  if (!v.ok) throw badRequest(v.error);
  const post = await createPost({
    userId: user.id,
    gamertag: user.gamertag,
    platform: user.platform,
    body: v.value,
  });
  return NextResponse.json({ post }, { status: 201 });
});
