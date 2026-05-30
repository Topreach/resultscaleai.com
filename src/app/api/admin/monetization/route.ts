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
  try {
    const body = await request.json();
    updateMonetizationConfig(body);
    return NextResponse.json({ success: true, message: "Monetization settings updated" });
  } catch {
    return NextResponse.json(
      { error: "Failed to update monetization config" },
      { status: 500 }
    );
  }
}
