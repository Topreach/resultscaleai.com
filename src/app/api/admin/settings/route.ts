import { NextRequest, NextResponse } from "next/server";
import { getAdminSettings, updateAdminPassword } from "@/lib/store/db";

// GET /api/admin/settings - Get admin settings (excluding password)
export async function GET() {
  try {
    const settings = getAdminSettings();
    return NextResponse.json({
      email: settings.email,
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch settings" },
      { status: 500 }
    );
  }
}

// PUT /api/admin/settings - Update admin password
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { currentPassword, newPassword } = body;

    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { error: "Current password and new password are required" },
        { status: 400 }
      );
    }

    if (newPassword.length < 6) {
      return NextResponse.json(
        { error: "New password must be at least 6 characters" },
        { status: 400 }
      );
    }

    const settings = getAdminSettings();

    // Verify current password
    if (currentPassword !== settings.passwordHash) {
      return NextResponse.json(
        { error: "Current password is incorrect" },
        { status: 401 }
      );
    }

    updateAdminPassword(newPassword);

    return NextResponse.json({ success: true, message: "Password updated successfully" });
  } catch {
    return NextResponse.json(
      { error: "Failed to update settings" },
      { status: 500 }
    );
  }
}
