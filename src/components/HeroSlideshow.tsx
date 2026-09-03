"use client";

import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { CHAPTERS } from "./HeroChapters";
import { ChapterVisual } from "./HeroChapters";

const THESIS_LINE_1 = "From Kenyan soil";
const THESIS_LINE_2 = "to global markets.";

export default function HeroSlideshow() {
  const [active, setActive] = useState(0);
  const sectionRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        setActive((a) => (a - 1 + CHAPTERS.length) % CHAPTERS.length);
      }
      if (e.key === "ArrowRight") {
        setActive((a) => (a + 1) % CHAPTERS.length);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const chapter = CHAPTERS[active];
  const heroChapter = CHAPTERS[0];

  return (
    <section
      ref={sectionRef}
      aria-label="Treadville — From Kenyan soil to global markets"
      className="relative isolate min-h-[100svh] overflow-hidden"
      style={{ background: "var(--atmosphere-hero)" }}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0 opacity-40"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, rgba(26, 20, 16, 0.035) 1px, transparent 0)",
          backgroundSize: "7px 7px",
        }}
      />

      {/* Hero composition — left text / right visual, single dominant frame */}
      <div className="relative z-10 mx-auto flex min-h-[100svh] max-w-[var(--content-cinema)] flex-col">
        {/* Top provenance bar */}
        <div className="flex items-center justify-between px-6 pt-8 md:px-10 md:pt-12">
          <div className="flex items-center gap-3">
            <span
              aria-hidden
              className="hidden h-px w-8 bg-[var(--ink)]/20 md:block"
            />
            <span className="font-mono text-[10px] uppercase tracking-[0.32em] text-[var(--ink-soft)]">
              <span className="text-[var(--ink)]">Treadville</span>
              <span className="mx-2 text-[var(--ink-faint)]">/</span>
              <span>Volcanic Highlands · Kenya</span>
            </span>
          </div>
          <span className="font-mono text-[10px] uppercase tracking-[0.32em] text-[var(--ink-faint)] tabular-nums">
            {String(active + 1).padStart(2, "0")} / {String(CHAPTERS.length).padStart(2, "0")}
          </span>
        </div>

        {/* Main editorial split — text on the left, visual on the right */}
        <div className="grid flex-1 grid-cols-1 items-end gap-6 px-6 pb-12 pt-6 md:px-10 md:pb-16 md:pt-10 lg:grid-cols-12 lg:gap-10 lg:pb-20">
          {/* Text column */}
          <div className="lg:col-span-8">
            <p className="inline-flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.32em] text-[var(--accent-sage)]">
              <span
                aria-hidden
                className="inline-block h-px w-8 bg-[var(--accent-sage)]"
              />
              {chapter.eyebrow}
            </p>

            <h1
              id="hero-headline"
              className="mt-6 max-w-[18ch] font-display font-medium leading-[0.92] tracking-[-0.025em] text-[var(--ink)] text-[3.5rem] sm:text-[4.5rem] md:text-[6rem] lg:max-w-[none] lg:text-[7.5rem] xl:text-[9rem]"
            >
              <span className="block text-balance italic" style={{ fontStyle: "italic" }}>
                {THESIS_LINE_1}
              </span>
              <span
                className="block text-balance"
                style={{
                  fontStyle: "italic",
                  color: "var(--ink-soft)",
                }}
              >
                {THESIS_LINE_2}
              </span>
            </h1>

            <p className="mt-6 max-w-[40ch] text-base leading-relaxed text-[var(--ink-soft)] sm:mt-8 md:max-w-[44ch] md:text-lg">
              {chapter.subtitle}
            </p>

            {/* Verified metadata — provenance, quality, scale */}
            <div className="mt-7 flex flex-wrap items-center gap-x-8 gap-y-3 border-t border-[var(--line-on-light)] pt-5 md:mt-9">
              {chapter.meta.map((m) => (
                <div key={m.label} className="flex flex-col gap-0.5">
                  <span className="font-mono text-[9px] uppercase tracking-[0.3em] text-[var(--ink-faint)]">
                    {m.label}
                  </span>
                  <span className="font-display text-base italic text-[var(--ink)] md:text-lg">
                    {m.value}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-4 md:mt-10">
              <Link
                href={chapter.ctaHref}
                className="group inline-flex items-center gap-3 bg-[var(--ink)] px-7 py-3.5 font-mono text-[11px] uppercase tracking-[0.26em] text-[var(--warm-white)] transition-colors duration-[var(--dur)] ease-[var(--ease-out)] hover:bg-[var(--accent-sage)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-sage)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--warm-white)]"
              >
                {chapter.ctaLabel}
                <span
                  aria-hidden
                  className="inline-block h-px w-4 bg-current transition-all duration-500 ease-[var(--ease-out)] group-hover:w-7"
                />
              </Link>
              <Link
                href={chapter.secondaryCtaHref}
                className="group inline-flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.26em] text-[var(--ink-soft)] transition-colors duration-[var(--dur-fast)] hover:text-[var(--ink)] focus-visible:outline-none focus-visible:text-[var(--ink)]"
              >
                {chapter.secondaryCtaLabel}
                <span
                  aria-hidden
                  className="inline-block h-px w-5 bg-[var(--ink)]/45 transition-all duration-500 ease-[var(--ease-out)] group-hover:w-8 group-hover:bg-[var(--accent-sage)]"
                />
              </Link>
            </div>
          </div>

          {/* Right visual — editorial composition, understated */}
          <div className="relative hidden h-[480px] overflow-hidden lg:col-span-4 lg:flex lg:items-end">
            <div
              className="absolute inset-x-[-10%] bottom-[-8%] h-[112%] transition-opacity duration-[1400ms] ease-[var(--ease-cinema)]"
              style={{ opacity: 1 }}
            >
              <ChapterVisual
                visual={heroChapter.visual}
                className="h-full w-full"
              />
            </div>
            {/* Faint edge fade so the visual lands softly on the page */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  "linear-gradient(90deg, var(--warm-white) 0%, rgba(251,248,241,0) 16%, rgba(251,248,241,0) 84%, rgba(251,248,241,0) 100%)",
              }}
            />
            <div
              aria-hidden
              className="pointer-events-none absolute inset-x-0 bottom-0 h-32"
              style={{
                background:
                  "linear-gradient(180deg, rgba(251,248,241,0) 0%, rgba(251,248,241,0.85) 100%)",
              }}
            />
          </div>
        </div>

        {/* Editorial "told through" strip — replaces carousel dot-nav */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-[var(--line-on-light)] px-6 pb-6 pt-5 md:px-10 md:pb-8">
          <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--ink-faint)]">
            Treadville · Specialty agricultural products from Kenya
          </p>
          <a
            href="#category-chapters"
            className="group flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--ink-muted)] transition-colors duration-[var(--dur-fast)] hover:text-[var(--ink)] focus-visible:outline-none"
          >
            <span
              aria-hidden
              className="h-px w-6 bg-[var(--ink)]/30 transition-all duration-500 ease-[var(--ease-out)] group-hover:w-8 group-hover:bg-[var(--accent-sage)]"
            />
            <span>Explore the chapters</span>
          </a>
        </div>
      </div>
    </section>
  );
}
