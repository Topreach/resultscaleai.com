import { validMonetization } from "@/lib/validation";
import { getSession } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";
import { getMonetizationConfig, updateMonetizationConfig } from "@/lib/store/db";

// GET /api/admin/monetization - Get monetization config
export async function GET() {
  try {
    const config = getMonetizationConfig();
    return NextResponse.json(config);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch monetization config" },
      { status: 500 }
    );
  }
}

// PUT /api/admin/monetization - Update monetization config
export async function PUT(request: NextRequest) {
  if (!getSession(request)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const body = await request.json();
    if (!validMonetization(body)) return NextResponse.json({ error: "Invalid or incomplete data" }, { status: 400 });
    updateMonetizationConfig(body);
    return NextResponse.json({ success: true, message: "Monetization settings updated" });
  } catch {
    return NextResponse.json(
      { error: "Failed to update monetization config" },
      { status: 500 }
    );
  }
}
