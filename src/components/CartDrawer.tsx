"use client";

import { X } from "lucide-react";
import { useCart } from "./CartContext";
import Link from "next/link";

export default function CartDrawer() {
  const { lines, isOpen, closeCart, removeFromCart, total } = useCart();

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-black/60" onClick={closeCart} aria-hidden />
      )}
      <aside
        className={`fixed right-0 top-0 z-50 h-full w-full max-w-sm border-l border-[var(--line)] bg-[var(--soil-raised)] p-6 transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
        aria-hidden={!isOpen}
      >
        <div className="flex items-center justify-between">
          <h2 className="font-display text-xl">Your order</h2>
          <button onClick={closeCart} aria-label="Close cart" className="text-[var(--parchment)]/70 hover:text-[var(--parchment)]">
            <X size={20} />
          </button>
        </div>

        {lines.length === 0 ? (
          <p className="mt-8 text-sm text-[var(--parchment)]/60">Nothing here yet — add a product to get started.</p>
        ) : (
          <ul className="mt-8 space-y-5">
            {lines.map((line) => (
              <li key={line.product.id} className="flex items-start justify-between gap-3 border-b border-[var(--line)] pb-4">
                <div>
                  <p className="font-display text-base leading-tight">{line.product.name}</p>
                  <p className="mt-1 font-mono text-xs text-[var(--parchment)]/60">
                    {line.qty} × KSh {line.product.price?.toLocaleString() ?? "—"}
                  </p>
                </div>
                <button
                  onClick={() => removeFromCart(line.product.id)}
                  className="font-mono text-xs uppercase tracking-wide text-[var(--parchment)]/50 hover:text-accent"
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        )}

        <div className="mt-8 border-t border-[var(--line)] pt-4">
          <div className="flex items-center justify-between font-mono text-sm">
            <span className="text-[var(--parchment)]/70">Subtotal</span>
            <span>KSh {total.toLocaleString()}</span>
          </div>
          <Link
            href="/checkout"
            onClick={closeCart}
            className="mt-4 block w-full bg-accent px-4 py-3 text-center font-mono text-xs uppercase tracking-widest text-[var(--soil)]"
          >
            Proceed to checkout
          </Link>
          <p className="mt-3 text-center text-xs text-[var(--parchment)]/40">
            Prototype checkout — no payment is processed.
          </p>
        </div>
      </aside>
    </>
  );
}
