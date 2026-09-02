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
        style={{ ["--accent" as string]: accent }}
        className="group relative flex-1 min-w-[180px] overflow-hidden border border-[var(--ink)] bg-[var(--ink)] px-6 py-3 font-mono text-[11px] uppercase tracking-[0.28em] text-[var(--warm-white)] transition-colors duration-[var(--dur)] ease-[var(--ease-out)] hover:bg-[var(--warm-white)] hover:text-[var(--ink)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--warm-white)]"
      >
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 origin-left scale-x-0 transition-transform duration-[var(--dur)] ease-[var(--ease-out)] group-hover:scale-x-100"
          style={{ background: accent, opacity: 0.10 }}
        />
        <span className="relative">
          {added ? "Added to enquiry" : "Add to enquiry"}
        </span>
      </button>

      <a
        href="/contact?type=quote"
        style={{ ["--accent" as string]: accent }}
        className="group relative flex-1 min-w-[160px] overflow-hidden border border-[var(--ink)] px-6 py-3 text-center font-mono text-[11px] uppercase tracking-[0.28em] text-[var(--ink)] transition-colors duration-[var(--dur)] ease-[var(--ease-out)] hover:bg-[var(--ink)] hover:text-[var(--warm-white)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--warm-white)]"
      >
        <span className="relative">Request a quote</span>
      </a>

      <a
        href="/contact?type=sample"
        style={{ ["--accent" as string]: accent }}
        className="group border-b border-[var(--ink)] pb-0.5 font-mono text-[10px] uppercase tracking-[0.24em] text-[var(--ink-muted)] transition-colors hover:border-[var(--accent)] hover:text-[var(--accent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
      >
        Request a sample
      </a>
    </div>
  );
}
