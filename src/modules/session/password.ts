/**
 * Password hashing for gamertag accounts (server only).
 * Uses Node's built-in scrypt, so no extra dependency is needed.
 * Stored format: scrypt$<salt hex>$<hash hex>
 */
import "server-only";
import { randomBytes, scrypt as scryptCb, timingSafeEqual } from "crypto";
import { promisify } from "util";

const scrypt = promisify(scryptCb) as (password: string, salt: Buffer, keylen: number) => Promise<Buffer>;
const KEY_LEN = 64;

export const PASSWORD_MIN = 6;
export const PASSWORD_MAX = 72; // bcrypt-style limit, keeps requests small

export function validatePassword(input: unknown): { ok: true; value: string } | { ok: false; error: string } {
  const value = typeof input === "string" ? input : "";
  if (value.length < PASSWORD_MIN) return { ok: false, error: `Password needs at least ${PASSWORD_MIN} characters.` };
  if (value.length > PASSWORD_MAX) return { ok: false, error: `Password can be at most ${PASSWORD_MAX} characters.` };
  return { ok: true, value };
}

export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16);
  const hash = await scrypt(password, salt, KEY_LEN);
  return `scrypt$${salt.toString("hex")}$${hash.toString("hex")}`;
}

export async function verifyPassword(password: string, stored: string): Promise<boolean> {
  const parts = stored.split("$");
  if (parts.length !== 3 || parts[0] !== "scrypt") return false;
  const salt = Buffer.from(parts[1], "hex");
  const expected = Buffer.from(parts[2], "hex");
  if (salt.length === 0 || expected.length !== KEY_LEN) return false;
  const actual = await scrypt(password, salt, KEY_LEN);
  return timingSafeEqual(actual, expected);
}
