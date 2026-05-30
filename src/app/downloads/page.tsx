"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import type { App } from "@/types";
import AdSlot from "@/components/AdSlot";

export default function DownloadsPage() {
  const [apps, setApps] = useState<App[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/apps")
      .then((res) => res.json())
      .then((data) => setApps(data))
      .catch((err) => console.error("Failed to load apps", err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen pt-24 pb-20">
      {/* Header */}
      <section className="py-16 bg-gray-50 dark:bg-[#0a0a0f] border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Download Center</h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl">
            Central location for APK downloads, release notes, and installation guides
          </p>
        </div>
      </section>

      {/* All Downloads */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-4">
            {apps.map((app) => (
              <div
                key={app.id}
                className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-6 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 hover:border-indigo-500/50 hover:shadow-lg transition-all duration-300"
              >
                <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-cyan-500 rounded-xl flex items-center justify-center text-white text-xl font-bold shrink-0">
                  {app.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold">{app.name}</h3>
                  <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
                    <span>v{app.version}</span>
                    <span>{app.size}</span>
                    <span>Updated: {app.updatedDate}</span>
                    <span>{app.downloads.toLocaleString()} downloads</span>
                  </div>
                </div>
                <div className="flex gap-2 w-full sm:w-auto">
                  <Link
                    href={`/apps/${app.id}`}
                    className="flex-1 sm:flex-none text-center px-4 py-2.5 text-sm font-medium text-indigo-600 dark:text-indigo-400 border border-indigo-600 dark:border-indigo-400 rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-900/30 transition-colors"
                  >
                    Release Notes
                  </Link>
                  {app.apkUrl ? (
                    <a
                      href={app.apkUrl}
                      download
                      onClick={() => {
                        // P1: Track download asynchronously
                        fetch(`/api/apps/${app.id}/download`, { method: "POST" }).catch(() => {});
                      }}
                      className="flex-1 sm:flex-none text-center px-4 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-indigo-600 to-cyan-500 rounded-lg hover:from-indigo-700 hover:to-cyan-600 transition-all duration-200"
                    >
                      Download APK
                    </a>
                  ) : (
                    <Link
                      href={`/apps/${app.id}#download`}
                      className="flex-1 sm:flex-none text-center px-4 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-indigo-600 to-cyan-500 rounded-lg hover:from-indigo-700 hover:to-cyan-600 transition-all duration-200"
                    >
                      Download APK
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Ad Slot - Downloads Page */}
      <AdSlot slot="downloads" format="leaderboard" className="py-8" />

      {/* Installation Guide */}
      <section className="py-16 bg-gray-50 dark:bg-[#0a0a0f]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold mb-8">Installation Guide</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { step: "1", title: "Download APK", desc: "Click the Download APK button for your desired app." },
              { step: "2", title: "Enable Unknown Sources", desc: "Go to Settings > Security > Enable Unknown Sources on your Android device." },
              { step: "3", title: "Install & Enjoy", desc: "Open the downloaded APK file and follow the installation prompts." },
            ].map((item) => (
              <div key={item.step} className="p-6 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800">
                <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-bold mb-4">
                  {item.step}
                </div>
                <h3 className="font-semibold mb-2">{item.title}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Previous Versions */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold mb-4">Previous Versions</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            Need an older version? Contact us and we&rsquo;ll help you find the right release.
          </p>
          <Link
            href="/contact"
            className="inline-flex px-6 py-3 text-sm font-semibold text-white bg-gradient-to-r from-indigo-600 to-cyan-500 rounded-xl hover:from-indigo-700 hover:to-cyan-600 transition-all duration-200 shadow-lg shadow-indigo-500/25"
          >
            Request Previous Version
          </Link>
        </div>
      </section>
    </div>
  );
}
