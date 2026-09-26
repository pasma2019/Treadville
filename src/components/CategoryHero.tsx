"use client";

import Reveal from "@/components/Reveal";
import Link from "next/link";

type CategoryHeroProps = {
  slug: string;
  name: string;
  description: string | null;
  imageUrl: string | null;
};

const HERO_META: Record<
  string,
  {
    eyebrow: string;
    microLabels: string[];
    textGradient: string;
    ctaLabel: string;
  }
> = {
  coffee: {
    eyebrow: "Catalogue · Coffee",
    microLabels: ["Origin · Kenya", "Specialty Arabica", "Highlands · Mt. Kenya"],
    textGradient: "linear-gradient(135deg, #fffdf7 0%, #f4e6cf 55%, #dfb36a 100%)",
    ctaLabel: "Explore Coffee",
  },
  tea: {
    eyebrow: "Catalogue · Tea",
    microLabels: ["Origin · Kenya", "High-Grown Tea", "Leaf · Craft · Character"],
    textGradient: "linear-gradient(135deg, #fcfef8 0%, #e9f0dc 55%, #b5cb97 100%)",
    ctaLabel: "Explore Tea",
  },
  horticulture: {
    eyebrow: "Catalogue · Horticulture",
    microLabels: ["Fresh Produce · Kenya", "Grown with Purpose", "Global Export"],
    textGradient: "linear-gradient(135deg, #fdfef5 0%, #eef3d4 55%, #ccd88a 100%)",
    ctaLabel: "Explore Horticulture",
  },
  grains: {
    eyebrow: "Catalogue · Grains",
    microLabels: ["Harvest · Kenya", "Grains · Pulses · Origin", "Sun-Warmed Plains"],
    textGradient: "linear-gradient(135deg, #fffdf6 0%, #f6e8c9 55%, #e4bd6d 100%)",
    ctaLabel: "Explore Grains",
  },
};

const FALLBACK_META = {
  eyebrow: "Catalogue",
  microLabels: [] as string[],
  textGradient: "linear-gradient(135deg, #fffdf7 0%, #f2ead8 55%, #dcc08a 100%)",
  ctaLabel: "Explore",
};

export default function CategoryHero({
  slug,
  name,
  description,
  imageUrl,
}: CategoryHeroProps) {
  const meta = HERO_META[slug] ?? FALLBACK_META;

  return (
    <section className="cat-hero relative w-full overflow-hidden" data-category={slug}>
      {/* Background image */}
      {imageUrl && (
        <div className="cat-hero-image absolute inset-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={imageUrl}
            alt=""
            aria-hidden
            className="h-full w-full object-cover"
            loading="eager"
            decoding="async"
            fetchPriority="high"
          />
        </div>
      )}

      {/* Text-contrast scrim — shared premium scrim, not a decorative vignette */}
      <div className="cat-hero-scrim pointer-events-none absolute inset-0" aria-hidden />
      <div
        className="cat-hero-scrim-content pointer-events-none absolute inset-y-0 left-0"
        aria-hidden
      />
      <div
        className="cat-hero-scrim-bottom pointer-events-none absolute inset-x-0 bottom-0 h-3/4"
        aria-hidden
      />

      {/* Content */}
      <div className="relative z-10 mx-auto flex min-h-[420px] flex-col justify-end px-6 pb-12 pt-32 md:min-h-[520px] md:px-10 md:pb-16 md:pt-36">
        <div className="max-w-[520px]">
          <Reveal as="div" delay={0}>
            <p className="cat-hero-eyebrow font-mono text-[11px] uppercase tracking-[0.22em]">
              {meta.eyebrow}
            </p>
          </Reveal>

          <Reveal as="div" delay={1}>
            <h1
              className="cat-hero-title mt-3 max-w-[14ch] font-display text-[2.75rem] italic leading-[0.98] tracking-[-0.02em] md:text-5xl lg:text-[3.75rem]"
              style={{ background: meta.textGradient, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}
            >
              {name}
            </h1>
          </Reveal>

          {description && (
            <Reveal as="div" delay={2}>
              <p className="cat-hero-description mt-4 max-w-[42ch] text-[0.9375rem] leading-relaxed md:text-[1.0625rem]">
                {description}
              </p>
            </Reveal>
          )}

          {/* Micro labels — category identity */}
          {meta.microLabels.length > 0 && (
            <Reveal as="div" delay={3}>
              <div className="mt-5 flex flex-wrap items-center gap-2">
                {meta.microLabels.map((label) => (
                  <span key={label} className="cat-hero-micro">
                    {label}
                  </span>
                ))}
              </div>
            </Reveal>
          )}

          <Reveal as="div" delay={4}>
            <Link
              href="#catalogue"
              className="cat-hero-cta group mt-6 inline-flex items-center gap-2.5"
            >
              <span>{meta.ctaLabel}</span>
              <span
                aria-hidden
                className="inline-block h-px w-5 bg-current transition-all duration-500 group-hover:w-8"
              />
            </Link>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
