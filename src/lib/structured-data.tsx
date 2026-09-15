import type { Product, Article, Category } from "@/lib/types";
import { serializeJsonLd } from "@/lib/json-ld-serializer";

const SITE_URL = "https://treadville.co.ke";
const SITE_NAME = "Treadville";
const SITE_DESCRIPTION =
  "Specialty coffee, tea, horticulture, and grains sourced across Kenya's volcanic highlands and fertile plains. Traceable origins. Exceptional quality.";

type JsonLdProps = {
  data: Record<string, unknown>;
};

function JsonLdScript({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: serializeJsonLd(data) }}
    />
  );
}

export function OrganizationJsonLd() {
  return (
    <JsonLdScript
      data={{
        "@context": "https://schema.org",
        "@type": "Organization",
        name: SITE_NAME,
        legalName: "Treadville Company Limited",
        url: SITE_URL,
        logo: `${SITE_URL}/icon.png`,
        description: SITE_DESCRIPTION,
        foundingLocation: {
          "@type": "Place",
          name: "Kenya",
        },
        address: {
          "@type": "PostalAddress",
          addressLocality: "Nairobi",
          addressCountry: "KE",
        },
        contactPoint: {
          "@type": "ContactPoint",
          contactType: "customer support",
          email: "info@treadville.co.ke",
          telephone: "+254722479985",
          areaServed: ["KE", "Africa", "Worldwide"],
          availableLanguage: ["English"],
        },
        sameAs: [],
      }}
    />
  );
}

export function WebSiteJsonLd() {
  return (
    <JsonLdScript
      data={{
        "@context": "https://schema.org",
        "@type": "WebSite",
        name: SITE_NAME,
        url: SITE_URL,
        description: SITE_DESCRIPTION,
        inLanguage: "en-KE",
        publisher: {
          "@type": "Organization",
          name: "Treadville Company Limited",
        },
      }}
    />
  );
}

export function ProductJsonLd({
  product,
  category,
  url,
}: {
  product: Product;
  category: Category | null;
  url: string;
}) {
  // Deliberately omit: aggregateRating, review (none exist)
  // Deliberately omit: offers.price (prices are private / quote-based)
  return (
    <JsonLdScript
      data={{
        "@context": "https://schema.org",
        "@type": "Product",
        name: product.name,
        description: product.description || product.name,
        image: product.image_url ? [product.image_url] : undefined,
        sku: product.slug,
        brand: {
          "@type": "Brand",
          name: SITE_NAME,
        },
        category: category?.name,
        url,
      }}
    />
  );
}

export function ArticleJsonLd({
  article,
  url,
}: {
  article: Article;
  url: string;
}) {
  return (
    <JsonLdScript
      data={{
        "@context": "https://schema.org",
        "@type": "Article",
        headline: article.title,
        description: article.excerpt || article.title,
        image: article.cover_image_url ? [article.cover_image_url] : undefined,
        datePublished: article.published_at || article.created_at,
        dateModified: article.updated_at,
        author: {
          "@type": "Person",
          name: article.author_name || "Treadville Editorial",
        },
        publisher: {
          "@type": "Organization",
          name: SITE_NAME,
          logo: {
            "@type": "ImageObject",
            url: `${SITE_URL}/icon.png`,
          },
        },
        mainEntityOfPage: {
          "@type": "WebPage",
          "@id": url,
        },
        url,
      }}
    />
  );
}

export function BreadcrumbJsonLd({
  items,
}: {
  items: Array<{ name: string; url: string }>;
}) {
  return (
    <JsonLdScript
      data={{
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: items.map((item, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: item.name,
          item: item.url,
        })),
      }}
    />
  );
}
