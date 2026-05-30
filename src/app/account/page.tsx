"use client";

import Link from "next/link";

export default function AccountPage() {
  // In production, this would check authentication status
  const isLoggedIn = false;

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen pt-24 pb-20 flex items-center justify-center">
        <div className="max-w-md mx-auto px-4 text-center">
          <div className="text-6xl mb-6">🔐</div>
          <h1 className="text-3xl font-bold mb-4">My Account</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            Sign in to track downloads, save favorite apps, receive updates, and submit bug reports.
          </p>
          <div className="space-y-3">
            <Link
              href="/account/login"
              className="block w-full px-6 py-3.5 text-sm font-semibold text-white bg-gradient-to-r from-indigo-600 to-cyan-500 rounded-xl hover:from-indigo-700 hover:to-cyan-600 transition-all duration-200 shadow-lg shadow-indigo-500/25"
            >
              Sign In
            </Link>
            <Link
              href="/account/register"
              className="block w-full px-6 py-3.5 text-sm font-semibold text-indigo-600 dark:text-indigo-400 border border-indigo-600 dark:border-indigo-400 rounded-xl hover:bg-indigo-50 dark:hover:bg-indigo-900/30 transition-all duration-200"
            >
              Create Account
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold mb-8">My Account</h1>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Profile Card */}
          <div className="md:col-span-2 p-6 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-cyan-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                U
              </div>
              <div>
                <h2 className="text-xl font-bold">User Name</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">user@email.com</p>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">12</div>
                <div className="text-sm text-gray-500">Downloads</div>
              </div>
              <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">5</div>
                <div className="text-sm text-gray-500">Favorites</div>
              </div>
              <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">3</div>
                <div className="text-sm text-gray-500">Reports</div>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="p-6 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800">
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <div className="space-y-2">
              {["My Downloads", "Favorite Apps", "Bug Reports", "Account Settings", "Notifications"].map((link) => (
                <button
                  key={link}
                  className="w-full text-left px-4 py-2.5 text-sm rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-700 dark:text-gray-300"
                >
                  {link}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
