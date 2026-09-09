import type { Metadata } from "next";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import { getSiteContent } from "@/lib/queries";

export const revalidate = 0;

export const metadata: Metadata = {
  title: "Origins",
  description:
    "Kenyan agricultural origins — Kirinyaga, Mt. Kenya, and the highland terroir that shapes the raw material before it is ever processed.",
  alternates: {
    canonical: "/origins",
  },
};

export default async function OriginsPage() {
  const content = await getSiteContent();
  const kirinyagaImg = content.origins_body_kirinyaga || "";
  const terroirImg = content.origins_body_terroir || "";
  return (
    <main className="surface-base">
      {/* Cinematic hero */}
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

        <div className="relative z-10 mx-auto w-full max-w-[var(--content-wide)]">
          <Reveal as="div" delay={0}>
            <p className="font-mono text-[12px] uppercase eyebrow-gold">
              Treadville · Kenya
            </p>
          </Reveal>
          <Reveal as="div" delay={1} className="mt-6">
            <h1 className="max-w-[14ch] font-display text-5xl italic leading-[1.0] tracking-[-0.02em] text-[var(--ink)] md:text-7xl lg:text-8xl">
              The land{" "}
              <span className="text-[var(--ink-soft)]">
                comes first.
              </span>
            </h1>
          </Reveal>
          <Reveal as="div" delay={2} className="mt-8 max-w-[48ch]">
            <p className="text-[1.0625rem] leading-relaxed text-[var(--ink-soft)] md:text-[1.125rem]">
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
              "linear-gradient(180deg, var(--bg-warm) 0%, var(--bg-base) 100%)",
          }}
        />
        <div className="relative z-10 mx-auto max-w-[var(--content-wide)]">
          <Reveal as="div" delay={0} className="grid grid-cols-1 gap-12 md:grid-cols-12 md:gap-10">
            <div className="md:col-span-7">
              <p className="font-mono text-[12px] uppercase eyebrow-gold">
                I · Kirinyaga
              </p>
              <h2 className="mt-5 max-w-[16ch] font-display text-3xl italic leading-[1.04] tracking-[-0.015em] text-[var(--ink)] md:text-5xl">
                Where coffee finds its voice
              </h2>
              <p className="mt-6 max-w-[52ch] text-[0.9375rem] leading-relaxed text-[var(--ink-soft)] md:text-[1.0625rem]">
                The slopes of Mt. Kenya — Kirinyaga — rise to over 1,800 metres
                above sea level. Volcanic basalt soils, fed by glacial streams and
                filtered through centuries of organic matter, create a growing
                medium unlike anywhere else in East Africa.
              </p>
              <p className="mt-4 max-w-[52ch] text-[0.9375rem] leading-relaxed text-[var(--ink-soft)] md:text-[1.0625rem]">
                Cool nights and bright days slow the cherry&apos;s development.
                Sugars concentrate. Acids find their balance. The result is a
                coffee that carries the signature of its place — a flavour that
                cannot be replicated elsewhere.
              </p>
            </div>
            <div className="md:col-span-5 md:flex md:items-center">
              <div className="aspect-[4/3] w-full overflow-hidden bg-[rgba(184,134,11,0.08)]">
                {kirinyagaImg ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={kirinyagaImg}
                    alt="The Kirinyaga highland landscape above the slopes of Mt. Kenya"
                    loading="lazy"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div aria-hidden className="flex h-full w-full items-center justify-center">
                    <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--ink-faint)]">
                      Kirinyaga · Photography pending
                    </p>
                  </div>
                )}
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
            background:
              "linear-gradient(180deg, var(--bg-base) 0%, var(--bg-warm) 100%)",
          }}
        />
        <div className="relative z-10 mx-auto max-w-[var(--content-wide)]">
          <Reveal as="div" delay={0} className="grid grid-cols-1 gap-12 md:grid-cols-12 md:gap-10">
            <div className="order-2 md:order-1 md:col-span-5 md:flex md:items-center">
              <div className="aspect-[4/3] w-full overflow-hidden bg-[rgba(184,134,11,0.08)]">
                {terroirImg ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={terroirImg}
                    alt="A close detail of volcanic Kenyan soil and the raw material it produces"
                    loading="lazy"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div aria-hidden className="flex h-full w-full items-center justify-center">
                    <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--ink-faint)]">
                      Terroir · Photography pending
                    </p>
                  </div>
                )}
              </div>
            </div>
            <div className="order-1 md:order-2 md:col-span-7">
              <p className="font-mono text-[12px] uppercase eyebrow-gold">
                II · Terroir
              </p>
              <h2 className="mt-5 max-w-[16ch] font-display text-3xl italic leading-[1.04] tracking-[-0.015em] text-[var(--ink)] md:text-5xl">
                Provenance is not a claim
              </h2>
              <p className="mt-6 max-w-[52ch] text-[0.9375rem] leading-relaxed text-[var(--ink-soft)] md:text-[1.0625rem]">
                Provenance means knowing — farm by farm, plot by plot — where a
                product originates. Treadville maintains direct relationships with
                growers across Kenya&apos;s agricultural zones. Every lot can be
                traced to its source.
              </p>
              <p className="mt-4 max-w-[52ch] text-[0.9375rem] leading-relaxed text-[var(--ink-soft)] md:text-[1.0625rem]">
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
              "linear-gradient(180deg, var(--bg-warm) 0%, var(--bg-base) 50%, var(--bg-warm) 100%)",
          }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[rgba(184,134,11,0.18)] to-transparent"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[rgba(184,134,11,0.18)] to-transparent"
        />
        <div className="relative z-10 mx-auto max-w-[var(--content-wide)]">
          <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
            {[
              { value: "Mt. Kenya", label: "Altitude source" },
              { value: "Volcanic", label: "Soil type" },
              { value: "Glacial", label: "Water source" },
            ].map(({ value, label }) => (
              <div key={label} className="text-center">
                <p className="font-display text-4xl italic text-[var(--ink)] md:text-5xl">
                  {value}
                </p>
                <p className="mt-2 font-mono text-[12px] uppercase eyebrow-gold">
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
          style={{
            background:
              "linear-gradient(180deg, var(--bg-base) 0%, var(--bg-warm) 100%)",
          }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-40"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, rgba(184, 134, 11, 0.06) 1px, transparent 0)",
            backgroundSize: "6px 6px",
          }}
        />
        <div className="relative z-10 mx-auto max-w-[var(--content-wide)] text-center">
          <Reveal as="div" delay={0}>
            <h2 className="font-display text-3xl italic leading-tight text-[var(--ink)] md:text-5xl">
              Ready to explore the catalogue?
            </h2>
            <p className="mt-4 max-w-[48ch] mx-auto text-[0.9375rem] leading-relaxed text-[var(--ink-soft)]">
              Each Treadville product carries its origin in its flavour.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <Link href="/shop" className="btn-cta">
                Explore products
              </Link>
              <Link href="/contact" className="btn-cta-ghost">
                Speak to us
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </main>
  );
}