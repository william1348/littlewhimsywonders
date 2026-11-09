export async function postJson(
  path: string,
  body: unknown,
): Promise<{ ok: true; message: string; storage?: string } | { ok: false; message: string }> {
  try {
    const response = await fetch(path, {
      method: "POST",
      headers: { "content-type": "application/json", accept: "application/json" },
      body: JSON.stringify(body),
    });
    const data = (await response.json().catch(() => null)) as { message?: string; storage?: string } | null;
    if (!response.ok) {
      return { ok: false, message: data?.message ?? fallback(response.status) };
    }
    return { ok: true, message: data?.message ?? "Saved.", storage: data?.storage };
  } catch {
    return { ok: false, message: "The studio could not be reached. Try again in a moment." };
  }
}

function fallback(status: number): string {
  if (status === 401) return "Sign in to save this.";
  if (status === 403) return "That request was refused.";
  if (status === 429) return "Too many notes at once. Wait a few minutes and try again.";
  return "That could not be saved.";
}
