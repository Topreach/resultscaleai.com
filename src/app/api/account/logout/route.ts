import { sameOrigin } from "@/lib/request-security";
import { NextRequest, NextResponse } from "next/server";
import { logoutAccount } from "@/lib/account-auth";
export async function POST(request: NextRequest) {
  if (!sameOrigin(request)) return NextResponse.json({ error: "Invalid origin" }, { status: 403 });
  logoutAccount(request);
  const response = NextResponse.json({ success: true });
  response.cookies.set("user_token", "", { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", maxAge: 0, path: "/" });
  return response;
}
