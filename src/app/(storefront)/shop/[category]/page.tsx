import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getCategories, getCategoryBySlug, getProducts } from "@/lib/queries";
import CategoryTabs from "@/components/CategoryTabs";
import Reveal from "@/components/Reveal";
import Link from "next/link";
import type { Product } from "@/lib/types";
import ProductImage from "@/components/ProductImage";
import CategoryMark, { accentFor } from "@/components/CategoryMark";
import { getSiteContent } from "@/lib/queries";
import { BreadcrumbJsonLd } from "@/lib/structured-data";

export const revalidate = 0;

const SITE_URL = "https://treadville.co.ke";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}): Promise<Metadata> {
  const { category: slug } = await params;
  const cat = await getCategoryBySlug(slug);
  if (!cat) return {};
  return {
    title: cat.name,
    description:
      cat.description ||
      `Browse Treadville ${cat.name.toLowerCase()} products. Traceable origins. Exceptional quality.`,
    alternates: {
      canonical: `/shop/${slug}`,
    },
  };
}

export default async function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const { category: slug } = await params;
  const [categories, category, products, content] = await Promise.all([
    getCategories(),
    getCategoryBySlug(slug),
    getProducts({ categorySlug: slug, publishedOnly: true }),
    getSiteContent(),
  ]);

  if (!category) notFound();

  const heroImage = content[`category_hero_${slug}` as keyof typeof content] as string | undefined;

  return (
    <main className="surface-warm">
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: `${SITE_URL}/` },
          { name: "Shop", url: `${SITE_URL}/shop` },
          { name: category.name, url: `${SITE_URL}/shop/${slug}` },
        ]}
      />
      {heroImage ? (
        <div className="relative h-[400px] w-full overflow-hidden md:h-[480px]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={heroImage}
            alt=""
            aria-hidden
            className="absolute inset-0 h-full w-full object-cover"
            loading="eager"
            decoding="async"
            fetchPriority="high"
          />
          {/* Directional scrim — soft left-to-right dark gradient behind text column only */}
          <div
            className="pointer-events-none absolute inset-y-0 left-0 w-2/3 md:w-1/2"
            style={{
              background:
                "linear-gradient(90deg, rgba(250,247,240,0.90) 0%, rgba(250,247,240,0.55) 50%, rgba(250,247,240,0.05) 100%)",
            }}
          />
          {/* Text content over the image */}
          <div className="absolute inset-0 flex items-end">
            <div className="relative z-10 mx-auto w-full max-w-[var(--content-wide)] px-6 pb-10 md:px-10 md:pb-14">
              <Reveal variant="light" as="div" delay={0}>
                <p className="font-mono text-[12px] uppercase tracking-[0.20em] text-[var(--gold-deep)]">
                  Catalogue · {category.name}
                </p>
                <h1 className="mt-2 max-w-[16ch] font-display text-4xl italic leading-[1.02] tracking-[-0.015em] text-[var(--ink)] md:text-5xl lg:text-6xl">
                  {category.name}
                </h1>
                {category.description && (
                  <p className="mt-3 max-w-[44ch] text-[15px] leading-relaxed text-[var(--ink-soft)] md:text-[16px]">
                    {category.description}
                  </p>
                )}
              </Reveal>
            </div>
          </div>
        </div>
      ) : category.image_url ? (
        /* Category image hero — editorial composition */
        <div className="relative h-[400px] w-full overflow-hidden md:h-[480px]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={category.image_url}
            alt=""
            aria-hidden
            className="absolute inset-0 h-full w-full object-cover"
            loading="eager"
            decoding="async"
            fetchPriority="high"
          />
          <div
            className="pointer-events-none absolute inset-y-0 left-0 w-2/3 md:w-1/2"
            style={{
              background:
                "linear-gradient(90deg, rgba(250,247,240,0.90) 0%, rgba(250,247,240,0.55) 50%, rgba(250,247,240,0.05) 100%)",
            }}
          />
          <div className="absolute inset-0 flex items-end">
            <div className="relative z-10 mx-auto w-full max-w-[var(--content-wide)] px-6 pb-10 md:px-10 md:pb-14">
              <Reveal variant="light" as="div" delay={0}>
                <p className="font-mono text-[12px] uppercase tracking-[0.20em] text-[var(--gold-deep)]">
                  Catalogue · {category.name}
                </p>
                <h1 className="mt-2 max-w-[16ch] font-display text-4xl italic leading-[1.02] tracking-[-0.015em] text-[var(--ink)] md:text-5xl lg:text-6xl">
                  {category.name}
                </h1>
                {category.description && (
                  <p className="mt-3 max-w-[44ch] text-[15px] leading-relaxed text-[var(--ink-soft)] md:text-[16px]">
                    {category.description}
                  </p>
                )}
              </Reveal>
            </div>
          </div>
        </div>
      ) : (
        /* No hero image — clean editorial header */
        <div className="border-b border-[var(--line-on-light)]">
          <div className="mx-auto max-w-[var(--content-wide)] px-6 pt-28 pb-10 md:px-10 md:pt-32 md:pb-14">
            <Reveal variant="light" as="div" delay={0}>
              <p className="font-mono text-[12px] uppercase tracking-[0.20em] eyebrow-gold">
                Catalogue · {category.name}
              </p>
              <h1 className="mt-2 max-w-[16ch] font-display text-4xl italic leading-[1.02] tracking-[-0.015em] text-[var(--ink)] md:text-5xl lg:text-6xl">
                {category.name}
              </h1>
              {category.description && (
                <p className="mt-3 max-w-[44ch] text-[15px] leading-relaxed text-[var(--ink-soft)] md:text-[16px]">
                  {category.description}
                </p>
              )}
            </Reveal>
          </div>
        </div>
      )}

      {/* Category navigation — dedicated light surface */}
      <div className="border-b border-[var(--line-on-light)] bg-[var(--warm-white)]">
        <div className="mx-auto max-w-[var(--content-wide)] px-6 py-5 md:px-10">
          <CategoryTabs categories={categories} activeSlug={slug} />
        </div>
      </div>

      {/* Catalogue area */}
      <div className="mx-auto max-w-[var(--content-wide)] px-6 py-12 md:px-10 md:py-16">
        {products.length > 0 ? (
          <div className="grid grid-cols-2 gap-x-5 gap-y-10 md:grid-cols-3 lg:grid-cols-4">
            {products.map((p, i) => (
              <Reveal
                key={p.id}
                variant="light"
                as="div"
                delay={(Math.min(i % 6, 5) as 0 | 1 | 2 | 3 | 4 | 5)}
              >
                <CategoryProductCard product={p} categorySlug={slug} />
              </Reveal>
            ))}
          </div>
        ) : (
          <CategoryEmptyState categoryName={category.name} categorySlug={slug} />
        )}
      </div>
    </main>
  );
}

function CategoryProductCard({
  product,
  categorySlug,
}: {
  product: Product;
  categorySlug: string;
}) {
  const accent = accentFor(categorySlug);

  return (
    <Link
      href={`/product/${product.slug}`}
      className="group block rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ink)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--warm-white)]"
      aria-label={`View ${product.name}`}
      style={{ ["--accent" as string]: accent }}
    >
      <div className="stage-product-card relative aspect-[4/5] w-full overflow-hidden">
        {product.image_url ? (
          <ProductImage
            src={product.image_url}
            alt={product.name}
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-[700ms] ease-out group-hover:scale-[1.03] group-hover:translate-y-[-3px] motion-reduce:transition-none motion-reduce:group-hover:scale-100 motion-reduce:group-hover:translate-y-0"
          />
        ) : (
          <div className="absolute inset-0 flex flex-col justify-between p-5 md:p-7">
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 opacity-25"
              style={{
                backgroundImage:
                  "radial-gradient(circle at 1px 1px, rgba(26, 20, 16, 0.12) 1px, transparent 0)",
                backgroundSize: "5px 5px",
              }}
            />
            <div className="flex flex-1 items-center justify-center">
              <CategoryMark
                slug={categorySlug}
                className="h-20 w-20 opacity-[0.22] transition-opacity duration-700 ease-out group-hover:opacity-35"
              />
            </div>
            <div className="relative">
              <p className="font-display text-base italic leading-tight text-[var(--ink)]">
                {product.name}
              </p>
            </div>
          </div>
        )}
      </div>
      <div className="mt-4">
        <p className="font-display text-base italic leading-tight text-[var(--ink)]">
          {product.name}
        </p>
        <p className="mt-1 font-mono text-[12px] uppercase tracking-[0.12em]" style={{ color: accent }}>
          Enquire
        </p>
      </div>
    </Link>
  );
}

function CategoryEmptyState({
  categoryName,
  categorySlug,
}: {
  categoryName: string;
  categorySlug: string;
}) {
  const accent = accentFor(categorySlug);
  const descriptions: Record<string, { eyebrow: string; headline: string; body: string }> = {
    coffee: {
      eyebrow: "Specialty Kenyan Arabica",
      headline: "Currently sourcing the next selection.",
      body: "No published lots are currently available in this category. We're preparing the next selection from the highlands. If you're sourcing for your business, contact us and we'll help identify the right opportunity.",
    },
    tea: {
      eyebrow: "Selected Kenyan teas",
      headline: "Currently sourcing the next selection.",
      body: "No published lots are currently available in this category. We're preparing the next selection from the highlands. If you're sourcing for your business, contact us and we'll help identify the right opportunity.",
    },
    horticulture: {
      eyebrow: "Fresh produce & export",
      headline: "Currently sourcing the next selection.",
      body: "No published lots are currently available in this category. We're preparing the next selection. If you're sourcing for your business, contact us and we'll help identify the right opportunity.",
    },
    grains: {
      eyebrow: "Selected agricultural commodities",
      headline: "Currently sourcing the next selection.",
      body: "No published lots are currently available in this category. We're preparing the next selection. If you're sourcing for your business, contact us and we'll help identify the right opportunity.",
    },
  };
  const desc = descriptions[categorySlug] ?? {
    eyebrow: "Catalogue",
    headline: "Currently in preparation.",
    body: "No published lots are currently available in this category. We're preparing the next selection. If you're sourcing for your business, contact us and we'll help identify the right opportunity.",
  };

  return (
    <div className="mx-auto max-w-2xl">
      <div
        className="cat-empty-surface px-8 py-14 text-center sm:px-12 sm:py-16 md:py-20"
        style={{ ["--accent" as string]: accent }}
      >
        <span
          aria-hidden
          className="mx-auto mb-6 block h-px w-12"
          style={{ background: accent }}
        />
        <p
          className="font-mono text-[12px] font-semibold uppercase tracking-[0.22em]"
          style={{ color: accent }}
        >
          {desc.eyebrow}
        </p>
        <h2 className="mx-auto mt-5 max-w-[18ch] font-display text-3xl italic leading-[1.08] tracking-[-0.02em] text-[var(--ink)] md:text-[2.75rem]">
          {desc.headline}
        </h2>
        <p className="mx-auto mt-6 max-w-[46ch] text-[1.0625rem] leading-relaxed text-[var(--ink-soft)]">
          {desc.body}
        </p>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Link href="/contact?type=sample" className="btn-cta group">
            Request a sample
            <span
              aria-hidden
              className="inline-block h-px w-6 bg-current transition-all duration-500 group-hover:w-10"
            />
          </Link>
          <Link href="/contact" className="btn-cta-ghost">
            Make an enquiry
          </Link>
        </div>
      </div>
      <p className="mx-auto mt-8 max-w-[52ch] text-center text-[13px] leading-relaxed text-[var(--ink-muted)]">
        New lots are published from the Treadville catalogue as they are confirmed
        and made available for order.
      </p>
    </div>
  );
}
