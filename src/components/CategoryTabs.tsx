"use client";

import Link from "next/link";
import { categoryAccent } from "@/lib/accents";
import type { Category } from "@/lib/types";

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
        const accent = categoryAccent(cat.slug);
        if (active) {
          return (
            <Link
              key={cat.id}
              href={`/shop/${cat.slug}`}
              style={{ borderColor: accent, color: accent }}
              className="border px-4 py-2 font-mono text-xs uppercase tracking-widest transition-colors"
            >
              {cat.name}
            </Link>
          );
        }
        return (
          <Link
            key={cat.id}
            href={`/shop/${cat.slug}`}
            className="border border-[var(--line)] px-4 py-2 font-mono text-xs uppercase tracking-widest text-[var(--parchment)]/60 transition-colors hover:text-[var(--parchment)]"
          >
            {cat.name}
          </Link>
        );
      })}
    </div>
  );
}
