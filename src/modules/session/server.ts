/**
 * Session module (server only).
 *
 * Auth sources (first match wins):
 *  1. Authorization: Bearer <sessionId>
 *  2. x-session-token request header
 *  3. gtac_session httpOnly cookie
 *  4. gtac_session_token client cookie (CHIPS / SameSite=None fallback)
 * Tokens are never accepted from the URL here. The middleware reads the one-time
 * bootstrap link for page loads only and turns it into a header.
 */
import "server-only";
import { cookies, headers } from "next/headers";
import { and, desc, eq, gt, isNotNull, sql } from "drizzle-orm";
import { db } from "@/db";
import { sessions, users, type User } from "@/db/schema";
import { SESSION_COOKIE, SESSION_TOKEN_KEY, SESSION_TTL_DAYS, type Platform } from "@/lib/constants";
import { ApiError } from "@/lib/api/errors";
import { hashPassword, verifyPassword } from "@/modules/session/password";

export interface SessionUser {
  id: string;
  gamertag: string;
  platform: Platform;
  createdAt: string;
}

export interface SessionBundle {
  user: SessionUser;
  token: string;
  cookieSet: boolean;
}

function toSessionUser(u: User): SessionUser {
  return { id: u.id, gamertag: u.gamertag, platform: u.platform as Platform, createdAt: u.createdAt.toISOString() };
}

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function isSessionId(v: unknown): v is string {
  return typeof v === "string" && UUID_RE.test(v);
}

export function sessionIdFromRequest(req?: Request | null): string | null {
  if (!req) return null;

  const auth = req.headers.get("authorization") ?? req.headers.get("Authorization");
  if (auth) {
    const m = auth.match(/^Bearer\s+(.+)$/i);
    if (m && isSessionId(m[1].trim())) return m[1].trim();
  }

  const x = req.headers.get("x-session-token");
  if (isSessionId(x)) return x;

  return null;
}

async function userForSessionId(sid: string): Promise<{ user: SessionUser; token: string } | null> {
  if (!isSessionId(sid)) return null;
  const rows = await db
    .select({ user: users })
    .from(sessions)
    .innerJoin(users, eq(sessions.userId, users.id))
    .where(and(eq(sessions.id, sid), gt(sessions.expiresAt, new Date())))
    .limit(1);
  const row = rows[0];
  if (!row) return null;
  db.update(users).set({ lastSeenAt: new Date() }).where(eq(users.id, row.user.id)).catch(() => {});
  return { user: toSessionUser(row.user), token: sid };
}

async function sessionIdFromCookies(): Promise<string | null> {
  try {
    const store = await cookies();
    for (const name of [SESSION_COOKIE, SESSION_TOKEN_KEY]) {
      const v = store.get(name)?.value;
      if (isSessionId(v)) return v;
    }
  } catch {
    /* cookies() outside request */
  }
  return null;
}

export async function getCurrentUser(req?: Request | null): Promise<SessionUser | null> {
  const fromReq = sessionIdFromRequest(req);
  if (fromReq) {
    const hit = await userForSessionId(fromReq);
    if (hit) return hit.user;
  }

  const fromCookie = await sessionIdFromCookies();
  if (fromCookie) {
    const hit = await userForSessionId(fromCookie);
    if (hit) return hit.user;
  }

  try {
    const h = await headers();
    const alt = h.get("x-session-token") || h.get("authorization");
    if (alt) {
      const m = alt.match(/^Bearer\s+(.+)$/i);
      const sid = m ? m[1].trim() : alt;
      if (isSessionId(sid)) {
        const hit = await userForSessionId(sid);
        if (hit) return hit.user;
      }
    }
  } catch {
    /* ignore */
  }

  return null;
}

export async function getSessionTokenFromCookie(): Promise<string | null> {
  return sessionIdFromCookies();
}

function cookieSecure(): boolean {
  // Always mark Secure in production; in dev over http browsers reject SameSite=None without Secure
  // so we only use None when we know we're on https.
  return process.env.NODE_ENV === "production" || process.env.FORCE_SECURE_COOKIES === "1";
}

/**
 * Signs a person in with gamertag + password. Gamertags are matched without case.
 *  - No account yet: create one with this password.
 *  - Account has a password: the password must match, or the login is refused.
 *  - Old account without a password: the first login sets it (legacy claim).
 */
export async function createSession(gamertag: string, platform: Platform, password: string): Promise<SessionBundle> {
  const expiresAt = new Date(Date.now() + SESSION_TTL_DAYS * 86400_000);
  const sameTag = sql`lower(${users.gamertag}) = lower(${gamertag})`;

  const protectedRows = await db
    .select()
    .from(users)
    .where(and(sameTag, isNotNull(users.passwordHash)))
    .orderBy(desc(users.lastSeenAt));

  let user: User | undefined;
  if (protectedRows.length > 0) {
    for (const row of protectedRows) {
      if (row.passwordHash && (await verifyPassword(password, row.passwordHash))) {
        user = row;
        break;
      }
    }
    if (!user) throw new ApiError(401, "Wrong password for this gamertag.", "wrong_password");
    if (user.platform !== platform) {
      [user] = await db.update(users).set({ platform }).where(eq(users.id, user.id)).returning();
    }
  } else {
    const passwordHash = await hashPassword(password);
    const [legacy] = await db
      .select()
      .from(users)
      .where(sameTag)
      .orderBy(desc(users.lastSeenAt))
      .limit(1);
    if (legacy) {
      [user] = await db
        .update(users)
        .set({ passwordHash, platform })
        .where(eq(users.id, legacy.id))
        .returning();
    } else {
      [user] = await db.insert(users).values({ gamertag, platform, passwordHash }).returning();
    }
  }

  const [session] = await db.insert(sessions).values({ userId: user.id, expiresAt }).returning();

  let cookieSet = false;
  const secure = cookieSecure();
  try {
    const store = await cookies();
    // Primary httpOnly cookie. Use SameSite=None; Secure so third-party iframes
    // (Arena preview) can keep it when the browser allows third-party cookies.
    // On plain HTTP dev we fall back to Lax so the cookie isn't rejected outright.
    store.set(SESSION_COOKIE, session.id, {
      httpOnly: true,
      sameSite: secure ? "none" : "lax",
      secure,
      path: "/",
      expires: expiresAt,
    });
    cookieSet = true;
  } catch (err) {
    console.warn("[session] could not set cookie", err);
    cookieSet = false;
  }

  return { user: toSessionUser(user), token: session.id, cookieSet };
}

/** True when another account already uses this gamertag (case-insensitive). */
export async function gamertagTakenByOther(gamertag: string, userId: string): Promise<boolean> {
  const rows = await db
    .select({ id: users.id })
    .from(users)
    .where(and(sql`lower(${users.gamertag}) = lower(${gamertag})`, sql`${users.id} <> ${userId}`))
    .limit(1);
  return rows.length > 0;
}

export async function updateProfile(userId: string, patch: { gamertag?: string; platform?: Platform }): Promise<SessionUser> {
  const [user] = await db.update(users).set(patch).where(eq(users.id, userId)).returning();
  return toSessionUser(user);
}

export async function destroySession(req?: Request | null): Promise<void> {
  const sid = sessionIdFromRequest(req) ?? (await getSessionTokenFromCookie());
  if (sid && isSessionId(sid)) {
    await db.delete(sessions).where(eq(sessions.id, sid)).catch(() => {});
  }
  try {
    const store = await cookies();
    store.delete(SESSION_COOKIE);
    store.delete(SESSION_TOKEN_KEY);
  } catch {
    /* ignore */
  }
}
