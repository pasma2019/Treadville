import type { Metadata } from "next";
import Link from "next/link";
import { getCategories, getProducts } from "@/lib/queries";
import CategoryTabs from "@/components/CategoryTabs";
import Reveal from "@/components/Reveal";
import ProductCard from "@/components/ProductCard";

export const revalidate = 0;

export const metadata: Metadata = {
  title: "Shop",
  description:
    "Browse the full Treadville catalogue — specialty coffee, tea, horticulture, and grains. Request samples, place wholesale enquiries, or explore export options.",
  alternates: {
    canonical: "/shop",
  },
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
      {/* Page header */}
      <div className="border-b border-[var(--line-on-light)] bg-[var(--warm-white)]">
        <div className="mx-auto max-w-[var(--content-wide)] px-6 pt-28 pb-10 md:px-10 md:pt-32 md:pb-14">
          <Reveal variant="light" as="div" delay={0}>
            <p className="font-mono text-[12px] uppercase tracking-[0.20em] eyebrow-gold">
              Treadville
            </p>
            <h1 className="mt-2 max-w-[16ch] font-display text-4xl italic leading-[1.02] tracking-[-0.015em] text-[var(--ink)] md:text-5xl lg:text-6xl">
              The catalogue
            </h1>
          </Reveal>
        </div>
      </div>

      {/* Category navigation */}
      <div className="border-b border-[var(--line-on-light)] bg-[var(--warm-white)]">
        <div className="mx-auto max-w-[var(--content-wide)] px-6 py-5 md:px-10">
          <CategoryTabs categories={categories} />
        </div>
      </div>

      {/* Catalogue area */}
      <div className="mx-auto max-w-[var(--content-wide)] px-6 py-12 md:px-10 md:py-16">
        {products.length > 0 ? (
          <div className="grid grid-cols-2 gap-x-5 gap-y-10 md:grid-cols-3 lg:grid-cols-4">
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
          <ShopEmptyState />
        )}
      </div>
    </main>
  );
}

function ShopEmptyState() {
  return (
    <div className="mx-auto max-w-lg py-16 text-center">
      <p className="font-mono text-[12px] uppercase tracking-[0.20em] eyebrow-gold">
        Full catalogue
      </p>
      <h2 className="mt-4 font-display text-2xl italic leading-tight tracking-[-0.01em] text-[var(--ink)] md:text-3xl">
        Currently in preparation.
      </h2>
      <p className="mt-4 text-[15px] leading-relaxed text-[var(--ink-soft)]">
        No published lots are currently available. We're preparing the next selection from the
        Kenyan highlands. If you're sourcing for your business, contact us and we'll help
        identify the right opportunity.
      </p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
        <Link href="/contact?type=sample" className="btn-cta">
          Request a sample
        </Link>
        <Link href="/contact" className="btn-cta-ghost">
          Make an enquiry
        </Link>
      </div>
    </div>
  );
}
