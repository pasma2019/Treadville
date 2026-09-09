import type { Metadata } from "next";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import { getSiteContent } from "@/lib/queries";

export const revalidate = 0;

export const metadata: Metadata = {
  title: "Export",
  description:
    "Export and wholesale enquiries for Treadville specialty Kenyan coffee, tea, horticulture, and grains.",
  alternates: {
    canonical: "/export",
  },
};

const DESTINATIONS = [
  { region: "Europe", markets: "Specialty importers, roasters, distributors" },
  { region: "Middle East", markets: "Foodservice, hospitality, retail" },
  { region: "Asia Pacific", markets: "Specialty traders, food manufacturers" },
  { region: "East Africa", markets: "Regional distributors, hospitality" },
];

export default async function ExportPage() {
  const content = await getSiteContent();
  const heroImage = content.export_hero || "";
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
              Treadville · Export
            </p>
          </Reveal>
          <Reveal as="div" delay={1} className="mt-6">
            <h1 className="max-w-[14ch] font-display text-5xl italic leading-[1.0] tracking-[-0.02em] text-[var(--ink)] md:text-7xl lg:text-8xl">
              Built for{" "}
              <span className="text-[var(--ink-soft)]">
                global markets.
              </span>
            </h1>
          </Reveal>
          <Reveal as="div" delay={2} className="mt-8 max-w-[48ch]">
            <p className="text-[1.0625rem] leading-relaxed text-[var(--ink-soft)] md:text-[1.125rem]">
              Treadville has export capability — from Nairobi to ports around the
              world. We handle documentation, compliance, and logistics so buyers
              can focus on the product.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Capabilities */}
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
              Capabilities
            </p>
            <h2 className="mt-5 font-display text-3xl italic leading-tight text-[var(--ink)] md:text-4xl">
              What we handle on your behalf
            </h2>
          </Reveal>

          <div className="mt-14 grid grid-cols-1 gap-8 md:grid-cols-3">
            {[
              {
                title: "Documentation",
                items: [
                  "Phytosanitary certificates",
                  "Certificate of origin",
                  "Export declaration",
                  "Bill of lading coordination",
                ],
              },
              {
                title: "Compliance",
                items: [
                  "KEPHIS export clearance",
                  "Destination country requirements",
                  "Documentation per market",
                  "Customs classification",
                ],
              },
              {
                title: "Logistics",
                items: [
                  "FCL and LCL shipping",
                  "Air freight for samples",
                  "Port of Mombasa coordination",
                  "Warehouse-to-port handling",
                ],
              },
            ].map((col, ci) => (
              <Reveal key={col.title} as="div" delay={(ci % 5) as 0 | 1 | 2 | 3 | 4}>
                <div className="border-t border-[rgba(184,134,11,0.20)] pt-6">
                  <p className="font-display text-xl italic text-[var(--ink)]">
                    {col.title}
                  </p>
                  <ul className="mt-4 space-y-3">
                    {col.items.map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-3 text-[0.9375rem] text-[var(--ink-soft)]"
                    >
                        <span
                          aria-hidden
                          className="mt-2 h-px w-4 flex-shrink-0 bg-[rgba(184,134,11,0.40)]"
                        />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Markets */}
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
              Capability regions
            </p>
            <h2 className="mt-5 font-display text-3xl italic leading-tight text-[var(--ink)] md:text-4xl">
              Markets where Treadville can deliver
            </h2>
          </Reveal>

          <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            {DESTINATIONS.map((d, i) => (
              <Reveal key={d.region} as="div" delay={(i % 5) as 0 | 1 | 2 | 3 | 4}>
                <div className="glass-card h-full">
                  <p className="font-mono text-[12px] uppercase eyebrow-gold">
                    {d.region}
                  </p>
                  <p className="mt-3 font-display text-xl italic leading-tight text-[var(--ink)]">
                    {d.markets}
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
              Start an export enquiry
            </h2>
            <p className="mt-4 max-w-[48ch] mx-auto text-[0.9375rem] leading-relaxed text-[var(--ink-soft)]">
              Tell us your destination market, product type, and volume. We&apos;ll
              respond with a specification and shipping estimate.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <Link href="/contact" className="btn-cta">
                Open export enquiry
              </Link>
              <Link href="/shop" className="btn-cta-ghost">
                Browse catalogue
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </main>
  );
}