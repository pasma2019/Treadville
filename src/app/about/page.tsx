import type { Metadata } from "next";
import Link from "next/link";
import Reveal from "@/components/Reveal";

export const metadata: Metadata = {
  title: "About",
  description:
    "Treadville is a Kenyan agricultural platform working to transform agricultural resources into real wealth through market development, processing, and global networking.",
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

export default function AboutPage() {
  return (
    <main className="surface-footer">
      {/* Hero */}
      <section className="relative flex min-h-[85vh] flex-col justify-end px-6 pb-20 pt-40 md:pb-28 md:pt-56 lg:pb-36">
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(175deg, #0f0b08 0%, #1a1209 40%, #261c12 70%, #1e1508 100%)",
          }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-30"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, rgba(212, 190, 145, 0.06) 1px, transparent 0)",
            backgroundSize: "7px 7px",
          }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[rgba(212,190,145,0.25)] to-transparent"
        />

        <div className="relative z-10 mx-auto w-full max-w-[var(--content-wide)]">
          <Reveal as="div" delay={0}>
            <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-[rgba(236,227,206,0.45)]">
              Treadville · About
            </p>
          </Reveal>
          <Reveal as="div" delay={1} className="mt-6">
            <h1 className="max-w-[14ch] font-display text-5xl italic leading-[1.0] tracking-[-0.02em] text-[var(--ivory)] md:text-7xl lg:text-8xl">
              A platform for{" "}
              <span className="text-[rgba(236,227,206,0.55)]">
                Kenyan agriculture.
              </span>
            </h1>
          </Reveal>
          <Reveal as="div" delay={2} className="mt-8 max-w-[52ch]">
            <p className="text-base leading-relaxed text-[rgba(236,227,206,0.70)] md:text-lg">
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
              "linear-gradient(180deg, #1e1508 0%, #140f07 100%)",
          }}
        />
        <div className="relative z-10 mx-auto max-w-[var(--content-wide)]">
          <div className="grid grid-cols-1 gap-12 md:grid-cols-12">
            <Reveal as="div" delay={0} className="md:col-span-7">
              <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-[rgba(212,190,145,0.55)]">
                The work
              </p>
              <h2 className="mt-5 font-display text-3xl italic leading-[1.05] tracking-[-0.015em] text-[var(--ivory)] md:text-4xl">
                Built on three decades of expertise
              </h2>
              <p className="mt-6 max-w-[56ch] text-sm leading-relaxed text-[rgba(236,227,206,0.68)] md:text-base">
                Treadville brings together over thirty years of combined
                experience across the Kenyan agricultural value chain. The team
                has worked in coffee from the very beginning — in sourcing,
                in processing, in export, in specialty markets.
              </p>
              <p className="mt-4 max-w-[56ch] text-sm leading-relaxed text-[rgba(236,227,206,0.68)] md:text-base">
                The platform extends that expertise to tea, horticulture, and
                grains — building a single coherent commerce system for
                Kenya&apos;s agricultural products, locally and abroad.
              </p>
            </Reveal>
            <Reveal as="div" delay={1} className="md:col-span-5 md:flex md:items-center">
              <div className="w-full border-l border-[rgba(212,190,145,0.20)] pl-8">
                <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-[rgba(212,190,145,0.55)]">
                  Mission
                </p>
                <p className="mt-4 font-display text-2xl italic leading-snug text-[var(--ivory)]">
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
              "linear-gradient(180deg, #140f07 0%, #1a1209 50%, #140f07 100%)",
          }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[rgba(212,190,145,0.18)] to-transparent"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[rgba(212,190,145,0.18)] to-transparent"
        />
        <div className="relative z-10 mx-auto max-w-[var(--content-wide)]">
          <Reveal as="div" delay={0} className="max-w-2xl">
            <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-[rgba(212,190,145,0.55)]">
              What we do
            </p>
            <h2 className="mt-5 font-display text-3xl italic leading-tight text-[var(--ivory)] md:text-4xl">
              Four pillars of the work
            </h2>
          </Reveal>

          <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-2">
            {PILLARS.map((p, i) => (
              <Reveal key={p.t} as="div" delay={(i % 5) as 0 | 1 | 2 | 3 | 4}>
                <div className="h-full border border-[rgba(212,190,145,0.18)] bg-[rgba(20,15,7,0.40)] p-7">
                  <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-[rgba(212,190,145,0.55)]">
                    {String(i + 1).padStart(2, "0")} · {p.t}
                  </p>
                  <p className="mt-4 font-display text-2xl italic leading-tight text-[var(--ivory)]">
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
          style={{ background: "#140f07" }}
        />
        <div className="relative z-10 mx-auto max-w-[var(--content-wide)] text-center">
          <Reveal as="div" delay={0}>
            <h2 className="font-display text-3xl italic leading-tight text-[var(--ivory)] md:text-5xl">
              Looking for a long-term partner?
            </h2>
            <p className="mt-4 max-w-[48ch] mx-auto text-sm leading-relaxed text-[rgba(236,227,206,0.65)]">
              Whether you&apos;re a local buyer, an importer, or a distributor —
              we&apos;d like to talk.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/contact"
                className="inline-flex items-center gap-3 border border-[var(--ivory)] px-8 py-3 font-mono text-[11px] uppercase tracking-[0.28em] text-[var(--ivory)] transition-colors hover:bg-[var(--ivory)] hover:text-[var(--soil)]"
              >
                Start a conversation
              </Link>
              <Link
                href="/export"
                className="inline-flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.28em] text-[rgba(236,227,206,0.65)] underline decoration-[rgba(212,190,145,0.40)] underline-offset-4 transition-colors hover:text-[var(--ivory)]"
              >
                Export enquiry
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </main>
  );
}
