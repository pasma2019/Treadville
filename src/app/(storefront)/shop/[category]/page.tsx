import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getCategories, getCategoryBySlug, getProducts } from "@/lib/queries";
import CategoryTabs from "@/components/CategoryTabs";
import CategoryHero from "@/components/CategoryHero";
import Reveal from "@/components/Reveal";
import Link from "next/link";
import type { Product } from "@/lib/types";
import ProductImage from "@/components/ProductImage";
import CategoryMark, { accentFor } from "@/components/CategoryMark";
import { getSiteContent } from "@/lib/queries";
import { BreadcrumbJsonLd } from "@/lib/structured-data";

export const revalidate = 0;

const SITE_URL = "https://treadville.co.ke";

const CATEGORY_MICRO: Record<string, { eyebrow: string; labels: string[] }> = {
  coffee: {
    eyebrow: "Specialty Kenyan Arabica",
    labels: ["ORIGIN · KENYA", "SPECIALTY ARABICA", "HIGHLANDS · MT. KENYA"],
  },
  tea: {
    eyebrow: "Selected Kenyan Teas",
    labels: ["ORIGIN · KENYA", "HIGH-GROWN TEA", "LEAF · CRAFT · CHARACTER"],
  },
  horticulture: {
    eyebrow: "Fresh Produce & Export",
    labels: ["FRESH PRODUCE · KENYA", "GROWN WITH PURPOSE"],
  },
  grains: {
    eyebrow: "Agricultural Commodities",
    labels: ["HARVEST · KENYA", "GRAINS · PULSES · ORIGIN"],
  },
};

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
  const micro = CATEGORY_MICRO[slug];

  return (
    <main className="surface-warm">
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: `${SITE_URL}/` },
          { name: "Shop", url: `${SITE_URL}/shop` },
          { name: category.name, url: `${SITE_URL}/shop/${slug}` },
        ]}
      />

      {/* Category Hero — premium editorial composition */}
      <CategoryHero
        slug={slug}
        name={category.name}
        description={category.description}
        imageUrl={heroImage ?? category.image_url}
      />

      {/* Category navigation — luminous surface */}
      <div className="border-b border-[var(--line-on-light)] bg-[var(--bg-elevated)]">
        <div className="mx-auto max-w-[var(--content-wide)] px-6 py-4 md:px-10">
          <CategoryTabs categories={categories} activeSlug={slug} />
        </div>
      </div>

      {/* Micro labels bar — category identity */}
      {micro && (
        <div className="border-b border-[var(--line-on-light)] bg-[var(--bg-base)]">
          <div className="mx-auto max-w-[var(--content-wide)] px-6 py-4 md:px-10">
            <div className="flex flex-wrap items-center gap-3">
              <span
                className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em]"
                style={{ color: accentFor(slug) }}
              >
                {micro.eyebrow}
              </span>
              <span className="h-px w-4 bg-[var(--line-on-light)]" />
              {micro.labels.map((label) => (
                <span
                  key={label}
                  className="font-mono text-[9px] uppercase tracking-[0.16em] text-[var(--ink-faint)]"
                >
                  {label}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Catalogue area — premium canvas */}
      <div id="catalogue" className="mx-auto max-w-[var(--content-wide)] px-6 py-12 md:px-10 md:py-16 scroll-mt-20">
        {products.length > 0 ? (
          <div className="cat-product-grid">
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
      className="cat-product-card group"
      aria-label={`View ${product.name}`}
      style={{ ["--accent" as string]: accent }}
    >
      <div className="cat-product-image-wrap">
        {product.image_url ? (
          <ProductImage
            src={product.image_url}
            alt={product.name}
            className="cat-product-image"
          />
        ) : (
          <div className="absolute inset-0 flex flex-col justify-between p-5 md:p-6" style={{ background: `linear-gradient(135deg, rgba(184,134,11,0.04) 0%, var(--bg-warm) 100%)` }}>
            <div className="flex flex-1 items-center justify-center">
              <CategoryMark
                slug={categorySlug}
                className="h-16 w-16 opacity-[0.18] transition-opacity duration-700 ease-out group-hover:opacity-30"
              />
            </div>
            <p className="font-display text-sm italic leading-tight text-[var(--ink)]">
              {product.name}
            </p>
          </div>
        )}
        {/* Category accent bar */}
        <div
          className="cat-product-accent-bar"
          style={{ background: accent }}
          aria-hidden
        />
      </div>
      <div className="cat-product-info">
        <p className="cat-product-name">{product.name}</p>
        <p className="cat-product-cta" style={{ color: accent }}>
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
          className="font-mono text-[11px] font-semibold uppercase tracking-[0.20em]"
          style={{ color: accent }}
        >
          {desc.eyebrow}
        </p>
        <h2 className="mx-auto mt-5 max-w-[18ch] font-display text-3xl italic leading-[1.08] tracking-[-0.02em] text-[var(--ink)] md:text-[2.75rem]">
          {desc.headline}
        </h2>
        <p className="mx-auto mt-6 max-w-[46ch] text-[1rem] leading-relaxed text-[var(--ink-soft)]">
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
