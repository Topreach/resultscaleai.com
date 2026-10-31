import { validPost } from "@/lib/validation";
import { getSession } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";
import { getBlogPost, getBlogPosts, updateBlogPost, deleteBlogPost } from "@/lib/store/db";

// GET /api/blog/[id] - Get a single blog post
export async function GET(
  request: NextRequest,
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
  if (!getSession(request)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  try {
    const body = await request.json();
    const existing = getBlogPosts().find((post) => post.id === id);
    if (!existing) return NextResponse.json({ error: "Post not found" }, { status: 404 });
    if (!validPost({ ...existing, ...body, id })) return NextResponse.json({ error: "Invalid post data" }, { status: 400 });
    if (getBlogPosts().some((p) => p.slug === body.slug && p.id !== id)) return NextResponse.json({ error: "This slug is already in use" }, { status: 409 });
    const updated = updateBlogPost(id, { ...body, id });
    if (!updated) {
      return NextResponse.json({ error: "Blog post not found" }, { status: 404 });
    }
    return NextResponse.json(updated);
  } catch {
    return NextResponse.json(
      { error: "Failed to update blog post" },
      { status: 400 }
    );
  }
}

// DELETE /api/blog/[id] - Delete a blog post
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!getSession(request)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const deleted = deleteBlogPost(id);
  if (!deleted) {
    return NextResponse.json({ error: "Blog post not found" }, { status: 404 });
  }
  return NextResponse.json({ success: true });
}
