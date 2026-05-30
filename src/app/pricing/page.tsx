"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import type { MonetizationConfig, SubscriptionTier } from "@/types";

export default function PricingPage() {
  const [config, setConfig] = useState<MonetizationConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [interval, setInterval] = useState<"month" | "year">("month");

  useEffect(() => {
    fetch("/api/admin/monetization")
      .then((res) => res.json())
      .then((data) => {
        setConfig(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen pt-24 pb-20 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const tiers = config?.subscriptions || [];
  const premiumApps = config?.premiumApps;
  const servicePackages = config?.servicePackages || [];

  return (
    <div className="min-h-screen pt-24 pb-20">
      {/* Header */}
      <section className="py-16 bg-gray-50 dark:bg-[#0a0a0f] border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">
            <span className="bg-linear-to-r from-indigo-600 to-cyan-500 bg-clip-text text-transparent">
              Pricing
            </span>
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Choose the plan that fits your needs. All plans include access to our core platform.
          </p>
        </div>
      </section>

      {/* Subscription Tiers */}
      {tiers.length > 0 && (
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-center mb-10">
              <div className="inline-flex items-center bg-gray-100 dark:bg-gray-800 rounded-xl p-1">
                <button
                  onClick={() => setInterval("month")}
                  className={`px-6 py-2 text-sm font-medium rounded-lg transition-all ${
                    interval === "month"
                      ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm"
                      : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                  }`}
                >
                  Monthly
                </button>
                <button
                  onClick={() => setInterval("year")}
                  className={`px-6 py-2 text-sm font-medium rounded-lg transition-all ${
                    interval === "year"
                      ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm"
                      : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                  }`}
                >
                  Annual <span className="text-green-500 text-xs">Save 20%</span>
                </button>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {tiers.map((tier: SubscriptionTier) => (
                <div
                  key={tier.id}
                  className={`relative rounded-2xl border p-8 transition-all duration-300 ${
                    tier.highlighted
                      ? "border-indigo-500 dark:border-indigo-400 bg-white dark:bg-gray-900 shadow-xl scale-105"
                      : "border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 hover:shadow-lg"
                  }`}
                >
                  {tier.highlighted && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-linear-to-r from-indigo-600 to-cyan-500 rounded-full text-xs font-semibold text-white">
                      Most Popular
                    </div>
                  )}
                  <div className="text-center mb-8">
                    <h3 className="text-xl font-bold mb-2">{tier.name}</h3>
                    <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">{tier.description}</p>
                    <div className="flex items-baseline justify-center gap-1">
                      <span className="text-4xl font-bold">
                        ${interval === "year" ? (tier.price * 10).toFixed(0) : tier.price}
                      </span>
                      <span className="text-gray-400 text-sm">
                        /{interval === "month" ? "month" : "year"}
                      </span>
                    </div>
                    {interval === "year" && tier.price > 0 && (
                      <p className="text-xs text-green-500 mt-1">
                        ${tier.price}/mo billed annually
                      </p>
                    )}
                  </div>
                  <ul className="space-y-3 mb-8">
                    {tier.features.map((feature: string, i: number) => (
                      <li key={i} className="flex items-start gap-3 text-sm">
                        <svg className="w-5 h-5 text-green-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Link
                    href="/contact"
                    className={`block text-center py-3 rounded-xl font-medium transition-all ${
                      tier.highlighted
                        ? "bg-linear-to-r from-indigo-600 to-cyan-500 text-white hover:from-indigo-700 hover:to-cyan-600"
                        : "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-700"
                    }`}
                  >
                    {tier.cta}
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Premium Apps */}
      {premiumApps?.enabled && (
        <section className="py-20 bg-gray-50 dark:bg-[#0a0a0f]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold mb-4">Premium Apps</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
              Get access to premium versions of our apps with advanced features.
            </p>
            <div className="max-w-sm mx-auto bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-8">
              <div className="text-4xl font-bold mb-2">
                <span className="bg-linear-to-r from-indigo-600 to-cyan-500 bg-clip-text text-transparent">
                  ${premiumApps.price}
                </span>
              </div>
              <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">per app • one-time purchase</p>
              <ul className="space-y-3 mb-8 text-left">
                <li className="flex items-start gap-3 text-sm">
                  <svg className="w-5 h-5 text-green-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Ad-free experience
                </li>
                <li className="flex items-start gap-3 text-sm">
                  <svg className="w-5 h-5 text-green-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Premium features unlocked
                </li>
                <li className="flex items-start gap-3 text-sm">
                  <svg className="w-5 h-5 text-green-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Priority updates
                </li>
                <li className="flex items-start gap-3 text-sm">
                  <svg className="w-5 h-5 text-green-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Lifetime access
                </li>
              </ul>
              <Link
                href="/apps"
                className="block text-center py-3 rounded-xl font-medium bg-linear-to-r from-indigo-600 to-cyan-500 text-white hover:from-indigo-700 hover:to-cyan-600 transition-all"
              >
                Browse Apps
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Service Packages */}
      {servicePackages.length > 0 && (
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center mb-4">Professional Services</h2>
            <p className="text-gray-600 dark:text-gray-400 text-center mb-12 max-w-2xl mx-auto">
              Expert development and cybersecurity services for your business.
            </p>
            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {servicePackages.map((pkg) => (
                <div
                  key={pkg.id}
                  className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-8 hover:shadow-lg transition-all"
                >
                  <div className="mb-6">
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold mb-3 ${
                      pkg.category === "security"
                        ? "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400"
                        : pkg.category === "development"
                        ? "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                        : "bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400"
                    }`}>
                      {pkg.category.charAt(0).toUpperCase() + pkg.category.slice(1)}
                    </span>
                    <h3 className="text-xl font-bold">{pkg.name}</h3>
                    <p className="text-gray-500 dark:text-gray-400 text-sm mt-2">{pkg.description}</p>
                  </div>
                  <div className="mb-6">
                    <span className="text-3xl font-bold">
                      {pkg.price === 0 ? "Custom" : `$${pkg.price}`}
                    </span>
                  </div>
                  <ul className="space-y-2 mb-8">
                    {pkg.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-3 text-sm">
                        <svg className="w-5 h-5 text-green-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Link
                    href="/contact"
                    className="block text-center py-3 rounded-xl font-medium bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all"
                  >
                    {pkg.cta}
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
