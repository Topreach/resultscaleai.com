"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import type { BlogPost } from "@/types";

export default function BlogPostPage() {
  const params = useParams();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPost() {
      try {
        const res = await fetch("/api/blog");
        if (res.ok) {
          const allPosts: BlogPost[] = await res.json();
          const found = allPosts.find((p) => p.slug === params.slug);
          if (found) {
            setPost(found);
            setRelatedPosts(allPosts.filter((p) => p.category === found.category && p.id !== found.id).slice(0, 3));
          }
        }
      } catch (err) {
        console.error("Failed to load post", err);
      } finally {
        setLoading(false);
      }
    }
    loadPost();
  }, [params.slug]);

  if (loading) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">📝</div>
          <h1 className="text-2xl font-bold mb-2">Post Not Found</h1>
          <p className="text-gray-500 dark:text-gray-400 mb-6">The article you&rsquo;re looking for doesn&rsquo;t exist.</p>
          <Link
            href="/blog"
            className="px-6 py-3 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Browse Blog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-20">
      {/* Breadcrumb */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <nav className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
          <Link href="/" className="hover:text-indigo-600 dark:hover:text-indigo-400">Home</Link>
          <span>/</span>
          <Link href="/blog" className="hover:text-indigo-600 dark:hover:text-indigo-400">Blog</Link>
          <span>/</span>
          <span className="text-gray-900 dark:text-white truncate">{post.title}</span>
        </nav>
      </div>

      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <header className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <span className="px-3 py-1 text-sm font-medium bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-full">
              {post.category}
            </span>
            <span className="text-sm text-gray-400">{post.readTime}</span>
          </div>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">{post.title}</h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">{post.excerpt}</p>
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <span>{post.author}</span>
            <span>{post.date}</span>
          </div>
        </header>

        {/* Featured Image */}
        <div className="aspect-video bg-gradient-to-br from-indigo-100 to-cyan-100 dark:from-indigo-900/20 dark:to-cyan-900/20 rounded-2xl mb-12 flex items-center justify-center border border-gray-200 dark:border-gray-800">
          <div className="text-8xl">
            {post.category === "AI" ? "🤖" : post.category === "Cybersecurity" ? "🛡️" : post.category === "Web Development" ? "🌐" : post.category === "Mobile Development" ? "📱" : "💻"}
          </div>
        </div>

        {/* Content */}
        <div className="prose prose-lg dark:prose-invert max-w-none mb-12">
          <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
            {post.content}
          </p>
          <div className="mt-8 p-6 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800">
            <p className="text-gray-500 dark:text-gray-400 italic">
              This is a sample article. In production, this would contain the full blog post content with rich formatting,
              code snippets, images, and more.
            </p>
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-12">
          {post.tags.map((tag) => (
            <span
              key={tag}
              className="px-3 py-1.5 text-sm bg-gray-100 dark:bg-gray-800 rounded-lg text-gray-600 dark:text-gray-400"
            >
              #{tag}
            </span>
          ))}
        </div>
      </article>

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 pt-16 border-t border-gray-200 dark:border-gray-800">
          <h2 className="text-2xl font-bold mb-8">Related Articles</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {relatedPosts.map((related) => (
              <Link
                key={related.id}
                href={`/blog/${related.slug}`}
                className="group bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6 hover:border-indigo-500/50 hover:shadow-xl transition-all duration-300"
              >
                <div className="text-xs font-medium text-indigo-600 dark:text-indigo-400 mb-2 uppercase tracking-wider">
                  {related.category}
                </div>
                <h3 className="font-semibold group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors mb-2">
                  {related.title}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">{related.excerpt}</p>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
