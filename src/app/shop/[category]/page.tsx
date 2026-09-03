import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getCategories, getCategoryBySlug, getProducts } from "@/lib/queries";
import CategoryTabs from "@/components/CategoryTabs";
import Reveal from "@/components/Reveal";
import Link from "next/link";
import type { Product } from "@/lib/types";
import ProductImage from "@/components/ProductImage";
import CategoryMark, { accentFor } from "@/components/CategoryMark";

export const revalidate = 0;

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
  };
}

export default async function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const { category: slug } = await params;
  const [categories, category, products] = await Promise.all([
    getCategories(),
    getCategoryBySlug(slug),
    getProducts({ categorySlug: slug, publishedOnly: true }),
  ]);

  if (!category) notFound();

  return (
    <main className="surface-warm relative">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 z-0 h-[420px] opacity-60 md:h-[480px]"
        style={{ background: categoryAtmosphere(slug) }}
      />
      <div className="relative z-10 mx-auto max-w-[var(--content-wide)] px-6 pt-16 pb-24 md:pt-20 md:pb-32">
        <Reveal variant="light" as="div" delay={0}>
          <p className="label-on-light">Catalogue · {category.name}</p>
          <h1 className="mt-3 max-w-[16ch] font-display text-4xl leading-[1.02] tracking-[-0.015em] text-[var(--ink)] md:text-5xl lg:text-6xl">
            {category.name}
          </h1>
          {category.description && (
            <p className="mt-4 max-w-[52ch] body-on-light md:text-lg">
              {category.description}
            </p>
          )}
        </Reveal>

        <Reveal variant="light" as="div" delay={1} className="mt-8">
          <CategoryTabs categories={categories} activeSlug={slug} />
        </Reveal>

        {products.length > 0 ? (
          <div className="mt-10 grid grid-cols-2 gap-x-5 gap-y-10 md:mt-14 md:grid-cols-3 lg:grid-cols-4">
            {products.map((p, i) => (
              <Reveal key={p.id} variant="light" as="div" delay={(Math.min(i % 6, 5) as 0 | 1 | 2 | 3 | 4 | 5)}>
                <CategoryProductCard product={p} categorySlug={slug} />
              </Reveal>
            ))}
          </div>
        ) : (
          <div className="mt-20 py-20 text-center">
            <p className="body-on-light">
              No published {category.name.toLowerCase()} products yet.
            </p>
            <Link href="/shop" className="mt-3 inline-block btn-light-link">
              Browse all
            </Link>
          </div>
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
      className="group block focus-visible:outline-none"
      aria-label={`View ${product.name}`}
      style={{ ["--accent" as string]: accent }}
    >
      <div className="stage-product-card relative aspect-[4/5] w-full overflow-hidden">
        {product.image_url ? (
          <ProductImage
            src={product.image_url}
            alt={product.name}
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-[700ms] ease-out group-hover:scale-[1.06]"
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
        <p className="font-display text-sm italic leading-tight text-[var(--ink)]">
          {product.name}
        </p>
        <p className="mt-1 label-on-light" style={{ color: accent }}>
          Enquire
        </p>
      </div>
    </Link>
  );
}

/**
 * Category atmospheric wash — a quiet, large radial gradient at the top of
 * the page that hints at the category's character without over-theming the
 * page. Mobile intensity is reduced via inline opacity to prevent visual noise.
 */
function categoryAtmosphere(slug: string): string {
  switch (slug) {
    case "coffee":
      return (
        "radial-gradient(70% 50% at 50% 0%, rgba(184, 114, 58, 0.16) 0%, rgba(184, 114, 58, 0) 60%)," +
        "radial-gradient(50% 30% at 80% 10%, rgba(245, 232, 212, 0.55) 0%, rgba(245, 232, 212, 0) 60%)"
      );
    case "tea":
      return (
        "radial-gradient(70% 50% at 50% 0%, rgba(122, 158, 122, 0.18) 0%, rgba(122, 158, 122, 0) 60%)," +
        "radial-gradient(50% 30% at 20% 10%, rgba(216, 232, 207, 0.50) 0%, rgba(216, 232, 207, 0) 60%)"
      );
    case "horticulture":
      return (
        "radial-gradient(70% 50% at 50% 0%, rgba(147, 161, 60, 0.16) 0%, rgba(147, 161, 60, 0) 60%)," +
        "radial-gradient(50% 30% at 80% 10%, rgba(232, 240, 212, 0.50) 0%, rgba(232, 240, 212, 0) 60%)"
      );
    case "grains":
      return (
        "radial-gradient(70% 50% at 50% 0%, rgba(201, 154, 61, 0.18) 0%, rgba(201, 154, 61, 0) 60%)," +
        "radial-gradient(50% 30% at 30% 10%, rgba(245, 230, 196, 0.50) 0%, rgba(245, 230, 196, 0) 60%)"
      );
    default:
      return (
        "radial-gradient(70% 50% at 50% 0%, rgba(168, 70, 31, 0.10) 0%, rgba(168, 70, 31, 0) 60%)"
      );
  }
}
