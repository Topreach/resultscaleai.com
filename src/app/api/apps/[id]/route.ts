import { validApp } from "@/lib/validation";
import { getSession } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";
import { getApp, updateApp, deleteApp } from "@/lib/store/db";
import { removeLocalApk } from "@/lib/apk-storage";

// GET /api/apps/[id] - Get a single app
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const app = getApp(id);
  if (!app) {
    return NextResponse.json({ error: "App not found" }, { status: 404 });
  }
  return NextResponse.json(app);
}

// PUT /api/apps/[id] - Update an app
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!getSession(request)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  try {
    const body = await request.json();
    const existing = getApp(id);
    if (!existing) {
      return NextResponse.json({ error: "App not found" }, { status: 404 });
    }

    if (!validApp({ ...existing, ...body, id })) return NextResponse.json({ error: "Invalid app data" }, { status: 400 });
    const updated = updateApp(id, { ...body, id });
    if (!updated) {
      return NextResponse.json({ error: "App not found" }, { status: 404 });
    }
    if (Object.hasOwn(body, "apkUrl") && body.apkUrl !== existing.apkUrl && existing.apkUrl) await removeLocalApk(existing.apkUrl);
    return NextResponse.json(updated);
  } catch {
    return NextResponse.json(
      { error: "Failed to update app" },
      { status: 400 }
    );
  }
}

// DELETE /api/apps/[id] - Delete an app
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!getSession(request)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const existing = getApp(id);
  if (!existing) {
    return NextResponse.json({ error: "App not found" }, { status: 404 });
  }

  const deleted = deleteApp(id);
  if (!deleted) {
    return NextResponse.json({ error: "App not found" }, { status: 404 });
  }
  if (existing.apkUrl) await removeLocalApk(existing.apkUrl);
  return NextResponse.json({ success: true });
}
