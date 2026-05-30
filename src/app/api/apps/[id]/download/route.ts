import { NextRequest, NextResponse } from "next/server";
import { getApp, updateApp } from "@/lib/store/db";

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

  // P1: Increment download count
  const currentDownloads = app.downloads || 0;
  updateApp(id, { downloads: currentDownloads + 1 });

  // Return the full download URL (file is hosted on uploads.resultscaleai.com)
  return NextResponse.json({
    url: app.apkUrl,
    filename: app.apkUrl.split("/").pop() || "app.apk",
  });
}
