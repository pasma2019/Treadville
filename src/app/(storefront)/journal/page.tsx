import type { Metadata } from "next";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import { getArticles } from "@/lib/queries";

export const revalidate = 0;

export const metadata: Metadata = {
  title: "Journal",
  description:
    "Field notes from Kenya — writing on terroir, sourcing, processing, and the people behind Treadville's agricultural products.",
  alternates: {
    canonical: "/journal",
  },
};

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default async function JournalPage() {
  const articles = await getArticles(true);

  return (
    <main className="surface-base">
      {/* Hero */}
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
              Treadville · Journal
            </p>
          </Reveal>
          <Reveal as="div" delay={1} className="mt-6">
            <h1 className="max-w-[14ch] font-display text-5xl italic leading-[1.0] tracking-[-0.02em] text-[var(--ink)] md:text-7xl lg:text-8xl">
              Field notes,{" "}
              <span className="text-[var(--ink-soft)]">
                from Kenya.
              </span>
            </h1>
          </Reveal>
          <Reveal as="div" delay={2} className="mt-8 max-w-[48ch]">
            <p className="text-[1.0625rem] leading-relaxed text-[var(--ink-soft)] md:text-[1.125rem]">
              A journal of writing on Kenyan agriculture, sourcing, processing,
              and the people behind the work.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Articles list */}
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
          {articles.length === 0 ? (
            <div className="max-w-2xl">
              <p className="font-mono text-[12px] uppercase eyebrow-gold">
                Coming soon
              </p>
              <h2 className="mt-5 font-display text-3xl italic leading-tight text-[var(--ink)] md:text-4xl">
                The first essays
              </h2>
              <p className="mt-4 text-[0.9375rem] leading-relaxed text-[var(--ink-soft)]">
                The Treadville Journal is being prepared. The first pieces will appear here as they are completed and reviewed.
              </p>
            </div>
          ) : (
            <>
              <Reveal as="div" delay={0} className="max-w-2xl">
                <p className="font-mono text-[12px] uppercase eyebrow-gold">
                  {articles.length} {articles.length === 1 ? "essay" : "essays"}
                </p>
                <h2 className="mt-5 font-display text-3xl italic leading-tight text-[var(--ink)] md:text-4xl">
                  {articles.length === 1 ? "From the field" : "From the field"}
                </h2>
              </Reveal>

              <ul className="mt-14 divide-y divide-[rgba(184,134,11,0.15)]">
                {articles.map((article, i) => (
                  <Reveal
                    as="li"
                    key={article.id}
                    delay={((i % 5) as 0 | 1 | 2 | 3 | 4)}
                    className="py-10"
                  >
                    <Link
                      href={`/journal/${article.slug}`}
                      className="group grid grid-cols-1 gap-6 md:grid-cols-12 md:gap-10"
                    >
                      <div className="md:col-span-2">
                        <p className="font-mono text-[12px] uppercase eyebrow-gold">
                          Essay {String(i + 1).padStart(2, "0")}
                        </p>
                      </div>
                      <div className="md:col-span-7">
                        <p className="font-display text-2xl italic leading-tight text-[var(--ink)] transition-colors duration-300 group-hover:text-[var(--gold-deep)] md:text-3xl">
                          {article.title}
                        </p>
                        {article.excerpt && (
                          <p className="mt-3 max-w-[60ch] text-[0.9375rem] leading-relaxed text-[var(--ink-soft)]">
                            {article.excerpt}
                          </p>
                        )}
                      </div>
                      <div className="md:col-span-3 md:text-right">
                        <p className="font-mono text-[12px] uppercase eyebrow-gold">
                          {article.author_name && (
                            <span>{article.author_name} · </span>
                          )}
                          {formatDate(article.updated_at)}
                        </p>
                      </div>
                    </Link>
                  </Reveal>
                ))}
              </ul>
            </>
          )}
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
        <div className="relative z-10 mx-auto max-w-[var(--content-wide)] text-center">
          <Reveal as="div" delay={0}>
            <h2 className="font-display text-3xl italic leading-tight text-[var(--ink)] md:text-5xl">
              Write for the journal
            </h2>
            <p className="mt-4 mx-auto max-w-[48ch] text-[0.9375rem] leading-relaxed text-[var(--ink-soft)]">
              Have a story from the field? We work with partners, producers, and
              colleagues who want to share what they know.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/contact"
                className="btn-cta"
              >
                Get in touch
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </main>
  );
}