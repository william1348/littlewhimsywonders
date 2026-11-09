import "server-only";

import { getIdentity, requireIdentity, type VerifiedIdentity } from "../../cursor/identity";
import type { Stage } from "@/lib/store";

export async function requirePerson(request: Request): Promise<VerifiedIdentity | Response> {
  const identity = await requireIdentity(request);
  if (identity instanceof Response) return identity;
  if (identity.kind !== "person") {
    return Response.json(
      { message: "Sign in to use the studio list." },
      { status: 401, headers: { "cache-control": "no-store" } },
    );
  }
  return identity;
}

export async function stageFromRequest(request: Request): Promise<Stage> {
  const identity = await getIdentity(request);
  if (identity.verified) return identity.stage;
  return defaultStage();
}

export function defaultStage(): Stage {
  return process.env.VERCEL_ENV === "preview" ? "preview" : "production";
}

export function canOpenDesk(identity: VerifiedIdentity): boolean {
  if (identity.kind !== "person") return false;
  if (identity.appVisibility === "private") return true;
  return identity.teamRole === "admin";
}
