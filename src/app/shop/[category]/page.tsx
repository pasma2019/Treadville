import { notFound } from "next/navigation";
import { getCategories, getCategoryBySlug, getProducts } from "@/lib/queries";
import CategoryTabs from "@/components/CategoryTabs";
import ProductCard from "@/components/ProductCard";

export const revalidate = 0;

export default async function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const { category: slug } = await params;
  const [categories, category, products] = await Promise.all([
    getCategories(),
    getCategoryBySlug(slug),
    getProducts({ categorySlug: slug, publishedOnly: true }),
  ]);

  if (!category) notFound();

  return (
    <main className="mx-auto max-w-6xl px-6 py-16">
      <p className="font-mono text-xs uppercase tracking-widest text-[var(--parchment)]/50">Catalogue</p>
      <h1 className="mt-2 font-display text-4xl">{category.name}</h1>
      {category.description && <p className="mt-3 max-w-lg text-sm text-[var(--parchment)]/60">{category.description}</p>}
      <div className="mt-8">
        <CategoryTabs categories={categories} activeSlug={slug} />
      </div>
      <div className="mt-10 grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-3">
        {products.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
      {products.length === 0 && (
        <p className="mt-12 font-mono text-sm text-[var(--parchment)]/40">
          No published {category.name.toLowerCase()} products yet.
        </p>
      )}
    </main>
  );
}
