"use client";

import { useState, useEffect, useTransition } from "react";
import type { MonetizationConfig, SubscriptionTier, AffiliateItem, ServicePackage } from "@/types";

const defaultConfig: MonetizationConfig = {
  adsense: { enabled: false, publisherId: "", slots: { homepage: true, blogSidebar: true, blogInline: true, appDetail: true, downloads: true } },
  subscriptions: [],
  premiumApps: { enabled: true, price: 4.99, currency: "USD" },
  affiliate: { enabled: false, items: [] },
  servicePackages: [],
  membership: { enabled: false, free: { name: "Free", price: 0, features: [] }, premium: { name: "Premium", price: 5, features: [] } },
};

export default function AdminMonetizationPage() {
  const [config, setConfig] = useState<MonetizationConfig>(defaultConfig);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [activeTab, setActiveTab] = useState<"adsense" | "subscriptions" | "premium" | "affiliate" | "packages" | "membership">("adsense");

  const loadConfig = async () => {
    try {
      const res = await fetch("/api/admin/monetization");
      if (res.ok) {
        const data = await res.json();
        setConfig(data);
      }
    } catch {
      // use defaults
    } finally {
      setLoading(false);
    }
  };

  const [, startTransition] = useTransition();

  useEffect(() => {
    startTransition(() => {
      loadConfig();
    });
  }, []);

  const saveConfig = async () => {
    setSaving(true);
    setMessage(null);
    try {
      const res = await fetch("/api/admin/monetization", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(config),
      });
      if (res.ok) {
        setMessage({ type: "success", text: "Monetization settings saved successfully" });
      } else {
        setMessage({ type: "error", text: "Failed to save settings" });
      }
    } catch {
      setMessage({ type: "error", text: "Failed to save settings" });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-24 pb-20 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const tabs = [
    { id: "adsense" as const, label: "AdSense" },
    { id: "subscriptions" as const, label: "Subscriptions" },
    { id: "premium" as const, label: "Premium Apps" },
    { id: "affiliate" as const, label: "Affiliates" },
    { id: "packages" as const, label: "Services" },
    { id: "membership" as const, label: "Membership" },
  ];

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Monetization</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">Configure ads, pricing, and revenue settings</p>
          </div>
          <button
            onClick={saveConfig}
            disabled={saving}
            className="px-6 py-2.5 text-sm font-medium text-white bg-linear-to-r from-indigo-600 to-cyan-500 rounded-xl hover:from-indigo-700 hover:to-cyan-600 transition-all disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save All Settings"}
          </button>
        </div>

        {message && (
          <div className={`mb-6 p-4 rounded-xl text-sm border ${
            message.type === "success"
              ? "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-600 dark:text-green-400"
              : "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-600 dark:text-red-400"
          }`}>
            {message.text}
          </div>
        )}

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-8 border-b border-gray-200 dark:border-gray-800 pb-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-all ${
                activeTab === tab.id
                  ? "bg-white dark:bg-gray-900 text-indigo-600 dark:text-indigo-400 border border-gray-200 dark:border-gray-800 border-b-white dark:border-b-gray-900 -mb-[2px]"
                  : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6 sm:p-8">
          {/* AdSense Tab */}
          {activeTab === "adsense" && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold">Google AdSense</h2>
              <p className="text-sm text-gray-500">Configure AdSense to display ads on your website.</p>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={config.adsense.enabled}
                  onChange={(e) => setConfig({ ...config, adsense: { ...config.adsense, enabled: e.target.checked } })}
                  className="w-5 h-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                <span className="text-sm font-medium">Enable AdSense</span>
              </label>

              {config.adsense.enabled && (
                <>
                  <div>
                    <label className="block text-sm font-medium mb-2">Publisher ID</label>
                    <input
                      type="text"
                      value={config.adsense.publisherId}
                      onChange={(e) => setConfig({ ...config, adsense: { ...config.adsense, publisherId: e.target.value } })}
                      placeholder="ca-pub-XXXXXXXXXXXXXXXX"
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                    />
                  </div>

                  <div>
                    <h3 className="text-sm font-medium mb-3">Ad Slot Locations</h3>
                    <div className="space-y-3">
                      {Object.entries(config.adsense.slots).map(([key, value]) => (
                        <label key={key} className="flex items-center gap-3 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={value}
                            onChange={(e) => setConfig({
                              ...config,
                              adsense: {
                                ...config.adsense,
                                slots: { ...config.adsense.slots, [key]: e.target.checked },
                              },
                            })}
                            className="w-5 h-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                          />
                          <span className="text-sm capitalize">{key.replace(/([A-Z])/g, " $1").trim()}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          )}

          {/* Subscriptions Tab */}
          {activeTab === "subscriptions" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold">Subscription Tiers</h2>
                  <p className="text-sm text-gray-500">Manage your subscription plans shown on the pricing page.</p>
                </div>
                <button
                  onClick={() => {
                    const newTier: SubscriptionTier = {
                      id: `tier-${Date.now()}`,
                      name: "",
                      price: 0,
                      interval: "month",
                      description: "",
                      features: [],
                      highlighted: false,
                      cta: "Subscribe",
                    };
                    setConfig({ ...config, subscriptions: [...config.subscriptions, newTier] });
                  }}
                  className="px-4 py-2 text-sm font-medium text-white bg-linear-to-r from-indigo-600 to-cyan-500 rounded-xl hover:from-indigo-700 hover:to-cyan-600"
                >
                  + Add Tier
                </button>
              </div>

              {config.subscriptions.length === 0 ? (
                <p className="text-gray-400 text-sm py-8 text-center">No subscription tiers configured. Click &ldquo;+ Add Tier&rdquo; to create one.</p>
              ) : (
                config.subscriptions.map((tier, index) => (
                  <div key={tier.id} className="p-4 border border-gray-200 dark:border-gray-700 rounded-xl space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium">Tier {index + 1}</h3>
                      <button
                        onClick={() => setConfig({ ...config, subscriptions: config.subscriptions.filter((_, i) => i !== index) })}
                        className="text-sm text-red-500 hover:text-red-700"
                      >
                        Remove
                      </button>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-medium mb-1">Name</label>
                        <input
                          type="text"
                          value={tier.name}
                          onChange={(e) => {
                            const subs = [...config.subscriptions];
                            subs[index] = { ...subs[index], name: e.target.value };
                            setConfig({ ...config, subscriptions: subs });
                          }}
                          className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium mb-1">Price ($)</label>
                        <input
                          type="number"
                          value={tier.price}
                          onChange={(e) => {
                            const subs = [...config.subscriptions];
                            subs[index] = { ...subs[index], price: Number(e.target.value) };
                            setConfig({ ...config, subscriptions: subs });
                          }}
                          className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium mb-1">Description</label>
                        <input
                          type="text"
                          value={tier.description}
                          onChange={(e) => {
                            const subs = [...config.subscriptions];
                            subs[index] = { ...subs[index], description: e.target.value };
                            setConfig({ ...config, subscriptions: subs });
                          }}
                          className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium mb-1">CTA Button</label>
                        <input
                          type="text"
                          value={tier.cta}
                          onChange={(e) => {
                            const subs = [...config.subscriptions];
                            subs[index] = { ...subs[index], cta: e.target.value };
                            setConfig({ ...config, subscriptions: subs });
                          }}
                          className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                      </div>
                    </div>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={tier.highlighted}
                        onChange={(e) => {
                          const subs = [...config.subscriptions];
                          subs[index] = { ...subs[index], highlighted: e.target.checked };
                          setConfig({ ...config, subscriptions: subs });
                        }}
                        className="w-4 h-4 rounded border-gray-300 text-indigo-600"
                      />
                      <span className="text-sm">Highlight (Most Popular)</span>
                    </label>
                    <div>
                      <label className="block text-xs font-medium mb-1">Features (one per line)</label>
                      <textarea
                        value={tier.features.join("\n")}
                        onChange={(e) => {
                          const subs = [...config.subscriptions];
                          subs[index] = { ...subs[index], features: e.target.value.split("\n").filter(Boolean) };
                          setConfig({ ...config, subscriptions: subs });
                        }}
                        rows={4}
                        className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* Premium Apps Tab */}
          {activeTab === "premium" && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold">Premium App Downloads</h2>
              <p className="text-sm text-gray-500">Configure premium pricing for app downloads.</p>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={config.premiumApps.enabled}
                  onChange={(e) => setConfig({ ...config, premiumApps: { ...config.premiumApps, enabled: e.target.checked } })}
                  className="w-5 h-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                <span className="text-sm font-medium">Enable Premium Apps</span>
              </label>

              {config.premiumApps.enabled && (
                <div className="grid grid-cols-2 gap-4 max-w-md">
                  <div>
                    <label className="block text-sm font-medium mb-2">Price ($)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={config.premiumApps.price}
                      onChange={(e) => setConfig({ ...config, premiumApps: { ...config.premiumApps, price: Number(e.target.value) } })}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Currency</label>
                    <input
                      type="text"
                      value={config.premiumApps.currency}
                      onChange={(e) => setConfig({ ...config, premiumApps: { ...config.premiumApps, currency: e.target.value } })}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Affiliate Tab */}
          {activeTab === "affiliate" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold">Affiliate Marketing</h2>
                  <p className="text-sm text-gray-500">Manage affiliate partners and links.</p>
                </div>
                <button
                  onClick={() => {
                    const newItem: AffiliateItem = {
                      id: `aff-${Date.now()}`,
                      name: "",
                      description: "",
                      url: "",
                      commission: "",
                      logo: "",
                    };
                    setConfig({ ...config, affiliate: { ...config.affiliate, items: [...config.affiliate.items, newItem] } });
                  }}
                  className="px-4 py-2 text-sm font-medium text-white bg-linear-to-r from-indigo-600 to-cyan-500 rounded-xl hover:from-indigo-700 hover:to-cyan-600"
                >
                  + Add Affiliate
                </button>
              </div>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={config.affiliate.enabled}
                  onChange={(e) => setConfig({ ...config, affiliate: { ...config.affiliate, enabled: e.target.checked } })}
                  className="w-5 h-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                <span className="text-sm font-medium">Enable Affiliate Section</span>
              </label>

              {config.affiliate.items.map((item, index) => (
                <div key={item.id} className="p-4 border border-gray-200 dark:border-gray-700 rounded-xl space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium">Affiliate {index + 1}</h3>
                    <button
                      onClick={() => setConfig({
                        ...config,
                        affiliate: { ...config.affiliate, items: config.affiliate.items.filter((_, i) => i !== index) },
                      })}
                      className="text-sm text-red-500 hover:text-red-700"
                    >
                      Remove
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium mb-1">Name</label>
                      <input
                        type="text"
                        value={item.name}
                        onChange={(e) => {
                          const items = [...config.affiliate.items];
                          items[index] = { ...items[index], name: e.target.value };
                          setConfig({ ...config, affiliate: { ...config.affiliate, items } });
                        }}
                        className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium mb-1">URL</label>
                      <input
                        type="url"
                        value={item.url}
                        onChange={(e) => {
                          const items = [...config.affiliate.items];
                          items[index] = { ...items[index], url: e.target.value };
                          setConfig({ ...config, affiliate: { ...config.affiliate, items } });
                        }}
                        className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                    <div className="col-span-2">
                      <label className="block text-xs font-medium mb-1">Description</label>
                      <input
                        type="text"
                        value={item.description}
                        onChange={(e) => {
                          const items = [...config.affiliate.items];
                          items[index] = { ...items[index], description: e.target.value };
                          setConfig({ ...config, affiliate: { ...config.affiliate, items } });
                        }}
                        className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium mb-1">Commission</label>
                      <input
                        type="text"
                        value={item.commission}
                        onChange={(e) => {
                          const items = [...config.affiliate.items];
                          items[index] = { ...items[index], commission: e.target.value };
                          setConfig({ ...config, affiliate: { ...config.affiliate, items } });
                        }}
                        className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Service Packages Tab */}
          {activeTab === "packages" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold">Service Packages</h2>
                  <p className="text-sm text-gray-500">Manage development and security service packages.</p>
                </div>
                <button
                  onClick={() => {
                    const newPkg: ServicePackage = {
                      id: `pkg-${Date.now()}`,
                      name: "",
                      price: 0,
                      description: "",
                      features: [],
                      category: "development",
                      cta: "Get Started",
                    };
                    setConfig({ ...config, servicePackages: [...config.servicePackages, newPkg] });
                  }}
                  className="px-4 py-2 text-sm font-medium text-white bg-linear-to-r from-indigo-600 to-cyan-500 rounded-xl hover:from-indigo-700 hover:to-cyan-600"
                >
                  + Add Package
                </button>
              </div>

              {config.servicePackages.map((pkg, index) => (
                <div key={pkg.id} className="p-4 border border-gray-200 dark:border-gray-700 rounded-xl space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium">Package {index + 1}</h3>
                    <button
                      onClick={() => setConfig({ ...config, servicePackages: config.servicePackages.filter((_, i) => i !== index) })}
                      className="text-sm text-red-500 hover:text-red-700"
                    >
                      Remove
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium mb-1">Name</label>
                      <input
                        type="text"
                        value={pkg.name}
                        onChange={(e) => {
                          const pkgs = [...config.servicePackages];
                          pkgs[index] = { ...pkgs[index], name: e.target.value };
                          setConfig({ ...config, servicePackages: pkgs });
                        }}
                        className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium mb-1">Price ($) - 0 for custom</label>
                      <input
                        type="number"
                        value={pkg.price}
                        onChange={(e) => {
                          const pkgs = [...config.servicePackages];
                          pkgs[index] = { ...pkgs[index], price: Number(e.target.value) };
                          setConfig({ ...config, servicePackages: pkgs });
                        }}
                        className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                    <div className="col-span-2">
                      <label className="block text-xs font-medium mb-1">Description</label>
                      <input
                        type="text"
                        value={pkg.description}
                        onChange={(e) => {
                          const pkgs = [...config.servicePackages];
                          pkgs[index] = { ...pkgs[index], description: e.target.value };
                          setConfig({ ...config, servicePackages: pkgs });
                        }}
                        className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium mb-1">Category</label>
                      <select
                        value={pkg.category}
                        onChange={(e) => {
                          const pkgs = [...config.servicePackages];
                          pkgs[index] = { ...pkgs[index], category: e.target.value as "development" | "security" | "consulting" };
                          setConfig({ ...config, servicePackages: pkgs });
                        }}
                        className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                      >
                        <option value="development">Development</option>
                        <option value="security">Security</option>
                        <option value="consulting">Consulting</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium mb-1">CTA Button</label>
                      <input
                        type="text"
                        value={pkg.cta}
                        onChange={(e) => {
                          const pkgs = [...config.servicePackages];
                          pkgs[index] = { ...pkgs[index], cta: e.target.value };
                          setConfig({ ...config, servicePackages: pkgs });
                        }}
                        className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1">Features (one per line)</label>
                    <textarea
                      value={pkg.features.join("\n")}
                      onChange={(e) => {
                        const pkgs = [...config.servicePackages];
                        pkgs[index] = { ...pkgs[index], features: e.target.value.split("\n").filter(Boolean) };
                        setConfig({ ...config, servicePackages: pkgs });
                      }}
                      rows={4}
                      className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Membership Tab */}
          {activeTab === "membership" && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold">APK Download Membership</h2>
              <p className="text-sm text-gray-500">Configure membership plans for premium downloads.</p>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={config.membership.enabled}
                  onChange={(e) => setConfig({ ...config, membership: { ...config.membership, enabled: e.target.checked } })}
                  className="w-5 h-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                <span className="text-sm font-medium">Enable Membership</span>
              </label>

              {config.membership.enabled && (
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Free Tier */}
                  <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-xl space-y-3">
                    <h3 className="font-medium">Free Tier</h3>
                    <div>
                      <label className="block text-xs font-medium mb-1">Name</label>
                      <input
                        type="text"
                        value={config.membership.free.name}
                        onChange={(e) => setConfig({ ...config, membership: { ...config.membership, free: { ...config.membership.free, name: e.target.value } } })}
                        className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium mb-1">Features (one per line)</label>
                      <textarea
                        value={config.membership.free.features.join("\n")}
                        onChange={(e) => setConfig({ ...config, membership: { ...config.membership, free: { ...config.membership.free, features: e.target.value.split("\n").filter(Boolean) } } })}
                        rows={3}
                        className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                  </div>

                  {/* Premium Tier */}
                  <div className="p-4 border border-indigo-200 dark:border-indigo-800 rounded-xl space-y-3">
                    <h3 className="font-medium text-indigo-600 dark:text-indigo-400">Premium Tier</h3>
                    <div>
                      <label className="block text-xs font-medium mb-1">Name</label>
                      <input
                        type="text"
                        value={config.membership.premium.name}
                        onChange={(e) => setConfig({ ...config, membership: { ...config.membership, premium: { ...config.membership.premium, name: e.target.value } } })}
                        className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium mb-1">Price ($/month)</label>
                      <input
                        type="number"
                        value={config.membership.premium.price}
                        onChange={(e) => setConfig({ ...config, membership: { ...config.membership, premium: { ...config.membership.premium, price: Number(e.target.value) } } })}
                        className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium mb-1">Features (one per line)</label>
                      <textarea
                        value={config.membership.premium.features.join("\n")}
                        onChange={(e) => setConfig({ ...config, membership: { ...config.membership, premium: { ...config.membership.premium, features: e.target.value.split("\n").filter(Boolean) } } })}
                        rows={3}
                        className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
