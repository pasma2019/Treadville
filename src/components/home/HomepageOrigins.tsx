import Link from "next/link";
import Reveal from "@/components/Reveal";

type Props = {
  eyebrow?: string;
  headline?: string;
  intro?: string;
  image?: string;
  closing?: string;
};

export default function HomepageOrigins({
  eyebrow = "Origin · Kenya",
  headline = "Where it begins.",
  intro = "Every Treadville product starts in Kenyan soil — volcanic highlands, fertile plains, and equatorial climates that shape flavour before a hand ever touches it.",
  image,
  closing = "Discover our origins",
}: Props) {
  return (
    <section
      aria-labelledby="origins-heading"
      className="relative overflow-hidden"
      style={{
        background:
          "linear-gradient(180deg, var(--bg-base) 0%, var(--ivory) 40%, var(--bg-warm) 100%)",
      }}
    >
      <div className="relative z-10 mx-auto max-w-[var(--content-wide)]">
        <div className="grid grid-cols-1 gap-0 md:grid-cols-12 md:gap-0">
          {/* Image column — cinematic landscape */}
          <Reveal
            variant="light"
            as="div"
            delay={0}
            className="relative md:col-span-7"
          >
            <div
              className="relative overflow-hidden"
              style={{ aspectRatio: "4 / 3" }}
            >
              {image ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={image}
                  alt="Kenyan agricultural landscape"
                  className="h-full w-full object-cover transition-transform duration-[1200ms] ease-[var(--ease-premium)] motion-reduce:transition-none"
                  style={{ objectPosition: "center 40%" }}
                  loading="lazy"
                />
              ) : (
                <div
                  className="h-full w-full"
                  style={{
                    background:
                      "radial-gradient(80% 60% at 30% 40%, rgba(184,134,11,0.10) 0%, var(--bg-warm) 70%), linear-gradient(135deg, var(--ivory) 0%, var(--parchment) 100%)",
                  }}
                />
              )}

              {/* Warm luminous overlay */}
              <div
                className="pointer-events-none absolute inset-0"
                aria-hidden
                style={{
                  background:
                    "linear-gradient(180deg, rgba(251,248,241,0.08) 0%, rgba(251,248,241,0.25) 100%)",
                }}
              />
            </div>
          </Reveal>

          {/* Text column — editorial composition with provenance facts */}
          <Reveal
            variant="light"
            as="div"
            delay={1}
            className="flex flex-col justify-center px-6 py-16 md:col-span-5 md:px-10 md:py-20 lg:px-14"
          >
            <p className="font-mono text-[12px] uppercase tracking-[0.2em] text-[var(--gold)]">
              {eyebrow}
            </p>
            <h2
              id="origins-heading"
              className="mt-6 max-w-[18ch] font-display text-[clamp(1.75rem,3.5vw,3rem)] italic leading-[1.08] tracking-[-0.015em] text-[var(--ink)]"
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
              {intro}
            </p>

            {/* Two-column provenance facts */}
            <div className="mt-10 grid grid-cols-2 gap-6 border-t border-[var(--line-on-light)] pt-8">
              <div>
                <p className="font-display text-[clamp(1.5rem,3vw,2.25rem)] leading-none tracking-[-0.02em] text-[var(--ink)]">
                  Highland
                </p>
                <p className="mt-2 text-[0.8125rem] leading-relaxed text-[var(--ink-muted)]">
                  Volcanic origin
                </p>
              </div>
              <div>
                <p className="font-display text-[clamp(1.5rem,3vw,2.25rem)] leading-none tracking-[-0.02em] text-[var(--ink)]">
                  Kirinyaga
                </p>
                <p className="mt-2 text-[0.8125rem] leading-relaxed text-[var(--ink-muted)]">
                  Primary region
                </p>
              </div>
            </div>

            <Link
              href="/origins"
              className="group mt-10 inline-flex items-center gap-3 self-start font-mono text-[13px] font-semibold uppercase tracking-[0.2em] text-[var(--ink)] transition-colors hover:text-[var(--gold-deep)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--gold-deep)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-base)]"
            >
              {closing}
              <span
                aria-hidden
                className="h-px w-6 bg-current transition-all duration-500 group-hover:w-10"
              />
            </Link>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
