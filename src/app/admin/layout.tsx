"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";

const navItems = [
  { label: "Dashboard", href: "/admin", icon: "📊" },
  { label: "Apps", href: "/admin/apps", icon: "📱" },
  { label: "Blog", href: "/admin/blog", icon: "📝" },
  { label: "Contacts", href: "/admin/contacts", icon: "✉️" },
  { label: "Monetization", href: "/admin/monetization", icon: "💰" },
  { label: "Users", href: "/admin/users", icon: "👥" },
  { label: "Analytics", href: "/admin/analytics", icon: "📈" },
  { label: "Security", href: "/admin/security-reports", icon: "🛡️" },
  { label: "Settings", href: "/admin/settings", icon: "⚙️" },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [verifiedPath, setVerifiedPath] = useState<string | null>(null);
  const [authError, setAuthError] = useState("");
  const [authAttempt, setAuthAttempt] = useState(0);
  const [loggingOut, setLoggingOut] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const isLoginPage = pathname === "/admin/login";

  useEffect(() => {
    if (isLoginPage) {
      return;
    }

    let cancelled = false;

    async function checkAuth() {
      try {
        const res = await fetch("/api/auth/me");
        if (cancelled) return;
        if (res.status === 401) { setVerifiedPath(null); router.replace("/admin/login"); return; }
        if (!res.ok) throw new Error("Authentication service is unavailable. Please retry.");
        setAuthError("");
        setVerifiedPath(pathname);
      } catch {
        if (!cancelled) setAuthError("Could not verify your session. Check your connection and retry.");
      }
    }
    checkAuth();
    const interval = setInterval(checkAuth, 60_000);
    window.addEventListener("focus", checkAuth);

    return () => {
      clearInterval(interval);
      window.removeEventListener("focus", checkAuth);
      cancelled = true;
    };
  }, [isLoginPage, pathname, router, authAttempt]);

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      const response = await fetch("/api/auth/logout", { method: "POST" });
      if (!response.ok) throw new Error("Sign out failed");
      localStorage.removeItem("admin_token");
      setVerifiedPath(null);
      router.replace("/admin/login");
    } catch { setAuthError("Sign out failed. Your session may still be active. Please retry."); }
    finally { setLoggingOut(false); }
  };

  if (isLoginPage) {
    return <>{children}</>;
  }

  if (verifiedPath !== pathname) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-[#0a0a0f]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          {authError ? <><p role="alert" className="text-red-600">{authError}</p><button className="mt-4 text-indigo-600" onClick={() => { setAuthError(""); setAuthAttempt((attempt) => attempt + 1); }}>Retry authentication</button></> : <p role="status" className="text-gray-500">Checking authentication...</p>}
        </div>
      </div>
    );
  }


  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0a0a0f]">
      {/* Top Bar */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
        <div className="flex items-center justify-between px-4 h-16">
          <div className="flex items-center gap-4">
            <button
              aria-label="Toggle admin navigation"
              aria-expanded={sidebarOpen}
              aria-controls="admin-navigation"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <Link href="/admin" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-indigo-600 to-cyan-500 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                RS
              </div>
              <span className="font-semibold hidden sm:block">Admin Panel</span>
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="text-sm text-gray-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
            >
              View Site
            </Link>
            <button
              disabled={loggingOut}
              onClick={handleLogout}
              className="px-4 py-2 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
            >
              {loggingOut ? "Signing out..." : "Logout"}
            </button>
          </div>
        </div>
      </div>

      {/* Sidebar */}
      <aside id="admin-navigation"
        className={`fixed top-16 left-0 bottom-0 w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 transform transition-transform duration-200 lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } z-40`}
      >
        <nav className="p-4 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive ? "page" : undefined}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400"
                    : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800"
                }`}
              >
                <span>{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="lg:ml-64 pt-16">
        {authError && <p role="alert" className="p-4 text-red-600">{authError}</p>}
        {children}
      </div>
    </div>
  );
}
