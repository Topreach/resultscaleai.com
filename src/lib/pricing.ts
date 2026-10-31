import type { SubscriptionTier } from "@/types";
export function subscriptionAmount(tier: SubscriptionTier, interval: "month" | "year") {
  const amount = tier.interval === interval ? tier.price : interval === "year" ? tier.price * 12 * 0.8 : tier.price / 12;
  return Math.round(amount * 100) / 100;
}
