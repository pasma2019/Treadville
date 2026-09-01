import Link from "next/link";
import Reveal from "@/components/Reveal";

const ESSAYS = [
  {
    no: "01",
    title: "A note on Kirinyaga",
    excerpt:
      "Volcanic soil, glacial water, and a particular quality of light — what the highland terroir means for the coffee grown there.",
    meta: "Coming soon",
  },
  {
    no: "02",
    title: "Cupping at origin",
    excerpt:
      "The discipline of evaluating a lot before it leaves Nairobi — and why SCA protocol matters at the source, not only in the destination market.",
    meta: "Coming soon",
  },
  {
    no: "03",
    title: "From farm to export",
    excerpt:
      "How a lot moves from cherry to container — and the moments where quality is won or lost along the way.",
    meta: "Coming soon",
  },
];

export default function JournalPage() {
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
              Treadville · Journal
            </p>
          </Reveal>
          <Reveal as="div" delay={1} className="mt-6">
            <h1 className="max-w-[14ch] font-display text-5xl italic leading-[1.0] tracking-[-0.02em] text-[var(--ivory)] md:text-7xl lg:text-8xl">
              Field notes,{" "}
              <span className="text-[rgba(236,227,206,0.55)]">
                from Kenya.
              </span>
            </h1>
          </Reveal>
          <Reveal as="div" delay={2} className="mt-8 max-w-[48ch]">
            <p className="text-base leading-relaxed text-[rgba(236,227,206,0.70)] md:text-lg">
              A journal of writing on Kenyan agriculture, sourcing, processing,
              and the people behind the work.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Essays list */}
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
          <Reveal as="div" delay={0} className="max-w-2xl">
            <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-[rgba(212,190,145,0.55)]">
              Forthcoming
            </p>
            <h2 className="mt-5 font-display text-3xl italic leading-tight text-[var(--ivory)] md:text-4xl">
              The first three essays
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-[rgba(236,227,206,0.65)]">
              The Treadville Journal is in preparation. These are the first three
              pieces we are working on.
            </p>
          </Reveal>

          <ul className="mt-14 divide-y divide-[rgba(212,190,145,0.18)]">
            {ESSAYS.map((e, i) => (
              <Reveal as="li" key={e.no} delay={(i % 5) as 0 | 1 | 2 | 3 | 4} className="py-10">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-12 md:gap-10">
                  <div className="md:col-span-2">
                    <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-[rgba(212,190,145,0.55)]">
                      Essay {e.no}
                    </p>
                  </div>
                  <div className="md:col-span-7">
                    <p className="font-display text-2xl italic leading-tight text-[var(--ivory)] md:text-3xl">
                      {e.title}
                    </p>
                    <p className="mt-3 max-w-[60ch] text-sm leading-relaxed text-[rgba(236,227,206,0.68)]">
                      {e.excerpt}
                    </p>
                  </div>
                  <div className="md:col-span-3 md:text-right">
                    <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-[rgba(212,190,145,0.55)]">
                      {e.meta}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
          </ul>
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
              Subscribe to the journal
            </h2>
            <p className="mt-4 max-w-[48ch] mx-auto text-sm leading-relaxed text-[rgba(236,227,206,0.65)]">
              The first essays will be available in the coming season. Tell us
              where to send them.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/contact"
                className="inline-flex items-center gap-3 border border-[var(--ivory)] px-8 py-3 font-mono text-[11px] uppercase tracking-[0.28em] text-[var(--ivory)] transition-colors hover:bg-[var(--ivory)] hover:text-[var(--soil)]"
              >
                Request subscription
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </main>
  );
}
