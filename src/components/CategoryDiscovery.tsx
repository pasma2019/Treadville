import Link from "next/link";
import Reveal from "@/components/Reveal";
import CategoryImageLayer from "@/components/CategoryImageLayer";
import { categoryAccent } from "@/lib/accents";
import type { Category } from "@/lib/types";

type CategoryAtmosphere = {
  eyebrow: string;
  descriptor: string;
  accent: string;
};

const CATEGORY_META: Record<string, CategoryAtmosphere> = {
  coffee: {
    eyebrow: "Specialty Kenyan Arabica",
    descriptor:
      "High-altitude volcanic soils. Selected with the discipline the crop deserves.",
    accent: "var(--accent-coffee)",
  },
  tea: {
    eyebrow: "Selected Kenyan teas",
    descriptor: "Highland mist, slow growth, leaf-by-leaf selection.",
    accent: "var(--accent-tea)",
  },
  horticulture: {
    eyebrow: "Fresh produce & export",
    descriptor: "Fertile lowland fields, packed and graded for transit.",
    accent: "var(--accent-horticulture)",
  },
  grains: {
    eyebrow: "Selected agricultural commodities",
    descriptor: "Sun-warmed plains, steady harvest, consistent quality.",
    accent: "var(--accent-grains)",
  },
};

function metaFor(slug: string): CategoryAtmosphere {
  return (
    CATEGORY_META[slug] || {
      eyebrow: "Origin",
      descriptor: "",
      accent: categoryAccent(slug),
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

function CategoryImageLayerFor({ cat }: { cat: Category }) {
  if (!cat.image_url) return null;
  return (
    <CategoryImageLayer
      src={cat.image_url}
      className="absolute inset-0 h-full w-full object-cover transition-transform duration-[900ms] ease-[var(--ease-smooth)] group-hover:scale-[1.04] group-hover:translate-y-[-2px] motion-reduce:transition-none motion-reduce:group-hover:scale-100 motion-reduce:group-hover:translate-y-0"
    />
  );
}

function LeadChapter({ cat }: { cat: Category }) {
  const m = metaFor(cat.slug);
  return (
    <Reveal as="div" delay={0} className="md:col-span-7">
      <Link
        href={`/shop/${cat.slug}`}
        className="group relative block overflow-hidden rounded-[14px] border border-[var(--glass-border)] bg-[var(--warm-white)] shadow-[var(--shadow-soft)] transition-[border-color,box-shadow] duration-500 hover:border-[rgba(184,134,11,0.4)] hover:shadow-[var(--shadow-elite)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--gold)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bone)]"
        aria-label={`Enter the ${cat.name} chapter`}
      >
        <div className="relative aspect-[4/5] w-full overflow-hidden md:aspect-[5/6]">
          <CategoryImageLayerFor cat={cat} />
        </div>
        <div className="p-6 md:p-8">
          <p
            className={`font-mono text-[13px] uppercase tracking-[0.12em] transition-colors duration-300 group-hover:text-[var(--gold-deep)] ${accentClass(cat.slug)}`}
          >
            {m.eyebrow}
          </p>
          <h3 className="mt-4 font-display text-xl italic leading-[1.0] tracking-[-0.02em] text-[var(--ink)] md:text-2xl">
            {cat.name}
          </h3>
          <p className="mt-3 max-w-md text-[0.9375rem] leading-relaxed text-[var(--ink-soft)] md:text-base">
            {cat.description || m.descriptor}
          </p>
        </div>
      </Link>
    </Reveal>
  );
}

function CompanionChapter({ cat, index }: { cat: Category; index: number }) {
  const m = metaFor(cat.slug);
  return (
    <Reveal as="div" delay={(index as 0 | 1 | 2 | 3)}>
      <Link
        href={`/shop/${cat.slug}`}
        className="group relative block overflow-hidden rounded-[14px] border border-[var(--glass-border)] bg-[var(--warm-white)] shadow-[var(--shadow-soft)] transition-[border-color,box-shadow] duration-500 hover:border-[rgba(184,134,11,0.4)] hover:shadow-[var(--shadow-elite)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--gold)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bone)]"
        aria-label={`Enter the ${cat.name} chapter`}
      >
        <div className="relative aspect-[4/3] w-full overflow-hidden">
          <CategoryImageLayerFor cat={cat} />
        </div>
        <div className="p-5 md:p-6">
          <p
            className={`font-mono text-[13px] uppercase tracking-[0.12em] transition-colors duration-300 group-hover:text-[var(--gold-deep)] ${accentClass(cat.slug)}`}
          >
            {m.eyebrow}
          </p>
          <h3 className="mt-3 font-display text-lg italic leading-[1.0] tracking-[-0.015em] text-[var(--ink)] md:text-xl">
            {cat.name}
          </h3>
          <p className="mt-2 text-[0.9375rem] leading-relaxed text-[var(--ink-soft)]">
            {cat.description || m.descriptor}
          </p>
        </div>
      </Link>
    </Reveal>
  );
}

export default function CategoryDiscovery({ categories }: { categories: Category[] }) {
  if (categories.length === 0) return null;

  const lead = categories[0];
  const companions = categories.slice(1);

  return (
    <section
      aria-labelledby="terroir-heading"
      className="relative border-b border-[var(--line-on-light)] bg-[var(--warm-white)] px-6 py-16 md:py-20"
    >
      <div className="relative z-10 mx-auto max-w-[var(--content-wide)]">
        <div className="mt-8 grid grid-cols-1 gap-6 md:mt-12 md:grid-cols-12 md:gap-8">
          <LeadChapter cat={lead} />
          {companions.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:col-span-5 md:grid-cols-1 md:gap-6">
              {companions.map((cat, i) => (
                <CompanionChapter key={cat.id} cat={cat} index={i + 1} />
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}