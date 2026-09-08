import Link from "next/link";
import Reveal from "@/components/Reveal";

type Essay = {
  no: string;
  title: string;
  excerpt: string;
  meta: string;
  image?: string;
};

const DEFAULT_ESSAYS: Essay[] = [
  {
    no: "01",
    title: "A note on Kirinyaga",
    excerpt:
      "Volcanic soil, glacial water, and a particular quality of light — what the highland terroir means for the coffee grown there.",
    meta: "Field notes",
  },
  {
    no: "02",
    title: "Cupping at origin",
    excerpt:
      "The discipline of evaluating a lot before it leaves Nairobi — and why SCA protocol matters at the source, not only in the destination market.",
    meta: "Field notes",
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
      className="relative px-6 py-20 md:py-28"
      style={{
        background:
          "linear-gradient(180deg, var(--warm-white) 0%, var(--bone) 100%)",
        color: "var(--ink)",
      }}
    >
      <div className="relative z-10 mx-auto max-w-[var(--content-wide)]">
        <Reveal as="div" delay={0} className="grid grid-cols-1 items-end gap-8 md:grid-cols-12 md:gap-10">
          <div className="md:col-span-7">
            <p className="font-mono text-[12px] uppercase eyebrow-gold">
              {eyebrow}
            </p>
            <h2
              id="journal-preview-heading"
              className="mt-5 max-w-[18ch] font-display text-3xl italic leading-[1.04] tracking-[-0.015em] text-[var(--ink)] md:text-5xl lg:text-[4.5rem]"
            >
              {headline}
            </h2>
          </div>
          <div className="md:col-span-5">
            <p className="max-w-md text-[1.0625rem] leading-relaxed text-[var(--ink-soft)] md:text-[1.125rem]">
              {intro}
            </p>
            <Link
              href="/journal"
              className="mt-6 inline-flex items-center gap-3 rounded-sm font-mono text-[15px] uppercase tracking-[0.16em] text-[var(--ink)] transition-colors hover:text-[var(--accent-sage)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-sage)] focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
            >
              {ctaLabel}
              <span
                aria-hidden
                className="h-px w-6 bg-[var(--ink)]/30 transition-all duration-500 group-hover:w-10"
              />
            </Link>
          </div>
        </Reveal>

        <div className="mt-12 grid grid-cols-1 gap-6 md:mt-16 md:grid-cols-3 md:gap-8">
          {essays.map((e, i) => (
            <Reveal
              key={e.no}
              as="article"
              delay={((i + 1) as 0 | 1 | 2 | 3 | 4 | 5)}
              className="journal-card group relative overflow-hidden border border-[var(--line-on-light)] bg-[var(--warm-white)]"
            >
              {e.image ? (
                <div className="aspect-[4/3] w-full overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={e.image}
                    alt=""
                    aria-hidden
                    loading="lazy"
                    className="h-full w-full object-cover opacity-90 transition-[opacity,transform] duration-[600ms] ease-[var(--ease-smooth)] group-hover:opacity-100 group-hover:scale-[1.04] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                    style={{ objectPosition: "center 50%" }}
                  />
                </div>
              ) : null}
              <div className="p-6 md:p-7">
                <div className="flex items-center justify-between">
                  <p className="font-mono text-[12px] uppercase tracking-[0.28em] text-[var(--ink-muted)]">
                    {e.meta}
                  </p>
                  <p className="font-mono text-[12px] uppercase tracking-[0.28em] text-[var(--ink-faint)]">
                    No. {e.no}
                  </p>
                </div>
                <h3 className="mt-5 font-display text-2xl italic leading-tight text-[var(--ink)] md:text-[1.75rem]">
                  {e.title}
                </h3>
                  <p className="mt-3 text-[0.9375rem] leading-relaxed text-[var(--ink-soft)]">
                  {e.excerpt}
                </p>
                <div
                  aria-hidden
                  className="journal-line mt-6 h-px w-8 transition-all duration-500 group-hover:w-16"
                />
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}