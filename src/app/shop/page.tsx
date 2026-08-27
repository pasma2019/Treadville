import { getCategories, getProducts } from "@/lib/queries";
import CategoryTabs from "@/components/CategoryTabs";
import ProductCard from "@/components/ProductCard";

export const revalidate = 0;

export default async function ShopPage() {
  const [categories, products] = await Promise.all([
    getCategories(),
    getProducts({ publishedOnly: true }),
  ]);

  return (
    <main className="mx-auto max-w-6xl px-6 py-16">
      <p className="font-mono text-xs uppercase tracking-widest text-[var(--parchment)]/50">Full catalogue</p>
      <h1 className="mt-2 font-display text-4xl">Shop all</h1>
      <div className="mt-8">
        <CategoryTabs categories={categories} />
      </div>
      <div className="mt-10 grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-3">
        {products.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
      {products.length === 0 && (
        <p className="mt-12 font-mono text-sm text-[var(--parchment)]/40">
          No published products yet — add some from /admin/products.
        </p>
      )}
    </main>
  );
}
