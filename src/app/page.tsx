"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { services, testimonials, stats } from "@/lib/data";
import type { App } from "@/types";
import AdSlot from "@/components/AdSlot";

export default function HomePage() {
  const [apps, setApps] = useState<App[]>([]);
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  useEffect(() => {
    fetch("/api/apps")
      .then((res) => res.json())
      .then((data) => setApps(data))
      .catch(() => {});
  }, []);

  return (
    <div className="min-h-screen">
      {/* ===== HERO SECTION ===== */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-950 via-gray-900 to-cyan-950" />
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500 rounded-full blur-[128px] animate-float" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-cyan-500 rounded-full blur-[128px] animate-float stagger-3" />
        </div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMSIvPjwvZz48L2c+PC9zdmc+')] opacity-50" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="animate-fade-in">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-sm text-gray-300 mb-8">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              Building the Future of Software
            </div>
          </div>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-6 animate-fade-in-up">
            <span className="gradient-text">ResultScale</span>
            <br />
            <span className="text-white">AI</span>
          </h1>

          <p className="text-xl md:text-2xl text-gray-300 mb-4 max-w-3xl mx-auto animate-fade-in-up stagger-2">
            Building Intelligent Software Solutions
          </p>
          <p className="text-lg text-gray-400 mb-10 max-w-2xl mx-auto animate-fade-in-up stagger-3">
            for Businesses and Individuals
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up stagger-4">
            <Link
              href="/apps"
              className="px-8 py-4 text-lg font-semibold text-white bg-gradient-to-r from-indigo-600 to-cyan-500 rounded-xl hover:from-indigo-700 hover:to-cyan-600 transition-all duration-200 shadow-xl shadow-indigo-500/25 animate-pulse-glow"
            >
              Explore Apps
            </Link>
            <Link
              href="/contact"
              className="px-8 py-4 text-lg font-semibold text-white border-2 border-white/30 rounded-xl hover:bg-white/10 transition-all duration-200"
            >
              Request a Project
            </Link>
          </div>

          {/* Stats */}
          <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto animate-fade-in-up stagger-5">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-white mb-1">{stat.value}</div>
                <div className="text-sm text-gray-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </section>

      {/* Ad Slot - Homepage Banner */}
      <AdSlot slot="homepage" format="leaderboard" className="py-8" />

      {/* ===== WHAT WE DO SECTION ===== */}
      <section className="py-20 lg:py-28 bg-gray-50 dark:bg-[#0a0a0f]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">What We Do</h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Comprehensive software solutions tailored to your needs
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, index) => (
              <Link
                key={service.id}
                href={`/services#${service.id}`}
                className="group p-6 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 hover:border-indigo-500/50 hover:shadow-xl hover:shadow-indigo-500/5 transition-all duration-300"
              >
                <div className="text-4xl mb-4">{service.icon}</div>
                <h3 className="text-xl font-semibold mb-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                  {service.title}
                </h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm">{service.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FEATURED APPLICATIONS ===== */}
      <section className="py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-2">Featured Applications</h2>
              <p className="text-gray-600 dark:text-gray-400">Discover our latest software releases</p>
            </div>
            <Link
              href="/apps"
              className="mt-4 md:mt-0 text-indigo-600 dark:text-indigo-400 font-medium hover:underline"
            >
              View All Apps &rarr;
            </Link>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {apps.slice(0, 6).map((app, index) => (
              <div
                key={app.id}
                className="group bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden hover:border-indigo-500/50 hover:shadow-xl hover:shadow-indigo-500/5 transition-all duration-300"
              >
                <div className="p-6">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-cyan-500 rounded-xl flex items-center justify-center text-white text-xl font-bold shrink-0">
                      {app.name.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-lg truncate">{app.name}</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{app.category}</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                    {app.shortDescription}
                  </p>
                  <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400 mb-4">
                    <span>v{app.version}</span>
                    <span>{app.downloads.toLocaleString()} downloads</span>
                  </div>
                  <div className="flex gap-2">
                    <Link
                      href={`/apps/${app.id}`}
                      className="flex-1 text-center px-4 py-2 text-sm font-medium text-indigo-600 dark:text-indigo-400 border border-indigo-600 dark:border-indigo-400 rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-900/30 transition-colors"
                    >
                      View Details
                    </Link>
                    <Link
                      href={`/apps/${app.id}#download`}
                      className="flex-1 text-center px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-indigo-600 to-cyan-500 rounded-lg hover:from-indigo-700 hover:to-cyan-600 transition-all duration-200"
                    >
                      Download APK
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== WHY CHOOSE US ===== */}
      <section className="py-20 lg:py-28 bg-gray-50 dark:bg-[#0a0a0f]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose Us</h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              We combine technical excellence with business understanding
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {[
              { icon: "✓", title: "Custom Development", desc: "Tailored solutions built from the ground up for your specific needs" },
              { icon: "✓", title: "Modern UI/UX", desc: "Beautiful, intuitive interfaces that users love" },
              { icon: "✓", title: "AI Integration", desc: "Cutting-edge artificial intelligence capabilities" },
              { icon: "✓", title: "Secure Architecture", desc: "Enterprise-grade security in every solution" },
              { icon: "✓", title: "Fast Delivery", desc: "Agile methodology ensuring timely delivery" },
              { icon: "✓", title: "Ongoing Support", desc: "Dedicated support and maintenance after launch" },
            ].map((item, index) => (
              <div
                key={item.title}
                className="flex items-start gap-4 p-6 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800"
              >
                <div className="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center text-green-600 dark:text-green-400 font-bold shrink-0">
                  {item.icon}
                </div>
                <div>
                  <h3 className="font-semibold mb-1">{item.title}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== TESTIMONIALS ===== */}
      <section className="py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Client Testimonials</h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              What our clients say about working with us
            </p>
          </div>

          <div className="max-w-3xl mx-auto">
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-8 md:p-10">
              <div className="flex items-center gap-1 mb-6">
                {Array.from({ length: testimonials[activeTestimonial].rating }).map((_, i) => (
                  <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-lg text-gray-700 dark:text-gray-300 mb-8 italic">
                &ldquo;{testimonials[activeTestimonial].content}&rdquo;
              </p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-cyan-500 rounded-full flex items-center justify-center text-white font-bold">
                  {testimonials[activeTestimonial].name.charAt(0)}
                </div>
                <div>
                  <div className="font-semibold">{testimonials[activeTestimonial].name}</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {testimonials[activeTestimonial].role}, {testimonials[activeTestimonial].company}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-center gap-2 mt-6">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveTestimonial(index)}
                  className={`w-2.5 h-2.5 rounded-full transition-all ${
                    index === activeTestimonial
                      ? "bg-indigo-600 w-8"
                      : "bg-gray-300 dark:bg-gray-700 hover:bg-gray-400"
                  }`}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===== LATEST BLOG POSTS ===== */}
      <section className="py-20 lg:py-28 bg-gray-50 dark:bg-[#0a0a0f]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-2">Latest Apps & Updates</h2>
              <p className="text-gray-600 dark:text-gray-400">Stay informed with our latest releases</p>
            </div>
            <Link
              href="/blog"
              className="mt-4 md:mt-0 text-indigo-600 dark:text-indigo-400 font-medium hover:underline"
            >
              View All Posts &rarr;
            </Link>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { title: "TaskFlow Pro v2.0 Released", category: "Product Update", date: "Mar 15, 2025", desc: "New Kanban boards, real-time collaboration, and dark mode." },
              { title: "SecureVault 1.5 Now Available", category: "Product Update", date: "Mar 10, 2025", desc: "Breach monitoring, improved sync, and redesigned UI." },
              { title: "AIDesigner 2.0 Launch", category: "Product Update", date: "Mar 5, 2025", desc: "3x faster AI model, vector export, and team collaboration." },
            ].map((post, index) => (
              <div
                key={post.title}
                className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6 hover:border-indigo-500/50 hover:shadow-xl transition-all duration-300"
              >
                <div className="text-xs font-medium text-indigo-600 dark:text-indigo-400 mb-2 uppercase tracking-wider">
                  {post.category}
                </div>
                <h3 className="font-semibold text-lg mb-2">{post.title}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">{post.desc}</p>
                <div className="text-xs text-gray-400">{post.date}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CONTACT CTA ===== */}
      <section className="py-20 lg:py-28 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-cyan-600" />
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full blur-[100px]" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-white rounded-full blur-[100px]" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
            Have a Project Idea?
          </h2>
          <p className="text-xl text-indigo-100 mb-10 max-w-2xl mx-auto">
            Let&rsquo;s turn your vision into reality. Get a free consultation with our team.
          </p>
          <Link
            href="/contact"
            className="inline-flex px-8 py-4 text-lg font-semibold text-indigo-600 bg-white rounded-xl hover:bg-indigo-50 transition-all duration-200 shadow-xl"
          >
            Get Free Consultation
          </Link>
        </div>
      </section>
    </div>
  );
}
