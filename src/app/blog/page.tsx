"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import type { BlogPost } from "@/types";
import AdSlot from "@/components/AdSlot";

const blogCategories: { value: string; label: string }[] = [
  { value: "all", label: "All Posts" },
  { value: "Mobile Development", label: "Mobile Development" },
  { value: "AI", label: "AI" },
  { value: "Web Development", label: "Web Development" },
  { value: "Cybersecurity", label: "Cybersecurity" },
  { value: "Software Engineering", label: "Software Engineering" },
  { value: "Tutorials", label: "Tutorials" },
];

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  useEffect(() => {
    fetch("/api/blog")
      .then((res) => res.json())
      .then((data) => setPosts(data))
      .catch((err) => console.error("Failed to load posts", err))
      .finally(() => setLoading(false));
  }, []);

  const filteredPosts = posts.filter(
    (post) => selectedCategory === "all" || post.category === selectedCategory
  );

  return (
    <div className="min-h-screen pt-24 pb-20">
      {/* Header */}
      <section className="py-16 bg-gray-50 dark:bg-[#0a0a0f] border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Knowledge Center</h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl">
            Insights, tutorials, and updates from the ResultScale AI team
          </p>
        </div>
      </section>

      {/* Categories */}
      <section className="py-6 border-b border-gray-200 dark:border-gray-800 sticky top-16 bg-white/80 dark:bg-[#0a0a0f]/80 backdrop-blur-lg z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap gap-2">
            {blogCategories.map((cat) => (
              <button
                key={cat.value}
                onClick={() => setSelectedCategory(cat.value)}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
                  selectedCategory === cat.value
                    ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/25"
                    : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Ad Slot - Blog Sidebar */}
      <AdSlot slot="blogSidebar" format="rectangle" className="py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" />

      {/* Blog Posts */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {filteredPosts.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">📝</div>
              <h3 className="text-xl font-semibold mb-2">No posts found</h3>
              <p className="text-gray-500 dark:text-gray-400">Try selecting a different category</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPosts.map((post) => (
                <Link
                  key={post.id}
                  href={`/blog/${post.slug}`}
                  className="group bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden hover:border-indigo-500/50 hover:shadow-xl transition-all duration-300"
                >
                  <div className="aspect-video bg-gradient-to-br from-indigo-100 to-cyan-100 dark:from-indigo-900/20 dark:to-cyan-900/20 flex items-center justify-center">
                    <div className="text-6xl">
                      {post.category === "AI" ? "🤖" : post.category === "Cybersecurity" ? "🛡️" : post.category === "Web Development" ? "🌐" : post.category === "Mobile Development" ? "📱" : "💻"}
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="px-2.5 py-1 text-xs font-medium bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-full">
                        {post.category}
                      </span>
                      <span className="text-xs text-gray-400">{post.readTime}</span>
                    </div>
                    <h3 className="font-semibold text-lg mb-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-2">
                      {post.title}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 line-clamp-2">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center justify-between text-xs text-gray-400">
                      <span>{post.date}</span>
                      <span>{post.author}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
