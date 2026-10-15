import { NextResponse } from "next/server";
import { handleApi, badRequest, unauthorized } from "@/lib/api/errors";
import { getCurrentUser } from "@/modules/session/server";
import { toggleLike } from "@/modules/feed/server";

export const dynamic = "force-dynamic";

type Ctx = { params: Promise<{ id: string }> };

export const POST = handleApi<Ctx>(async (req, { params }) => {
  const user = await getCurrentUser(req);
  if (!user) throw unauthorized();
  const { id } = await params;
  const postId = Number(id);
  if (!Number.isFinite(postId) || postId <= 0) throw badRequest("Invalid post.");
  const result = await toggleLike(postId, user.id);
  return NextResponse.json(result);
});
