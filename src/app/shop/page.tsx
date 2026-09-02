import type { Metadata } from "next";
import { getCategories, getProducts } from "@/lib/queries";
import CategoryTabs from "@/components/CategoryTabs";
import Reveal from "@/components/Reveal";
import ProductCard from "@/components/ProductCard";

export const revalidate = 0;

export const metadata: Metadata = {
  title: "Shop",
  description:
    "Browse the full Treadville catalogue — specialty coffee, tea, horticulture, and grains. Request samples, place wholesale enquiries, or explore export options.",
};

type JoinedProduct = Awaited<ReturnType<typeof getProducts>>[number] & {
  categories?: { slug: string } | null;
};

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
            {products.map((p, i) => {
              const joined = p as JoinedProduct;
              const slug = joined.categories?.slug ?? "default";
              return (
                <Reveal
                  key={p.id}
                  variant="light"
                  as="div"
                  delay={(Math.min(i % 6, 5) as 0 | 1 | 2 | 3 | 4 | 5)}
                >
                  <ProductCard product={p} categorySlug={slug} tone="light" />
                </Reveal>
              );
            })}
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
