import { NextRequest, NextResponse } from "next/server";
import { getBlogPost, updateBlogPost, deleteBlogPost } from "@/lib/store/db";

// GET /api/blog/[id] - Get a single blog post
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const post = getBlogPost(id);
  if (!post) {
    return NextResponse.json({ error: "Blog post not found" }, { status: 404 });
  }
  return NextResponse.json(post);
}

// PUT /api/blog/[id] - Update a blog post
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const body = await request.json();
    const updated = updateBlogPost(id, body);
    if (!updated) {
      return NextResponse.json({ error: "Blog post not found" }, { status: 404 });
    }
    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update blog post" },
      { status: 400 }
    );
  }
}

// DELETE /api/blog/[id] - Delete a blog post
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const deleted = deleteBlogPost(id);
  if (!deleted) {
    return NextResponse.json({ error: "Blog post not found" }, { status: 404 });
  }
  return NextResponse.json({ success: true });
}
