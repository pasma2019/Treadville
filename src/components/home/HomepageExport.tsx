import Link from "next/link";
import Reveal from "@/components/Reveal";

type Props = {
  headline?: string;
  body?: string;
  image?: string;
};

export default function HomepageExport({
  headline = "Built for international buyers.",
  body = "Treadville supplies specialty agricultural products to importers, roasters, and distributors worldwide. Volume pricing, export documentation, and logistics support — from Nairobi to your destination.",
  image,
}: Props) {
  return (
    <section
      aria-labelledby="export-heading"
      className="export-maritime relative overflow-hidden"
    >
      <div className="relative z-10 mx-auto max-w-[var(--content-wide)]">
        <div className="grid grid-cols-1 gap-0 md:grid-cols-12 md:gap-0">
          {/* Text column */}
          <Reveal
            variant="light"
            as="div"
            delay={0}
            className="flex flex-col justify-center px-6 py-16 md:col-span-5 md:order-1 md:px-10 md:py-20 lg:px-14"
          >
            <p className="font-mono text-[12px] uppercase tracking-[0.2em] text-[var(--gold)]">
              Export
            </p>
            <h2
              id="export-heading"
              className="mt-6 max-w-[20ch] font-display text-[clamp(1.75rem,3.5vw,3rem)] italic leading-[1.08] tracking-[-0.015em] text-[var(--ink)]"
              style={{ textWrap: "balance" }}
            >
              {headline}
            </h2>

            {/* Gold divider */}
            <div
              aria-hidden
              className="mt-6 h-[2px] w-12"
              style={{ background: "var(--gold-gradient)" }}
            />

            <p className="mt-6 max-w-[38ch] text-[1rem] leading-[1.75] text-[var(--ink-soft)] md:text-[1.0625rem]">
              {body}
            </p>

            {/* Route metadata */}
            <div className="mt-8 flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--gold-deep)]">
                  Kenya
                </span>
                <span aria-hidden className="h-px w-6 bg-[var(--gold)]/40" />
              </div>
              <div className="flex items-center gap-2">
                <span aria-hidden className="h-px w-4 bg-[var(--gold)]/25" />
                <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--ink-muted)]">
                  Logistics
                </span>
                <span aria-hidden className="h-px w-6 bg-[var(--gold)]/40" />
              </div>
              <div className="flex items-center gap-2">
                <span aria-hidden className="h-px w-4 bg-[var(--gold)]/25" />
                <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--ink-muted)]">
                  Global
                </span>
              </div>
            </div>

            <Link
              href="/contact?type=Export%20%2F%20wholesale"
              className="group mt-10 inline-flex items-center gap-3 self-start font-mono text-[13px] font-semibold uppercase tracking-[0.2em] text-[var(--ink)] transition-colors hover:text-[var(--gold-deep)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--gold-deep)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-base)]"
            >
              Export enquiry
              <span
                aria-hidden
                className="h-px w-6 bg-current transition-all duration-500 group-hover:w-10"
              />
            </Link>
          </Reveal>

          {/* Image column */}
          <Reveal
            variant="light"
            as="div"
            delay={1}
            className="relative md:col-span-7 md:order-2"
          >
            <div
              className="relative overflow-hidden"
              style={{ aspectRatio: "4 / 3" }}
            >
              {image ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={image}
                  alt="Treadville export operations"
                  className="h-full w-full object-cover transition-transform duration-[1200ms] ease-[var(--ease-premium)] motion-reduce:transition-none"
                  style={{ objectPosition: "center 40%" }}
                  loading="lazy"
                />
              ) : (
                <div
                  className="h-full w-full"
                  style={{
                    background:
                      "radial-gradient(80% 60% at 70% 40%, rgba(184,134,11,0.08) 0%, var(--bg-warm) 70%), linear-gradient(135deg, var(--ivory) 0%, var(--parchment) 100%)",
                  }}
                />
              )}

              <div
                className="pointer-events-none absolute inset-0"
                aria-hidden
                style={{
                  background:
                    "linear-gradient(180deg, rgba(251,248,241,0.08) 0%, rgba(251,248,241,0.22) 100%)",
                }}
              />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
