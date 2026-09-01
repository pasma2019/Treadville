import Link from "next/link";
import Reveal from "@/components/Reveal";

export default function OriginsPage() {
  return (
    <main className="surface-footer">
      {/* Cinematic hero */}
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
              Treadville · Kenya
            </p>
          </Reveal>
          <Reveal as="div" delay={1} className="mt-6">
            <h1 className="max-w-[14ch] font-display text-5xl italic leading-[1.0] tracking-[-0.02em] text-[var(--ivory)] md:text-7xl lg:text-8xl">
              The land{" "}
              <span className="text-[rgba(236,227,206,0.55)]">
                comes first.
              </span>
            </h1>
          </Reveal>
          <Reveal as="div" delay={2} className="mt-8 max-w-[48ch]">
            <p className="text-base leading-relaxed text-[rgba(236,227,206,0.70)] md:text-lg">
              Every Treadville product begins with soil, altitude, and the
              particular quality of Kenyan light. This is the story of the land
              that makes it possible.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Chapter I */}
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
          <Reveal as="div" delay={0} className="grid grid-cols-1 gap-12 md:grid-cols-12 md:gap-10">
            <div className="md:col-span-7">
              <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-[rgba(212,190,145,0.55)]">
                I · Kirinyaga
              </p>
              <h2 className="mt-5 max-w-[16ch] font-display text-3xl italic leading-[1.04] tracking-[-0.015em] text-[var(--ivory)] md:text-5xl">
                Where coffee finds its voice
              </h2>
              <p className="mt-6 max-w-[52ch] text-sm leading-relaxed text-[rgba(236,227,206,0.68)] md:text-base">
                The slopes of Mt. Kenya — Kirinyaga — rise to over 1,800 metres
                above sea level. Volcanic basalt soils, fed by glacial streams and
                filtered through centuries of organic matter, create a growing
                medium unlike anywhere else in East Africa.
              </p>
              <p className="mt-4 max-w-[52ch] text-sm leading-relaxed text-[rgba(236,227,206,0.68)] md:text-base">
                Cool nights and bright days slow the cherry&apos;s development.
                Sugars concentrate. Acids find their balance. The result is a
                coffee that carries the signature of its place — a flavour that
                cannot be replicated elsewhere.
              </p>
            </div>
            <div className="md:col-span-5 md:flex md:items-center">
              <div className="aspect-[4/3] w-full overflow-hidden bg-[rgba(212,190,145,0.06)]">
                <div
                  aria-hidden
                  className="flex h-full w-full items-center justify-center"
                >
                  <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-[rgba(212,190,145,0.30)]">
                    Kirinyaga · Photography pending
                  </p>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Chapter II */}
      <section className="relative px-6 py-24 md:py-32">
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background: "linear-gradient(180deg, #140f07 0%, #1a1209 100%)",
          }}
        />
        <div className="relative z-10 mx-auto max-w-[var(--content-wide)]">
          <Reveal as="div" delay={0} className="grid grid-cols-1 gap-12 md:grid-cols-12 md:gap-10">
            <div className="order-2 md:order-1 md:col-span-5 md:flex md:items-center">
              <div className="aspect-[4/3] w-full overflow-hidden bg-[rgba(212,190,145,0.06)]">
                <div
                  aria-hidden
                  className="flex h-full w-full items-center justify-center"
                >
                  <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-[rgba(212,190,145,0.30)]">
                    Terroir · Photography pending
                  </p>
                </div>
              </div>
            </div>
            <div className="order-1 md:order-2 md:col-span-7">
              <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-[rgba(212,190,145,0.55)]">
                II · Terroir
              </p>
              <h2 className="mt-5 max-w-[16ch] font-display text-3xl italic leading-[1.04] tracking-[-0.015em] text-[var(--ivory)] md:text-5xl">
                Provenance is not a claim
              </h2>
              <p className="mt-6 max-w-[52ch] text-sm leading-relaxed text-[rgba(236,227,206,0.68)] md:text-base">
                Provenance means knowing — farm by farm, plot by plot — where a
                product originates. Treadville maintains direct relationships with
                growers across Kenya&apos;s agricultural zones. Every lot can be
                traced to its source.
              </p>
              <p className="mt-4 max-w-[52ch] text-sm leading-relaxed text-[rgba(236,227,206,0.68)] md:text-base">
                This is not marketing language. It is the operational foundation
                of the business — the reason buyers who care about quality return.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Stats row */}
      <section className="relative px-6 py-20 md:py-24">
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, #1a1209 0%, #1e1508 50%, #140f07 100%)",
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
          <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
            {[
              { value: "Mt. Kenya", label: "Altitude source" },
              { value: "Volcanic", label: "Soil type" },
              { value: "Glacial", label: "Water source" },
            ].map(({ value, label }) => (
              <div key={label} className="text-center">
                <p className="font-display text-4xl italic text-[var(--ivory)] md:text-5xl">
                  {value}
                </p>
                <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.32em] text-[rgba(236,227,206,0.45)]">
                  {label}
                </p>
              </div>
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
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, rgba(212,190,145,0.08) 1px, transparent 0)",
            backgroundSize: "6px 6px",
          }}
        />
        <div className="relative z-10 mx-auto max-w-[var(--content-wide)] text-center">
          <Reveal as="div" delay={0}>
            <h2 className="font-display text-3xl italic leading-tight text-[var(--ivory)] md:text-5xl">
              Ready to explore the catalogue?
            </h2>
            <p className="mt-4 max-w-[48ch] mx-auto text-sm leading-relaxed text-[rgba(236,227,206,0.65)]">
              Each Treadville product carries its origin in its flavour.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/shop"
                className="inline-flex items-center gap-3 border border-[var(--ivory)] px-8 py-3 font-mono text-[11px] uppercase tracking-[0.28em] text-[var(--ivory)] transition-colors hover:bg-[var(--ivory)] hover:text-[var(--soil)]"
              >
                Explore products
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.28em] text-[rgba(236,227,206,0.65)] underline decoration-[rgba(212,190,145,0.40)] underline-offset-4 transition-colors hover:text-[var(--ivory)]"
              >
                Speak to us
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </main>
  );
}
