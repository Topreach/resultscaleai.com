"use client";
import { useState } from "react";
import Link from "next/link";

export default function CheckoutForm({ selection }: { selection: { productId: string; kind: string; interval: string } }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  async function submit(event: React.FormEvent) {
    event.preventDefault(); setBusy(true); setError("");
    try {
      const response = await fetch("/api/payments/checkout", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...selection, name, email }) });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error);
      window.location.assign(result.url);
    } catch (error) { setError(error instanceof Error ? error.message : "Checkout failed. Please try again."); setBusy(false); }
  }
  return <div className="max-w-lg mx-auto px-4 pt-28 pb-20"><h1 className="text-3xl font-bold mb-4">Secure checkout</h1><p className="text-gray-500 mb-6">Pay in USD with Flutterwave. You will review the amount on the payment page before paying.</p><form onSubmit={submit} className="space-y-5"><label className="block">Full name<input required minLength={2} maxLength={150} value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" className="block w-full border rounded-lg p-3 bg-transparent mt-2" /></label><label className="block">Email address<input required type="email" maxLength={254} value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" className="block w-full border rounded-lg p-3 bg-transparent mt-2" /></label>{error && <p role="alert" className="text-red-600">{error}</p>}<button disabled={busy || !selection.productId} className="w-full bg-indigo-600 text-white rounded-lg p-3 disabled:opacity-50">{busy ? "Opening Flutterwave…" : "Continue to payment"}</button></form><Link href="/pricing" className="block mt-6 text-indigo-600">Back to pricing</Link><Link href="/contact" className="block mt-3 text-indigo-600">Contact us for help</Link></div>;
}
