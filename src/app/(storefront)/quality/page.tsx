import type { Metadata } from "next";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import { getSiteContent } from "@/lib/queries";

export const revalidate = 0;

export const metadata: Metadata = {
  title: "Quality",
  description:
    "Quality, grading, and traceability at Treadville — the discipline applied to every lot before it leaves Nairobi.",
  alternates: {
    canonical: "/quality",
  },
};

const STANDARDS = [
  {
    name: "SCA Cupping",
    value: "80+ baseline",
    note: "All Treadville specialty coffee is evaluated on the Specialty Coffee Association scale. Selected lots score higher.",
  },
  {
    name: "KEPHIS",
    value: "Plant health",
    note: "Kenya Plant Health Inspectorate Service compliance — the standard for plant and seed exports.",
  },
  {
    name: "SGS",
    value: "Independent quality",
    note: "Third-party quality verification references for selected export grades.",
  },
  {
    name: "USDA",
    value: "Warehouse",
    note: "United States Department of Agriculture registered warehousing references.",
  },
];

export default async function QualityPage() {
  const content = await getSiteContent();
  const heroImage = content.quality_hero || "";
  return (
    <main className="surface-base">
      {/* Hero */}
      <section className="relative flex min-h-[85vh] flex-col justify-end px-6 pb-20 pt-40 md:pb-28 md:pt-56 lg:pb-36">
        <div aria-hidden className="page-hero-light absolute inset-0" />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-30"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, rgba(184, 134, 11, 0.05) 1px, transparent 0)",
            backgroundSize: "7px 7px",
          }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[rgba(184,134,11,0.20)] to-transparent"
        />
        {heroImage ? (
          <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={heroImage}
              alt=""
              className="h-full w-full object-cover opacity-[0.16]"
              loading="lazy"
            />
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(180deg, rgba(250,247,240,0.88) 0%, rgba(250,247,240,0.55) 45%, rgba(250,247,240,0.90) 100%)",
              }}
            />
          </div>
        ) : null}

        <div className="relative z-10 mx-auto w-full max-w-[var(--content-wide)]">
          <Reveal as="div" delay={0}>
            <p className="font-mono text-[12px] uppercase eyebrow-gold">
              Treadville · Standards
            </p>
          </Reveal>
          <Reveal as="div" delay={1} className="mt-6">
            <h1 className="max-w-[14ch] font-display text-5xl italic leading-[1.0] tracking-[-0.02em] text-[var(--ink)] md:text-7xl lg:text-8xl">
              Quality,{" "}
              <span className="text-[var(--ink-soft)]">
                held to standard.
              </span>
            </h1>
          </Reveal>
          <Reveal as="div" delay={2} className="mt-8 max-w-[48ch]">
            <p className="text-[1.0625rem] leading-relaxed text-[var(--ink-soft)] md:text-[1.125rem]">
              The expectation of buyers is rising. Treadville&apos;s standard is to
              meet it — through independent evaluation, traceability, and
              certifications that mean something.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Standards grid */}
      <section className="relative px-6 py-24 md:py-32">
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, var(--bg-warm) 0%, var(--bg-base) 100%)",
          }}
        />
        <div className="relative z-10 mx-auto max-w-[var(--content-wide)]">
          <Reveal as="div" delay={0} className="max-w-2xl">
            <p className="font-mono text-[12px] uppercase eyebrow-gold">
              Standards & references
            </p>
            <h2 className="mt-5 font-display text-3xl italic leading-tight text-[var(--ink)] md:text-4xl">
              A short, considered list
            </h2>
            <p className="mt-4 text-[0.9375rem] leading-relaxed text-[var(--ink-soft)] md:text-[1.0625rem]">
              We work with the standards recognised by the markets that matter.
            </p>
          </Reveal>

          <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-2">
            {STANDARDS.map((s, i) => (
              <Reveal key={s.name} as="div" delay={(i % 5) as 0 | 1 | 2 | 3 | 4}>
                <div className="glass-card h-full">
                  <p className="font-mono text-[12px] uppercase eyebrow-gold">
                    {s.name}
                  </p>
                  <p className="mt-5 font-display text-2xl italic leading-tight text-[var(--ink)]">
                    {s.value}
                  </p>
                  <p className="mt-3 text-[0.9375rem] leading-relaxed text-[var(--ink-soft)]">
                    {s.note}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Process strip */}
      <section className="relative px-6 py-24 md:py-28">
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, var(--bg-base) 0%, var(--bg-warm) 50%, var(--bg-base) 100%)",
          }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[rgba(184,134,11,0.15)] to-transparent"
        />
        <div className="relative z-10 mx-auto max-w-[var(--content-wide)]">
          <Reveal as="div" delay={0} className="max-w-2xl">
            <p className="font-mono text-[12px] uppercase eyebrow-gold">
              Process
            </p>
            <h2 className="mt-5 font-display text-3xl italic leading-tight text-[var(--ink)] md:text-4xl">
              From source to shipment
            </h2>
          </Reveal>

          <ol className="mt-14 grid grid-cols-1 gap-10 md:grid-cols-4">
            {[
              { n: "01", t: "Sourcing", d: "Direct relationships with growers and cooperatives across Kenya." },
              { n: "02", t: "Evaluation", d: "SCA protocol cupping, sensory assessment, lot-level grading." },
              { n: "03", t: "Processing", d: "Milling, grading, and preparation for export and local delivery." },
              { n: "04", t: "Traceability", d: "Every lot linked to its source, recorded from intake to delivery." },
            ].map((step) => (
              <li key={step.n} className="relative border-t border-[rgba(184,134,11,0.20)] pt-6">
                <p className="font-mono text-[12px] uppercase eyebrow-gold">
                  {step.n}
                </p>
                <p className="mt-3 font-display text-xl italic text-[var(--ink)]">
                  {step.t}
                </p>
                <p className="mt-2 text-[0.9375rem] leading-relaxed text-[var(--ink-soft)]">
                  {step.d}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* CTA */}
      <section className="relative px-6 py-24 md:py-32">
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, var(--bg-base) 0%, var(--bg-warm) 100%)",
          }}
        />
        <div className="relative z-10 mx-auto max-w-[var(--content-wide)] text-center">
          <Reveal as="div" delay={0}>
            <h2 className="font-display text-3xl italic leading-tight text-[var(--ink)] md:text-5xl">
              Talk to us about a specific grade
            </h2>
            <p className="mt-4 max-w-[48ch] mx-auto text-[0.9375rem] leading-relaxed text-[var(--ink-soft)]">
              Sample requests, technical specifications, and export documentation
              on request.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <Link href="/contact" className="btn-cta">
                Request specification
              </Link>
              <Link href="/shop" className="btn-cta-ghost">
                See the catalogue
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </main>
  );
}