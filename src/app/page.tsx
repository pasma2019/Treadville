import Link from "next/link";
import { getCategories, getFeaturedProducts, getSiteContent } from "@/lib/queries";
import CategoryTabs from "@/components/CategoryTabs";
import ProductCard from "@/components/ProductCard";

export const revalidate = 0;

export default async function HomePage() {
  const [categories, featured, content] = await Promise.all([
    getCategories(),
    getFeaturedProducts(),
    getSiteContent(),
  ]);

  return (
    <main>
      {/* Hero — driven by site_content, editable from /admin/content */}
      <section className="relative flex min-h-[80vh] items-end overflow-hidden border-b border-[var(--line)]">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${content.hero_image || "/images/hero-coffee.jpg"})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--soil)] via-[var(--soil)]/40 to-[var(--soil)]/10" />
        <div className="relative z-10 mx-auto w-full max-w-6xl px-6 pb-16">
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-accent">Est. 30+ years · Kenya</p>
          <h1 className="mt-4 max-w-2xl font-display text-5xl italic leading-[1.05] md:text-6xl">
            {content.hero_headline || "Premium African Products."}
          </h1>
          <p className="mt-5 max-w-lg text-[var(--parchment)]/70">
            {content.hero_subheadline ||
              "Sourced across Kenya's volcanic highlands and fertile plains — delivered worldwide."}
          </p>
          <Link
            href="/shop"
            className="mt-8 inline-block bg-accent px-6 py-3 font-mono text-xs uppercase tracking-widest text-[var(--soil)]"
          >
            Explore the catalogue
          </Link>
        </div>
      </section>

      {/* Category discovery — the architectural thesis of the whole prototype */}
      <section className="mx-auto max-w-6xl px-6 py-20">
        <p className="font-mono text-xs uppercase tracking-widest text-[var(--parchment)]/50">Our terroir</p>
        <h2 className="mt-2 font-display text-3xl">One estate. Four categories.</h2>
        <p className="mt-3 max-w-xl text-sm text-[var(--parchment)]/60">
          Coffee built the name. Tea, horticulture, and grains carry it forward — each with its own character,
          under one standard of quality.
        </p>
        <div className="mt-8">
          <CategoryTabs categories={categories} />
        </div>
        <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/shop/${cat.slug}`}
              className="group relative flex aspect-square items-end overflow-hidden border border-[var(--line)] p-4"
            >
              {cat.image_url && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={cat.image_url}
                  alt={cat.name}
                  className="absolute inset-0 h-full w-full object-cover opacity-60 transition-opacity group-hover:opacity-80"
                />
              )}
              <span className="relative z-10 font-display text-lg">{cat.name}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured products */}
      {featured.length > 0 && (
        <section className="mx-auto max-w-6xl px-6 pb-20">
          <h2 className="font-display text-3xl">Featured</h2>
          <div className="mt-8 grid grid-cols-2 gap-8 md:grid-cols-3">
            {featured.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}

      {/* Story */}
      <section className="border-t border-[var(--line)] px-6 py-20">
        <div className="mx-auto max-w-2xl text-center">
          <p className="font-mono text-xs uppercase tracking-widest text-[var(--parchment)]/50">Our story</p>
          <p className="mt-4 font-display text-2xl italic leading-relaxed">
            {content.about_blurb ||
              "Three decades of Kenyan agriculture, now growing beyond coffee."}
          </p>
        </div>
      </section>
    </main>
  );
}
