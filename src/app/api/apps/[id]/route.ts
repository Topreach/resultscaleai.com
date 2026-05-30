import { NextRequest, NextResponse } from "next/server";
import { getApp, updateApp, deleteApp } from "@/lib/store/db";
import { unlink } from "fs/promises";
import path from "path";

// GET /api/apps/[id] - Get a single app
export async function GET(
  _request: NextRequest,
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
  const { id } = await params;
  try {
    const body = await request.json();
    const existing = getApp(id);
    if (!existing) {
      return NextResponse.json({ error: "App not found" }, { status: 404 });
    }

    // P1: Clean up old APK file if apkUrl changed
    if (body.apkUrl && body.apkUrl !== existing.apkUrl && existing.apkUrl) {
      const oldFilename = existing.apkUrl.replace("/apks/", "");
      const oldFilepath = path.join(process.cwd(), "public", "apks", oldFilename);
      try {
        await unlink(oldFilepath);
      } catch {
        // File may not exist on disk; ignore
      }
    }

    const updated = updateApp(id, body);
    if (!updated) {
      return NextResponse.json({ error: "App not found" }, { status: 404 });
    }
    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update app" },
      { status: 400 }
    );
  }
}

// DELETE /api/apps/[id] - Delete an app
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const existing = getApp(id);
  if (!existing) {
    return NextResponse.json({ error: "App not found" }, { status: 404 });
  }

  // P1: Clean up APK file before deleting the app record
  if (existing.apkUrl) {
    const filename = existing.apkUrl.replace("/apks/", "");
    const filepath = path.join(process.cwd(), "public", "apks", filename);
    try {
      await unlink(filepath);
    } catch {
      // File may not exist on disk; ignore
    }
  }

  const deleted = deleteApp(id);
  if (!deleted) {
    return NextResponse.json({ error: "App not found" }, { status: 404 });
  }
  return NextResponse.json({ success: true });
}
