import { validApp } from "@/lib/validation";
import { getSession } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";
import { getApps, createApp } from "@/lib/store/db";

// GET /api/apps - List all apps
export async function GET() {
  const apps = getApps();
  return NextResponse.json(apps);
}

// POST /api/apps - Create a new app
export async function POST(request: NextRequest) {
  if (!getSession(request)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const body = await request.json();
    if (!validApp(body)) return NextResponse.json({ error: "Invalid or incomplete data" }, { status: 400 });
    if (getApps().some((app) => app.id === body.id)) return NextResponse.json({ error: "App ID already exists" }, { status: 409 });
    const app = createApp(body);
    return NextResponse.json(app, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Failed to create app" },
      { status: 400 }
    );
  }
}
