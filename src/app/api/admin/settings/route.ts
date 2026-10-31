import { hashPassword, verifyPassword } from "@/lib/auth";
import { getSession } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";
import { getAdminSettings, updateAdminPassword, updateGoogleConfig, getSessions, saveSessions } from "@/lib/store/db";

// GET /api/admin/settings - Get admin settings (excluding password)
export async function GET(request: NextRequest) {
  if (!getSession(request)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
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
  if (!getSession(request)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const body = await request.json();

    // Update password
    if (body.currentPassword && body.newPassword) {
      const { currentPassword, newPassword } = body;

      if (typeof newPassword !== "string" || newPassword.length < 8 || newPassword.length > 1024) {
        return NextResponse.json(
          { error: "New password must be between 8 and 1024 characters" },
          { status: 400 }
        );
      }

      const settings = getAdminSettings();

      // Verify current password
      if (!verifyPassword(currentPassword, settings.passwordHash)) {
        return NextResponse.json(
          { error: "Current password is incorrect" },
          { status: 401 }
        );
      }

      updateAdminPassword(hashPassword(newPassword));
      const currentSession = getSession(request);
      saveSessions(getSessions().filter((session) => session.hash === currentSession?.hash));
      return NextResponse.json({ success: true, message: "Password updated successfully" });
    }

    // Update Google config
    if (body.google) {
      const google = body.google;
      if (!!google.recaptchaSiteKey !== !!google.recaptchaSecretKey) return NextResponse.json({ error: "Provide both reCAPTCHA v2 keys or clear both." }, { status: 400 });
      const keys = ["searchConsoleVerification", "recaptchaSiteKey", "recaptchaSecretKey", "analyticsMeasurementId", "tagManagerId"];
      if (keys.some((key) => typeof google[key] !== "string" || google[key].length > 500) ||
        (google.analyticsMeasurementId && !/^G-[A-Z0-9]+$/.test(google.analyticsMeasurementId)) ||
        (google.tagManagerId && !/^GTM-[A-Z0-9]+$/.test(google.tagManagerId))) {
        return NextResponse.json({ error: "Enter valid Google settings and measurement IDs" }, { status: 400 });
      }
      updateGoogleConfig(Object.fromEntries(keys.map((key) => [key, google[key]])) as unknown as import("@/types").GoogleConfig);
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
