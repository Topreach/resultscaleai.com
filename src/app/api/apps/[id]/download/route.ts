import { NextRequest, NextResponse } from "next/server";
import { getApp, updateApp } from "@/lib/store/db";
import path from "path";
import fs from "fs";

// POST /api/apps/[id]/download - Increment download count and return file URL
export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const app = getApp(id);

  if (!app) {
    return NextResponse.json({ error: "App not found" }, { status: 404 });
  }

  if (!app.apkUrl) {
    return NextResponse.json({ error: "No APK available for this app" }, { status: 404 });
  }

  // Verify the file actually exists on disk
  const filename = app.apkUrl.replace("/apks/", "");
  const filepath = path.join(process.cwd(), "public", "apks", filename);
  if (!fs.existsSync(filepath)) {
    return NextResponse.json({ error: "APK file not found on server" }, { status: 404 });
  }

  // P1: Increment download count
  const currentDownloads = app.downloads || 0;
  updateApp(id, { downloads: currentDownloads + 1 });

  return NextResponse.json({
    url: app.apkUrl,
    filename: filename,
  });
}
