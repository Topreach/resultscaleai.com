import { NextRequest, NextResponse } from "next/server";

// GET /api/auth/me - Check if user is authenticated
export async function GET(request: NextRequest) {
  const token = request.cookies.get("admin_token")?.value;

  if (!token) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }

  try {
    const decoded = JSON.parse(Buffer.from(token, "base64").toString("utf-8"));

    if (decoded.exp < Date.now()) {
      return NextResponse.json(
        { authenticated: false, error: "Token expired" },
        { status: 401 }
      );
    }

    return NextResponse.json({
      authenticated: true,
      user: {
        email: decoded.email,
        role: decoded.role,
      },
    });
  } catch {
    return NextResponse.json(
      { authenticated: false, error: "Invalid token" },
      { status: 401 }
    );
  }
}
