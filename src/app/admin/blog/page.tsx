"use client";

import { useState, useEffect } from "react";
import { BlogPost, BlogCategory } from "@/types";

const emptyPost = {
  id: "",
  slug: "",
  title: "",
  excerpt: "",
  content: "",
  category: "Mobile Development" as BlogCategory,
  author: "Admin",
  date: "",
  readTime: "5 min read",
  image: "",
  tags: [] as string[],
};

const categories: BlogCategory[] = [
  "Mobile Development", "AI", "Web Development",
  "Cybersecurity", "Software Engineering", "Tutorials",
];

export default function AdminBlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<BlogPost>({ ...emptyPost });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [tagInput, setTagInput] = useState("");

  useEffect(() => {
    const loadPosts = async () => {
      try {
        const res = await fetch("/api/blog");
        const data = await res.json();
        setPosts(data);
      } catch (err) {
        console.error("Failed to fetch posts", err);
      } finally {
        setLoading(false);
      }
    };
    loadPosts();
  }, []);

  const resetForm = () => {
    setForm({ ...emptyPost });
    setEditingId(null);
    setShowForm(false);
    setMessage("");
    setTagInput("");
  };

  const handleEdit = (post: BlogPost) => {
    setForm({ ...post });
    setEditingId(post.id);
    setShowForm(true);
    setMessage("");
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this post?")) return;
    try {
      const res = await fetch(`/api/blog/${id}`, { method: "DELETE" });
      if (res.ok) {
        setPosts(posts.filter((p) => p.id !== id));
        setMessage("Post deleted successfully");
      }
    } catch (err) {
      console.error("Failed to delete post", err);
    }
  };

  const addTag = () => {
    const tag = tagInput.trim();
    if (tag && !form.tags.includes(tag)) {
      setForm({ ...form, tags: [...form.tags, tag] });
      setTagInput("");
    }
  };

  const removeTag = (index: number) => {
    setForm({ ...form, tags: form.tags.filter((_, i) => i !== index) });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage("");

    try {
      const postData = {
        ...form,
        id: editingId || Date.now().toString(),
        slug: form.slug || form.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
        date: form.date || new Date().toISOString().split("T")[0],
      };

      let res;
      if (editingId) {
        res = await fetch(`/api/blog/${editingId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(postData),
        });
      } else {
        res = await fetch("/api/blog", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(postData),
        });
      }

      if (res.ok) {
        setMessage(editingId ? "Post updated successfully" : "Post created successfully");
        resetForm();
        // Reload posts
        const updatedRes = await fetch("/api/blog");
        const updatedData = await updatedRes.json();
        setPosts(updatedData);
      } else {
        const err = await res.json();
        setMessage(err.error || "Failed to save post");
      }
    } catch (err) {
      setMessage("Failed to save post");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-24 pb-20 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Blog Management</h1>
            <p className="text-gray-600 dark:text-gray-400">Create and manage blog posts</p>
          </div>
          <button
            onClick={() => { resetForm(); setShowForm(true); }}
            className="px-4 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-indigo-600 to-cyan-500 rounded-lg hover:from-indigo-700 hover:to-cyan-600 transition-all duration-200"
          >
            + New Post
          </button>
        </div>

        {message && (
          <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl text-sm text-green-600 dark:text-green-400">
            {message}
          </div>
        )}

        {/* Create/Edit Form */}
        {showForm && (
          <div className="mb-8 p-6 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800">
            <h2 className="text-xl font-bold mb-6">
              {editingId ? "Edit Post" : "New Blog Post"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Title</label>
                  <input
                    type="text"
                    required
                    value={form.title}
                    onChange={(e) => {
                      const title = e.target.value;
                      setForm({
                        ...form,
                        title,
                        slug: title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
                      });
                    }}
                    className="w-full px-4 py-2.5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Post Title"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Category</label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value as BlogCategory })}
                    className="w-full px-4 py-2.5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    {categories.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Author</label>
                  <input
                    type="text"
                    required
                    value={form.author}
                    onChange={(e) => setForm({ ...form, author: e.target.value })}
                    className="w-full px-4 py-2.5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Author name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Read Time</label>
                  <input
                    type="text"
                    value={form.readTime}
                    onChange={(e) => setForm({ ...form, readTime: e.target.value })}
                    className="w-full px-4 py-2.5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="5 min read"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Slug (URL)</label>
                <input
                  type="text"
                  required
                  value={form.slug}
                  onChange={(e) => setForm({ ...form, slug: e.target.value })}
                  className="w-full px-4 py-2.5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="my-blog-post"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Excerpt</label>
                <textarea
                  required
                  rows={2}
                  value={form.excerpt}
                  onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
                  className="w-full px-4 py-2.5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                  placeholder="Brief excerpt for cards..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Content (HTML)</label>
                <textarea
                  required
                  rows={10}
                  value={form.content}
                  onChange={(e) => setForm({ ...form, content: e.target.value })}
                  className="w-full px-4 py-2.5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none font-mono text-sm"
                  placeholder="<p>Write your blog content in HTML...</p>"
                />
              </div>

              {/* Tags */}
              <div>
                <label className="block text-sm font-medium mb-2">Tags</label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {form.tags.map((t, i) => (
                    <span key={i} className="inline-flex items-center gap-1 px-3 py-1 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 rounded-full text-sm">
                      {t}
                      <button type="button" onClick={() => removeTag(i)} className="hover:text-red-500">&times;</button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addTag(); } }}
                    className="flex-1 px-4 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                    placeholder="Type a tag and press Enter"
                  />
                  <button type="button" onClick={addTag} className="px-4 py-2 text-sm bg-gray-100 dark:bg-gray-800 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700">
                    Add
                  </button>
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-indigo-600 to-cyan-500 rounded-xl hover:from-indigo-700 hover:to-cyan-600 transition-all disabled:opacity-50"
                >
                  {saving ? "Saving..." : editingId ? "Update Post" : "Create Post"}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-6 py-2.5 text-sm font-medium text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-all"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Posts Table */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-800">
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-500">Title</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-500">Category</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-500">Author</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-500">Date</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-500">Status</th>
                <th className="text-right px-6 py-4 text-sm font-semibold text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody>
              {posts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                    No blog posts yet. Click &ldquo;+ New Post&rdquo; to create one.
                  </td>
                </tr>
              ) : (
                posts.map((post) => (
                  <tr key={post.id} className="border-b border-gray-100 dark:border-gray-800 last:border-0">
                    <td className="px-6 py-4 font-medium max-w-xs truncate">{post.title}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{post.category}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{post.author}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{post.date}</td>
                    <td className="px-6 py-4">
                      <span className="px-2.5 py-1 text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full">
                        Published
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleEdit(post)}
                          className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(post.id)}
                          className="text-sm text-red-600 dark:text-red-400 hover:underline"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
