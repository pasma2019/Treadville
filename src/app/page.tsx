import type { Metadata } from "next";
import Link from "next/link";
import { getCategories, getFeaturedProducts, getSiteContent } from "@/lib/queries";
import ProductCard from "@/components/ProductCard";
import HeroSlideshow from "@/components/HeroSlideshow";
import CategoryDiscovery from "@/components/CategoryDiscovery";
import Provenance from "@/components/Provenance";
import Reveal from "@/components/Reveal";
import FeaturedSection from "@/components/FeaturedSection";
import JournalPreview from "@/components/JournalPreview";
import type { Product } from "@/lib/types";
export const metadata: Metadata = {
  description:
    "Premium Kenyan agricultural products — specialty coffee, tea, horticulture, and grains. Traceable origins, exceptional quality, built for global markets.",
};

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

      <JournalPreview />

      {featured.length > 0 && (() => {
        const lead = featured[0];
        const supporting = featured.slice(1);
        const featuredEyebrow = contentMap.featured_eyebrow || "From the current collection";
        const featuredHeadline = contentMap.featured_headline || "Curated lots, ready to ship.";
        const featuredIntro = contentMap.featured_intro || "A small selection from across our categories — chosen for character, condition, and the way they present.";
        return (
          <FeaturedSection
            lead={lead}
            supporting={supporting}
            categories={categories}
            eyebrow={featuredEyebrow}
            headline={featuredHeadline}
            intro={featuredIntro}
          />
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
                {[
                  {
                    href: "/contact",
                    eyebrow: "General enquiry",
                    headline: "Talk to Treadville",
                    note: "Speak with our team about any product line.",
                    accent: "var(--copper)",
                    icon: "→",
                  },
                  {
                    href: "/contact?type=sample",
                    eyebrow: "Sample request",
                    headline: "Request a sample",
                    note: "Cup, taste, and evaluate before you commit.",
                    accent: "var(--jade)",
                    icon: "→",
                  },
                  {
                    href: "/contact?type=quote",
                    eyebrow: "Export & wholesale",
                    headline: "Request a quote",
                    note: "Volume pricing and shipping terms for international buyers.",
                    accent: "var(--gold)",
                    icon: "→",
                  },
                ].map((card) => (
                  <li key={card.href}>
                    <Link
                      href={card.href}
                      className="group flex items-start gap-5 border p-5 transition-shadow duration-[var(--dur)] hover:shadow-[var(--shadow-lift-light)]"
                      style={{
                        borderColor: "var(--line-on-light)",
                        background: "var(--warm-white)",
                      }}
                    >
                      <div
                        className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center border font-mono text-[11px] transition-all duration-[var(--dur)] group-hover:w-10"
                        style={{
                          borderColor: card.accent,
                          color: card.accent,
                        }}
                      >
                        {card.icon}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p
                          className="label-on-light"
                          style={{ color: card.accent }}
                        >
                          {card.eyebrow}
                        </p>
                        <p className="mt-1 font-display text-xl italic text-[var(--ink)]">
                          {card.headline}
                        </p>
                        <p className="mt-1 text-sm text-[var(--ink-muted)]">
                          {card.note}
                        </p>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </section>
    </main>
  );
}


