import Link from "next/link";
import Reveal from "@/components/Reveal";
import ProductImage from "@/components/ProductImage";
import CategoryMark, { accentFor } from "@/components/CategoryMark";
import type { Product, Category } from "@/lib/types";

type Props = {
  products: Product[];
  categories: Category[];
  eyebrow?: string;
  headline?: string;
  intro?: string;
};

export default function HomepageProductEdit({
  products,
  categories,
  eyebrow = "From the current collection",
  headline = "Curated lots, ready to ship.",
  intro = "A small selection from across our categories, chosen for character, condition, and the way they present.",
}: Props) {
  if (products.length === 0) return null;

  const categoryById = new Map(categories.map((c) => [c.id, c]));
  const lead = products[0];
  const supporting = products.slice(1, 4);
  const leadCategory = categoryById.get(lead.category_id);
  const leadAccent = accentFor(leadCategory?.slug ?? "default");

  return (
    <section
      aria-labelledby="product-edit-heading"
      className="relative overflow-hidden px-6 py-20 md:py-28"
      style={{
        background:
          "linear-gradient(180deg, var(--bg-warm) 0%, var(--bg-soft) 40%, var(--bg-base) 100%)",
      }}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-35"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, rgba(33, 29, 23, 0.03) 1px, transparent 0)",
          backgroundSize: "7px 7px",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-[var(--line-on-light)]"
      />

      <div className="relative z-10 mx-auto max-w-[var(--content-wide)]">
        <Reveal
          variant="light"
          as="div"
          delay={0}
          className="grid grid-cols-1 items-end gap-8 md:grid-cols-12 md:gap-12"
        >
          <div className="md:col-span-6">
            <p className="label-on-light">{eyebrow}</p>
            <h2
              id="product-edit-heading"
              className="mt-5 max-w-[20ch] font-display text-[clamp(1.75rem,3.5vw,3.5rem)] italic leading-[1.06] tracking-[-0.015em] text-[var(--ink)]"
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

        <div className="mt-14 grid grid-cols-1 gap-12 md:mt-20 md:grid-cols-12 md:gap-10">
          <Reveal
            variant="light"
            as="div"
            delay={0}
            className="md:col-span-8"
          >
            <Link
              href={`/product/${lead.slug}`}
              className="pe-lead-card group block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ink)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-base)]"
              aria-label={`View ${lead.name}`}
            >
              <div
                className="relative w-full overflow-hidden rounded-[14px]"
                style={{ aspectRatio: "3 / 4" }}
              >
                {lead.image_url ? (
                  <ProductImage
                    src={lead.image_url}
                    alt={lead.name}
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1200ms] ease-[var(--ease-premium)] group-hover:scale-105 motion-reduce:transition-none"
                  />
                ) : (
                  <div
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

                <div className="absolute inset-x-0 bottom-0 p-7 md:p-10">
                  <div
                    className="pe-glass-panel mx-auto w-full max-w-lg"
                    style={{
                      background: "rgba(255, 255, 255, 0.60)",
                      backdropFilter: "blur(20px) saturate(150%)",
                      WebkitBackdropFilter: "blur(20px) saturate(150%)",
                      border: "1px solid var(--glass-border)",
                      boxShadow: "var(--shadow-soft)",
                      padding: "clamp(1.25rem, 2vw, 1.75rem)",
                    }}
                  >
                    <div className="flex items-baseline justify-between gap-3">
                      <p
                        className="font-mono text-[13px] uppercase tracking-[0.2em]"
                        style={{ color: leadAccent }}
                      >
                        {leadCategory?.name ?? "Product"}
                      </p>
                      <p className="font-mono text-[13px] uppercase tracking-[0.2em] text-[var(--ink-faint)]">
                        Featured
                      </p>
                    </div>
                    <h3 className="mt-3 font-display text-2xl italic leading-[1.04] text-[var(--ink)] sm:text-3xl md:text-4xl">
                      {lead.name}
                    </h3>
                    {lead.description && (
                      <p className="mt-3 hidden text-sm leading-relaxed text-[var(--ink-soft)] md:block">
                        {lead.description}
                      </p>
                    )}
                    <div className="mt-5 flex items-center gap-3">
                      <span
                        className="font-mono text-[13px] uppercase tracking-[0.2em]"
                        style={{ color: leadAccent }}
                      >
                        View product
                      </span>
                      <span
                        aria-hidden
                        className="inline-block h-px w-8 origin-left bg-current transition-all duration-500 group-hover:w-12"
                        style={{ color: leadAccent }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          </Reveal>

          {supporting.length > 0 && (
            <div className="flex flex-col gap-8 md:col-span-4 md:gap-6">
              {supporting.map((p, i) => {
                const cat = categoryById.get(p.category_id);
                const accent = accentFor(cat?.slug ?? "default");
                return (
                  <Reveal
                    key={p.id}
                    variant="light"
                    as="div"
                    delay={((i + 1) as 0 | 1 | 2 | 3 | 4 | 5)}
                  >
                    <Link
                      href={`/product/${p.slug}`}
                      className="group flex gap-5 border-t border-[var(--line-on-light)] py-6 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ink)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-base)]"
                      aria-label={`View ${p.name}`}
                    >
                      <div className="relative h-28 w-24 shrink-0 overflow-hidden rounded-lg">
                        {p.image_url ? (
                          <ProductImage
                            src={p.image_url}
                            alt={p.name}
                            className="h-full w-full object-cover transition-transform duration-[900ms] ease-[var(--ease-premium)] group-hover:scale-105 motion-reduce:transition-none"
                          />
                        ) : (
                          <div
                            className="flex h-full w-full items-center justify-center"
                            style={{
                              background:
                                "linear-gradient(135deg, rgba(168,70,31,0.10) 0%, rgba(201,154,61,0.06) 100%)",
                            }}
                          >
                            <CategoryMark slug={cat?.slug ?? "default"} className="h-14 w-14 opacity-40" />
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
                          {p.name}
                        </p>
                        <div
                          aria-hidden
                          className="mt-3 h-px w-0 bg-current transition-all duration-500 group-hover:w-8"
                          style={{ color: accent }}
                        />
                      </div>
                    </Link>
                  </Reveal>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
