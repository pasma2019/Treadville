import type { Metadata } from "next";
import { getCategories, getFeaturedProducts, getSiteContent, getArticles } from "@/lib/queries";
import HeroSlideshow from "@/components/HeroSlideshow";
import HomepageIntro from "@/components/home/HomepageIntro";
import HomepageProductWorlds from "@/components/home/HomepageProductWorlds";
import HomepageOrigins from "@/components/home/HomepageOrigins";
import HomepageProductEdit from "@/components/home/HomepageProductEdit";
import HomepageQuality from "@/components/home/HomepageQuality";
import HomepageExport from "@/components/home/HomepageExport";
import HomepageJournal from "@/components/home/HomepageJournal";
import HomepageEnquiry from "@/components/home/HomepageEnquiry";

export const revalidate = 0;

export const metadata: Metadata = {
  description:
    "Premium Kenyan agricultural products — specialty coffee, tea, horticulture, and grains. Traceable origins, exceptional quality, built for global markets.",
  alternates: {
    canonical: "/",
  },
};

export default async function HomePage() {
  const [categories, featured, content, articles] = await Promise.all([
    getCategories(),
    getFeaturedProducts(),
    getSiteContent(),
    getArticles(true),
  ]);

  const contentMap = content as Record<string, string>;

  return (
    <main>
      {/* CAMPAIGN — Hero */}
      <HeroSlideshow
        heroImage={contentMap.homepage_hero || undefined}
        headline={contentMap.homepage_hero_headline || undefined}
        subheadline={contentMap.homepage_hero_subheadline || undefined}
      />

      {/* BRAND INTRODUCTION — Editorial statement */}
      <HomepageIntro
        eyebrow={contentMap.story_eyebrow || undefined}
        headline={contentMap.story_headline || undefined}
        body={contentMap.about_blurb || undefined}
        closing={contentMap.story_closing || undefined}
      />

      {/* PRODUCT WORLDS — Four categories */}
      <HomepageProductWorlds categories={categories} />

      {/* ORIGIN — Kenyan landscape story */}
      <HomepageOrigins
        eyebrow={contentMap.provenance_eyebrow || undefined}
        headline={contentMap.provenance_headline || undefined}
        intro={contentMap.provenance_intro || undefined}
        image={contentMap.provenance_image || undefined}
        closing={contentMap.provenance_closing || undefined}
      />

      {/* PRODUCT EDIT — Featured collection */}
      {featured.length > 0 && (
        <HomepageProductEdit
          products={featured}
          categories={categories}
          eyebrow={contentMap.featured_eyebrow || undefined}
          headline={contentMap.featured_headline || undefined}
          intro={contentMap.featured_intro || undefined}
        />
      )}

      {/* QUALITY — Trust section */}
      <HomepageQuality />

      {/* EXPORT — International section */}
      <HomepageExport
        image={contentMap.export_hero || undefined}
      />

      {/* JOURNAL — Editorial publishing */}
      <HomepageJournal articles={articles} />

      {/* ENQUIRY — Final conversion */}
      <HomepageEnquiry />
    </main>
  );
}


