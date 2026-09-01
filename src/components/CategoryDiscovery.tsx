import Link from "next/link";
import Reveal from "@/components/Reveal";
import CategoryImageLayer from "@/components/CategoryImageLayer";
import { categoryAccent } from "@/lib/accents";
import type { Category } from "@/lib/types";

/**
 * Phase 2D — CategoryDiscovery transformed into a "luminous editorial world".
 *
 * Per the dark → light → dark → light → dark chapter system, this section
 * is the LIGHT beat between the cinematic hero and the dark Provenance.
 *
 * Each category receives a distinct visual world:
 *   - Coffee: lead chapter with oversized typography and full-bleed
 *     atmosphere
 *   - Tea, Horticulture, Grains: companion chapters with distinct
 *     atmospheres, accent lines, and editorial detail
 *
 * Architecture is identical to before; the only changes are the visual
 * treatment of the cards and the section wrapper.
 */

type CategoryAtmosphere = {
  eyebrow: string;
  descriptor: string;
  accent: string;
  atmosphere: string;
  surface: string;
  pattern: string;
  textOnAtmosphere: "light" | "dark";
};

function atmosphereFor(slug: string): CategoryAtmosphere {
  switch (slug) {
    case "coffee":
      return {
        eyebrow: "Origin · Cherry",
        descriptor: "High-altitude volcanic soils. Selected with the discipline the crop deserves.",
        accent: "var(--accent-coffee)",
        atmosphere:
          "radial-gradient(90% 60% at 30% 30%, rgba(168, 70, 31, 0.55) 0%, rgba(22, 17, 13, 0) 60%)," +
          "radial-gradient(70% 50% at 80% 80%, rgba(176, 141, 87, 0.35) 0%, rgba(22, 17, 13, 0) 60%)," +
          "linear-gradient(180deg, #2a160c 0%, #1a0f08 100%)",
        surface:
          "linear-gradient(180deg, rgba(22, 17, 13, 0) 0%, rgba(22, 17, 13, 0.20) 50%, rgba(22, 17, 13, 0.85) 100%)",
        pattern:
          "radial-gradient(circle at 1px 1px, rgba(236, 227, 206, 0.10) 1px, transparent 0)",
        textOnAtmosphere: "light",
      };
    case "tea":
      return {
        eyebrow: "Origin · Leaf",
        descriptor: "Highland mist and slow growth.",
        accent: "var(--accent-tea)",
        atmosphere:
          "radial-gradient(90% 60% at 70% 30%, rgba(147, 161, 60, 0.40) 0%, rgba(14, 18, 12, 0) 60%)," +
          "radial-gradient(70% 50% at 20% 80%, rgba(45, 74, 53, 0.55) 0%, rgba(14, 18, 12, 0) 60%)," +
          "linear-gradient(180deg, #0f1810 0%, #060a06 100%)",
        surface:
          "linear-gradient(180deg, rgba(6, 10, 6, 0) 0%, rgba(6, 10, 6, 0.20) 50%, rgba(6, 10, 6, 0.85) 100%)",
        pattern:
          "linear-gradient(135deg, rgba(196, 220, 168, 0.06) 0%, transparent 60%)",
        textOnAtmosphere: "light",
      };
    case "horticulture":
      return {
        eyebrow: "Origin · Bloom",
        descriptor: "Fertile lowland fields.",
        accent: "var(--accent-horticulture)",
        atmosphere:
          "radial-gradient(90% 60% at 30% 30%, rgba(147, 161, 60, 0.40) 0%, rgba(14, 18, 8, 0) 60%)," +
          "radial-gradient(70% 50% at 80% 80%, rgba(176, 141, 87, 0.25) 0%, rgba(14, 18, 8, 0) 60%)," +
          "linear-gradient(180deg, #161c0e 0%, #0a0f06 100%)",
        surface:
          "linear-gradient(180deg, rgba(10, 15, 6, 0) 0%, rgba(10, 15, 6, 0.20) 50%, rgba(10, 15, 6, 0.85) 100%)",
        pattern:
          "radial-gradient(circle at 1px 1px, rgba(236, 227, 206, 0.08) 1px, transparent 0)",
        textOnAtmosphere: "light",
      };
    case "grains":
      return {
        eyebrow: "Origin · Field",
        descriptor: "Sun-warmed plains and steady harvest.",
        accent: "var(--accent-grains)",
        atmosphere:
          "radial-gradient(90% 60% at 30% 30%, rgba(201, 154, 61, 0.45) 0%, rgba(22, 17, 13, 0) 60%)," +
          "radial-gradient(70% 50% at 80% 80%, rgba(176, 141, 87, 0.30) 0%, rgba(22, 17, 13, 0) 60%)," +
          "linear-gradient(180deg, #21180a 0%, #16100a 100%)",
        surface:
          "linear-gradient(180deg, rgba(22, 16, 10, 0) 0%, rgba(22, 16, 10, 0.20) 50%, rgba(22, 16, 10, 0.85) 100%)",
        pattern:
          "repeating-linear-gradient(45deg, rgba(236, 227, 206, 0.05) 0 1px, transparent 1px 6px)",
        textOnAtmosphere: "light",
      };
    default:
      return {
        eyebrow: "Origin",
        descriptor: "",
        accent: categoryAccent(slug),
        atmosphere:
          "radial-gradient(90% 60% at 30% 30%, rgba(168, 70, 31, 0.40) 0%, rgba(22, 17, 13, 0) 60%)," +
          "linear-gradient(180deg, #1f1610 0%, #15100a 100%)",
        surface: "linear-gradient(180deg, transparent, rgba(22,17,13,0.85))",
        pattern: "",
        textOnAtmosphere: "light",
      };
  }
}

function CategoryAtmosphere({ cat }: { cat: Category }) {
  const a = atmosphereFor(cat.slug);
  return (
    <div className="absolute inset-0" aria-hidden>
      <div className="absolute inset-0" style={{ background: a.atmosphere }} />
      {a.pattern ? (
        <div
          className="absolute inset-0 opacity-60 mix-blend-soft-light"
          style={{ backgroundImage: a.pattern, backgroundSize: "6px 6px" }}
        />
      ) : null}
      <div
        className="absolute inset-0"
        style={{ background: a.surface }}
      />
    </div>
  );
}

function CategoryImageLayerFor({ cat }: { cat: Category }) {
  if (!cat.image_url) return null;
  return (
    <CategoryImageLayer
      src={cat.image_url}
      className="absolute inset-0 h-full w-full object-cover transition-transform duration-[900ms] ease-[var(--ease-smooth)] group-hover:scale-[1.05]"
    />
  );
}

function ChapterMark({ slug, size = 96 }: { slug: string; size?: number }) {
  // Distinct composition per category
  if (slug === "coffee") {
    return (
      <svg viewBox="0 0 200 200" width={size} height={size} aria-hidden className="opacity-40">
        <defs>
          <linearGradient id="disc-coffee" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#a8461f" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#a8461f" stopOpacity="0.1" />
          </linearGradient>
        </defs>
        <circle cx="100" cy="100" r="80" fill="none" stroke="url(#disc-coffee)" strokeWidth="1" />
        <circle cx="100" cy="100" r="60" fill="none" stroke="url(#disc-coffee)" strokeWidth="0.5" />
        <ellipse cx="100" cy="100" rx="36" ry="48" fill="none" stroke="url(#disc-coffee)" strokeWidth="1" />
        <path d="M 100 52 C 96 76, 104 92, 100 116 C 96 132, 104 144, 100 148" stroke="url(#disc-coffee)" strokeWidth="0.8" fill="none" />
      </svg>
    );
  }
  if (slug === "tea") {
    return (
      <svg viewBox="0 0 200 200" width={size} height={size} aria-hidden className="opacity-40">
        <defs>
          <linearGradient id="disc-tea" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#5c7440" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#5c7440" stopOpacity="0.1" />
          </linearGradient>
        </defs>
        <circle cx="100" cy="100" r="80" fill="none" stroke="url(#disc-tea)" strokeWidth="1" />
        <path d="M 100 40 C 70 70, 70 130, 100 160 C 130 130, 130 70, 100 40 Z" fill="none" stroke="url(#disc-tea)" strokeWidth="1" />
        <line x1="100" y1="40" x2="100" y2="160" stroke="url(#disc-tea)" strokeWidth="0.5" />
        <path d="M 84 96 L 100 108 L 116 96" stroke="url(#disc-tea)" strokeWidth="0.8" fill="none" />
      </svg>
    );
  }
  if (slug === "horticulture") {
    return (
      <svg viewBox="0 0 200 200" width={size} height={size} aria-hidden className="opacity-40">
        <defs>
          <linearGradient id="disc-hort" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#93a13c" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#93a13c" stopOpacity="0.1" />
          </linearGradient>
        </defs>
        <circle cx="100" cy="100" r="80" fill="none" stroke="url(#disc-hort)" strokeWidth="1" />
        <circle cx="100" cy="86" r="14" fill="none" stroke="url(#disc-hort)" strokeWidth="1" />
        <path d="M 100 100 C 100 124, 92 144, 76 152" fill="none" stroke="url(#disc-hort)" strokeWidth="1" />
        <path d="M 100 100 C 100 124, 108 144, 124 152" fill="none" stroke="url(#disc-hort)" strokeWidth="1" />
        <path d="M 100 72 C 100 60, 92 56, 84 60" fill="none" stroke="url(#disc-hort)" strokeWidth="1" />
        <path d="M 100 72 C 100 60, 108 56, 116 60" fill="none" stroke="url(#disc-hort)" strokeWidth="1" />
      </svg>
    );
  }
  if (slug === "grains") {
    return (
      <svg viewBox="0 0 200 200" width={size} height={size} aria-hidden className="opacity-40">
        <defs>
          <linearGradient id="disc-grains" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#c99a3d" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#c99a3d" stopOpacity="0.1" />
          </linearGradient>
        </defs>
        <circle cx="100" cy="100" r="80" fill="none" stroke="url(#disc-grains)" strokeWidth="1" />
        <line x1="100" y1="40" x2="100" y2="160" stroke="url(#disc-grains)" strokeWidth="1" />
        <path d="M 100 70 C 86 70, 76 80, 76 94 C 92 94, 100 86, 100 70 Z" fill="none" stroke="url(#disc-grains)" strokeWidth="0.8" />
        <path d="M 100 70 C 114 70, 124 80, 124 94 C 108 94, 100 86, 100 70 Z" fill="none" stroke="url(#disc-grains)" strokeWidth="0.8" />
        <path d="M 100 100 C 86 100, 76 110, 76 124 C 92 124, 100 116, 100 100 Z" fill="none" stroke="url(#disc-grains)" strokeWidth="0.8" />
        <path d="M 100 100 C 114 100, 124 110, 124 124 C 108 124, 100 116, 100 100 Z" fill="none" stroke="url(#disc-grains)" strokeWidth="0.8" />
      </svg>
    );
  }
  return null;
}

function LeadChapter({ cat }: { cat: Category }) {
  const a = atmosphereFor(cat.slug);
  const accent = categoryAccent(cat.slug);
  return (
    <Reveal as="div" delay={0} className="md:col-span-7">
      <Link
        href={`/shop/${cat.slug}`}
        style={{ ["--accent" as string]: accent }}
        className="group relative block overflow-hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bone)]"
        aria-label={`Enter the ${cat.name} chapter`}
      >
        <div className="relative aspect-[4/5] w-full overflow-hidden md:aspect-[5/6]">
          <CategoryAtmosphere cat={cat} />
          <CategoryImageLayerFor cat={cat} />
          <div className="absolute inset-0 flex items-center justify-center">
            <ChapterMark slug={cat.slug} size={140} />
          </div>
          <div className="absolute inset-0 pointer-events-none transition-opacity duration-700 ease-out opacity-0 group-hover:opacity-100" style={{ background: `radial-gradient(60% 50% at 50% 50%, ${a.accent}33 0%, transparent 70%)` }} />
        </div>
        <div className="pointer-events-none absolute inset-0 flex flex-col justify-between p-6 md:p-10">
          <div className="flex items-start justify-between">
            <span
              className="font-mono text-[10px] uppercase tracking-[0.32em]"
              style={{ color: a.accent }}
            >
              {a.eyebrow}
            </span>
            <span className="font-mono text-[9px] uppercase tracking-[0.32em] text-[var(--parchment)]/40">
              Chapter 01 · Lead
            </span>
          </div>
          <div>
            <h3 className="font-display text-4xl italic leading-[1.0] tracking-[-0.02em] text-[var(--parchment)] md:text-6xl">
              {cat.name}
            </h3>
            <p className="mt-3 max-w-md text-sm leading-relaxed text-[var(--parchment)]/75 md:text-base">
              {cat.description || a.descriptor}
            </p>
            <div className="mt-5 inline-flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.3em] text-[var(--parchment)]/85">
              <span
                aria-hidden
                className="h-px w-8 transition-all duration-500 ease-out group-hover:w-12"
                style={{ background: a.accent }}
              />
              <span>Enter the chapter</span>
            </div>
          </div>
        </div>
      </Link>
    </Reveal>
  );
}

function CompanionChapter({ cat, index }: { cat: Category; index: number }) {
  const a = atmosphereFor(cat.slug);
  const accent = categoryAccent(cat.slug);
  return (
    <Reveal as="div" delay={(index as 0 | 1 | 2 | 3)}>
      <Link
        href={`/shop/${cat.slug}`}
        style={{ ["--accent" as string]: accent }}
        className="group relative block overflow-hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bone)]"
        aria-label={`Enter the ${cat.name} chapter`}
      >
        <div className="relative aspect-[4/3] w-full overflow-hidden">
          <CategoryAtmosphere cat={cat} />
          <CategoryImageLayerFor cat={cat} />
          <div className="absolute right-5 top-5">
            <ChapterMark slug={cat.slug} size={64} />
          </div>
        </div>
        <div className="pointer-events-none absolute inset-0 flex flex-col justify-end p-5 md:p-6">
          <span
            className="font-mono text-[9px] uppercase tracking-[0.32em]"
            style={{ color: a.accent }}
          >
            {a.eyebrow}
          </span>
          <h3 className="mt-2 font-display text-2xl italic leading-[1.0] tracking-[-0.015em] text-[var(--parchment)] md:text-3xl">
            {cat.name}
          </h3>
          <p className="mt-2 text-xs leading-relaxed text-[var(--parchment)]/70 md:text-sm">
            {cat.description || a.descriptor}
          </p>
          <div className="mt-3 inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--parchment)]/75">
            <span
              aria-hidden
              className="h-px w-6 transition-all duration-500 ease-out group-hover:w-10"
              style={{ background: a.accent }}
            />
            <span>Enter</span>
          </div>
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
      className="relative border-b border-[var(--line)] px-6 py-24 md:py-32"
      style={{ background: "var(--bone)", color: "var(--soil)" }}
    >
      {/* Luminous field — sparse paper texture, no dark base */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-50"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, rgba(22, 17, 13, 0.05) 1px, transparent 0)",
          backgroundSize: "8px 8px",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(60% 50% at 80% 0%, rgba(168, 70, 31, 0.05) 0%, rgba(244, 239, 228, 0) 50%)," +
            "radial-gradient(50% 40% at 0% 100%, rgba(45, 74, 53, 0.05) 0%, rgba(244, 239, 228, 0) 60%)",
        }}
      />

      <div className="relative z-10 mx-auto max-w-[var(--content-wide)]">
        <Reveal
          variant="light"
          as="div"
          delay={0}
          className="grid grid-cols-1 items-end gap-8 md:grid-cols-12 md:gap-10"
        >
          <div className="md:col-span-7">
            <p className="label-on-light">The Treadville world · Four chapters</p>
            <h2
              id="terroir-heading"
              className="mt-4 max-w-[18ch] font-display text-3xl italic leading-[1.05] tracking-[-0.015em] text-[var(--ink)] md:text-6xl"
            >
              One platform. <span className="text-[var(--ink-muted)]">Four distinct origins.</span>
            </h2>
          </div>
          <div className="md:col-span-5">
            <p className="body-on-light max-w-md md:text-lg">
              Coffee built the name. Tea, horticulture, and grains carry it
              forward — each with its own character, under one standard of
              quality.
            </p>
            <div className="mt-6 inline-flex items-center gap-3 label-on-light">
              <span aria-hidden className="h-px w-10 bg-[var(--ink-faint)]" />
              <span>Scroll for chapters</span>
            </div>
          </div>
        </Reveal>

        <div className="mt-14 grid grid-cols-1 gap-6 md:mt-20 md:grid-cols-12 md:gap-8">
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
