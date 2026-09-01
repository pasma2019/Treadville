import Link from "next/link";
import { getCategories, getFeaturedProducts, getSiteContent } from "@/lib/queries";
import ProductCard from "@/components/ProductCard";
import HeroSlideshow from "@/components/HeroSlideshow";
import CategoryDiscovery from "@/components/CategoryDiscovery";
import Provenance from "@/components/Provenance";
import Reveal from "@/components/Reveal";

export const revalidate = 0;

export default async function HomePage() {
  const [categories, featured, content] = await Promise.all([
    getCategories(),
    getFeaturedProducts(),
    getSiteContent(),
  ]);

  const contentMap = content as Record<string, string>;

  return (
    <main>
      <HeroSlideshow />

      <CategoryDiscovery categories={categories} />

      <Provenance
        eyebrow={contentMap.provenance_eyebrow || "From origin to experience"}
        headline={
          contentMap.provenance_headline ||
          "Kenyan agriculture, considered at every step."
        }
        intro={
          contentMap.provenance_intro ||
          "Every Treadville product travels the same arc — from the soils that grow it, through the hands that refine it, to the markets that receive it. The work between those moments is where quality is made."
        }
        stages={[
          {
            number: "01",
            label: "Origin",
            line:
              "Kenyan volcanic highlands and fertile plains. Soils, altitude, and climate shape the raw material before a hand ever touches it.",
          },
          {
            number: "02",
            label: "Craft",
            line:
              "Selection, processing, and quality control. Each lot is handled with the same discipline, in service of the same standard.",
          },
          {
            number: "03",
            label: "Experience",
            line:
              "Packaged, documented, and delivered. The result is a product that carries its origin — and is ready for tables far from it.",
          },
        ]}
        closing={contentMap.provenance_closing || "The collection follows."}
      />

      {/* FEATURED — light premium, products on bright backgrounds */}
      {featured.length > 0 && (() => {
        const lead = featured[0];
        const supporting = featured.slice(1);
        const categoryById = new Map(categories.map((c) => [c.id, c]));
        const leadCategory = categoryById.get(lead.category_id);
        const leadCategoryName = leadCategory?.name ?? null;
        const featuredEyebrow = contentMap.featured_eyebrow || "From the current collection";
        const featuredHeadline =
          contentMap.featured_headline || "Curated lots, ready to ship.";
        const featuredIntro =
          contentMap.featured_intro ||
          "A small selection from across our categories — chosen for character, condition, and the way they present.";
        return (
          <section
            aria-labelledby="featured-heading"
            className="relative surface-warm border-y border-[var(--line-on-light)] px-6 py-24 md:py-36"
          >
            <div className="relative z-10 mx-auto max-w-[var(--content-wide)]">
              <Reveal variant="light" as="div" delay={0} className="grid grid-cols-1 items-end gap-8 md:grid-cols-12 md:gap-10">
                <div className="md:col-span-7">
                  <p className="label-on-light">{featuredEyebrow} · Lot cards</p>
                  <h2
                    id="featured-heading"
                    className="mt-4 max-w-[18ch] font-display text-3xl italic leading-[1.05] tracking-[-0.02em] text-[var(--ink)] md:text-6xl"
                  >
                    {featuredHeadline}
                  </h2>
                </div>
                <div className="md:col-span-5">
                  <p className="body-on-light max-w-md md:text-lg">
                    {featuredIntro}
                  </p>
                </div>
              </Reveal>

              <div className="mt-14 md:mt-20">
                <div className="grid grid-cols-1 gap-6 md:gap-8 lg:grid-cols-12">
                  <div className="lg:col-span-7">
                    <div className="relative">
                      {leadCategoryName ? (
                        <div className="pointer-events-none absolute right-5 top-5 z-10 hidden label-on-light sm:block">
                          Lead · {leadCategoryName}
                        </div>
                      ) : null}
                      <ProductCardLight
                        product={lead}
                        categorySlug={leadCategory?.slug}
                        index={0}
                      />
                    </div>
                  </div>
                  {supporting.length > 0 ? (
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:gap-8 lg:col-span-5 lg:grid-cols-1">
                      {supporting.map((p, i) => {
                        const cat = categoryById.get(p.category_id);
                        return (
                          <div key={p.id} className="relative">
                            {cat ? (
                              <div className="pointer-events-none absolute right-5 top-5 z-10 hidden label-on-light sm:block">
                                {cat.name}
                              </div>
                            ) : null}
                            <ProductCardLight
                              product={p}
                              categorySlug={cat?.slug}
                              index={i + 1}
                            />
                          </div>
                        );
                      })}
                    </div>
                  ) : null}
                </div>
              </div>

              <div className="mt-14 flex flex-wrap items-center justify-between gap-4 border-t border-[var(--line-on-light)] pt-6 md:mt-20">
                <p className="label-on-light">The full collection</p>
                <Link
                  href="/shop"
                  className="btn-light-link"
                >
                  View all
                </Link>
              </div>
            </div>
          </section>
        );
      })()}

      {/* STORY — light editorial with stats */}
      <section
        aria-labelledby="story-heading"
        className="relative surface-ivory px-6 py-24 md:py-36"
      >
        <div className="relative z-10 mx-auto max-w-[var(--content-wide)]">
          <Reveal variant="light" as="div" delay={0} className="grid grid-cols-1 gap-12 md:grid-cols-12 md:gap-16">
            <div className="md:col-span-5">
              <p className="label-on-light">
                {contentMap.story_eyebrow || "The Treadville approach"}
              </p>
              <h2
                id="story-heading"
                className="mt-6 max-w-[16ch] font-display text-3xl leading-[1.02] tracking-[-0.025em] text-[var(--ink)] md:text-5xl lg:text-[4.5rem]"
              >
                {contentMap.story_headline ||
                  "Three decades of Kenyan agriculture — now growing beyond coffee."}
              </h2>
            </div>
            <div className="md:col-span-7">
              <p className="max-w-[42ch] text-base leading-relaxed text-[var(--ink-soft)] md:text-lg">
                {contentMap.about_blurb ||
                  "Over 30 years of expertise in Kenyan agriculture — now expanding from specialty coffee into tea, horticulture, and grains, with the same standard of quality and traceability."}
              </p>

              <div className="mt-12 grid grid-cols-2 gap-6 border-t border-[var(--line-on-light)] pt-10 md:grid-cols-3 md:gap-10">
                <div>
                  <p className="editorial-stat">
                    30<span className="editorial-stat-soft">+</span>
                  </p>
                  <p className="mt-3 max-w-[18ch] label-on-light">
                    Years in Kenyan agriculture
                  </p>
                </div>
                <div>
                  <p className="editorial-stat">04</p>
                  <p className="mt-3 max-w-[18ch] label-on-light">
                    Categories under one standard
                  </p>
                </div>
                <div>
                  <p className="editorial-stat">
                    80<span className="editorial-stat-soft">+</span>
                  </p>
                  <p className="mt-3 max-w-[18ch] label-on-light">
                    SCA specialty score
                  </p>
                </div>
              </div>
            </div>
          </Reveal>

          <Reveal
            variant="light"
            as="div"
            delay={1}
            className="mt-20 flex items-center gap-4 border-t border-[var(--line-on-light)] pt-8 md:mt-28"
          >
            <span aria-hidden className="label-on-light">
              Treadville
            </span>
            <span aria-hidden className="h-px flex-1 max-w-[6rem] bg-[var(--line-on-light)]" />
            <p className="label-on-light">
              {contentMap.story_closing || "Est. 30+ years · Kenya"}
            </p>
          </Reveal>
        </div>
      </section>

      {/* ENQUIRY CTA — light, premium close */}
      <section
        aria-labelledby="enquiry-heading"
        className="relative surface-cream px-6 py-24 md:py-36"
      >
        <div className="relative z-10 mx-auto max-w-[var(--content-wide)]">
          <Reveal variant="light" as="div" delay={0} className="grid grid-cols-1 gap-12 md:grid-cols-12 md:gap-16">
            <div className="md:col-span-7">
              <p className="label-on-light">Engage with Treadville</p>
              <h2
                id="enquiry-heading"
                className="mt-6 max-w-[18ch] font-display text-3xl leading-[1.02] tracking-[-0.025em] text-[var(--ink)] md:text-5xl lg:text-[4rem]"
              >
                A conversation, not a checkout.
              </h2>
              <p className="mt-6 max-w-[44ch] text-base leading-relaxed text-[var(--ink-soft)] md:text-lg">
                Whether you are sourcing for a roastery, an importer, a retail
                shelf, or a private-label programme, our team responds to
                every enquiry directly.
              </p>
            </div>
            <div className="md:col-span-5">
              <ul className="space-y-4">
                <li>
                  <Link
                    href="/contact"
                    className="group block border border-[var(--line-on-light)] bg-[var(--warm-white)] p-6 transition-shadow duration-[var(--dur)] hover:shadow-[var(--shadow-lift-light)]"
                  >
                    <p className="label-on-light">General enquiry</p>
                    <p className="mt-2 font-display text-xl italic text-[var(--ink)]">Talk to Treadville</p>
                    <p className="mt-1 text-sm text-[var(--ink-muted)]">Speak with our team about any product line.</p>
                  </Link>
                </li>
                <li>
                  <Link
                    href="/contact?type=sample"
                    className="group block border border-[var(--line-on-light)] bg-[var(--warm-white)] p-6 transition-shadow duration-[var(--dur)] hover:shadow-[var(--shadow-lift-light)]"
                  >
                    <p className="label-on-light">Sample request</p>
                    <p className="mt-2 font-display text-xl italic text-[var(--ink)]">Request a sample</p>
                    <p className="mt-1 text-sm text-[var(--ink-muted)]">Cup, taste, and evaluate before you commit.</p>
                  </Link>
                </li>
                <li>
                  <Link
                    href="/contact?type=quote"
                    className="group block border border-[var(--line-on-light)] bg-[var(--warm-white)] p-6 transition-shadow duration-[var(--dur)] hover:shadow-[var(--shadow-lift-light)]"
                  >
                    <p className="label-on-light">Export &amp; wholesale</p>
                    <p className="mt-2 font-display text-xl italic text-[var(--ink)]">Request a quote</p>
                    <p className="mt-1 text-sm text-[var(--ink-muted)]">Volume pricing and shipping terms for international buyers.</p>
                  </Link>
                </li>
              </ul>
            </div>
          </Reveal>
        </div>
      </section>
    </main>
  );
}

import type { Product } from "@/lib/types";
import ProductImage from "@/components/ProductImage";
import CategoryMark, { accentFor } from "@/components/CategoryMark";

function ProductCardLight({
  product,
  categorySlug,
  index,
}: {
  product: Product;
  categorySlug?: string;
  index?: number;
}) {
  const slug = categorySlug ?? "default";
  const accent = accentFor(slug);
  const eyebrowIndex =
    typeof index === "number" ? `N° ${String(index + 1).padStart(2, "0")}` : "Lot";

  return (
    <Link
      href={`/product/${product.slug}`}
      className="group block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--warm-white)]"
      aria-label={`View ${product.name}`}
      style={{ ["--accent" as string]: accent }}
    >
      <div className="stage-product-card relative aspect-[4/5] w-full overflow-hidden">
        {product.image_url ? (
          <ProductImage
            src={product.image_url}
            alt={product.name}
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-[700ms] ease-out group-hover:scale-[1.06]"
          />
        ) : (
          <ProductIdentityLight slug={slug} name={product.name} eyebrow={eyebrowIndex} />
        )}
      </div>
      <div className="mt-5 flex items-baseline justify-between gap-3">
        <p className="font-display text-lg italic leading-tight text-[var(--ink)]">
          {product.name}
        </p>
        <p
          className="shrink-0 whitespace-nowrap label-on-light"
          style={{ color: accent }}
        >
          Enquire
        </p>
      </div>
    </Link>
  );
}

function ProductIdentityLight({
  slug,
  name,
  eyebrow,
}: {
  slug: string;
  name: string;
  eyebrow: string;
}) {
  return (
    <div className="absolute inset-0 flex flex-col justify-between p-5 md:p-7">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-30"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, rgba(26, 20, 16, 0.10) 1px, transparent 0)",
          backgroundSize: "5px 5px",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(60% 40% at 50% 30%, rgba(168, 70, 31, 0.08) 0%, transparent 70%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-5 top-5 h-px bg-[var(--accent)]"
        style={{ opacity: 0.65 }}
      />
      <div className="relative flex items-start justify-between">
        <p className="label-on-light">{eyebrow}</p>
      </div>
      <div className="relative flex flex-1 items-center justify-center">
        <CategoryMark
          slug={slug}
          className="h-32 w-32 opacity-[0.28] transition-opacity duration-700 ease-out group-hover:opacity-40 md:h-40 md:w-40"
          style={{ strokeWidth: 0.8 }}
        />
      </div>
      <div className="relative">
        <p
          className="font-display text-[1.85rem] italic leading-[1.02] tracking-[-0.018em] text-[var(--ink)] md:text-[2.25rem]"
          style={{ textWrap: "balance" }}
        >
          {name}
        </p>
        <div className="mt-3 flex items-center gap-2 label-on-light">
          <span aria-hidden className="h-px w-6 bg-[var(--ink-faint)]" />
          <span>Treadville · {slug === "default" ? "Lot" : slug}</span>
        </div>
      </div>
    </div>
  );
}
