import "server-only";

import { createHash, timingSafeEqual } from "node:crypto";

const ADMIN_COOKIE = "north_room_admin";
const SESSION_MAX_AGE = 60 * 60 * 8;
const SESSION_PREFIX = "north-room-admin-v1";

export function adminPasswordConfigured(): boolean {
  return adminPassword().length > 0;
}

export function passwordMatches(value: string): boolean {
  const expected = adminPassword();
  if (!expected) return false;
  return safeEqual(value, expected);
}

export function adminCookieName(): string {
  return ADMIN_COOKIE;
}

export function adminSessionValue(): string {
  return createHash("sha256").update(`${SESSION_PREFIX}:${adminPassword()}`).digest("hex");
}

export function hasAdminSession(request: Request): boolean {
  if (!adminPasswordConfigured()) return false;
  const expected = adminSessionValue();
  const cookie = readCookie(request, ADMIN_COOKIE);
  if (!cookie) return false;
  return safeEqual(cookie, expected);
}

export function adminSessionMaxAge(): number {
  return SESSION_MAX_AGE;
}

function adminPassword(): string {
  return (process.env.ADMIN_PASSWORD ?? "").trim();
}

function safeEqual(left: string, right: string): boolean {
  const a = Buffer.from(left);
  const b = Buffer.from(right);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

function readCookie(request: Request, key: string): string | null {
  const header = request.headers.get("cookie");
  if (!header) return null;
  for (const part of header.split(";")) {
    const [name, ...value] = part.trim().split("=");
    if (name !== key) continue;
    return decodeURIComponent(value.join("="));
  }
  return null;
}
