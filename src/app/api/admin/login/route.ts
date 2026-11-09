import { NextResponse } from "next/server";

import {
  adminCookieName,
  adminPasswordConfigured,
  adminSessionMaxAge,
  adminSessionValue,
  passwordMatches,
} from "@/lib/admin-auth";
import { allowRequest, json, readBody, sameOrigin } from "@/lib/http";
import { isRecord } from "@/lib/validators";

export async function POST(request: Request) {
  if (!sameOrigin(request)) {
    return json({ message: "That request did not come from this site." }, 403);
  }
  if (!allowRequest(request, "admin-login")) {
    return json({ message: "Too many login attempts. Wait a few minutes and try again." }, 429);
  }
  if (!adminPasswordConfigured()) {
    return json({ message: "Admin password is not configured." }, 503);
  }

  const body = await readBody(request);
  if (body instanceof Response) return body;
  const password = isRecord(body) && typeof body.password === "string" ? body.password : "";

  if (!passwordMatches(password)) {
    return json({ message: "Password was not correct." }, 401);
  }

  const response = NextResponse.json({ message: "Signed in." }, { headers: { "cache-control": "no-store" } });
  response.cookies.set({
    name: adminCookieName(),
    value: adminSessionValue(),
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    secure: process.env.NODE_ENV === "production",
    maxAge: adminSessionMaxAge(),
  });
  return response;
}
