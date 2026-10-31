import { validPost } from "@/lib/validation";
import { getSession } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";
import { getBlogPosts, createBlogPost } from "@/lib/store/db";

// GET /api/blog - List all blog posts
export async function GET() {
  const posts = getBlogPosts();
  return NextResponse.json(posts);
}

// POST /api/blog - Create a new blog post
export async function POST(request: NextRequest) {
  if (!getSession(request)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const body = await request.json();
    if (!validPost(body)) return NextResponse.json({ error: "Invalid or incomplete data" }, { status: 400 });
    if (getBlogPosts().some((post) => post.id === body.id || post.slug === body.slug)) return NextResponse.json({ error: "Post ID or slug already exists" }, { status: 409 });
    const post = createBlogPost(body);
    return NextResponse.json(post, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Failed to create blog post" },
      { status: 400 }
    );
  }
}
