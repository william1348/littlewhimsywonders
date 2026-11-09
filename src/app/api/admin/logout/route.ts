import { NextResponse } from "next/server";

import { adminCookieName } from "@/lib/admin-auth";
import { json, sameOrigin } from "@/lib/http";

export async function POST(request: Request) {
  if (!sameOrigin(request)) {
    return json({ message: "That request did not come from this site." }, 403);
  }
  const response = NextResponse.json({ message: "Signed out." }, { headers: { "cache-control": "no-store" } });
  response.cookies.set({
    name: adminCookieName(),
    value: "",
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    secure: process.env.NODE_ENV === "production",
    maxAge: 0,
  });
  return response;
}
