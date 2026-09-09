import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { getArticleBySlug } from "@/lib/queries";
import Reveal from "@/components/Reveal";
import { ArticleJsonLd, BreadcrumbJsonLd } from "@/lib/structured-data";

export const revalidate = 0;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) {
    return { title: "Article not found" };
  }

  const ogImage = article.cover_image_url
    ? { url: article.cover_image_url }
    : undefined;

  return {
    title: article.title,
    description: article.excerpt ?? undefined,
    alternates: {
      canonical: `/journal/${slug}`,
    },
    openGraph: {
      title: article.title,
      description: article.excerpt ?? undefined,
      type: "article",
      ...(ogImage ? { images: [ogImage] } : {}),
    },
  };
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function renderBody(body: string | null): React.ReactNode {
  if (!body) return null;
  if (body.includes("<")) {
    return <div dangerouslySetInnerHTML={{ __html: body }} />;
  }
  return (
    <div className="space-y-5">
      {body.split(/\n+/).filter((p) => p.trim()).map((para, i) => (
        <p key={i} className="text-[1.0625rem] leading-[1.8] text-[var(--ink-soft)] md:text-[1.125rem]">
          {para}
        </p>
      ))}
    </div>
  );
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) notFound();

  const articleUrl = `https://treadville.co.ke/journal/${slug}`;

  return (
    <main className="surface-base">
      <ArticleJsonLd article={article} url={articleUrl} />
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: "https://treadville.co.ke/" },
          { name: "Journal", url: "https://treadville.co.ke/journal" },
          { name: article.title, url: articleUrl },
        ]}
      />
      {/* Back */}
      <div className="px-6 pt-28 md:pt-32">
        <Link
          href="/journal"
          className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.28em] text-[var(--gold-deep)] transition-colors hover:text-[var(--gold)]"
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M7 2L3 6l4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Journal
        </Link>
      </div>

      {/* Hero */}
      <section className="relative mt-8 px-6 md:mt-12 lg:mt-16">
        <div className="mx-auto max-w-[var(--content-wide)]">
          <Reveal as="div" delay={0} className="max-w-3xl">
            <p className="font-mono text-[11px] uppercase eyebrow-gold">
              Essay
            </p>
            <h1 className="mt-5 max-w-[20ch] font-display text-4xl italic leading-[1.05] tracking-[-0.015em] text-[var(--ink)] md:text-5xl lg:text-6xl">
              {article.title}
            </h1>
            {(article.author_name || article.updated_at) && (
              <p className="mt-5 font-mono text-[11px] uppercase eyebrow-gold">
                {article.author_name && <span>By {article.author_name}</span>}
                {article.author_name && article.updated_at && " · "}
                {article.updated_at && formatDate(article.updated_at)}
              </p>
            )}
            {article.excerpt && (
              <p className="mt-8 max-w-[56ch] text-[1.0625rem] leading-[1.7] italic text-[var(--ink-soft)] md:text-[1.125rem]">
                {article.excerpt}
              </p>
            )}
          </Reveal>
        </div>
      </section>

      {/* Cover image */}
      {article.cover_image_url && (
        <section className="relative mt-12 px-6 md:mt-16">
          <div className="mx-auto max-w-[var(--content-wide)]">
            <Reveal as="div" delay={0}>
              <div className="overflow-hidden rounded-sm">
                <img
                  src={article.cover_image_url}
                  alt={article.title}
                  className="h-auto w-full object-cover"
                  style={{ maxHeight: "70vh" }}
                />
              </div>
            </Reveal>
          </div>
        </section>
      )}

      {/* Body */}
      {article.body && (
        <section className="relative mt-12 px-6 pb-24 md:mt-16 md:pb-32">
          <div className="mx-auto max-w-[var(--content-wide)]">
            <Reveal as="div" delay={0} className="max-w-2xl">
              <div className="border-t border-[rgba(184,134,11,0.18)] pt-10">
                {renderBody(article.body)}
              </div>
            </Reveal>
          </div>
        </section>
      )}

      {/* Footer CTA */}
      <section className="relative border-t border-[rgba(184,134,11,0.15)] px-6 py-20 md:py-28">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, var(--bg-base) 0%, var(--bg-warm) 100%)",
          }}
        />
        <div className="relative z-10 mx-auto max-w-[var(--content-wide)] text-center">
          <Reveal as="div" delay={0}>
            <p className="font-mono text-[11px] uppercase eyebrow-gold">
              More from the field
            </p>
            <h2 className="mt-4 font-display text-2xl italic leading-tight text-[var(--ink)] md:text-3xl">
              Read more from the Treadville Journal
            </h2>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <Link href="/journal" className="btn-cta">
                Back to Journal
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
