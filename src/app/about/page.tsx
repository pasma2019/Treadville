import type { Metadata } from "next";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import { getSiteContent } from "@/lib/queries";

export const revalidate = 0;

export const metadata: Metadata = {
  title: "About",
  description:
    "Treadville is a Kenyan agricultural platform working to transform agricultural resources into real wealth through market development, processing, and global networking.",
  alternates: {
    canonical: "/about",
  },
};

const PILLARS = [
  {
    t: "Sourcing",
    d: "Building the relationships that allow quality to remain consistent, lot after lot.",
  },
  {
    t: "Processing",
    d: "Milling, grading, and preparation carried out with the care that specialty buyers expect.",
  },
  {
    t: "Distribution",
    d: "Local delivery in Nairobi, nationwide shipping, and export logistics managed end-to-end.",
  },
  {
    t: "Market development",
    d: "Working to make Kenyan agricultural products more visible, more valuable, and better understood in the markets that matter.",
  },
];

export default async function AboutPage() {
  const content = await getSiteContent();
  const heroImage = content.about_hero || "";
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
              Treadville · About
            </p>
          </Reveal>
          <Reveal as="div" delay={1} className="mt-6">
            <h1 className="max-w-[14ch] font-display text-5xl italic leading-[1.0] tracking-[-0.02em] text-[var(--ink)] md:text-7xl lg:text-8xl">
              A platform for{" "}
              <span className="text-[var(--ink-soft)]">
                Kenyan agriculture.
              </span>
            </h1>
          </Reveal>
          <Reveal as="div" delay={2} className="mt-8 max-w-[52ch]">
            <p className="text-[1.0625rem] leading-relaxed text-[var(--ink-soft)] md:text-[1.125rem]">
              Treadville works to transform agricultural resources into real
              wealth — through market development, processing, value addition,
              and sustainable global networking.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Story */}
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
          <div className="grid grid-cols-1 gap-12 md:grid-cols-12">
            <Reveal as="div" delay={0} className="md:col-span-7">
              <p className="font-mono text-[12px] uppercase eyebrow-gold">
                The work
              </p>
              <h2 className="mt-5 font-display text-3xl italic leading-[1.05] tracking-[-0.015em] text-[var(--ink)] md:text-4xl">
                Built on three decades of expertise
              </h2>
              <p className="mt-6 max-w-[56ch] text-[0.9375rem] leading-relaxed text-[var(--ink-soft)] md:text-[1.0625rem]">
                Treadville brings together over thirty years of combined
                experience across the Kenyan agricultural value chain. The team
                has worked in coffee from the very beginning — in sourcing,
                in processing, in export, in specialty markets.
              </p>
              <p className="mt-4 max-w-[56ch] text-[0.9375rem] leading-relaxed text-[var(--ink-soft)] md:text-[1.0625rem]">
                The platform extends that expertise to tea, horticulture, and
                grains — building a single coherent commerce system for
                Kenya&apos;s agricultural products, locally and abroad.
              </p>
            </Reveal>
            <Reveal as="div" delay={1} className="md:col-span-5 md:flex md:items-center">
              <div className="w-full border-l border-[rgba(184,134,11,0.25)] pl-8">
                <p className="font-mono text-[12px] uppercase eyebrow-gold">
                  Mission
                </p>
                <p className="mt-4 font-display text-2xl italic leading-snug text-[var(--ink)]">
                  To build lasting value for Kenyan growers, and lasting
                  confidence for the buyers who serve them.
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Pillars */}
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
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[rgba(184,134,11,0.15)] to-transparent"
        />
        <div className="relative z-10 mx-auto max-w-[var(--content-wide)]">
          <Reveal as="div" delay={0} className="max-w-2xl">
            <p className="font-mono text-[12px] uppercase eyebrow-gold">
              What we do
            </p>
            <h2 className="mt-5 font-display text-3xl italic leading-tight text-[var(--ink)] md:text-4xl">
              Four pillars of the work
            </h2>
          </Reveal>

          <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-2">
            {PILLARS.map((p, i) => (
              <Reveal key={p.t} as="div" delay={(i % 5) as 0 | 1 | 2 | 3 | 4}>
                <div className="glass-card h-full">
                  <p className="font-mono text-[12px] uppercase eyebrow-gold">
                    {String(i + 1).padStart(2, "0")} · {p.t}
                  </p>
                  <p className="mt-4 font-display text-2xl italic leading-tight text-[var(--ink)]">
                    {p.d}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
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
              Looking for a long-term partner?
            </h2>
            <p className="mt-4 max-w-[48ch] mx-auto text-[0.9375rem] leading-relaxed text-[var(--ink-soft)]">
              Whether you&apos;re a local buyer, an importer, or a distributor —
              we&apos;d like to talk.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <Link href="/contact" className="btn-cta">
                Start a conversation
              </Link>
              <Link href="/export" className="btn-cta-ghost">
                Export enquiry
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </main>
  );
}