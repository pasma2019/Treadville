import Link from "next/link";
import Reveal from "@/components/Reveal";

type Essay = {
  no: string;
  title: string;
  excerpt: string;
  meta: string;
};

const DEFAULT_ESSAYS: Essay[] = [
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
];

type Props = {
  eyebrow?: string;
  headline?: string;
  intro?: string;
  ctaLabel?: string;
  essays?: Essay[];
};

export default function JournalPreview({
  eyebrow = "Field notes",
  headline = "From the journal",
  intro = "Writing on terroir, sourcing, processing, and the people behind Treadville's agricultural products.",
  ctaLabel = "View the journal",
  essays = DEFAULT_ESSAYS,
}: Props) {
  return (
    <section
      aria-labelledby="journal-preview-heading"
      className="relative px-6 py-20 md:py-24"
      style={{
        background: "linear-gradient(180deg, #1a1209 0%, #0e0b08 100%)",
      }}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-25"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, rgba(212, 190, 145, 0.06) 1px, transparent 0)",
          backgroundSize: "6px 6px",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[rgba(212,190,145,0.18)] to-transparent"
      />

      <div className="relative z-10 mx-auto max-w-[var(--content-wide)]">
        <Reveal as="div" delay={0} className="grid grid-cols-1 items-end gap-8 md:grid-cols-12 md:gap-10">
          <div className="md:col-span-7">
            <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-[rgba(212,190,145,0.55)]">
              {eyebrow}
            </p>
            <h2
              id="journal-preview-heading"
              className="mt-5 max-w-[18ch] font-display text-3xl italic leading-[1.04] tracking-[-0.015em] text-[var(--ivory)] md:text-5xl"
            >
              {headline}
            </h2>
          </div>
          <div className="md:col-span-5">
            <p className="max-w-md text-sm leading-relaxed text-[rgba(236,227,206,0.65)] md:text-base">
              {intro}
            </p>
            <Link
              href="/journal"
              className="mt-5 inline-flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.28em] text-[var(--ivory)] underline decoration-[rgba(212,190,145,0.40)] underline-offset-4 transition-colors hover:text-[var(--accent)]"
            >
              {ctaLabel}
              <span
                aria-hidden
                className="h-px w-6 bg-[rgba(212,190,145,0.40)] transition-all duration-500 group-hover:w-10"
              />
            </Link>
          </div>
        </Reveal>

        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8">
          {essays.map((e, i) => (
            <Reveal
              key={e.no}
              as="article"
              delay={((i + 1) as 0 | 1 | 2 | 3 | 4 | 5)}
              className="group relative border border-[rgba(212,190,145,0.18)] bg-[rgba(20,15,7,0.50)] p-7 backdrop-blur-sm transition-colors duration-500 hover:border-[rgba(212,190,145,0.30)]"
            >
              <div className="flex items-center justify-between">
                <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-[rgba(212,190,145,0.55)]">
                  Essay {e.no}
                </p>
                <p className="font-mono text-[9px] uppercase tracking-[0.32em] text-[rgba(236,227,206,0.40)]">
                  {e.meta}
                </p>
              </div>
              <h3 className="mt-6 font-display text-2xl italic leading-tight text-[var(--ivory)] md:text-3xl">
                {e.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-[rgba(236,227,206,0.68)]">
                {e.excerpt}
              </p>
              <div
                aria-hidden
                className="mt-6 h-px w-8 bg-[var(--accent)] transition-all duration-500 group-hover:w-16"
                style={{ background: "rgba(212,190,145,0.45)" }}
              />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
