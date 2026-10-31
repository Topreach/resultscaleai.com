import { sameOrigin, allowAttempt } from "@/lib/request-security";
import { NextRequest, NextResponse } from "next/server";
import { getUsers } from "@/lib/store/db";
import { verifyPassword } from "@/lib/auth";
import { createAccountSession, publicUser } from "@/lib/account-auth";
export async function POST(request: NextRequest) {
  if (!sameOrigin(request)) return NextResponse.json({ error: "Invalid origin" }, { status: 403 });
  try {
    const body = await request.json();
    if (!allowAttempt("login:" + String(body.email).toLowerCase())) return NextResponse.json({ error: "Too many attempts. Please try again in a minute." }, { status: 429 });
    const user = typeof body.email === "string" ? getUsers().find((u) => u.email === body.email.trim().toLowerCase() && u.active) : null;
    if (!user || !verifyPassword(body.password, user.passwordHash)) return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    const response = NextResponse.json({ user: publicUser(user) });
    response.cookies.set("user_token", createAccountSession(user.id), { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", maxAge: 86400, path: "/" });
    return response;
  } catch { return NextResponse.json({ error: "Sign in failed" }, { status: 400 }); }
}
