import { NextRequest, NextResponse } from "next/server";
import { getAdminSettings } from "@/lib/store/db";

const ADMIN_EMAIL = "admin@resultscaleai.com";

// POST /api/auth/login - Admin login
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    const settings = getAdminSettings();

    if (email !== ADMIN_EMAIL || password !== settings.passwordHash) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    // Create a simple token (in production, use JWT)
    const token = Buffer.from(
      JSON.stringify({
        email: ADMIN_EMAIL,
        role: "admin",
        exp: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
      })
    ).toString("base64");

    const response = NextResponse.json({
      success: true,
      token,
      user: {
        email: ADMIN_EMAIL,
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
  } catch (error) {
    return NextResponse.json(
      { error: "Login failed" },
      { status: 400 }
    );
  }
}
