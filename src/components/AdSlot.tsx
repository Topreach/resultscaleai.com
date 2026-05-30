"use client";

import { useState, useEffect } from "react";
import type { MonetizationConfig } from "@/types";

interface AdSlotProps {
  slot: keyof MonetizationConfig["adsense"]["slots"];
  format?: "banner" | "rectangle" | "leaderboard";
  className?: string;
}

export default function AdSlot({ slot, format = "banner", className = "" }: AdSlotProps) {
  const [config, setConfig] = useState<MonetizationConfig | null>(null);

  useEffect(() => {
    fetch("/api/admin/monetization")
      .then((res) => res.json())
      .then((data) => setConfig(data))
      .catch(() => setConfig(null));
  }, []);

  // Don't render anything while loading or if disabled
  if (!config || !config.adsense.enabled || !config.adsense.slots[slot]) {
    return null;
  }

  const heightClass = format === "leaderboard" ? "min-h-[90px]" : format === "rectangle" ? "min-h-[250px]" : "min-h-[90px]";

  return (
    <div className={`w-full ${className}`}>
      <div
        className={`${heightClass} bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700 flex items-center justify-center`}
      >
        {config.adsense.publisherId ? (
          <div className="text-center p-4">
            <div className="text-xs text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2">
              Advertisement
            </div>
            <div
              className="ad-container"
              data-ad-slot={slot}
              data-ad-format={format}
              data-full-width-responsive="true"
            />
          </div>
        ) : (
          <div className="text-center p-4">
            <p className="text-sm text-gray-400 dark:text-gray-500">
              Ad Space Available
            </p>
            <p className="text-xs text-gray-300 dark:text-gray-600 mt-1">
              Configure AdSense in Admin → Monetization
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
