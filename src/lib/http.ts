const WINDOW_MS = 10 * 60 * 1000;
const MAX_HITS = 8;
const buckets = new Map<string, number[]>();

export function sameOrigin(request: Request): boolean {
  const site = request.headers.get("sec-fetch-site");
  if (site === "cross-site") return false;
  const origin = request.headers.get("origin");
  const host = request.headers.get("host");
  if (!origin) {
    // Browsers omit Origin on same-origin GET. They still set Sec-Fetch-Site,
    // and a page on another site cannot change that header.
    return site === "same-origin" || site === "none";
  }
  if (!host) return false;
  try {
    const url = new URL(origin);
    return (url.protocol === "https:" || url.protocol === "http:") && url.host === host;
  } catch {
    return false;
  }
}

export function allowRequest(request: Request, bucket: string): boolean {
  const forwarded = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
  const key = `${bucket}:${forwarded.slice(0, 80)}`;
  const now = Date.now();
  const recent = (buckets.get(key) ?? []).filter((stamp) => now - stamp < WINDOW_MS);
  if (recent.length >= MAX_HITS) {
    buckets.set(key, recent);
    return false;
  }
  recent.push(now);
  buckets.set(key, recent);
  if (buckets.size > 2000) {
    const oldest = buckets.keys().next().value;
    if (oldest) buckets.delete(oldest);
  }
  return true;
}

export async function readBody(request: Request): Promise<unknown | Response> {
  const type = request.headers.get("content-type") ?? "";
  if (!type.includes("application/json")) {
    return json({ message: "Send a JSON body." }, 415);
  }
  const text = await request.text();
  if (text.length > 8000) {
    return json({ message: "That note is too long." }, 413);
  }
  try {
    return JSON.parse(text) as unknown;
  } catch {
    return json({ message: "That note could not be read." }, 400);
  }
}

export function json(body: unknown, status = 200): Response {
  return Response.json(body, {
    status,
    headers: { "cache-control": "no-store" },
  });
}
