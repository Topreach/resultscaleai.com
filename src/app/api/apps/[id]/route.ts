import { NextRequest, NextResponse } from "next/server";
import { getApp, updateApp, deleteApp } from "@/lib/store/db";

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
  const deleted = deleteApp(id);
  if (!deleted) {
    return NextResponse.json({ error: "App not found" }, { status: 404 });
  }
  return NextResponse.json({ success: true });
}
