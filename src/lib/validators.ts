import { getPiece } from "@/lib/catalog";

const EMAIL = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/;

export function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function cleanEmail(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const email = value.trim().toLowerCase();
  if (email.length < 3 || email.length > 254) return null;
  if (email.includes("..")) return null;
  if (!EMAIL.test(email)) return null;
  return email;
}

export function cleanName(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const name = value.trim().replace(/\s+/g, " ");
  if (name.length < 1 || name.length > 80) return null;
  if (/[\u0000-\u001f\u007f]/.test(name)) return null;
  return name;
}

export function cleanMessage(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const message = value.trim();
  if (message.length < 1 || message.length > 2000) return null;
  if (/[\u0000-\u0008\u000b\u000c\u000e-\u001f]/.test(message)) return null;
  return message;
}

export function cleanPieces(value: unknown): string[] | null {
  if (!Array.isArray(value) || value.length < 1 || value.length > 8) return null;
  const slugs: string[] = [];
  for (const item of value) {
    if (typeof item !== "string" || !getPiece(item)) return null;
    if (!slugs.includes(item)) slugs.push(item);
  }
  return slugs;
}
