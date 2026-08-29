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
            className="relative border-b border-[var(--line)] px-6 py-24 md:py-32"
            style={{ background: "var(--soil)" }}
          >
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  "radial-gradient(60% 50% at 0% 0%, rgba(168, 70, 31, 0.08) 0%, transparent 50%)," +
                  "radial-gradient(50% 40% at 100% 100%, rgba(176, 141, 87, 0.06) 0%, transparent 60%)",
              }}
            />
            <div className="relative z-10 mx-auto max-w-[var(--content-wide)]">
              <div className="grid grid-cols-1 items-end gap-8 md:grid-cols-12 md:gap-10">
                <div className="md:col-span-7">
                  <p className="font-mono text-[11px] uppercase tracking-[0.32em] text-[var(--parchment)]/50">
                    {featuredEyebrow} · Lot cards
                  </p>
                  <h2
                    id="featured-heading"
                    className="mt-4 max-w-[18ch] font-display text-3xl italic leading-[1.05] tracking-[-0.02em] text-[var(--parchment)] md:text-6xl"
                  >
                    {featuredHeadline}
                  </h2>
                </div>
                <div className="md:col-span-5">
                  <p className="max-w-md text-sm leading-relaxed text-[var(--parchment)]/60 md:text-base">
                    {featuredIntro}
                  </p>
                </div>
              </div>

              <div className="mt-14 md:mt-20">
                <div className="grid grid-cols-1 gap-6 md:gap-8 lg:grid-cols-12">
                  <div className="lg:col-span-7">
                    <div className="relative">
                      {leadCategoryName ? (
                        <div className="pointer-events-none absolute right-5 top-5 z-10 hidden font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--parchment)]/70 sm:block">
                          Lead · {leadCategoryName}
                        </div>
                      ) : null}
                      <ProductCard product={lead} categorySlug={leadCategory?.slug} index={0} forceIdentity />
                    </div>
                  </div>
                  {supporting.length > 0 ? (
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:gap-8 lg:col-span-5 lg:grid-cols-1">
                      {supporting.map((p, i) => {
                        const cat = categoryById.get(p.category_id);
                        return (
                          <div key={p.id} className="relative">
                            {cat ? (
                              <div className="pointer-events-none absolute right-5 top-5 z-10 hidden font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--parchment)]/60 sm:block">
                                {cat.name}
                              </div>
                            ) : null}
                            <ProductCard product={p} categorySlug={cat?.slug} index={i + 1} forceIdentity />
                          </div>
                        );
                      })}
                    </div>
                  ) : null}
                </div>
              </div>

              <div className="mt-14 flex flex-wrap items-center justify-between gap-4 border-t border-[var(--line)] pt-6 md:mt-20">
                <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--parchment)]/40">
                  The full collection
                </p>
                <Link
                  href="/shop"
                  className="group inline-flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.28em] text-[var(--parchment)]/70 transition-colors duration-[var(--dur-fast)] ease-[var(--ease-out)] hover:text-[var(--parchment)] focus-visible:outline-none focus-visible:text-[var(--parchment)]"
                >
                  <span>View all</span>
                  <span
                    aria-hidden
                    className="h-px w-6 bg-[var(--parchment)]/40 transition-[width,background-color] duration-[var(--dur)] ease-[var(--ease-out)] group-hover:w-10 group-hover:bg-[var(--accent)] group-focus-visible:w-10 group-focus-visible:bg-[var(--accent)]"
                  />
                </Link>
              </div>
            </div>
          </section>
        );
      })()}

      <section
        aria-labelledby="story-heading"
        className="relative border-t border-[var(--line-light)] border-b border-[var(--line)] px-6 py-32 md:py-44"
        style={{ background: "var(--bone)", color: "var(--soil)" }}
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-50"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, rgba(22, 17, 13, 0.04) 1px, transparent 0)",
            backgroundSize: "8px 8px",
          }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(70% 50% at 20% 100%, rgba(168, 70, 31, 0.06) 0%, transparent 60%)",
          }}
        />
        <div className="relative z-10 mx-auto max-w-[var(--content-wide)]">
          <Reveal as="div" delay={0} className="grid grid-cols-1 gap-12 md:grid-cols-12 md:gap-16">
            <div className="md:col-span-5">
              <p className="font-mono text-[10px] uppercase tracking-[0.35em] text-[var(--soil)]/45">
                {contentMap.story_eyebrow || "The Treadville approach"}
              </p>
              <h2
                id="story-heading"
                className="mt-6 max-w-[16ch] font-display text-3xl leading-[1.02] tracking-[-0.025em] text-[var(--soil)] md:text-5xl lg:text-[4.5rem]"
              >
                {contentMap.story_headline ||
                  "Three decades of Kenyan agriculture — now growing beyond coffee."}
              </h2>
            </div>
            <div className="md:col-span-7">
              <p className="max-w-[42ch] text-base leading-relaxed text-[var(--soil)]/70 md:text-lg">
                {contentMap.about_blurb ||
                  "Over 30 years of expertise in Kenyan agriculture — now expanding from specialty coffee into tea, horticulture, and grains, with the same standard of quality and traceability."}
              </p>

              {/* Visual anchor — oversized editorial stat, no fake photo */}
              <div className="mt-12 grid grid-cols-2 gap-6 border-t border-[var(--line-light)] pt-10 md:grid-cols-3 md:gap-10">
                <div>
                  <p className="font-display text-5xl leading-none tracking-[-0.02em] text-[var(--soil)] md:text-6xl lg:text-7xl">
                    30<span className="text-[var(--soil)]/40">+</span>
                  </p>
                  <p className="mt-3 max-w-[18ch] font-mono text-[10px] uppercase tracking-[0.28em] text-[var(--soil)]/55">
                    Years in Kenyan agriculture
                  </p>
                </div>
                <div>
                  <p className="font-display text-5xl leading-none tracking-[-0.02em] text-[var(--soil)] md:text-6xl lg:text-7xl">
                    04
                  </p>
                  <p className="mt-3 max-w-[18ch] font-mono text-[10px] uppercase tracking-[0.28em] text-[var(--soil)]/55">
                    Categories under one standard
                  </p>
                </div>
                <div>
                  <p className="font-display text-5xl leading-none tracking-[-0.02em] text-[var(--soil)] md:text-6xl lg:text-7xl">
                    80<span className="text-[var(--soil)]/40">+</span>
                  </p>
                  <p className="mt-3 max-w-[18ch] font-mono text-[10px] uppercase tracking-[0.28em] text-[var(--soil)]/55">
                    SCA specialty score
                  </p>
                </div>
              </div>
            </div>
          </Reveal>

          <Reveal
            as="div"
            delay={1}
            className="mt-20 flex items-center gap-4 border-t border-[var(--line-light)] pt-8 md:mt-28"
          >
            <span aria-hidden className="font-mono text-[9px] uppercase tracking-[0.4em] text-[var(--soil)]/40">
              Treadville
            </span>
            <span aria-hidden className="h-px flex-1 max-w-[6rem] bg-[var(--line-light)]" />
            <p className="font-mono text-[9px] uppercase tracking-[0.4em] text-[var(--soil)]/50">
              {contentMap.story_closing || "Est. 30+ years · Kenya"}
            </p>
          </Reveal>
        </div>
      </section>
    </main>
  );
}
