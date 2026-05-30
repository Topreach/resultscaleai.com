import { NextRequest, NextResponse } from "next/server";

// POST /api/auth/register - Register a new user account
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, password } = body;

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Name, email, and password are required" },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters" },
        { status: 400 }
      );
    }

    // In production, save to database
    // For now, return success (registration is open to public)
    return NextResponse.json(
      {
        success: true,
        message: "Account created successfully. Please check your email to verify.",
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Registration failed" },
      { status: 400 }
    );
  }
}
