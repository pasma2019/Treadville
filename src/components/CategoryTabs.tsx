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
      className="cat-tabs flex items-center gap-x-1 overflow-x-auto scrollbar-none"
    >
      {categories.map((cat) => {
        const active = cat.slug === activeSlug;
        const accent = categoryAccent(cat.slug);
        return (
          <Link
            key={cat.id}
            href={`/shop/${cat.slug}`}
            aria-current={active ? "page" : undefined}
            className="cat-tab group relative shrink-0 px-4 py-2.5 text-[13px] font-medium uppercase tracking-[0.12em] transition-colors md:px-5 md:text-[14px]"
            style={active ? { color: accent } : undefined}
          >
            {cat.name}
            {/* Active indicator — gold/accent underline */}
            <span
              className="cat-tab-indicator absolute inset-x-2 bottom-0 h-[2px] origin-left transition-transform duration-300"
              style={{
                background: active ? accent : "transparent",
                transform: active ? "scaleX(1)" : "scaleX(0)",
              }}
            />
            {/* Hover indicator — subtle */}
            {!active && (
              <span
                className="absolute inset-x-3 bottom-0 h-px origin-left bg-[var(--ink-faint)] transition-transform duration-300 group-hover:scale-x-100"
                style={{ transform: "scaleX(0)" }}
              />
            )}
          </Link>
        );
      })}
    </nav>
  );
}
