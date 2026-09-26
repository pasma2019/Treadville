import Link from "next/link";
import Reveal from "@/components/Reveal";

type Props = {
  eyebrow?: string;
  headline?: string;
  body?: string;
  closing?: string;
};

export default function HomepageIntro({
  eyebrow = "The Treadville approach",
  headline = "Three decades of Kenyan agriculture — now growing beyond coffee.",
  body = "Over 30 years of expertise in Kenyan agriculture — now expanding from specialty coffee into tea, horticulture, and grains, with the same standard of quality and traceability.",
  closing = "Est. 30+ years · Kenya",
}: Props) {
  return (
    <section
      aria-labelledby="intro-heading"
      className="relative px-6 pt-12 pb-24 md:pt-16 md:pb-36"
      style={{
        background:
          "linear-gradient(180deg, var(--warm-white) 0%, var(--bg-base) 100%)",
      }}
    >
      <div className="relative z-10 mx-auto max-w-[var(--content-wide)]">
        <Reveal
          variant="light"
          as="div"
          delay={0}
          className="grid grid-cols-1 gap-12 md:grid-cols-12 md:gap-16 lg:gap-20"
        >
          {/* Left — display statement */}
          <div className="md:col-span-7">
            <p className="font-mono text-[12px] uppercase tracking-[0.2em] text-[var(--gold)]">
              {eyebrow}
            </p>
            <h2
              id="intro-heading"
              className="mt-8 max-w-[22ch] font-display text-[clamp(2.25rem,5vw,4.5rem)] italic leading-[1.02] tracking-[-0.025em] text-[var(--ink)]"
              style={{ textWrap: "balance" }}
            >
              {headline}
            </h2>
          </div>

          {/* Right — explanation + CTA */}
          <div className="md:col-span-5 md:flex md:flex-col md:justify-end">
            <p className="max-w-[40ch] text-[1.0625rem] leading-[1.75] text-[var(--ink-soft)] md:text-[1.125rem]">
              {body}
            </p>
            <Link
              href="/about"
              className="group mt-8 inline-flex items-center gap-3 font-mono text-[13px] font-semibold uppercase tracking-[0.2em] text-[var(--ink)] transition-colors hover:text-[var(--gold-deep)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--gold-deep)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-base)]"
            >
              Discover Treadville
              <span
                aria-hidden
                className="h-px w-6 bg-current transition-all duration-500 group-hover:w-10"
              />
            </Link>
          </div>
        </Reveal>

        <Reveal
          variant="light"
          as="div"
          delay={1}
          className="mt-16 flex items-center gap-4 border-t border-[var(--line-on-light)] pt-8 md:mt-24"
        >
          <span aria-hidden className="font-mono text-[12px] uppercase tracking-[0.2em] text-[var(--gold)]">
            Treadville
          </span>
          <span
            aria-hidden
            className="h-px flex-1 max-w-[6rem] bg-[var(--line-on-light)]"
          />
          <p className="font-mono text-[12px] uppercase tracking-[0.2em] text-[var(--ink-muted)]">
            {closing}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
