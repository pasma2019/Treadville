"use client";

import { useState } from "react";
import { useCart } from "@/components/CartContext";
import type { Product } from "@/lib/types";

export default function ProductDetailClient({ product }: { product: Product }) {
  const { addToCart } = useCart();
  const [qty, setQty] = useState(1);

  return (
    <div className="mt-6 flex flex-wrap items-center gap-3">
      <div className="flex items-center border border-[var(--line)]">
        <button
          onClick={() => setQty((q) => Math.max(1, q - 1))}
          className="px-3 py-2 font-mono text-sm transition-colors hover:text-[var(--accent)]"
          aria-label="Decrease quantity"
        >
          −
        </button>
        <span className="w-8 text-center font-mono text-sm">{qty}</span>
        <button
          onClick={() => setQty((q) => q + 1)}
          className="px-3 py-2 font-mono text-sm transition-colors hover:text-[var(--accent)]"
          aria-label="Increase quantity"
        >
          +
        </button>
      </div>
      <button
        onClick={() => addToCart(product, qty)}
        className="flex-1 bg-accent px-6 py-3 font-mono text-xs uppercase tracking-widest text-[var(--soil)] transition-colors hover:bg-[var(--copper)]"
      >
        Add to enquiry
      </button>
    </div>
  );
}
