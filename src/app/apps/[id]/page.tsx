"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import type { App } from "@/types";
import AdSlot from "@/components/AdSlot";

export default function AppDetailPage() {
  const params = useParams();
  const [app, setApp] = useState<App | null>(null);
  const [relatedApps, setRelatedApps] = useState<App[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadApp() {
      try {
        const res = await fetch(`/api/apps/${params.id}`);
        if (res.ok) {
          const data = await res.json();
          setApp(data);
          // Load related apps
          const allRes = await fetch("/api/apps");
          const allApps: App[] = await allRes.json();
          setRelatedApps(allApps.filter((a) => a.category === data.category && a.id !== data.id).slice(0, 3));
        }
      } catch (err) {
        console.error("Failed to load app", err);
      } finally {
        setLoading(false);
      }
    }
    loadApp();
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!app) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">📱</div>
          <h1 className="text-2xl font-bold mb-2">App Not Found</h1>
          <p className="text-gray-500 dark:text-gray-400 mb-6">The application you&rsquo;re looking for doesn&rsquo;t exist.</p>
          <Link
            href="/apps"
            className="px-6 py-3 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Browse Apps
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-20">
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <nav className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
          <Link href="/" className="hover:text-indigo-600 dark:hover:text-indigo-400">Home</Link>
          <span>/</span>
          <Link href="/apps" className="hover:text-indigo-600 dark:hover:text-indigo-400">Apps</Link>
          <span>/</span>
          <span className="text-gray-900 dark:text-white">{app.name}</span>
        </nav>
      </div>

      {/* App Banner */}
      <section className="py-8 bg-gray-50 dark:bg-[#0a0a0f] border-y border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            <div className="w-20 h-20 md:w-24 md:h-24 bg-gradient-to-br from-indigo-500 to-cyan-500 rounded-2xl flex items-center justify-center text-white text-3xl md:text-4xl font-bold shrink-0">
              {app.name.charAt(0)}
            </div>
            <div className="flex-1">
              <h1 className="text-3xl md:text-4xl font-bold mb-2">{app.name}</h1>
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                <span className="px-3 py-1 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-full font-medium">
                  {app.category}
                </span>
                <span>v{app.version}</span>
                <span>{app.downloads.toLocaleString()} downloads</span>
                <span>Updated: {app.updatedDate}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-12">
            {/* Description */}
            <div>
              <h2 className="text-2xl font-bold mb-4">About</h2>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{app.description}</p>
            </div>

            {/* Screenshots Gallery */}
            <div>
              <h2 className="text-2xl font-bold mb-4">Screenshots</h2>
              <div className="grid grid-cols-2 gap-4">
                {app.screenshots.map((screenshot, index) => (
                  <div
                    key={index}
                    className="aspect-video bg-gray-100 dark:bg-gray-800 rounded-xl flex items-center justify-center text-gray-400 border border-gray-200 dark:border-gray-800"
                  >
                    <div className="text-center">
                      <svg className="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span className="text-sm">Screenshot {index + 1}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Features */}
            <div>
              <h2 className="text-2xl font-bold mb-4">Features</h2>
              <div className="grid sm:grid-cols-2 gap-3">
                {app.features.map((feature) => (
                  <div key={feature} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                    <div className="w-6 h-6 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center text-green-600 dark:text-green-400 shrink-0">
                      <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="text-sm font-medium">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Requirements */}
            <div>
              <h2 className="text-2xl font-bold mb-4">Requirements</h2>
              <ul className="space-y-2">
                {app.requirements.map((req) => (
                  <li key={req} className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                    <svg className="w-4 h-4 text-gray-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {req}
                  </li>
                ))}
              </ul>
            </div>

            {/* Changelog */}
            <div>
              <h2 className="text-2xl font-bold mb-4">Changelog</h2>
              <div className="space-y-4">
                {app.changelog.map((entry) => (
                  <div
                    key={entry.version}
                    className="p-4 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-semibold">v{entry.version}</span>
                      <span className="text-sm text-gray-500">{entry.date}</span>
                    </div>
                    <ul className="space-y-1">
                      {entry.changes.map((change) => (
                        <li key={change} className="text-sm text-gray-600 dark:text-gray-400 flex items-start gap-2">
                          <span className="text-indigo-500 mt-0.5">•</span>
                          {change}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            {/* FAQ */}
            <div>
              <h2 className="text-2xl font-bold mb-4">FAQ</h2>
              <div className="space-y-3">
                {app.faq.map((item) => (
                  <details
                    key={item.question}
                    className="group p-4 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800"
                  >
                    <summary className="flex items-center justify-between cursor-pointer font-medium text-sm">
                      {item.question}
                      <svg
                        className="w-4 h-4 text-gray-400 group-open:rotate-180 transition-transform"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </summary>
                    <p className="mt-3 text-sm text-gray-600 dark:text-gray-400">{item.answer}</p>
                  </details>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Ad Slot - App Detail Sidebar */}
            <AdSlot slot="appDetail" format="rectangle" />
            {/* Download Card */}
            <div id="download" className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6 sticky top-28">
              <h3 className="font-semibold text-lg mb-4">Download</h3>
              <div className="text-center mb-6">
                <div className="text-5xl mb-4">📦</div>
                <div className="text-2xl font-bold mb-1">v{app.version}</div>
                <div className="text-sm text-gray-500">APK Size: {app.size}</div>
              </div>

              {app.apkUrl ? (
                <a
                  href={app.apkUrl}
                  download
                  className="block w-full text-center px-6 py-3.5 text-sm font-semibold text-white bg-gradient-to-r from-indigo-600 to-cyan-500 rounded-xl hover:from-indigo-700 hover:to-cyan-600 transition-all duration-200 shadow-lg shadow-indigo-500/25 mb-4"
                >
                  Download APK
                </a>
              ) : (
                <div className="block w-full text-center px-6 py-3.5 text-sm font-semibold text-gray-400 bg-gray-100 dark:bg-gray-800 rounded-xl mb-4 cursor-not-allowed">
                  APK Not Available
                </div>
              )}

              {/* Safety Verification */}
              <div className="space-y-2 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                <h4 className="text-sm font-semibold mb-3">Safety Verification</h4>
                {[
                  { label: "Virus Scanned", passed: app.safety.virusScanned },
                  { label: "Secure Download", passed: app.safety.secureDownload },
                ].map((item) => (
                  <div key={item.label} className="flex items-center gap-2 text-sm">
                    <svg
                      className={`w-4 h-4 ${item.passed ? "text-green-500" : "text-red-500"}`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d={item.passed
                          ? "M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          : "M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                        }
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-gray-600 dark:text-gray-400">{item.label}</span>
                  </div>
                ))}
                <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                  <div className="text-xs text-gray-500 break-all font-mono">
                    SHA256: {app.safety.sha256Hash.slice(0, 32)}...
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Related Applications */}
        {relatedApps.length > 0 && (
          <section className="mt-16 pt-16 border-t border-gray-200 dark:border-gray-800">
            <h2 className="text-2xl font-bold mb-8">Related Applications</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {relatedApps.map((related) => (
                <Link
                  key={related.id}
                  href={`/apps/${related.id}`}
                  className="group bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6 hover:border-indigo-500/50 hover:shadow-xl transition-all duration-300"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-cyan-500 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                      {related.name.charAt(0)}
                    </div>
                    <div>
                      <div className="font-semibold text-sm group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                        {related.name}
                      </div>
                      <div className="text-xs text-gray-500">{related.category}</div>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2">{related.shortDescription}</p>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
