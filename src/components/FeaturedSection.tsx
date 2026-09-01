import Link from "next/link";
import Reveal from "@/components/Reveal";
import ProductImage from "@/components/ProductImage";
import CategoryMark, { accentFor } from "@/components/CategoryMark";
import type { Product } from "@/lib/types";

type FeaturedProps = {
  lead: Product;
  supporting: Product[];
  categories: { id: string; slug: string; name: string }[];
  eyebrow: string;
  headline: string;
  intro: string;
};

export default function FeaturedSection({
  lead,
  supporting,
  categories,
  eyebrow,
  headline,
  intro,
}: FeaturedProps) {
  const categoryById = new Map(categories.map((c) => [c.id, c]));
  const leadCategory = categoryById.get(lead.category_id);
  const leadCategoryName = leadCategory?.name ?? null;

  return (
    <section
      aria-labelledby="featured-heading"
      className="relative overflow-hidden px-6 py-20 md:py-28"
      style={{ background: "var(--atmosphere-warm)" }}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-50"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, rgba(26, 20, 16, 0.04) 1px, transparent 0)",
          backgroundSize: "6px 6px",
        }}
      />

      <div className="relative z-10 mx-auto max-w-[var(--content-wide)]">
        <Reveal
          variant="light"
          as="div"
          delay={0}
          className="grid grid-cols-1 items-end gap-8 md:grid-cols-12 md:gap-10"
        >
          <div className="md:col-span-7">
            <p className="label-on-light">{eyebrow}</p>
            <h2
              id="featured-heading"
              className="mt-4 max-w-[18ch] font-display text-3xl italic leading-[1.05] tracking-[-0.02em] text-[var(--ink)] md:text-6xl"
            >
              {headline}
            </h2>
          </div>
          <div className="md:col-span-5">
            <p className="body-on-light max-w-md md:text-lg">{intro}</p>
          </div>
        </Reveal>

        <div className="mt-12 md:mt-16">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:gap-8">
            <div className="lg:col-span-8">
              <FeaturedLead
                product={lead}
                categorySlug={leadCategory?.slug ?? "default"}
                eyebrow={leadCategoryName ?? undefined}
              />
            </div>
            {supporting.length > 0 ? (
              <div className="grid grid-cols-2 gap-4 lg:col-span-4 lg:grid-cols-1 lg:gap-6">
                {supporting.map((p, i) => (
                  <Reveal
                    key={p.id}
                    variant="light"
                    as="div"
                    delay={((i + 1) as 0 | 1 | 2 | 3 | 4 | 5)}
                  >
                    <FeaturedMini
                      product={p}
                      categorySlug={categoryById.get(p.category_id)?.slug ?? "default"}
                    />
                  </Reveal>
                ))}
              </div>
            ) : null}
          </div>
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-[var(--line-on-light)] pt-6 md:mt-14">
          <p className="label-on-light">The full collection</p>
          <Link href="/shop" className="btn-light-link">
            View all
          </Link>
        </div>
      </div>
    </section>
  );
}

function FeaturedLead({
  product,
  categorySlug,
  eyebrow,
}: {
  product: Product;
  categorySlug: string;
  eyebrow?: string;
}) {
  const accent = accentFor(categorySlug);

  return (
    <Link
      href={`/product/${product.slug}`}
      className="group block focus-visible:outline-none"
      aria-label={`View ${product.name}`}
    >
      <div
        className="stage-product-card relative w-full overflow-hidden"
        style={{ ["--accent" as string]: accent }}
      >
        {product.image_url ? (
          <ProductImage
            src={product.image_url}
            alt={product.name}
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.04]"
          />
        ) : (
          <div
            aria-hidden
            className="absolute inset-0 opacity-25"
            style={{
              backgroundImage:
                "radial-gradient(circle at 1px 1px, rgba(26, 20, 16, 0.12) 1px, transparent 0)",
              backgroundSize: "5px 5px",
            }}
          />
        )}

        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, transparent 30%, rgba(26, 20, 16, 0.15) 70%, rgba(26, 20, 16, 0.40) 100%)",
          }}
        />

        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-1/3 h-px"
          style={{
            background:
              "linear-gradient(90deg, transparent 0%, rgba(26,20,16,0.20) 30%, rgba(26,20,16,0.20) 70%, transparent 100%)",
          }}
        />

        <div className="absolute inset-0 flex flex-col justify-end">
          <div
            className="glass-light-soft mx-6 mb-6 max-w-sm p-6 backdrop-blur-[var(--glass-light-blur)] md:mx-10 md:mb-10"
            style={{ background: "var(--glass-light-bg)" }}
          >
            {eyebrow && (
              <p className="label-on-light mb-3" style={{ color: accent }}>
                {eyebrow}
              </p>
            )}
            <h3
              className="font-display text-3xl italic leading-[1.02] tracking-[-0.015em] text-[var(--ink)] md:text-4xl lg:text-5xl"
              style={{ textWrap: "balance" }}
            >
              {product.name}
            </h3>
            {product.description && (
              <p className="mt-3 hidden text-sm leading-relaxed text-[var(--ink-muted)] md:block">
                {product.description}
              </p>
            )}
            <div className="mt-5 flex items-center gap-3">
              <span
                className="font-mono text-[11px] uppercase tracking-[0.28em] underline decoration-current underline-offset-4"
                style={{ color: accent }}
              >
                View product
              </span>
              <span
                aria-hidden
                className="h-px w-8 transition-all duration-500 group-hover:w-14"
                style={{ background: accent }}
              />
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

function FeaturedMini({
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
      className="group flex gap-4 focus-visible:outline-none"
      aria-label={`View ${product.name}`}
    >
      <div
        className="stage-product-card relative h-28 w-24 shrink-0 overflow-hidden"
        style={{ ["--accent" as string]: accent }}
      >
        {product.image_url ? (
          <ProductImage
            src={product.image_url}
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-[700ms] ease-out group-hover:scale-[1.06]"
          />
        ) : (
          <div
            aria-hidden
            className="flex h-full w-full items-center justify-center"
          >
            <CategoryMark slug={categorySlug} className="h-12 w-12 opacity-30" />
          </div>
        )}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "linear-gradient(90deg, transparent 50%, rgba(26,20,16,0.10) 100%)",
          }}
        />
      </div>

      <div className="flex flex-1 flex-col justify-center">
        <p className="label-on-light" style={{ color: accent }}>
          Enquire
        </p>
        <p
          className="mt-1 font-display text-base italic leading-tight text-[var(--ink)]"
          style={{ textWrap: "balance" }}
        >
          {product.name}
        </p>
        <div
          aria-hidden
          className="mt-2 h-px w-0 transition-all duration-500 group-hover:w-10"
          style={{ background: accent }}
        />
      </div>
    </Link>
  );
}
