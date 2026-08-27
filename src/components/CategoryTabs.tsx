"use client";

import Link from "next/link";
import type { Category } from "@/lib/types";

const ACCENT_VAR: Record<string, string> = {
  coffee: "var(--accent-coffee)",
  tea: "var(--accent-tea)",
  horticulture: "var(--accent-horticulture)",
  grains: "var(--accent-grains)",
};

export default function CategoryTabs({
  categories,
  activeSlug,
}: {
  categories: Category[];
  activeSlug?: string;
}) {
  return (
    <div className="flex flex-wrap gap-3">
      {categories.map((cat) => {
        const active = cat.slug === activeSlug;
        return (
          <Link
            key={cat.id}
            href={`/shop/${cat.slug}`}
            style={active ? { borderColor: ACCENT_VAR[cat.slug], color: ACCENT_VAR[cat.slug] } : undefined}
            className={`border px-4 py-2 font-mono text-xs uppercase tracking-widest transition-colors ${
              active ? "" : "border-[var(--line)] text-[var(--parchment)]/60 hover:text-[var(--parchment)]"
            }`}
          >
            {cat.name}
          </Link>
        );
      })}
    </div>
  );
}
