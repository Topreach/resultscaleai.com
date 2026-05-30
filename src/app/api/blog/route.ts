import { NextRequest, NextResponse } from "next/server";
import { getBlogPosts, createBlogPost } from "@/lib/store/db";

// GET /api/blog - List all blog posts
export async function GET() {
  const posts = getBlogPosts();
  return NextResponse.json(posts);
}

// POST /api/blog - Create a new blog post
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const post = createBlogPost(body);
    return NextResponse.json(post, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create blog post" },
      { status: 400 }
    );
  }
}
