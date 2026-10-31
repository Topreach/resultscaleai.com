import { sameOrigin, allowAttempt } from "@/lib/request-security";
import { createSession, verifyPassword, hashPassword } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";
import { getAdminSettings, updateAdminPassword } from "@/lib/store/db";



// POST /api/auth/login - Admin login
export async function POST(request: NextRequest) {
  if (!sameOrigin(request)) return NextResponse.json({ error: "Invalid origin" }, { status: 403 });
  try {
    const body = await request.json();
    if (!allowAttempt("login:" + String(body.email).toLowerCase())) return NextResponse.json({ error: "Too many attempts. Please try again in a minute." }, { status: 429 });
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    const settings = getAdminSettings();

    if (email !== settings.email || !verifyPassword(password, settings.passwordHash)) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    if (!settings.passwordHash.startsWith("scrypt:")) updateAdminPassword(hashPassword(password));
    const token = createSession(settings.email);

    const response = NextResponse.json({
      success: true,
      token,
      user: {
        email: settings.email,
        name: "Admin",
        role: "admin",
      },
    });

    // Set cookie
    response.cookies.set("admin_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24, // 24 hours
      path: "/",
    });

    return response;
  } catch {
    return NextResponse.json(
      { error: "Login failed" },
      { status: 400 }
    );
  }
}
