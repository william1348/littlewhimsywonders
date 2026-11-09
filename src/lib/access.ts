import "server-only";

import { requireIdentity, type VerifiedIdentity } from "../../cursor/identity";

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

export function canOpenDesk(identity: VerifiedIdentity): boolean {
  if (identity.kind !== "person") return false;
  if (identity.appVisibility === "private") return true;
  return identity.teamRole === "admin";
}
