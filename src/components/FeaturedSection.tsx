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
      className="relative overflow-hidden"
      style={{
        background:
          "linear-gradient(180deg, #f3eadb 0%, #f8f4ec 40%, #faf7f0 100%)",
      }}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-35"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, rgba(26, 20, 16, 0.03) 1px, transparent 0)",
          backgroundSize: "7px 7px",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-[var(--line-on-light)]"
      />

      <div className="relative z-10 mx-auto max-w-[var(--content-wide)] px-6 py-20 md:px-10 md:py-28 lg:py-36">
        <Reveal
          variant="light"
          as="div"
          delay={0}
          className="grid grid-cols-1 items-end gap-8 md:grid-cols-12 md:gap-12"
        >
          <div className="md:col-span-6">
            <p className="label-on-light">{eyebrow}</p>
            <h2
              id="featured-heading"
              className="mt-5 max-w-[20ch] font-display text-[2.25rem] italic leading-[1.04] tracking-[-0.015em] text-[var(--ink)] sm:text-3xl md:text-5xl lg:text-[3.75rem]"
              style={{ textWrap: "balance" }}
            >
              {headline}
            </h2>
          </div>
          <div className="md:col-span-6">
            <p className="max-w-[42ch] text-base leading-relaxed text-[var(--ink-soft)] md:text-lg">
              {intro}
            </p>
          </div>
        </Reveal>

        <div className="mt-16 md:mt-24">
          <div className="grid grid-cols-1 gap-16 lg:grid-cols-12 lg:gap-14">
            <div className="lg:col-span-8">
              <FeaturedLead
                product={lead}
                categorySlug={leadCategory?.slug ?? "default"}
                eyebrow={leadCategoryName ?? undefined}
              />
            </div>

            {supporting.length > 0 ? (
              <div className="flex flex-col gap-10 lg:col-span-4 lg:gap-0">
                {supporting.slice(0, 3).map((p, i) => (
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
      className="group/lead block rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ink)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--warm-white)]"
      aria-label={`View ${product.name}`}
    >
      <div
        className="relative w-full overflow-hidden"
        style={{ aspectRatio: "3 / 4" }}
      >
        {product.image_url ? (
          <ProductImage
            src={product.image_url}
            alt={product.name}
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1200ms] ease-[var(--ease-out)] group-hover/lead:scale-[1.025]"
          />
        ) : (
          <div
            aria-hidden
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(80% 60% at 50% 20%, rgba(255,220,168,0.18) 0%, rgba(168,70,31,0.06) 60%),linear-gradient(180deg, #f3eadb 0%, #e8dece 100%)",
            }}
          />
        )}

        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(26,20,16,0) 40%, rgba(26,20,16,0.04) 65%, rgba(26,20,16,0.42) 100%)",
          }}
        />

        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            boxShadow:
              "inset 0 -120px 160px -60px rgba(26,20,16,0.28), inset 0 1px 0 0 rgba(255,255,255,0.06)",
          }}
        />

        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-12 left-1/2 h-28 w-[110%] -translate-x-1/2 blur-3xl"
          style={{ background: "rgba(26,20,16,0.22)" }}
        />

        <div className="absolute inset-x-0 bottom-0 p-7 md:p-10">
          <div
            className="mx-auto w-full max-w-lg transition-transform duration-[var(--dur-slow)] ease-[var(--ease-out)] group-hover/lead:-translate-y-1"
            style={
              {
                ["--accent" as string]: accent,
                background: "rgba(251, 248, 241, 0.90)",
                backdropFilter: "blur(20px) saturate(140%)",
                WebkitBackdropFilter: "blur(20px) saturate(140%)",
                border: "1px solid rgba(26, 20, 16, 0.08)",
                boxShadow:
                  "0 20px 56px -20px rgba(60, 45, 30, 0.32), 0 4px 12px -4px rgba(60, 45, 30, 0.12)",
                padding: "clamp(1.25rem, 2vw, 1.75rem)",
              } as React.CSSProperties
            }
          >
            <div className="flex items-baseline justify-between gap-3">
              {eyebrow ? (
                <p
                  className="font-mono text-[13px] uppercase tracking-[0.2em]"
                  style={{ color: accent }}
                >
                  {eyebrow}
                </p>
              ) : (
                <span />
              )}
              <p className="font-mono text-[13px] uppercase tracking-[0.2em] text-[var(--ink-faint)]">
                Featured
              </p>
            </div>
            <h3
              className="mt-3 font-display text-2xl italic leading-[1.04] tracking-[-0.012em] text-[var(--ink)] sm:text-3xl md:text-4xl"
              style={{ textWrap: "balance" }}
            >
              {product.name}
            </h3>
            {product.description && (
              <p className="mt-3 hidden text-sm leading-relaxed text-[var(--ink-soft)] md:block">
                {product.description}
              </p>
            )}
            <div className="mt-5 flex items-center gap-3">
              <span
                className="font-mono text-[13px] uppercase tracking-[0.2em]"
                style={{ color: accent }}
              >
                View product
              </span>
              <span
                aria-hidden
                className="inline-block h-px w-8 bg-current transition-all duration-500 group-hover/lead:w-14"
                style={{ color: accent }}
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
      className="group/mini flex gap-5 rounded-sm border-t border-[var(--line-on-light)] py-6 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ink)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--warm-white)] lg:border-none lg:py-0"
      aria-label={`View ${product.name}`}
    >
      <div className="relative h-28 w-24 shrink-0 overflow-hidden">
        {product.image_url ? (
          <ProductImage
            src={product.image_url}
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-[900ms] ease-[var(--ease-out)] group-hover/mini:scale-[1.04]"
          />
        ) : (
          <div
            className="flex h-full w-full items-center justify-center"
            style={{
              background:
                "linear-gradient(135deg, rgba(168,70,31,0.10) 0%, rgba(201,154,61,0.06) 100%)",
            }}
          >
            <CategoryMark slug={categorySlug} className="h-14 w-14 opacity-40" />
          </div>
        )}
      </div>

      <div className="flex min-w-0 flex-1 flex-col justify-center">
        <p
          className="font-mono text-[13px] uppercase tracking-[0.2em]"
          style={{ color: accent }}
        >
          Enquire
        </p>
        <p
          className="mt-1.5 font-display text-base italic leading-tight text-[var(--ink)]"
          style={{ textWrap: "balance" }}
        >
          {product.name}
        </p>
        <div
          aria-hidden
          className="mt-3 h-px w-0 bg-current transition-all duration-500 group-hover/mini:w-10"
          style={{ color: accent }}
        />
      </div>
    </Link>
  );
}
