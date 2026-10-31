import { subscriptionAmount } from "@/lib/pricing";
import { NextRequest, NextResponse } from "next/server";
import { createOrder, getMonetizationConfig } from "@/lib/store/db";
import { checksum, flutterwave } from "@/lib/payments";

export async function POST(request: NextRequest) {
  if (!process.env.FLW_SECRET_KEY || !process.env.SITE_URL) return NextResponse.json({ error: "Online payments are being configured. Please contact us to place your order." }, { status: 503 });
  try {
    const body = await request.json();
    if (typeof body.email !== "string" || body.email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email) ||
      typeof body.name !== "string" || body.name.trim().length < 2 || body.name.length > 150) {
      return NextResponse.json({ error: "Enter your name and a valid email address." }, { status: 400 });
    }
    const config = getMonetizationConfig();
    const interval = body.interval === "year" ? "year" : "month";
    const kind = body.kind === "subscription" ? "subscription" : body.kind === "service" ? "service" : null;
    const product = kind === "subscription" ? config.subscriptions.find((p) => p.id === body.productId) : kind === "service" ? config.servicePackages.find((p) => p.id === body.productId) : null;
    if (!product || product.price <= 0) return NextResponse.json({ error: "This product requires a quote. Please contact us." }, { status: 400 });
    const amount = kind === "subscription" ? subscriptionAmount(product as import("@/types").SubscriptionTier, interval) : Math.round(product.price * 100) / 100;
    const reference = crypto.randomUUID();
    const currency = "USD";
    // Plan IDs are provisioned in the Flutterwave dashboard, separately for each billing interval.
    let paymentPlan: number | undefined;
    if (kind === "subscription") {
      const plans = JSON.parse(process.env.FLW_PAYMENT_PLANS || "{}");
      paymentPlan = Number(plans[`${product.id}:${interval}`]);
      if (!Number.isSafeInteger(paymentPlan) || paymentPlan <= 0) return NextResponse.json({ error: "This subscription is not yet available for online checkout. Please contact us." }, { status: 503 });
    }
    if (paymentPlan) {
      const plan = await flutterwave(`payment-plans/${paymentPlan}`);
      if (plan.status !== "active" || plan.currency !== currency || Number(plan.amount) !== amount || plan.interval.toLowerCase() !== (interval === "year" ? "yearly" : "monthly")) return NextResponse.json({ error: "Subscription billing settings need updating. Please contact us." }, { status: 503 });
    }
    createOrder({ reference, productId: product.id, kind: kind!, name: product.name, email: body.email.trim().toLowerCase(), amount, currency, ...(kind === "subscription" ? { interval } : {}), status: "pending", createdAt: new Date().toISOString() });
    const payment = await flutterwave("payments", {
      tx_ref: reference, amount, currency,
      redirect_url: new URL("/checkout/return", process.env.SITE_URL).href,
      customer: { email: body.email.trim().toLowerCase(), name: body.name.trim() },
      customizations: { title: "ResultScale AI", description: product.name },
      payload_hash: checksum(amount, currency, body.email.trim().toLowerCase(), reference),
      ...(paymentPlan ? { payment_plan: paymentPlan } : {}),
    });
    const link = new URL(payment.link);
    if (link.protocol !== "https:" || link.hostname !== "checkout.flutterwave.com") throw new Error("Unexpected checkout URL");
    return NextResponse.json({ url: link.href });
  } catch {
    return NextResponse.json({ error: "Unable to start checkout. Please try again or contact us." }, { status: 502 });
  }
}
