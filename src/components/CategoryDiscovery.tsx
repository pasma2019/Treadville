import Link from "next/link";
import Reveal from "@/components/Reveal";
import CategoryImageLayer from "@/components/CategoryImageLayer";
import type { Category } from "@/lib/types";

type CategoryAtmosphere = {
  eyebrow: string;
  descriptor: string;
};

const CATEGORY_META: Record<string, CategoryAtmosphere> = {
  coffee: {
    eyebrow: "Specialty Kenyan Arabica",
    descriptor:
      "High-altitude volcanic soils. Selected with the discipline the crop deserves.",
  },
  tea: {
    eyebrow: "Selected Kenyan teas",
    descriptor: "Highland mist, slow growth, leaf-by-leaf selection.",
  },
  horticulture: {
    eyebrow: "Fresh produce & export",
    descriptor: "Fertile lowland fields, packed and graded for transit.",
  },
  grains: {
    eyebrow: "Selected agricultural commodities",
    descriptor: "Sun-warmed plains, steady harvest, consistent quality.",
  },
};

function metaFor(slug: string): CategoryAtmosphere {
  return (
    CATEGORY_META[slug] || {
      eyebrow: "Origin",
      descriptor: "",
    }
  );
}

const ACCENT_CLASS: Record<string, string> = {
  coffee: "text-[var(--accent-coffee)]",
  tea: "text-[var(--accent-tea)]",
  horticulture: "text-[var(--accent-horticulture)]",
  grains: "text-[var(--accent-grains)]",
};

function accentClass(slug: string) {
  return ACCENT_CLASS[slug] ?? "text-[var(--accent)]";
}

const GRADIENT_VAR: Record<string, string> = {
  coffee: "var(--gradient-coffee)",
  tea: "var(--gradient-tea)",
  horticulture: "var(--gradient-horticulture)",
  grains: "var(--gradient-grains)",
};

function gradientVar(slug: string) {
  return GRADIENT_VAR[slug] ?? "var(--gradient-gold)";
}

function CategoryImageLayerFor({ cat }: { cat: Category }) {
  if (!cat.image_url) return null;
  return (
    <CategoryImageLayer
      src={cat.image_url}
      className="absolute inset-0 h-full w-full object-cover"
    />
  );
}

function CategoryTile({ cat, index }: { cat: Category; index: number }) {
  const m = metaFor(cat.slug);
  const gv = gradientVar(cat.slug);
  const revealDelay = Math.min(index, 5) as 0 | 1 | 2 | 3 | 4 | 5;
  return (
    <Reveal as="div" delay={revealDelay}>
      <Link
        href={`/shop/${cat.slug}`}
        className="category-tile group relative block overflow-hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--gold)] focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
        aria-label={`Enter the ${cat.name} chapter`}
      >
        {/* Full-bleed photograph */}
        <CategoryImageLayerFor cat={cat} />

        {/* Bottom scrim — strong where text sits */}
        <div
          className="category-scrim pointer-events-none absolute inset-0"
          aria-hidden
        />

        {/* Content — text directly over image with gradient scrim */}
        <div className="category-content relative z-10 absolute inset-x-0 bottom-0 p-4 md:p-6">
          <p
            className={`category-eyebrow font-mono text-[12px] uppercase tracking-[0.14em] ${accentClass(cat.slug)}`}
            style={{
              textShadow: "0 1px 8px rgba(26,20,16,0.7)",
            }}
          >
            {m.eyebrow}
          </p>
          <h3
            className="category-title mt-1"
          >
            {cat.name}
          </h3>
          <div
            className="category-accent-line mt-3 h-px w-full origin-left"
            style={{
              background: gv,
              transform: "scaleX(1)",
              transformOrigin: "left",
            }}
          />
        </div>

        {/* Arrow indicator */}
        <div className="category-arrow pointer-events-none absolute bottom-4 right-4 z-10 md:bottom-6 md:right-6" aria-hidden>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M5 10H15M15 10L11 6M15 10L11 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </Link>
    </Reveal>
  );
}

export default function CategoryDiscovery({ categories }: { categories: Category[] }) {
  if (categories.length === 0) return null;

  return (
    <section aria-labelledby="terroir-heading" className="relative section-terroir">
        <div className="category-grid">
          {categories.map((cat, i) => (
            <CategoryTile key={cat.id} cat={cat} index={i} />
          ))}
        </div>
    </section>
  );
}