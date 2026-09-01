"use client";

import { useState } from "react";
import { useCart } from "@/components/CartContext";
import type { Product } from "@/lib/types";

export default function ProductDetailClient({
  product,
  accent = "var(--accent)",
}: {
  product: Product;
  accent?: string;
}) {
  const { addToCart } = useCart();
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  function handleAdd() {
    addToCart(product, qty);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 2200);
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="flex items-center border border-[var(--line-on-light-strong)] bg-[var(--warm-white)]">
        <button
          onClick={() => setQty((q) => Math.max(1, q - 1))}
          className="px-3 py-2.5 font-mono text-sm text-[var(--ink)] transition-colors hover:text-[var(--ink-muted)]"
          aria-label="Decrease quantity"
        >
          −
        </button>
        <span
          aria-live="polite"
          className="w-10 text-center font-mono text-sm tabular-nums text-[var(--ink)]"
        >
          {qty}
        </span>
        <button
          onClick={() => setQty((q) => q + 1)}
          className="px-3 py-2.5 font-mono text-sm text-[var(--ink)] transition-colors hover:text-[var(--ink-muted)]"
          aria-label="Increase quantity"
        >
          +
        </button>
      </div>

      <button
        type="button"
        onClick={handleAdd}
        style={{ ["--accent" as string]: accent }}
        className="group relative flex-1 min-w-[200px] overflow-hidden border border-[var(--ink)] bg-[var(--ink)] px-6 py-3 font-mono text-[11px] uppercase tracking-[0.28em] text-[var(--warm-white)] transition-colors duration-[var(--dur)] ease-[var(--ease-out)] hover:bg-[var(--warm-white)] hover:text-[var(--ink)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--warm-white)]"
      >
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 origin-left scale-x-0 transition-transform duration-[var(--dur)] ease-[var(--ease-out)] group-hover:scale-x-100"
          style={{ background: accent, opacity: 0.12 }}
        />
        <span className="relative">
          {added ? "Added to enquiry" : "Add to enquiry"}
        </span>
      </button>
    </div>
  );
}
