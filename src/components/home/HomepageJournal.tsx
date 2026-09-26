import Link from "next/link";
import Reveal from "@/components/Reveal";
import type { Article } from "@/lib/types";

type Props = {
  articles: Article[];
};

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default function HomepageJournal({ articles }: Props) {
  const essays = articles
    .slice(0, 3)
    .map((article, index) => ({
      no: String(index + 1).padStart(2, "0"),
      title: article.title,
      excerpt: article.excerpt ?? "",
      meta: article.published_at
        ? formatDate(article.published_at)
        : "Field notes",
      image: article.cover_image_url ?? undefined,
      slug: article.slug,
    }));

  if (essays.length === 0) {
    return (
      <section
        aria-labelledby="journal-heading"
        className="journal-editorial relative px-6 py-20 md:py-28"
      >
        <div className="relative z-10 mx-auto max-w-[var(--content-wide)]">
          <Reveal variant="light" as="div" delay={0}>
            <p className="font-mono text-[12px] uppercase tracking-[0.2em] text-[var(--gold)]">
              Field notes
            </p>
            <h2
              id="journal-heading"
              className="mt-6 max-w-[18ch] font-display text-[clamp(2rem,4vw,3.5rem)] italic leading-[1.06] tracking-[-0.02em] text-[var(--ink)]"
            >
              From the journal
            </h2>
            <p className="mt-4 max-w-[42ch] text-[1.0625rem] leading-relaxed text-[var(--ink-soft)]">
              Writing on terroir, sourcing, processing, and the people behind
              Treadville&apos;s agricultural products.
            </p>
          </Reveal>

          {/* Empty state — premium editorial teaser */}
          <div
            className="mt-14 relative overflow-hidden rounded-[12px] bg-[var(--bg-warm)] p-12 text-center md:mt-20 md:p-16"
            style={{
              background:
                "radial-gradient(60% 50% at 50% 80%, rgba(184,134,11,0.04) 0%, transparent 60%), var(--bg-warm)",
            }}
          >
            {/* Decorative editorial lines */}
            <div className="pointer-events-none absolute inset-0 opacity-[0.025]" aria-hidden>
              <div
                className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2"
                style={{ background: "var(--gold)" }}
              />
            </div>

            <p className="relative font-mono text-[11px] uppercase tracking-[0.28em] text-[var(--gold)]">
              The Treadville Journal
            </p>
            <div
              aria-hidden
              className="mx-auto mt-4 h-px w-10"
              style={{ background: "var(--gold-gradient)" }}
            />
            <h3
              className="relative mt-6 font-display text-[clamp(1.5rem,3vw,2.25rem)] italic leading-[1.1] text-[var(--ink)]"
              style={{ textWrap: "balance" }}
            >
              Stories from origin,<br className="hidden md:block" /> coming soon.
            </h3>
            <p className="relative mx-auto mt-4 max-w-[38ch] text-[0.9375rem] leading-relaxed text-[var(--ink-soft)]">
              Field notes on terroir, processing, and the agricultural
              knowledge behind every lot — publishing soon.
            </p>
            <div className="relative mt-6 flex items-center justify-center gap-4">
              <span className="h-px w-8 bg-[var(--line-on-light)]" />
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--ink-muted)]">
                Treadville
              </span>
              <span className="h-px w-8 bg-[var(--line-on-light)]" />
            </div>
          </div>
        </div>
      </section>
    );
  }

  const [feature, ...supporting] = essays;

  return (
    <section
      aria-labelledby="journal-heading"
      className="journal-editorial relative px-6 py-20 md:py-28"
    >
      <div className="relative z-10 mx-auto max-w-[var(--content-wide)]">
        <Reveal variant="light" as="div" delay={0}>
          <p className="font-mono text-[12px] uppercase tracking-[0.2em] text-[var(--gold)]">
            Field notes
          </p>
          <h2
            id="journal-heading"
            className="mt-6 max-w-[18ch] font-display text-[clamp(2rem,4vw,3.5rem)] italic leading-[1.06] tracking-[-0.02em] text-[var(--ink)]"
          >
            From the journal
          </h2>
        </Reveal>

        <div className="mt-14 grid grid-cols-1 gap-8 md:mt-16 md:grid-cols-12 md:gap-8">
          {/* Feature article — large editorial */}
          <Reveal
            variant="light"
            as="div"
            delay={0}
            className="md:col-span-7"
          >
            <Link
              href={`/journal/${feature.slug}`}
              className="group block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--gold-deep)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--warm-white)]"
            >
              <article className="journal-card group relative overflow-hidden border border-[var(--line-on-light)] bg-[var(--warm-white)] transition-colors hover:border-[var(--gold)]/30">
                {feature.image ? (
                  <div className="aspect-[16 / 10] w-full overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={feature.image}
                      alt=""
                      aria-hidden
                      loading="lazy"
                      className="h-full w-full object-cover opacity-90 transition-[opacity,transform] duration-[800ms] ease-[var(--ease-premium)] motion-reduce:transition-none"
                    />
                  </div>
                ) : (
                  <div
                    className="aspect-[16 / 10] w-full"
                    style={{
                      background:
                        "linear-gradient(135deg, var(--bg-warm) 0%, var(--parchment) 100%)",
                    }}
                  />
                )}
                <div className="p-7 md:p-10">
                  <div className="flex items-center justify-between">
                    <p className="font-mono text-[12px] uppercase tracking-[0.28em] text-[var(--ink-muted)]">
                      {feature.meta}
                    </p>
                    <p className="font-mono text-[12px] uppercase tracking-[0.28em] text-[var(--ink-faint)]">
                      No. {feature.no}
                    </p>
                  </div>
                  <h3 className="mt-5 font-display text-[clamp(1.5rem,2.5vw,2.25rem)] italic leading-[1.1] text-[var(--ink)]">
                    {feature.title}
                  </h3>
                  <p className="mt-3 text-[0.9375rem] leading-relaxed text-[var(--ink-soft)]">
                    {feature.excerpt}
                  </p>
                  <div className="mt-6 flex items-center gap-3">
                    <span className="font-mono text-[13px] uppercase tracking-[0.2em] text-[var(--gold-deep)]">
                      Read article
                    </span>
                    <span
                      aria-hidden
                      className="journal-line h-px w-6 transition-all duration-500 group-hover:w-10"
                    />
                  </div>
                </div>
              </article>
            </Link>
          </Reveal>

          {/* Supporting articles — stacked editorial */}
          <div className="flex flex-col gap-6 md:col-span-5 md:gap-6">
            {supporting.map((essay, i) => (
              <Reveal
                key={essay.slug}
                variant="light"
                as="div"
                delay={((i + 1) as 0 | 1 | 2 | 3 | 4 | 5)}
              >
                <Link
                  href={`/journal/${essay.slug}`}
                  className="group block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--gold-deep)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--warm-white)]"
                >
                  <article className="journal-card group relative flex overflow-hidden border border-[var(--line-on-light)] bg-[var(--warm-white)] transition-colors hover:border-[var(--gold)]/30">
                    {essay.image ? (
                      <div className="relative h-32 w-28 shrink-0 overflow-hidden">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={essay.image}
                          alt=""
                          aria-hidden
                          loading="lazy"
                          className="h-full w-full object-cover opacity-90 transition-[opacity,transform] duration-[600ms] ease-[var(--ease-premium)] motion-reduce:transition-none"
                        />
                      </div>
                    ) : null}
                    <div className="flex min-w-0 flex-1 flex-col justify-center p-5">
                      <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-[var(--ink-muted)]">
                        {essay.meta}
                      </p>
                      <h3 className="mt-2 font-display text-lg italic leading-tight text-[var(--ink)]">
                        {essay.title}
                      </h3>
                      <div className="mt-3 flex items-center gap-2">
                        <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--gold-deep)]">
                          Read
                        </span>
                        <span
                          aria-hidden
                          className="journal-line h-px w-4 transition-all duration-500 group-hover:w-8"
                        />
                      </div>
                    </div>
                  </article>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>

        <Reveal variant="light" as="div" delay={2} className="mt-10">
          <Link
            href="/journal"
            className="group inline-flex items-center gap-3 font-mono text-[13px] font-semibold uppercase tracking-[0.2em] text-[var(--ink)] transition-colors hover:text-[var(--gold-deep)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--gold-deep)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--warm-white)]"
          >
            View the journal
            <span
              aria-hidden
              className="h-px w-6 bg-current transition-all duration-500 group-hover:w-10"
            />
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
