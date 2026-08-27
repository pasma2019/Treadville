import { notFound } from "next/navigation";
import { getProductBySlug, getProducts } from "@/lib/queries";
import ProductDetailClient from "./ProductDetailClient";
import ProductCard from "@/components/ProductCard";

export const revalidate = 0;

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product || product.status !== "published") notFound();

  const related = (await getProducts({ publishedOnly: true }))
    .filter((p) => p.category_id === product.category_id && p.id !== product.id)
    .slice(0, 3);

  return (
    <main>
      <section className="mx-auto grid max-w-6xl gap-12 px-6 py-16 md:grid-cols-2">
        <div className="aspect-square w-full overflow-hidden bg-[var(--soil-raised)]">
          {product.image_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={product.image_url} alt={product.name} className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full items-center justify-center font-mono text-xs text-[var(--parchment)]/30">
              Image pending
            </div>
          )}
        </div>

        <div>
          <p className="font-mono text-xs uppercase tracking-widest text-accent">Single origin</p>
          <h1 className="mt-3 font-display text-4xl italic leading-tight">{product.name}</h1>
          <p className="mt-5 text-sm leading-relaxed text-[var(--parchment)]/70">{product.description}</p>

          <div className="mt-8 flex items-baseline gap-3">
            {product.price ? (
              <span className="font-mono text-2xl">KSh {product.price.toLocaleString()}</span>
            ) : (
              <span className="font-mono text-lg text-accent">Request quote for bulk/export</span>
            )}
          </div>

          <ProductDetailClient product={product} />

          <dl className="mt-10 grid grid-cols-2 gap-4 border-t border-[var(--line)] pt-6 font-mono text-xs uppercase tracking-widest text-[var(--parchment)]/50">
            <div>
              <dt>Availability</dt>
              <dd className="mt-1 text-[var(--parchment)]">{product.stock > 0 ? `${product.stock} in stock` : "Made to order"}</dd>
            </div>
            <div>
              <dt>Delivery</dt>
              <dd className="mt-1 text-[var(--parchment)]">Nairobi + nationwide, export on request</dd>
            </div>
          </dl>
        </div>
      </section>

      {related.length > 0 && (
        <section className="mx-auto max-w-6xl border-t border-[var(--line)] px-6 py-16">
          <h2 className="font-display text-2xl">You may also like</h2>
          <div className="mt-8 grid grid-cols-2 gap-8 md:grid-cols-3">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
