import { NextResponse } from "next/server";
import { handleApi, badRequest, readJson, unauthorized, ApiError } from "@/lib/api/errors";
import {
  createSession,
  destroySession,
  gamertagTakenByOther,
  getCurrentUser,
  updateProfile,
} from "@/modules/session/server";
import { isPlatform, validateGamertag } from "@/lib/constants";
import { validatePassword } from "@/modules/session/password";

export const dynamic = "force-dynamic";

export const GET = handleApi(async (req) => {
  const user = await getCurrentUser(req);
  return NextResponse.json({ user });
});

export const POST = handleApi(async (req) => {
  const body = await readJson<{ gamertag?: string; platform?: string; password?: unknown }>(req);
  const tag = validateGamertag(String(body.gamertag ?? ""));
  if (!tag.ok) throw badRequest(tag.error);
  if (!isPlatform(body.platform)) throw badRequest("Choose PS4 or PS5.");
  const pw = validatePassword(body.password);
  if (!pw.ok) throw badRequest(pw.error);
  const { user, token, cookieSet } = await createSession(tag.value, body.platform, pw.value);
  // Always return the opaque session token so the client can store it when
  // the browser silently drops the Set-Cookie (cross-origin iframe / Brave).
  return NextResponse.json({ user, token, cookieSet }, { status: 201 });
});

export const PATCH = handleApi(async (req) => {
  const current = await getCurrentUser(req);
  if (!current) throw unauthorized();
  const body = await readJson<{ gamertag?: string; platform?: string }>(req);
  const patch: { gamertag?: string; platform?: "ps4" | "ps5" } = {};
  if (body.gamertag !== undefined) {
    const tag = validateGamertag(String(body.gamertag));
    if (!tag.ok) throw badRequest(tag.error);
    // Nobody may take a gamertag that another account already uses.
    if (tag.value.toLowerCase() !== current.gamertag.toLowerCase() && (await gamertagTakenByOther(tag.value, current.id))) {
      throw new ApiError(409, "That gamertag is already used by another account.", "gamertag_taken");
    }
    patch.gamertag = tag.value;
  }
  if (body.platform !== undefined) {
    if (!isPlatform(body.platform)) throw badRequest("Choose PS4 or PS5.");
    patch.platform = body.platform;
  }
  if (Object.keys(patch).length === 0) throw badRequest("Nothing to update.");
  const user = await updateProfile(current.id, patch);
  return NextResponse.json({ user });
});

export const DELETE = handleApi(async (req) => {
  await destroySession(req);
  return NextResponse.json({ ok: true });
});
