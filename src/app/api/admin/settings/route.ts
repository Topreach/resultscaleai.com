import { NextRequest, NextResponse } from "next/server";
import { getAdminSettings, updateAdminPassword, updateGoogleConfig } from "@/lib/store/db";

// GET /api/admin/settings - Get admin settings (excluding password)
export async function GET() {
  try {
    const settings = getAdminSettings();
    return NextResponse.json({
      email: settings.email,
      google: settings.google,
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch settings" },
      { status: 500 }
    );
  }
}

// PUT /api/admin/settings - Update admin password or Google config
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();

    // Update password
    if (body.currentPassword && body.newPassword) {
      const { currentPassword, newPassword } = body;

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
    }

    // Update Google config
    if (body.google) {
      updateGoogleConfig(body.google);
      return NextResponse.json({ success: true, message: "Google configuration saved" });
    }

    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 }
    );
  } catch {
    return NextResponse.json(
      { error: "Failed to update settings" },
      { status: 500 }
    );
  }
}
