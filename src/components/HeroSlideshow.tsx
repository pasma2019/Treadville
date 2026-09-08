"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const THESIS_LINE_1 = "From Kenyan soil";
const THESIS_LINE_2 = "to global markets.";

export default function HeroSlideshow({ heroImage }: { heroImage?: string }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 24);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section
      aria-label="Treadville — From Kenyan soil to global markets"
      className="relative isolate overflow-hidden"
      style={{
        background:
          "radial-gradient(65% 50% at 82% 18%, rgba(111, 155, 99, 0.10) 0%, transparent 55%), linear-gradient(180deg, #fbf8f1 0%, #f0e7d2 100%)",
      }}
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
          {/* Photographic scrim — text-readability zone on left,
              full photograph clarity across the rest. */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(90deg, rgba(251,248,241,0.72) 0%, rgba(251,248,241,0.45) 45%, rgba(251,248,241,0.04) 70%, transparent 100%)",
            }}
          />
        </div>
      ) : null}

      {/* Desktop provenance bar — visually subordinate, hidden on mobile.
          overflow-hidden prevents the wide letter-spacing from escaping right-0. */}
      <div className="absolute top-6 left-0 right-0 z-20 hidden overflow-hidden px-6 md:block md:px-12">
        <div className="flex items-center justify-between">
          <div className="flex shrink-0 items-center gap-3">
            <span
              aria-hidden
              className="h-px w-6 bg-[var(--accent-sage)]"
            />
            <p className="font-mono text-[13px] font-semibold uppercase tracking-[0.30em] text-[var(--ink)]">
              Treadville — Kirinyaga, Kenya
            </p>
          </div>
          <p className="shrink-0 font-mono text-[13px] font-semibold uppercase tracking-[0.30em] text-[var(--ink)]">
            Specialty agricultural products
          </p>
        </div>
      </div>

      {/* Hero content — CTA is now in document flow, not absolute,
          so it cannot overlap the paragraph text. */}
      <div className="relative z-10 mx-auto flex min-h-[88svh] w-full max-w-[var(--content-cinema)] flex-col">
        <div className="mt-auto pb-12 pt-[4.5rem] md:pb-16 md:pt-[5rem] lg:pt-[5.5rem]">
          <div className="px-6 md:max-w-[42rem] md:px-12">
            <p className="hidden text-[var(--jade)] font-mono text-[13px] font-semibold uppercase tracking-[0.32em] md:mb-6 md:inline-block">
              <span aria-hidden className="mr-3 inline-block h-px w-8 align-middle bg-[var(--jade)]" />
              Specialty agricultural products
            </p>

            <h1
              id="hero-headline"
              className="display-hero text-balance"
            >
              <span className="block italic">{THESIS_LINE_1}{" "}</span>
              <span className="block text-[var(--ink-soft)]">{THESIS_LINE_2}</span>
            </h1>

            <p className="mt-8 max-w-[42ch] text-[1.0625rem] leading-[1.7] text-[var(--ink-soft)]">
              Premium Kenyan agricultural products — specialty coffee, tea,
              horticulture, and grains — sourced with traceability and
              delivered to global markets.
            </p>

            <div className="mt-10">
              <Link
                href="/shop"
                className="group inline-flex items-center gap-3 bg-[var(--ink)] px-7 py-4 font-mono text-[14px] uppercase tracking-[0.18em] text-[var(--warm-white)] transition-colors duration-[var(--dur)] hover:bg-[var(--accent-sage)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-sage)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--warm-white)]"
              >
                Shop the collection
                <span
                  aria-hidden
                  className="inline-block h-px w-4 bg-current transition-all duration-500 group-hover:w-7"
                />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
