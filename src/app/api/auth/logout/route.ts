import { sameOrigin } from "@/lib/request-security";
import { revokeSession } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

// POST /api/auth/logout - Logout admin
export async function POST(request: NextRequest) {
  if (!sameOrigin(request)) return NextResponse.json({ error: "Invalid origin" }, { status: 403 });
  revokeSession(request);
  const response = NextResponse.json({ success: true });

  response.cookies.set("admin_token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 0,
    path: "/",
  });

  return response;
}
