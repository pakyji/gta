import { NextResponse } from "next/server";
import { handleApi, badRequest, unauthorized, notFound } from "@/lib/api/errors";
import { getCurrentUser } from "@/modules/session/server";
import { deletePost } from "@/modules/feed/server";

export const dynamic = "force-dynamic";
type Ctx = { params: Promise<{ id: string }> };

export const DELETE = handleApi<Ctx>(async (req, { params }) => {
  const user = await getCurrentUser(req);
  if (!user) throw unauthorized();
  const postId = Number((await params).id);
  if (!Number.isFinite(postId) || postId <= 0) throw badRequest("Invalid post.");
  const ok = await deletePost(postId, user.id);
  if (!ok) throw notFound("Post not found.");
  return NextResponse.json({ ok: true });
});
