"use client";

import { useState, useEffect, useTransition, useRef } from "react";
import { App, AppCategory } from "@/types";

const emptyApp = {
  id: "",
  name: "",
  shortDescription: "",
  description: "",
  category: "Productivity" as AppCategory,
  icon: "",
  screenshots: [],
  version: "1.0.0",
  size: "",
  updatedDate: "",
  downloads: 0,
  features: [],
  requirements: [],
  changelog: [],
  faq: [],
  safety: { virusScanned: true, secureDownload: true, sha256Hash: "" },
  rating: 0,
  developer: "ResultScale AI",
  apkUrl: "",
};

const categories: AppCategory[] = [
  "Productivity", "Business", "Finance", "Education",
  "AI Tools", "Security", "Utilities", "Entertainment",
];

export default function AdminAppsPage() {
  const [apps, setApps] = useState<App[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<App>({ ...emptyApp });
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");
  const [, startTransition] = useTransition();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchApps = async () => {
    try {
      const res = await fetch("/api/apps");
      const data = await res.json();
      startTransition(() => {
        setApps(data);
        setLoading(false);
      });
    } catch (err) {
      console.error("Failed to fetch apps", err);
      startTransition(() => setLoading(false));
    }
  };

  useEffect(() => {
    fetchApps();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const resetForm = () => {
    setForm({ ...emptyApp });
    setEditingId(null);
    setShowForm(false);
    setMessage("");
  };

  const handleEdit = (app: App) => {
    setForm({ ...app });
    setEditingId(app.id);
    setShowForm(true);
    setMessage("");
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this app?")) return;
    try {
      const res = await fetch(`/api/apps/${id}`, { method: "DELETE" });
      if (res.ok) {
        setApps(apps.filter((a) => a.id !== id));
        setMessage("App deleted successfully");
      }
    } catch (err) {
      console.error("Failed to delete app", err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage("");

    try {
      const appData = {
        ...form,
        id: editingId || Date.now().toString(),
        updatedDate: new Date().toISOString().split("T")[0],
      };

      let res;
      if (editingId) {
        res = await fetch(`/api/apps/${editingId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(appData),
        });
      } else {
        res = await fetch("/api/apps", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(appData),
        });
      }

      if (res.ok) {
        setMessage(editingId ? "App updated successfully" : "App created successfully");
        resetForm();
        fetchApps();
      } else {
        const err = await res.json();
        setMessage(err.error || "Failed to save app");
      }
    } catch (err) {
      setMessage("Failed to save app");
    } finally {
      setSaving(false);
    }
  };

  const addFeature = () => {
    const feature = prompt("Enter a feature:");
    if (feature) setForm({ ...form, features: [...form.features, feature] });
  };

  const removeFeature = (index: number) => {
    setForm({ ...form, features: form.features.filter((_, i) => i !== index) });
  };

  const handleApkUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith(".apk")) {
      setMessage("Only .apk files are allowed");
      return;
    }

    setUploading(true);
    setMessage("");

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload/apk", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        setForm({ ...form, apkUrl: data.url });
        setMessage(`APK uploaded: ${data.filename}`);
      } else {
        const err = await res.json();
        setMessage(err.error || "Upload failed");
      }
    } catch (err) {
      setMessage("Failed to upload APK");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const removeApk = () => {
    setForm({ ...form, apkUrl: "" });
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-24 pb-20 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">App Management</h1>
            <p className="text-gray-600 dark:text-gray-400">Manage your applications</p>
          </div>
          <button
            onClick={() => { resetForm(); setShowForm(true); }}
            className="px-4 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-indigo-600 to-cyan-500 rounded-lg hover:from-indigo-700 hover:to-cyan-600 transition-all duration-200"
          >
            + Add New App
          </button>
        </div>

        {message && (
          <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl text-sm text-green-600 dark:text-green-400">
            {message}
          </div>
        )}

        {/* Create/Edit Form */}
        {showForm && (
          <div className="mb-8 p-6 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800">
            <h2 className="text-xl font-bold mb-6">
              {editingId ? "Edit App" : "Add New App"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">App Name</label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full px-4 py-2.5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="My App"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Category</label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value as AppCategory })}
                    className="w-full px-4 py-2.5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    {categories.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Version</label>
                  <input
                    type="text"
                    required
                    value={form.version}
                    onChange={(e) => setForm({ ...form, version: e.target.value })}
                    className="w-full px-4 py-2.5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="1.0.0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Size (e.g., 25 MB)</label>
                  <input
                    type="text"
                    required
                    value={form.size}
                    onChange={(e) => setForm({ ...form, size: e.target.value })}
                    className="w-full px-4 py-2.5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="25 MB"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Short Description</label>
                <input
                  type="text"
                  required
                  value={form.shortDescription}
                  onChange={(e) => setForm({ ...form, shortDescription: e.target.value })}
                  className="w-full px-4 py-2.5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Brief description for cards"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Full Description</label>
                <textarea
                  required
                  rows={4}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full px-4 py-2.5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                  placeholder="Detailed description of the app..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Icon (emoji)</label>
                <input
                  type="text"
                  value={form.icon}
                  onChange={(e) => setForm({ ...form, icon: e.target.value })}
                  className="w-full px-4 py-2.5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="📱"
                />
              </div>

              {/* APK Upload */}
              <div>
                <label className="block text-sm font-medium mb-2">APK File</label>
                <div className="flex items-center gap-3">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".apk"
                    onChange={handleApkUpload}
                    disabled={uploading}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-indigo-50 dark:file:bg-indigo-900/20 file:text-indigo-600 dark:file:text-indigo-400 hover:file:bg-indigo-100 dark:hover:file:bg-indigo-900/40 cursor-pointer disabled:opacity-50"
                  />
                  {uploading && (
                    <div className="w-5 h-5 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin shrink-0"></div>
                  )}
                </div>
                {form.apkUrl && (
                  <div className="mt-2 flex items-center gap-2 text-sm">
                    <span className="text-green-600 dark:text-green-400">APK uploaded</span>
                    <button
                      type="button"
                      onClick={removeApk}
                      className="text-red-500 hover:text-red-700 text-xs underline"
                    >
                      Remove
                    </button>
                  </div>
                )}
                <p className="mt-1 text-xs text-gray-400">
                  Upload your .apk file (max 500MB). The file will be stored in the public/apks/ directory.
                </p>
              </div>

              {/* Features */}
              <div>
                <label className="block text-sm font-medium mb-2">Features</label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {form.features.map((f, i) => (
                    <span key={i} className="inline-flex items-center gap-1 px-3 py-1 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 rounded-full text-sm">
                      {f}
                      <button type="button" onClick={() => removeFeature(i)} className="hover:text-red-500">&times;</button>
                    </span>
                  ))}
                </div>
                <button type="button" onClick={addFeature} className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline">
                  + Add Feature
                </button>
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-indigo-600 to-cyan-500 rounded-xl hover:from-indigo-700 hover:to-cyan-600 transition-all disabled:opacity-50"
                >
                  {saving ? "Saving..." : editingId ? "Update App" : "Create App"}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-6 py-2.5 text-sm font-medium text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-all"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Apps Table */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-800">
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-500">App</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-500">Category</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-500">Version</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-500">Downloads</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-500">APK</th>
                <th className="text-right px-6 py-4 text-sm font-semibold text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody>
              {apps.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                    No apps yet. Click &ldquo;+ Add New App&rdquo; to create one.
                  </td>
                </tr>
              ) : (
                apps.map((app) => (
                  <tr key={app.id} className="border-b border-gray-100 dark:border-gray-800 last:border-0">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-linear-to-br from-indigo-500 to-cyan-500 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                          {app.name.charAt(0).toUpperCase()}
                        </div>
                        <span className="font-medium">{app.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">{app.category}</td>
                    <td className="px-6 py-4 text-sm">v{app.version}</td>
                    <td className="px-6 py-4 text-sm">{app.downloads?.toLocaleString() || 0}</td>
                    <td className="px-6 py-4">
                      {app.apkUrl ? (
                        <span className="px-2.5 py-1 text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full">
                          Uploaded
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-500 rounded-full">
                          None
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleEdit(app)}
                          className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(app.id)}
                          className="text-sm text-red-600 dark:text-red-400 hover:underline"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
