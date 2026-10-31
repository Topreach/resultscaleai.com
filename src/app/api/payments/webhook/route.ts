import { createHmac } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { matchesSecret, verifyPayment } from "@/lib/payments";

export async function POST(request: NextRequest) {
  const secret = process.env.FLW_WEBHOOK_SECRET;
  if (!secret) return NextResponse.json({ error: "Webhook not configured" }, { status: 503 });
  const raw = await request.text();
  const signature = request.headers.get("flutterwave-signature");
  const valid = signature ? matchesSecret(signature, createHmac("sha256", secret).update(raw).digest("base64")) : matchesSecret(request.headers.get("verif-hash") || "", secret);
  if (!valid) return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  try {
    const event = JSON.parse(raw);
    if (event.event === "charge.completed" && event.data?.status === "successful") await verifyPayment(String(event.data.id));
    return NextResponse.json({ received: true });
  } catch {
    return NextResponse.json({ error: "Verification failed; retry delivery" }, { status: 500 });
  }
}
