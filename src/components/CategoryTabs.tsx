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
    <nav
      aria-label="Shop categories"
      className="flex flex-wrap items-center gap-x-8 gap-y-3"
    >
      {categories.map((cat) => {
        const active = cat.slug === activeSlug;
        const accent = categoryAccent(cat.slug);
        return (
          <Link
            key={cat.id}
            href={`/shop/${cat.slug}`}
            aria-current={active ? "page" : undefined}
            className={
              active
                ? "relative pb-2 text-[15px] font-medium tracking-[-0.005em] text-[var(--ink)] after:absolute after:inset-x-0 after:bottom-0 after:h-[2px] after:bg-current focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ink)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--warm-white)] rounded-sm"
                : "relative pb-2 text-[15px] tracking-[-0.005em] text-[var(--ink-soft)]/70 transition-colors hover:text-[var(--ink)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ink)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--warm-white)] rounded-sm"
            }
            style={active ? { color: accent } : undefined}
          >
            {cat.name}
          </Link>
        );
      })}
    </nav>
  );
}
