import { getCategories, getProducts } from "@/lib/queries";
import CategoryTabs from "@/components/CategoryTabs";
import Reveal from "@/components/Reveal";
import ProductCard from "@/components/ProductCard";

export const revalidate = 0;

export default async function ShopPage() {
  const [categories, products] = await Promise.all([
    getCategories(),
    getProducts({ publishedOnly: true }),
  ]);

  return (
    <main className="surface-warm">
      <div className="mx-auto max-w-[var(--content-wide)] px-6 pt-16 pb-24 md:pt-20 md:pb-32">
        <Reveal variant="light" as="div" delay={0}>
          <p className="label-on-light">Full catalogue</p>
          <h1 className="mt-3 max-w-[16ch] font-display text-4xl leading-[1.02] tracking-[-0.015em] text-[var(--ink)] md:text-5xl lg:text-6xl">
            The collection
          </h1>
        </Reveal>

        <Reveal variant="light" as="div" delay={1} className="mt-8">
          <CategoryTabs categories={categories} />
        </Reveal>

        {products.length > 0 ? (
          <div className="mt-10 grid grid-cols-2 gap-x-5 gap-y-10 md:mt-14 md:grid-cols-3 lg:grid-cols-4">
            {products.map((p, i) => (
              <Reveal key={p.id} variant="light" as="div" delay={(Math.min(i % 6, 5) as 0 | 1 | 2 | 3 | 4 | 5)}>
                <ShopProductCard product={p} />
              </Reveal>
            ))}
          </div>
        ) : (
          <div className="mt-20 py-20 text-center">
            <p className="body-on-light">
              No published products yet.
            </p>
            <p className="mt-2 label-on-light">
              Add products from the admin panel.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}

import Link from "next/link";
import type { Product } from "@/lib/types";
import ProductImage from "@/components/ProductImage";
import CategoryMark, { accentFor } from "@/components/CategoryMark";

function ShopProductCard({ product }: { product: Product }) {
  const accent = accentFor("default");

  return (
    <Link
      href={`/product/${product.slug}`}
      className="group block focus-visible:outline-none"
      aria-label={`View ${product.name}`}
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
                slug="default"
                className="h-20 w-20 opacity-[0.18] transition-opacity duration-700 ease-out group-hover:opacity-30"
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
        <p className="mt-1 label-on-light" style={{ color: "var(--accent)" }}>
          Enquire
        </p>
      </div>
    </Link>
  );
}
