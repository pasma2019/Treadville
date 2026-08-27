"use client";

import { useCart } from "@/components/CartContext";

export default function CheckoutPage() {
  const { lines, total } = useCart();

  return (
    <main className="mx-auto max-w-2xl px-6 py-16">
      <p className="font-mono text-xs uppercase tracking-widest text-accent">Prototype only</p>
      <h1 className="mt-2 font-display text-4xl">Checkout</h1>
      <p className="mt-3 text-sm text-[var(--parchment)]/60">
        This is the checkout concept — no payment is processed. Production will connect M-Pesa, card, and export
        invoicing here.
      </p>

      <div className="mt-10 space-y-4 border-t border-[var(--line)] pt-6">
        {lines.map((line) => (
          <div key={line.product.id} className="flex justify-between font-mono text-sm">
            <span>
              {line.qty} × {line.product.name}
            </span>
            <span>KSh {((line.product.price ?? 0) * line.qty).toLocaleString()}</span>
          </div>
        ))}
        <div className="flex justify-between border-t border-[var(--line)] pt-4 font-mono text-base">
          <span>Total</span>
          <span>KSh {total.toLocaleString()}</span>
        </div>
      </div>

      <div className="mt-10 space-y-4">
        <input placeholder="Full name" className="w-full border border-[var(--line)] bg-transparent px-4 py-3 text-sm" />
        <input placeholder="Phone number" className="w-full border border-[var(--line)] bg-transparent px-4 py-3 text-sm" />
        <input placeholder="Delivery address" className="w-full border border-[var(--line)] bg-transparent px-4 py-3 text-sm" />
        <button
          type="button"
          disabled
          className="w-full cursor-not-allowed bg-accent/40 px-6 py-3 font-mono text-xs uppercase tracking-widest text-[var(--soil)]"
        >
          Payment integration — coming in production
        </button>
      </div>
    </main>
  );
}
