import { NextRequest, NextResponse } from "next/server";
import { getApps, createApp } from "@/lib/store/db";

// GET /api/apps - List all apps
export async function GET() {
  const apps = getApps();
  return NextResponse.json(apps);
}

// POST /api/apps - Create a new app
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const app = createApp(body);
    return NextResponse.json(app, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create app" },
      { status: 400 }
    );
  }
}
