import { NextRequest, NextResponse } from "next/server";
import { verifyPayment } from "@/lib/payments";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    if (typeof body.transactionId !== "string" || typeof body.reference !== "string") return NextResponse.json({ error: "Missing transaction details" }, { status: 400 });
    const order = await verifyPayment(body.transactionId, body.reference);
    return NextResponse.json({ paid: true, reference: order.reference, product: order.name });
  } catch {
    return NextResponse.json({ error: "Payment could not be confirmed. If charged, contact us with your payment reference." }, { status: 409 });
  }
}
