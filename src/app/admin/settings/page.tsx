"use client";

import { useState, useEffect } from "react";
import type { GoogleConfig } from "@/types";

const defaultGoogle: GoogleConfig = {
  searchConsoleVerification: "",
  recaptchaSiteKey: "",
  recaptchaSecretKey: "",
  analyticsMeasurementId: "",
  tagManagerId: "",
};

export default function AdminSettingsPage() {
  // Password state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [savingPassword, setSavingPassword] = useState(false);

  // Google config state
  const [google, setGoogle] = useState<GoogleConfig>(defaultGoogle);
  const [loadingGoogle, setLoadingGoogle] = useState(true);
  const [savingGoogle, setSavingGoogle] = useState(false);

  // Active tab
  const [activeTab, setActiveTab] = useState<"password" | "google">("password");

  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Load Google config on mount
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const res = await fetch("/api/admin/settings");
        if (res.ok) {
          const data = await res.json();
          if (data.google) setGoogle(data.google);
        }
      } catch (err) {
        console.error("Failed to load settings", err);
      } finally {
        setLoadingGoogle(false);
      }
    };
    loadSettings();
  }, []);

  // ── Password submit ──────────────────────────────────────────────────────
  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    if (newPassword !== confirmPassword) {
      setMessage({ type: "error", text: "New passwords do not match" });
      return;
    }

    if (newPassword.length < 6) {
      setMessage({ type: "error", text: "New password must be at least 6 characters" });
      return;
    }

    setSavingPassword(true);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage({ type: "success", text: data.message || "Password updated successfully" });
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        setMessage({ type: "error", text: data.error || "Failed to update password" });
      }
    } catch {
      setMessage({ type: "error", text: "Failed to update password" });
    } finally {
      setSavingPassword(false);
    }
  };

  // ── Google config submit ─────────────────────────────────────────────────
  const handleGoogleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setSavingGoogle(true);

    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ google }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage({ type: "success", text: data.message || "Google configuration saved" });
      } else {
        setMessage({ type: "error", text: data.error || "Failed to save Google configuration" });
      }
    } catch {
      setMessage({ type: "error", text: "Failed to save Google configuration" });
    } finally {
      setSavingGoogle(false);
    }
  };

  const tabs = [
    { id: "password" as const, label: "Password" },
    { id: "google" as const, label: "Google Configuration" },
  ];

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage admin password and Google integration settings
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-6 p-1 bg-gray-100 dark:bg-gray-800 rounded-xl w-fit">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => { setActiveTab(tab.id); setMessage(null); }}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
                activeTab === tab.id
                  ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm"
                  : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {message && (
          <div
            className={`mb-6 p-4 rounded-xl text-sm border ${
              message.type === "success"
                ? "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-600 dark:text-green-400"
                : "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-600 dark:text-red-400"
            }`}
          >
            {message.text}
          </div>
        )}

        {/* ── Password Tab ─────────────────────────────────────────────── */}
        {activeTab === "password" && (
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6 sm:p-8">
            <form onSubmit={handlePasswordSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Current Password
                </label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  required
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                  placeholder="Enter current password"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  New Password
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  minLength={6}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                  placeholder="Enter new password (min 6 characters)"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  minLength={6}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                  placeholder="Confirm new password"
                />
              </div>

              <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  <span className="font-medium">Account:</span> admin@resultscaleai.com
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
                  Default password: admin123
                </p>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  disabled={savingPassword}
                  className="px-6 py-2.5 text-sm font-medium text-white bg-linear-to-r from-indigo-600 to-cyan-500 rounded-xl hover:from-indigo-700 hover:to-cyan-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {savingPassword ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Saving...
                    </span>
                  ) : (
                    "Update Password"
                  )}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ── Google Configuration Tab ─────────────────────────────────── */}
        {activeTab === "google" && (
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6 sm:p-8">
            {loadingGoogle ? (
              <div className="flex items-center justify-center py-12">
                <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : (
              <form onSubmit={handleGoogleSubmit} className="space-y-6">
                {/* Search Console Verification */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Google Search Console Verification
                  </label>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                    Paste the full meta tag from Google Search Console, e.g.{" "}
                    <code className="text-indigo-500"><meta name="google-site-verification" content="..." /></code>
                  </p>
                  <input
                    type="text"
                    value={google.searchConsoleVerification}
                    onChange={(e) => setGoogle({ ...google, searchConsoleVerification: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all font-mono text-sm"
                    placeholder="google-site-verification content value"
                  />
                </div>

                {/* reCAPTCHA */}
                <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                  <h3 className="text-lg font-semibold mb-4">reCAPTCHA</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Site Key
                      </label>
                      <input
                        type="text"
                        value={google.recaptchaSiteKey}
                        onChange={(e) => setGoogle({ ...google, recaptchaSiteKey: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all font-mono text-sm"
                        placeholder="6Lc..._xxxxxxxxxxxx"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Secret Key
                      </label>
                      <input
                        type="text"
                        value={google.recaptchaSecretKey}
                        onChange={(e) => setGoogle({ ...google, recaptchaSecretKey: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all font-mono text-sm"
                        placeholder="6Lc..._xxxxxxxxxxxx"
                      />
                    </div>
                  </div>
                </div>

                {/* Google Analytics */}
                <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                  <h3 className="text-lg font-semibold mb-4">Google Analytics & Tag Manager</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Measurement ID
                      </label>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                        Format: <code className="text-indigo-500">G-XXXXXXXXXX</code>
                      </p>
                      <input
                        type="text"
                        value={google.analyticsMeasurementId}
                        onChange={(e) => setGoogle({ ...google, analyticsMeasurementId: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all font-mono text-sm"
                        placeholder="G-XXXXXXXXXX"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Tag Manager ID
                      </label>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                        Format: <code className="text-indigo-500">GTM-XXXXXXX</code>
                      </p>
                      <input
                        type="text"
                        value={google.tagManagerId}
                        onChange={(e) => setGoogle({ ...google, tagManagerId: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all font-mono text-sm"
                        placeholder="GTM-XXXXXXX"
                      />
                    </div>
                  </div>
                </div>

                {/* Info box */}
                <div className="p-4 bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800 rounded-xl">
                  <p className="text-xs text-amber-700 dark:text-amber-400">
                    <strong>Note:</strong> After saving Google configuration, the verification meta tag, Analytics
                    script, and reCAPTCHA scripts will be injected into the website automatically. You may need to
                    clear your browser cache for changes to take effect.
                  </p>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    disabled={savingGoogle}
                    className="px-6 py-2.5 text-sm font-medium text-white bg-linear-to-r from-indigo-600 to-cyan-500 rounded-xl hover:from-indigo-700 hover:to-cyan-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {savingGoogle ? (
                      <span className="flex items-center gap-2">
                        <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Saving...
                      </span>
                    ) : (
                      "Save Google Configuration"
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
