"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { services } from "@/lib/data";
import type { ServicePackage } from "@/types";

export default function ServicesPage() {
  const [packages, setPackages] = useState<ServicePackage[]>([]);

  useEffect(() => {
    fetch("/api/admin/monetization")
      .then((res) => res.json())
      .then((data) => {
        if (data?.servicePackages) setPackages(data.servicePackages);
      })
      .catch(() => {});
  }, []);
  return (
    <div className="min-h-screen pt-24 pb-20">
      {/* Header */}
      <section className="py-16 bg-gray-50 dark:bg-[#0a0a0f] border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Our Services</h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl">
            Comprehensive software development and cybersecurity services tailored to your business needs
          </p>
        </div>
      </section>

      {/* Services List */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          {services.map((service, index) => (
            <div
              key={service.id}
              id={service.id}
              className={`flex flex-col ${
                index % 2 === 0 ? "lg:flex-row" : "lg:flex-row-reverse"
              } gap-8 lg:gap-16 items-center`}
            >
              {/* Icon & Info */}
              <div className="flex-1">
                <div className="text-6xl mb-6">{service.icon}</div>
                <h2 className="text-3xl font-bold mb-3">{service.title}</h2>
                <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">{service.description}</p>

                <div className="space-y-3 mb-8">
                  {service.features.map((feature) => (
                    <div key={feature} className="flex items-center gap-3">
                      <div className="w-6 h-6 bg-indigo-100 dark:bg-indigo-900/30 rounded-full flex items-center justify-center text-indigo-600 dark:text-indigo-400 shrink-0">
                        <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                    </div>
                  ))}
                </div>

                <Link
                  href="/contact"
                  className="inline-flex px-6 py-3 text-sm font-semibold text-white bg-gradient-to-r from-indigo-600 to-cyan-500 rounded-xl hover:from-indigo-700 hover:to-cyan-600 transition-all duration-200 shadow-lg shadow-indigo-500/25"
                >
                  {service.cta}
                </Link>
              </div>

              {/* Visual */}
              <div className="flex-1 w-full">
                <div className="aspect-video bg-gradient-to-br from-indigo-100 to-cyan-100 dark:from-indigo-900/30 dark:to-cyan-900/30 rounded-2xl border border-gray-200 dark:border-gray-800 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-8xl mb-4">{service.icon}</div>
                    <div className="text-lg font-semibold text-gray-600 dark:text-gray-400">{service.title}</div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Service Packages from Monetization Config */}
      {packages.length > 0 && (
        <section className="py-20 lg:py-28 bg-gray-50 dark:bg-[#0a0a0f]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Service Packages</h2>
              <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                Fixed-price packages for common needs
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {packages.map((pkg) => (
                <div
                  key={pkg.id}
                  className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6 hover:border-indigo-500/50 hover:shadow-xl transition-all duration-300 flex flex-col"
                >
                  <div className="mb-4">
                    <span className={`inline-block px-3 py-1 text-xs font-medium rounded-full ${
                      pkg.category === "security"
                        ? "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400"
                        : pkg.category === "development"
                        ? "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                        : "bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400"
                    }`}>
                      {pkg.category.charAt(0).toUpperCase() + pkg.category.slice(1)}
                    </span>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{pkg.name}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 flex-1">{pkg.description}</p>
                  <div className="text-2xl font-bold mb-4">
                    {pkg.price > 0 ? `$${pkg.price}` : "Custom Pricing"}
                  </div>
                  {pkg.features.length > 0 && (
                    <ul className="space-y-2 mb-6">
                      {pkg.features.map((feature) => (
                        <li key={feature} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                          <svg className="w-4 h-4 text-green-500 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  )}
                  <Link
                    href="/contact"
                    className="block w-full text-center px-4 py-3 text-sm font-semibold text-white bg-gradient-to-r from-indigo-600 to-cyan-500 rounded-xl hover:from-indigo-700 hover:to-cyan-600 transition-all duration-200 shadow-lg shadow-indigo-500/25"
                  >
                    {pkg.cta || "Get Started"}
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="py-16 bg-gray-50 dark:bg-[#0a0a0f] border-y border-gray-200 dark:border-gray-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Not Sure Which Service You Need?</h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
            Schedule a free consultation and we&rsquo;ll help you find the right solution.
          </p>
          <Link
            href="/contact"
            className="inline-flex px-8 py-4 text-lg font-semibold text-white bg-gradient-to-r from-indigo-600 to-cyan-500 rounded-xl hover:from-indigo-700 hover:to-cyan-600 transition-all duration-200 shadow-xl shadow-indigo-500/25"
          >
            Get Free Consultation
          </Link>
        </div>
      </section>
    </div>
  );
}
