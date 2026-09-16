"use client";

import Link from "next/link";
import { ChevronDown } from "lucide-react";

const HERO_META = [
  { value: "30+", label: "Years" },
  { value: "04", label: "Categories" },
  { value: "Traceable", label: "Origin" },
] as const;

export default function HeroSlideshow({
  heroImage,
  headline = "From Kenyan soil\nto global markets.",
  subheadline = "Premium Kenyan agricultural products — specialty coffee, tea, horticulture, and grains — sourced with traceability and delivered to global markets.",
}: {
  heroImage?: string;
  headline?: string;
  subheadline?: string;
}) {
  const lines = (headline ?? "").split("\n").filter((l) => l.trim().length > 0);
  const thesisLine1 = lines[0] ?? "From Kenyan soil";
  const thesisLine2 = lines[1] ?? "";
  return (
    <section
      aria-label="Treadville — From Kenyan soil to global markets"
      className="hero-atmosphere relative isolate overflow-hidden"
    >
      {heroImage ? (
        <div aria-hidden className="pointer-events-none absolute inset-0 z-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={heroImage}
            alt=""
            aria-hidden
            className="h-full w-full object-cover"
            style={{ objectPosition: "center 42%" }}
            loading="eager"
            decoding="async"
            fetchPriority="high"
          />
          <div aria-hidden className="hero-overlay absolute inset-0" />
        </div>
      ) : null}

      <div
        aria-hidden
        className="hero-glow pointer-events-none absolute -left-40 top-1/4 z-[5] h-[34rem] w-[34rem] rounded-full"
      />

      <div className="relative z-10 mx-auto flex min-h-[88svh] w-full max-w-[var(--content-cinema)] flex-col">
        <div className="mt-auto pb-12 pt-[5rem] md:pb-16 md:pt-[6rem]">
          <div className="px-6 md:max-w-[42rem] md:px-12">
            <span aria-hidden className="hero-gold-rule mb-5 block" />
            <p className="hero-eyebrow mb-6">
              <span
                aria-hidden
                className="inline-block h-px w-5 bg-[var(--gold)]"
              />
              Specialty agricultural products
            </p>

            <h1 id="hero-headline" className="hero-headline text-balance">
              <span className="block italic">{thesisLine1}{" "}</span>
              {thesisLine2 ? (
                <span className="hero-accent-line">{thesisLine2}</span>
              ) : null}
            </h1>

            <p className="mt-8 max-w-[42ch] text-[1.0625rem] leading-[1.7] text-[#E5E5E0] font-normal">
              {subheadline}
            </p>

            <div className="mt-12 flex flex-wrap items-center gap-x-10 gap-y-6">
              <Link href="/shop" className="btn-cta group">
                Explore the collection
                <span
                  aria-hidden
                  className="inline-block h-px w-6 bg-current origin-left transition-transform duration-500 group-hover:scale-x-100"
                  style={{ transform: 'scaleX(0.6)' } as React.CSSProperties}
                /></Link>
              <Link
                href="/contact"
                className="hero-secondary-cta group inline-flex items-center justify-center gap-2 font-mono text-[13px] font-semibold uppercase tracking-[0.22em] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--gold-deep)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--warm-white)]"
              >
                Work with Treadville
                <span
                  aria-hidden
                  className="inline-block h-px w-5 bg-current origin-left transition-transform duration-500 group-hover:scale-x-100"
                  style={{ transform: 'scaleX(0.625)' } as React.CSSProperties}
                />
              </Link>
            </div>

            <div className="mt-10 flex flex-wrap items-center gap-3 font-mono text-[11px] font-semibold uppercase tracking-[0.24em]">
              {HERO_META.map((m, i) => (
                <span key={m.label} className="hero-stat-pill">
                  <span className="hero-stat-value">{m.value}</span>{" "}
                  <span className="hero-stat-label">{m.label}</span>
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div
        aria-hidden
        className="scroll-cue pointer-events-none absolute bottom-6 left-1/2 z-10 hidden -translate-x-1/2 md:flex"
      >
        <ChevronDown size={20} strokeWidth={1.75} />
      </div>
    </section>
  );
}