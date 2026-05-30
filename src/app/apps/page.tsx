"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import type { App, AppCategory } from "@/types";
import AdSlot from "@/components/AdSlot";

const categories: { value: string; label: string }[] = [
  { value: "all", label: "All Categories" },
  { value: "Productivity", label: "Productivity" },
  { value: "Business", label: "Business" },
  { value: "Finance", label: "Finance" },
  { value: "Education", label: "Education" },
  { value: "AI Tools", label: "AI Tools" },
  { value: "Security", label: "Security" },
  { value: "Utilities", label: "Utilities" },
  { value: "Entertainment", label: "Entertainment" },
];

export default function AppsPage() {
  const [apps, setApps] = useState<App[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  useEffect(() => {
    fetch("/api/apps")
      .then((res) => res.json())
      .then((data) => setApps(data))
      .catch((err) => console.error("Failed to load apps", err))
      .finally(() => setLoading(false));
  }, []);

  const filteredApps = apps.filter((app) => {
    const matchesSearch =
      app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.shortDescription.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || app.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen pt-24 pb-20">
      {/* Header */}
      <section className="py-12 bg-gray-50 dark:bg-[#0a0a0f] border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Applications</h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl">
            Discover our collection of intelligent software applications
          </p>
        </div>
      </section>

      {/* Search & Filters */}
      <section className="py-8 border-b border-gray-200 dark:border-gray-800 sticky top-16 bg-white/80 dark:bg-[#0a0a0f]/80 backdrop-blur-lg z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <svg
                className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <input
                type="text"
                placeholder="Search Apps..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              />
            </div>
          </div>

          {/* Categories */}
          <div className="flex flex-wrap gap-2 mt-4">
            {categories.map((cat) => (
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

      {/* Ad Slot - Apps Page */}
      <AdSlot slot="appDetail" format="banner" className="py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" />

      {/* Apps Grid */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {filteredApps.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold mb-2">No apps found</h3>
              <p className="text-gray-500 dark:text-gray-400">
                Try adjusting your search or filter criteria
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredApps.map((app) => (
                <div
                  key={app.id}
                  className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden hover:border-indigo-500/50 hover:shadow-xl hover:shadow-indigo-500/5 transition-all duration-300"
                >
                  <div className="p-6">
                    <div className="flex items-start gap-4 mb-4">
                      <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-cyan-500 rounded-xl flex items-center justify-center text-white text-2xl font-bold shrink-0">
                        {app.name.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-lg truncate">{app.name}</h3>
                        <span className="inline-block px-2 py-0.5 text-xs font-medium bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-full">
                          {app.category}
                        </span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                      {app.shortDescription}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400 mb-4 pb-4 border-b border-gray-100 dark:border-gray-800">
                      <span>v{app.version}</span>
                      <span>{app.size}</span>
                      <span>Updated: {app.updatedDate}</span>
                    </div>
                    <div className="flex gap-2">
                      <Link
                        href={`/apps/${app.id}`}
                        className="flex-1 text-center px-4 py-2.5 text-sm font-medium text-indigo-600 dark:text-indigo-400 border border-indigo-600 dark:border-indigo-400 rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-900/30 transition-colors"
                      >
                        Details
                      </Link>
                      <Link
                        href={`/apps/${app.id}#download`}
                        className="flex-1 text-center px-4 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-indigo-600 to-cyan-500 rounded-lg hover:from-indigo-700 hover:to-cyan-600 transition-all duration-200"
                      >
                        Download APK
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
