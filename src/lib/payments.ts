import { createHash, timingSafeEqual } from "node:crypto";
import { getOrders, markOrderPaid } from "@/lib/store/db";

export async function flutterwave(path: string, body?: object) {
  const key = process.env.FLW_SECRET_KEY;
  if (!key) throw new Error("Payments are not configured");
  const response = await fetch(`https://api.flutterwave.com/v3/${path}`, {
    method: body ? "POST" : "GET",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    ...(body ? { body: JSON.stringify(body) } : {}),
    cache: "no-store",
    signal: AbortSignal.timeout(20_000),
  });
  const result = await response.json();
  if (!response.ok || result.status !== "success") throw new Error("Payment provider request failed");
  return result.data;
}

export function checksum(amount: number, currency: string, email: string, reference: string) {
  const secret = createHash("sha256").update(process.env.FLW_SECRET_KEY!).digest("hex");
  return createHash("sha256").update(`${amount}${currency}${email}${reference}${secret}`).digest("hex");
}

export function matchesSecret(actual: string, expected: string) {
  const a = Buffer.from(actual), b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
}

export async function verifyPayment(transactionId: string, reference?: string) {
  if (!/^\d+$/.test(transactionId)) throw new Error("Invalid transaction ID");
  const tx = await flutterwave(`transactions/${transactionId}/verify`);
  const order = getOrders().find((o) => o.reference === tx.tx_ref);
  if (!order || (reference && reference !== order.reference) || tx.status !== "successful" ||
      tx.currency !== order.currency || !Number.isFinite(Number(tx.amount)) || Number(tx.amount) < order.amount ||
      String(tx.id) !== transactionId || tx.customer?.email?.toLowerCase() !== order.email.toLowerCase()) {
    throw new Error("Payment does not match this order");
  }
  return markOrderPaid(order.reference, transactionId);
}
