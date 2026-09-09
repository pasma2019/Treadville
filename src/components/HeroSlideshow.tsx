"use client";

import Link from "next/link";
import { ChevronDown } from "lucide-react";

const THESIS_LINE_1 = "From Kenyan soil";
const THESIS_LINE_2 = "to global markets.";

const HERO_META = [
  { value: "30+", label: "Years" },
  { value: "04", label: "Categories" },
  { value: "Traceable", label: "Origin" },
] as const;

export default function HeroSlideshow({ heroImage }: { heroImage?: string }) {
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

      <div className="absolute left-0 right-0 z-20 hidden overflow-hidden px-6 md:top-[100px] md:block md:px-12">
        <div className="flex items-center justify-between">
          <div className="flex shrink-0 items-center gap-3">
            <span aria-hidden className="h-px w-6 bg-[var(--gold)]" />
            <p className="font-mono text-[13px] font-semibold uppercase tracking-[0.30em] text-[var(--ink)]">
              Treadville — Kirinyaga, Kenya
            </p>
          </div>
          <p className="shrink-0 font-mono text-[13px] font-semibold uppercase tracking-[0.30em] text-[var(--ink)]">
            Specialty agricultural products
          </p>
        </div>
      </div>

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
              <span className="block italic">{THESIS_LINE_1}{" "}</span>
              <span className="hero-accent-line">{THESIS_LINE_2}</span>
            </h1>

            <p className="mt-8 max-w-[42ch] text-[1.0625rem] leading-[1.7] text-[var(--ink-soft)]">
              Premium Kenyan agricultural products — specialty coffee, tea,
              horticulture, and grains — sourced with traceability and
              delivered to global markets.
            </p>

            <div className="mt-12 flex flex-wrap items-center gap-x-10 gap-y-6">
              <Link href="/shop" className="btn-cta group">
                Explore the collection
                <span
                  aria-hidden
                  className="inline-block h-px w-6 bg-current transition-all duration-500 group-hover:w-10"
                />
              </Link>
              <Link
                href="/contact"
                className="group inline-flex items-center gap-2 font-mono text-[13px] font-semibold uppercase tracking-[0.22em] text-[var(--ink-soft)] transition-colors hover:text-[var(--gold-deep)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--gold-deep)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--warm-white)]"
              >
                Work with Treadville
                <span
                  aria-hidden
                  className="inline-block h-px w-5 bg-current transition-all duration-500 group-hover:w-8"
                />
              </Link>
            </div>

            <div className="mt-10 flex flex-wrap items-center divide-x divide-[var(--line-on-light-strong)] font-mono text-[11px] font-semibold uppercase tracking-[0.24em] text-[var(--ink-muted)]">
              {HERO_META.map((m, i) => (
                <span key={m.label} className={i === 0 ? "pr-6" : "px-6"}>
                  {m.value}{" "}
                  <span className="text-[var(--ink-faint)]">{m.label}</span>
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