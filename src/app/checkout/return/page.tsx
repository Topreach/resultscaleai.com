"use client";
import { useEffect, useState, startTransition } from "react";
import Link from "next/link";

export default function PaymentReturnPage() {
  const [message, setMessage] = useState("Confirming your payment…");
  const [reference, setReference] = useState("");
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const ref = params.get("tx_ref") || "";
    startTransition(() => setReference(ref));
    const transactionId = params.get("transaction_id");
    if (!transactionId || !ref) { startTransition(() => setMessage("Payment was not completed. You can return to pricing and try again.")); return; }
    fetch("/api/payments/verify", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ reference: ref, transactionId }) })
      .then(async (response) => { const data = await response.json(); if (!response.ok) throw new Error(data.error); setMessage(`Payment confirmed for ${data.product}. Thank you. Please contact us with your reference to arrange fulfilment.`); })
      .catch((error) => setMessage(error instanceof Error ? error.message : "Verification is unavailable. Please contact us."));
  }, []);
  return <div className="max-w-xl mx-auto px-4 pt-28 pb-20"><h1 className="text-3xl font-bold mb-6">Payment status</h1><p role="status">{message}</p>{reference && <p className="mt-4 break-all">Reference: {reference}</p>}<Link href="/contact" className="block mt-6 text-indigo-600">Contact support</Link><Link href="/pricing" className="block mt-4 text-indigo-600">Return to pricing</Link></div>;
}
