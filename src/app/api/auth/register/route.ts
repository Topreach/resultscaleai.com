import { NextRequest, NextResponse } from "next/server";
import { hashPassword } from "@/lib/auth";
import { getUsers, saveUsers } from "@/lib/store/db";

// POST /api/auth/register - Register a new user account
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, password } = body;

    if (typeof name !== "string" || !name.trim() || name.length > 150 || typeof email !== "string" || email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || typeof password !== "string" || password.length > 1024) {
      return NextResponse.json(
        { error: "Name, email, and password are required" },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters" },
        { status: 400 }
      );
    }

    const users = getUsers();
    const normalizedEmail = email.trim().toLowerCase();
    if (users.some((user) => user.email === normalizedEmail)) return NextResponse.json({ error: "An account with this email already exists. Please sign in." }, { status: 409 });
    saveUsers([...users, { id: crypto.randomUUID(), name: name.trim(), email: normalizedEmail, passwordHash: hashPassword(password), favorites: [], downloads: [], createdAt: new Date().toISOString(), active: true }]);
    return NextResponse.json(
      {
        success: true,
        message: "Account created successfully. You can now sign in.",
      },
      { status: 201 }
    );
  } catch {
    return NextResponse.json(
      { error: "Registration failed" },
      { status: 400 }
    );
  }
}
