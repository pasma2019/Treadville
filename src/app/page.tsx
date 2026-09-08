import type { Metadata } from "next";
import { getCategories, getFeaturedProducts, getSiteContent } from "@/lib/queries";
import ProductCard from "@/components/ProductCard";
import HeroSlideshow from "@/components/HeroSlideshow";
import CategoryDiscovery from "@/components/CategoryDiscovery";
import Provenance from "@/components/Provenance";
import Reveal from "@/components/Reveal";
import FeaturedSection from "@/components/FeaturedSection";
import JournalPreview from "@/components/JournalPreview";
import EnquirySection from "@/components/EnquirySection";
import { Clock, LayoutGrid, Award } from "lucide-react";
import type { Product } from "@/lib/types";

export const revalidate = 0;

export const metadata: Metadata = {
  description:
    "Premium Kenyan agricultural products — specialty coffee, tea, horticulture, and grains. Traceable origins, exceptional quality, built for global markets.",
  alternates: {
    canonical: "/",
  },
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
      <HeroSlideshow heroImage={contentMap.homepage_hero || undefined} />

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
        image={contentMap.provenance_image || undefined}
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

      <JournalPreview
        essays={[
          {
            no: "01",
            title: "A note on Kirinyaga",
            excerpt:
              "Volcanic soil, glacial water, and a particular quality of light — what the highland terroir means for the coffee grown there.",
            meta: "Field notes",
            image: contentMap.journal_card_coffee || undefined,
          },
          {
            no: "02",
            title: "Cupping at origin",
            excerpt:
              "The discipline of evaluating a lot before it leaves Nairobi — and why SCA protocol matters at the source, not only in the destination market.",
            meta: "Field notes",
            image: contentMap.journal_card_horticulture || undefined,
          },
          {
            no: "03",
            title: "From farm to export",
            excerpt:
              "How a lot moves from cherry to container — and the moments where quality is won or lost along the way.",
            meta: "Field notes",
            image: contentMap.journal_card_tea || undefined,
          },
        ]}
      />

      {/* Featured collection — no divider, natural transition from Journal */}

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
        className="relative surface-ivory px-6 py-20 md:py-28"
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
              <p className="max-w-[42ch] text-[1.0625rem] leading-relaxed text-[var(--ink-soft)] md:text-[1.125rem]">
                {contentMap.about_blurb ||
                  "Over 30 years of expertise in Kenyan agriculture — now expanding from specialty coffee into tea, horticulture, and grains, with the same standard of quality and traceability."}
              </p>

              {/* Trust-badge stats strip — icon + number + label */}
              <div className="mt-12 grid grid-cols-1 gap-6 border-t border-[var(--line-on-light)] pt-10 sm:grid-cols-3 sm:gap-0 sm:divide-x sm:divide-[var(--line-on-light)]">
                <div className="flex items-start gap-4 px-0 sm:px-5 first:sm:pl-0 last:sm:pr-0">
                  <Clock size={18} strokeWidth={1.5} className="mt-1 shrink-0 text-[var(--accent-sage)]" aria-hidden />
                  <div>
                    <p className="font-display text-3xl leading-none tracking-[-0.02em] text-[var(--ink)] md:text-4xl">
                      30<span className="text-[var(--ink-faint)]">+</span>
                    </p>
                    <p className="mt-2 max-w-[18ch] text-[0.8125rem] leading-relaxed text-[var(--ink-muted)]">
                      Years in Kenyan agriculture
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4 px-0 sm:px-5 first:sm:pl-0 last:sm:pr-0">
                  <LayoutGrid size={18} strokeWidth={1.5} className="mt-1 shrink-0 text-[var(--accent-sage)]" aria-hidden />
                  <div>
                    <p className="font-display text-3xl leading-none tracking-[-0.02em] text-[var(--ink)] md:text-4xl">
                      04
                    </p>
                    <p className="mt-2 max-w-[18ch] text-[0.8125rem] leading-relaxed text-[var(--ink-muted)]">
                      Categories under one standard
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4 px-0 sm:px-5 first:sm:pl-0 last:sm:pr-0">
                  <Award size={18} strokeWidth={1.5} className="mt-1 shrink-0 text-[var(--accent-sage)]" aria-hidden />
                  <div>
                    <p className="font-display text-3xl leading-none tracking-[-0.02em] text-[var(--ink)] md:text-4xl">
                      80<span className="text-[var(--ink-faint)]">+</span>
                    </p>
                    <p className="mt-2 max-w-[18ch] text-[0.8125rem] leading-relaxed text-[var(--ink-muted)]">
                      SCA specialty score
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>

          <Reveal
            variant="light"
            as="div"
            delay={1}
            className="mt-16 flex items-center gap-4 border-t border-[var(--line-on-light)] pt-8 md:mt-24"
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

      <EnquirySection />
    </main>
  );
}


