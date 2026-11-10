import "server-only";

import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { Pool } from "pg";

import { json } from "@/lib/http";

export type Stage = "production" | "preview";
export type StorageMode = "database" | "local-file";

export type Subscriber = {
  id: string;
  email: string;
  source: string;
  stage: Stage;
  createdAt: string;
};

export type Inquiry = {
  id: string;
  name: string;
  email: string;
  message: string;
  pieces: string[];
  stage: Stage;
  createdAt: string;
};

export type OrderStatus = "paid" | "unpaid" | "failed";

export type Order = {
  id: string;
  sessionId: string;
  title: string;
  customerEmail: string;
  amountTotal: number;
  currency: string;
  status: OrderStatus;
  source: string;
  stage: Stage;
  createdAt: string;
};

type FileDb = {
  subscribers: Subscriber[];
  inquiries: Inquiry[];
  orders: Order[];
};

const MAX_ROWS = 5000;
const LIST_LIMIT = 200;
const filePath = path.join(process.cwd(), "data", "local-store.json");

const SCHEMA = `
CREATE TABLE IF NOT EXISTS subscribers (
  id BIGSERIAL PRIMARY KEY,
  email TEXT NOT NULL,
  source TEXT NOT NULL,
  stage TEXT NOT NULL CHECK (stage IN ('production', 'preview')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (email, stage)
);
CREATE TABLE IF NOT EXISTS inquiries (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  message TEXT NOT NULL,
  pieces TEXT NOT NULL,
  stage TEXT NOT NULL CHECK (stage IN ('production', 'preview')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS subscribers_stage_created_idx
  ON subscribers (stage, created_at DESC);
CREATE INDEX IF NOT EXISTS inquiries_stage_created_idx
  ON inquiries (stage, created_at DESC);
CREATE TABLE IF NOT EXISTS orders (
  id BIGSERIAL PRIMARY KEY,
  session_id TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  customer_email TEXT NOT NULL DEFAULT '',
  amount_total INTEGER NOT NULL CHECK (amount_total >= 0),
  currency TEXT NOT NULL DEFAULT 'usd',
  status TEXT NOT NULL CHECK (status IN ('paid', 'unpaid', 'failed')),
  source TEXT NOT NULL,
  stage TEXT NOT NULL CHECK (stage IN ('production', 'preview')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS orders_stage_created_idx
  ON orders (stage, created_at DESC);
`;

const globalForPg = globalThis as unknown as {
  northRoomPool?: Pool;
  northRoomSchema?: Promise<void>;
};

let fileChain: Promise<unknown> = Promise.resolve();

export class StoreError extends Error {
  constructor(readonly code: "full" | "unavailable") {
    super(code);
    this.name = "StoreError";
  }
}

export function storageMode(): StorageMode {
  return databaseUrl() ? "database" : "local-file";
}

export async function addSubscriber(input: { email: string; source: string; stage: Stage }): Promise<void> {
  const db = await database();
  if (!db) {
    await addSubscriberFile(input);
    return;
  }
  const count = await db.query<{ count: string }>(
    "SELECT COUNT(*)::text AS count FROM subscribers WHERE stage = $1",
    [input.stage],
  );
  if (Number(count.rows[0]?.count ?? 0) >= MAX_ROWS) throw new StoreError("full");
  await db.query(
    `INSERT INTO subscribers (email, source, stage)
     VALUES ($1, $2, $3)
     ON CONFLICT (email, stage) DO NOTHING`,
    [input.email, input.source, input.stage],
  );
}

export async function addInquiry(input: {
  name: string;
  email: string;
  message: string;
  pieces: string[];
  stage: Stage;
}): Promise<void> {
  const db = await database();
  if (!db) {
    await addInquiryFile(input);
    return;
  }
  const count = await db.query<{ count: string }>(
    "SELECT COUNT(*)::text AS count FROM inquiries WHERE stage = $1",
    [input.stage],
  );
  if (Number(count.rows[0]?.count ?? 0) >= MAX_ROWS) throw new StoreError("full");
  await db.query(
    `INSERT INTO inquiries (name, email, message, pieces, stage)
     VALUES ($1, $2, $3, $4, $5)`,
    [input.name, input.email, input.message, JSON.stringify(input.pieces), input.stage],
  );
}

export async function addOrder(input: {
  sessionId: string;
  title: string;
  customerEmail: string;
  amountTotal: number;
  currency: string;
  status: OrderStatus;
  source: string;
  stage: Stage;
}): Promise<void> {
  const db = await database();
  if (!db) {
    await addOrderFile(input);
    return;
  }
  await db.query(
    `INSERT INTO orders (session_id, title, customer_email, amount_total, currency, status, source, stage)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
     ON CONFLICT (session_id) DO UPDATE SET
       title = EXCLUDED.title,
       customer_email = EXCLUDED.customer_email,
       amount_total = EXCLUDED.amount_total,
       currency = EXCLUDED.currency,
       status = EXCLUDED.status,
       source = EXCLUDED.source,
       stage = EXCLUDED.stage`,
    [input.sessionId, input.title, input.customerEmail, Math.max(0, Math.round(input.amountTotal)), input.currency, input.status, input.source, input.stage],
  );
}

export async function listDesk(stage: Stage): Promise<{
  storage: StorageMode;
  stage: Stage;
  subscribers: Subscriber[];
  inquiries: Inquiry[];
  orders: Order[];
}> {
  const db = await database();
  if (!db) return listFile(stage);
  const subscribers = await db.query<{
    id: string | number;
    email: string;
    source: string;
    stage: Stage;
    created_at: Date | string;
  }>(
    `SELECT id, email, source, stage, created_at
     FROM subscribers
     WHERE stage = $1
     ORDER BY created_at DESC
     LIMIT $2`,
    [stage, LIST_LIMIT],
  );
  const inquiries = await db.query<{
    id: string | number;
    name: string;
    email: string;
    message: string;
    pieces: string;
    stage: Stage;
    created_at: Date | string;
  }>(
    `SELECT id, name, email, message, pieces, stage, created_at
     FROM inquiries
     WHERE stage = $1
     ORDER BY created_at DESC
     LIMIT $2`,
    [stage, LIST_LIMIT],
  );
  const orders = await db.query<{
    id: string | number;
    session_id: string;
    title: string;
    customer_email: string;
    amount_total: number | string;
    currency: string;
    status: OrderStatus;
    source: string;
    stage: Stage;
    created_at: Date | string;
  }>(
    `SELECT id, session_id, title, customer_email, amount_total, currency, status, source, stage, created_at
     FROM orders
     WHERE stage = $1
     ORDER BY created_at DESC
     LIMIT $2`,
    [stage, LIST_LIMIT],
  );
  return {
    storage: "database",
    stage,
    subscribers: subscribers.rows.map((row) => ({
      id: String(row.id),
      email: row.email,
      source: row.source,
      stage: row.stage,
      createdAt: toIso(row.created_at),
    })),
    inquiries: inquiries.rows.map((row) => ({
      id: String(row.id),
      name: row.name,
      email: row.email,
      message: row.message,
      pieces: parsePieces(row.pieces),
      stage: row.stage,
      createdAt: toIso(row.created_at),
    })),
    orders: orders.rows.map((row) => ({
      id: String(row.id),
      sessionId: row.session_id,
      title: row.title,
      customerEmail: row.customer_email,
      amountTotal: Number(row.amount_total),
      currency: row.currency,
      status: row.status,
      source: row.source,
      stage: row.stage,
      createdAt: toIso(row.created_at),
    })),
  };
}

export function storeFailureResponse(error: unknown): Response {
  if (error instanceof StoreError && error.code === "full") {
    return json({ message: "The studio list is full right now." }, 429);
  }
  const code =
    typeof error === "object" && error !== null && "code" in error
      ? String((error as { code: unknown }).code)
      : "unknown";
  console.error("store_failed", code);
  return json({ message: "The studio list could not be saved. Try again in a moment." }, 503);
}

async function database(): Promise<Pool | null> {
  const connectionString = databaseUrl();
  if (!connectionString) return null;
  if (!globalForPg.northRoomPool) {
    globalForPg.northRoomPool = new Pool({
      connectionString,
      max: 3,
      connectionTimeoutMillis: 8000,
    });
  }
  const active = globalForPg.northRoomPool;
  if (!globalForPg.northRoomSchema) {
    globalForPg.northRoomSchema = active.query(SCHEMA).then(
      () => undefined,
      (error: unknown) => {
        globalForPg.northRoomSchema = undefined;
        throw error;
      },
    );
  }
  await globalForPg.northRoomSchema;
  return active;
}

function databaseUrl(): string | null {
  // Use pooled URL for app traffic; fall back to unpooled when needed.
  return process.env.DATABASE_URL ?? process.env.DATABASE_URL_UNPOOLED ?? null;
}

function withFile<T>(fn: (data: FileDb) => Promise<T> | T): Promise<T> {
  const run = fileChain.then(async () => {
    const data = await readFileDb();
    const result = await fn(data);
    return result;
  });
  fileChain = run.then(
    () => undefined,
    () => undefined,
  );
  return run;
}

async function readFileDb(): Promise<FileDb> {
  try {
    const raw = await readFile(filePath, "utf8");
    const parsed: unknown = JSON.parse(raw);
    if (!isFileDb(parsed)) throw new StoreError("unavailable");
    return {
      subscribers: parsed.subscribers,
      inquiries: parsed.inquiries,
      orders: Array.isArray(parsed.orders) ? parsed.orders : [],
    };
  } catch (error) {
    if (isMissing(error)) return { subscribers: [], inquiries: [], orders: [] };
    if (error instanceof StoreError) throw error;
    throw new StoreError("unavailable");
  }
}

async function writeFileDb(data: FileDb): Promise<void> {
  await mkdir(path.dirname(filePath), { recursive: true });
  await writeFile(filePath, JSON.stringify(data), { mode: 0o600 });
}

async function addSubscriberFile(input: { email: string; source: string; stage: Stage }): Promise<void> {
  await withFile(async (data) => {
    const existing = data.subscribers.filter((row) => row.stage === input.stage);
    if (existing.some((row) => row.email === input.email)) return;
    if (existing.length >= MAX_ROWS) throw new StoreError("full");
    data.subscribers.push({
      id: crypto.randomUUID(),
      email: input.email,
      source: input.source,
      stage: input.stage,
      createdAt: new Date().toISOString(),
    });
    await writeFileDb(data);
  });
}

async function addInquiryFile(input: {
  name: string;
  email: string;
  message: string;
  pieces: string[];
  stage: Stage;
}): Promise<void> {
  await withFile(async (data) => {
    const existing = data.inquiries.filter((row) => row.stage === input.stage);
    if (existing.length >= MAX_ROWS) throw new StoreError("full");
    data.inquiries.push({
      id: crypto.randomUUID(),
      name: input.name,
      email: input.email,
      message: input.message,
      pieces: input.pieces,
      stage: input.stage,
      createdAt: new Date().toISOString(),
    });
    await writeFileDb(data);
  });
}

async function addOrderFile(input: {
  sessionId: string;
  title: string;
  customerEmail: string;
  amountTotal: number;
  currency: string;
  status: OrderStatus;
  source: string;
  stage: Stage;
}): Promise<void> {
  await withFile(async (data) => {
    const index = data.orders.findIndex((row) => row.sessionId === input.sessionId);
    const next: Order = {
      id: index >= 0 ? data.orders[index].id : crypto.randomUUID(),
      sessionId: input.sessionId,
      title: input.title,
      customerEmail: input.customerEmail,
      amountTotal: Math.max(0, Math.round(input.amountTotal)),
      currency: input.currency,
      status: input.status,
      source: input.source,
      stage: input.stage,
      createdAt: index >= 0 ? data.orders[index].createdAt : new Date().toISOString(),
    };
    if (index >= 0) {
      data.orders[index] = next;
    } else {
      data.orders.push(next);
    }
    await writeFileDb(data);
  });
}

async function listFile(stage: Stage) {
  return withFile((data) => ({
    storage: "local-file" as const,
    stage,
    subscribers: data.subscribers
      .filter((row) => row.stage === stage)
      .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1))
      .slice(0, LIST_LIMIT),
    inquiries: data.inquiries
      .filter((row) => row.stage === stage)
      .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1))
      .slice(0, LIST_LIMIT),
    orders: data.orders
      .filter((row) => row.stage === stage)
      .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1))
      .slice(0, LIST_LIMIT),
  }));
}

function isFileDb(value: unknown): value is FileDb {
  if (typeof value !== "object" || value === null) return false;
  const record = value as { subscribers?: unknown; inquiries?: unknown; orders?: unknown };
  if (!Array.isArray(record.subscribers) || !Array.isArray(record.inquiries)) return false;
  return record.orders === undefined || Array.isArray(record.orders);
}

function isMissing(error: unknown): boolean {
  return typeof error === "object" && error !== null && "code" in error && (error as { code: string }).code === "ENOENT";
}

function toIso(value: Date | string): string {
  if (value instanceof Date) return value.toISOString();
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? String(value) : parsed.toISOString();
}

function parsePieces(value: string): string[] {
  try {
    const parsed: unknown = JSON.parse(value);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((item): item is string => typeof item === "string");
  } catch {
    return [];
  }
}
