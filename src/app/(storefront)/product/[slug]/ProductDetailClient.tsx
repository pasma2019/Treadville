"use client";

import { useState } from "react";
import { useCart } from "@/components/CartContext";
import type { Product } from "@/lib/types";

export default function ProductDetailClient({ product }: { product: Product }) {
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);

  function handleAddToEnquiry() {
    addToCart(product, 1);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 2200);
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      <button
        type="button"
        onClick={handleAddToEnquiry}
        className="btn-cta flex-1 min-w-[180px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--gold)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--warm-white)]"
      >
        {added ? "Added to enquiry" : "Add to enquiry"}
      </button>

      <a
        href="/contact?type=quote"
        className="btn-cta-ghost flex-1 min-w-[160px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--gold)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--warm-white)]"
      >
        Request a quote
      </a>

      <a
        href="/contact?type=sample"
        className="group border-b border-[var(--gold-deep)]/40 pb-0.5 font-mono text-[10px] uppercase tracking-[0.24em] text-[var(--gold-deep)] transition-colors hover:border-[var(--gold)] hover:text-[var(--gold)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--gold)]"
      >
        Request a sample
      </a>
    </div>
  );
}