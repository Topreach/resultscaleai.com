"use client";

import Link from "next/link";

const adminModules = [
  {
    title: "App Management",
    description: "Upload APKs, manage screenshots, and update changelogs",
    icon: "📱",
    href: "/admin/apps",
    color: "from-indigo-500 to-cyan-500",
  },
  {
    title: "Blog Management",
    description: "Create and manage blog posts and articles",
    icon: "📝",
    href: "/admin/blog",
    color: "from-purple-500 to-pink-500",
  },
  {
    title: "User Management",
    description: "Manage user accounts and permissions",
    icon: "👥",
    href: "/admin/users",
    color: "from-green-500 to-emerald-500",
  },
  {
    title: "Download Analytics",
    description: "Track downloads and user engagement metrics",
    icon: "📊",
    href: "/admin/analytics",
    color: "from-orange-500 to-red-500",
  },
  {
    title: "Contact Requests",
    description: "View and respond to contact form submissions",
    icon: "✉️",
    href: "/admin/contacts",
    color: "from-blue-500 to-indigo-500",
  },
  {
    title: "Security Reports",
    description: "Review security assessment reports and findings",
    icon: "🛡️",
    href: "/admin/security-reports",
    color: "from-red-500 to-rose-500",
  },
];

export default function AdminDashboard() {
  return (
    <div className="min-h-screen pt-24 pb-20">
      {/* Header */}
      <section className="py-12 bg-gray-50 dark:bg-[#0a0a0f] border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">Admin Dashboard</h1>
              <p className="text-gray-600 dark:text-gray-400">Manage your platform</p>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800">
              <span className="w-2 h-2 bg-green-400 rounded-full"></span>
              <span className="text-sm text-gray-600 dark:text-gray-400">System Online</span>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Overview */}
      <section className="py-8 border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "Total Apps", value: "6", change: "+2 this month" },
              { label: "Total Downloads", value: "162,580", change: "+12.5% vs last month" },
              { label: "Active Users", value: "1,234", change: "+8.3% vs last month" },
              { label: "Contact Requests", value: "28", change: "5 new today" },
            ].map((stat) => (
              <div key={stat.label} className="p-4 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800">
                <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">{stat.label}</div>
                <div className="text-2xl font-bold mb-1">{stat.value}</div>
                <div className="text-xs text-green-600 dark:text-green-400">{stat.change}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Admin Modules */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {adminModules.map((module) => (
              <Link
                key={module.title}
                href={module.href}
                className="group p-6 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 hover:border-indigo-500/50 hover:shadow-xl transition-all duration-300"
              >
                <div className={`w-14 h-14 bg-gradient-to-br ${module.color} rounded-xl flex items-center justify-center text-2xl mb-4`}>
                  {module.icon}
                </div>
                <h3 className="font-semibold text-lg mb-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                  {module.title}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">{module.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
