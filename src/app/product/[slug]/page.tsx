import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { getCategories, getProductBySlug, getProducts } from "@/lib/queries";
import ProductDetailClient from "./ProductDetailClient";
import Reveal from "@/components/Reveal";
import CategoryMark, { accentFor } from "@/components/CategoryMark";
import type { Product } from "@/lib/types";
import ProductImage from "@/components/ProductImage";

export const revalidate = 0;

const COFFEE_SOURCING_STANDARD = [
  { label: "Origin", value: "Kirinyaga, Kenya" },
  { label: "Altitude", value: "1,600–1,850m" },
  { label: "Process", value: "Washed / Anaerobic" },
  { label: "Quality", value: "80+ SCA" },
];

const EYEBROW_MAP: Record<string, string> = {
  coffee: "Single origin",
  tea: "Highland tea",
  horticulture: "Horticultural product",
  grains: "Grain & nut",
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return {};
  return {
    title: product.name,
    description: product.description || `${product.name} — available from Treadville.`,
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product || product.status !== "published") notFound();

  const categories = await getCategories();
  const category =
    categories.find((c) => c.id === product.category_id) ?? null;
  const categorySlug = category?.slug ?? "";
  const accent = accentFor(categorySlug);

  const related = (await getProducts({ publishedOnly: true }))
    .filter((p) => p.category_id === product.category_id && p.id !== product.id)
    .slice(0, 3);

  const eyebrow =
    EYEBROW_MAP[categorySlug] ??
    (category ? "Treadville product" : "Product");

  return (
    <main className="surface-warm">
      <div className="mx-auto max-w-[var(--content-wide)] px-6 pt-10 pb-20 md:pt-14">
        <Reveal variant="light" as="nav" delay={0} aria-label="Breadcrumb">
          <ol className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--ink-muted)]">
            <li>
              <Link href="/shop" className="transition-colors hover:text-[var(--ink)]">
                Shop
              </Link>
            </li>
            <li aria-hidden className="opacity-40">
              /
            </li>
            <li>
              <Link
                href={`/shop/${categorySlug}`}
                className="transition-colors hover:text-[var(--ink)]"
              >
                {category?.name ?? "Category"}
              </Link>
            </li>
            <li aria-hidden className="opacity-40">
              /
            </li>
            <li
              aria-current="page"
              className="truncate text-[var(--ink-faint)]"
            >
              {product.name}
            </li>
          </ol>
        </Reveal>

        <div className="mt-10 grid grid-cols-1 gap-10 md:grid-cols-[1fr_360px] md:gap-12 lg:grid-cols-[1fr_400px] lg:gap-16">
          <Reveal variant="light" as="div" delay={0} className="min-w-0">
            <div className="stage-product relative aspect-[4/5] w-full overflow-hidden md:aspect-[5/6]">
              {product.image_url ? (
                <ProductImage
                  src={product.image_url}
                  alt={product.name}
                  className="absolute inset-0 h-full w-full object-cover"
                />
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <div
                    aria-hidden
                    className="pointer-events-none absolute inset-0 opacity-20"
                    style={{
                      backgroundImage:
                        "radial-gradient(circle at 1px 1px, rgba(26, 20, 16, 0.10) 1px, transparent 0)",
                      backgroundSize: "6px 6px",
                    }}
                  />
                  <CategoryMark
                    slug={categorySlug}
                    className="h-28 w-28 opacity-30"
                  />
                  <p className="mt-6 font-mono text-[11px] uppercase tracking-[0.3em] text-[var(--ink-muted)]">
                    Image coming soon
                  </p>
                </div>
              )}
            </div>
          </Reveal>

          <Reveal variant="light" as="div" delay={1} className="min-w-0">
            <div className="md:pt-4">
              <p
                className="label-on-light"
                style={{ color: accent }}
              >
                {eyebrow}
              </p>
              <h1 className="mt-3 max-w-[18ch] font-display text-3xl italic leading-[1.04] tracking-[-0.015em] text-[var(--ink)] md:text-4xl lg:text-[2.75rem]">
                {product.name}
              </h1>
              <p className="mt-5 max-w-[44ch] body-on-light md:text-base">
                {product.description}
              </p>

              {categorySlug === "coffee" && (
                <dl className="mt-8 grid grid-cols-2 gap-x-6 gap-y-5 border-t border-[var(--line-on-light)] pt-7">
                  {COFFEE_SOURCING_STANDARD.map((row) => (
                    <div key={row.label}>
                      <dt className="font-mono text-[9px] uppercase tracking-[0.3em] text-[var(--ink-faint)]">
                        {row.label}
                      </dt>
                      <dd className="mt-1.5 font-display text-base italic leading-tight text-[var(--ink)]">
                        {row.value}
                      </dd>
                    </div>
                  ))}
                </dl>
              )}

              <div className="mt-8 border-t border-[var(--line-on-light)] pt-7">
                <p
                  className="mb-5 font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--ink-muted)]"
                >
                  Request this lot
                </p>
                <ProductDetailClient product={product} accent={accent} />
              </div>

              <div className="mt-7 inline-flex flex-wrap items-center gap-3">
                <Link
                  href={`/shop/${categorySlug}`}
                  className="btn-light-link"
                  style={{ color: accent }}
                >
                  More {category?.name ?? "products"}
                </Link>
                <span
                  aria-hidden
                  className="h-px w-4 bg-[var(--line-on-light)]"
                />
                <Link href="/contact" className="btn-light-link">
                  Speak to us
                </Link>
              </div>
            </div>
          </Reveal>
        </div>

        {related.length > 0 && (
          <section
            aria-labelledby="related-heading"
            className="mt-20 border-t border-[var(--line-on-light)] pt-16"
          >
            <Reveal variant="light" as="div" delay={0}>
              <h2
                id="related-heading"
                className="font-display text-2xl italic text-[var(--ink)]"
              >
                You may also like
              </h2>
            </Reveal>
            <div className="mt-8 grid grid-cols-2 gap-x-5 gap-y-10 md:grid-cols-3">
              {related.map((p, i) => (
                <Reveal
                  key={p.id}
                  variant="light"
                  as="div"
                  delay={(i as 0 | 1 | 2)}
                >
                  <RelatedCard product={p} categorySlug={categorySlug} />
                </Reveal>
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}

function RelatedCard({
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
    >
      <div className="stage-product-card relative aspect-[4/5] w-full overflow-hidden">
        {product.image_url ? (
          <ProductImage
            src={product.image_url}
            alt={product.name}
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-[700ms] ease-out group-hover:scale-[1.06]"
          />
        ) : (
          <div className="absolute inset-0 flex flex-col justify-between p-5">
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
                className="h-16 w-16 opacity-[0.22] transition-opacity duration-700 ease-out group-hover:opacity-35"
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
