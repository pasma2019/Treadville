import type { Category } from "@/lib/types";

// ============================================================
// CMS V1 — operator-controlled site content registry
//
// WRITE PATH = READ PATH. Every field declared here is consumed
// by the storefront exactly once (see the reader reference on
// each field). Nothing in this file exists merely because a
// database key exists.
//
// The allowlist built from this file is enforced server-side in
// setSiteContentAction — the browser cannot write arbitrary keys.
// ============================================================

export type CmsFieldType = "text" | "image";

export type CmsField = {
  key: string;
  type: CmsFieldType;
  section: string;
  label: string;
  hint?: string;
  rows?: number;
  fallback?: string;
  imageRole?: string;
};

export const CMS_TEXT_MAX_LENGTH = 2000;
export const CMS_IMAGE_VALUE_MAX_LENGTH = 600;

export const CMS_SECTIONS = [
  { id: "homepage", label: "Homepage" },
  { id: "about", label: "About" },
  { id: "quality", label: "Quality" },
  { id: "origins", label: "Origins" },
  { id: "export", label: "Export" },
  { id: "categories", label: "Categories" },
] as const;

export type CmsSectionId = (typeof CMS_SECTIONS)[number]["id"];

// ---- Category hero (dynamic per active category) ----

export function categoryHeroKey(slug: string): string {
  return `category_hero_${slug}`;
}

export const CATEGORY_HERO_PREFIX = "category_hero_";

// ---- Static field registry ----------------------------------
// Readers verified in Slice 16 (file:line of the storefront read).
export const CMS_STATIC_FIELDS: CmsField[] = [
  // Homepage → Hero (single authoritative homepage hero model)
  {
    key: "homepage_hero_headline",
    type: "text",
    section: "homepage",
    label: "Hero headline",
    hint: "The large statement at the top of the homepage. Use a new line to split the two visual lines.",
    rows: 2,
    fallback: "From Kenyan soil\nto global markets.",
  },
  {
    key: "homepage_hero_subheadline",
    type: "text",
    section: "homepage",
    label: "Hero subheadline",
    hint: "The paragraph directly under the hero headline.",
    rows: 3,
    fallback:
      "Premium Kenyan agricultural products — specialty coffee, tea, horticulture, and grains — sourced with traceability and delivered to global markets.",
  },
  {
    key: "homepage_hero",
    type: "image",
    section: "homepage",
    label: "Hero image",
    hint: "Read by the homepage hero.",
    imageRole: "Full-screen background behind the hero copy",
  },
  // Homepage → Story (the light editorial section on the homepage)
  {
    key: "story_eyebrow",
    type: "text",
    section: "homepage",
    label: "Story eyebrow",
    hint: "Small label above the story headline.",
    rows: 1,
    fallback: "The Treadville approach",
  },
  {
    key: "story_headline",
    type: "text",
    section: "homepage",
    label: "Story headline",
    hint: "Headline for the story section.",
    rows: 2,
    fallback: "Three decades of Kenyan agriculture — now growing beyond coffee.",
  },
  {
    key: "about_blurb",
    type: "text",
    section: "homepage",
    label: "Story paragraph",
    hint: "The paragraph under the story headline. Also referred to as the about blurb.",
    rows: 4,
    fallback:
      "Over 30 years of expertise in Kenyan agriculture — now expanding from specialty coffee into tea, horticulture, and grains, with the same standard of quality and traceability.",
  },
  {
    key: "story_closing",
    type: "text",
    section: "homepage",
    label: "Story closing line",
    hint: "The small line beneath the story section.",
    rows: 1,
    fallback: "Est. 30+ years · Kenya",
  },
  // Homepage → Provenance
  {
    key: "provenance_eyebrow",
    type: "text",
    section: "homepage",
    label: "Provenance eyebrow",
    hint: "Small label above the provenance headline.",
    rows: 1,
    fallback: "From origin to experience",
  },
  {
    key: "provenance_headline",
    type: "text",
    section: "homepage",
    label: "Provenance headline",
    hint: "Headline for the provenance section.",
    rows: 2,
    fallback: "Kenyan agriculture, considered at every step.",
  },
  {
    key: "provenance_intro",
    type: "text",
    section: "homepage",
    label: "Provenance intro",
    hint: "Introductory paragraph for the provenance section.",
    rows: 4,
    fallback:
      "Every Treadville product travels the same arc — from the soils that grow it, through the hands that refine it, to the markets that receive it. The work between those moments is where quality is made.",
  },
  {
    key: "provenance_image",
    type: "image",
    section: "homepage",
    label: "Provenance image",
    hint: "Read by the provenance section.",
    imageRole: "Large editorial image in the provenance section",
  },
  {
    key: "provenance_closing",
    type: "text",
    section: "homepage",
    label: "Provenance closing line",
    hint: "Closing statement under the provenance stages.",
    rows: 1,
    fallback: "The collection follows.",
  },
  // Homepage → Featured collection
  {
    key: "featured_eyebrow",
    type: "text",
    section: "homepage",
    label: "Featured eyebrow",
    hint: "Small label above the featured collection.",
    rows: 1,
    fallback: "From the current collection",
  },
  {
    key: "featured_headline",
    type: "text",
    section: "homepage",
    label: "Featured headline",
    hint: "Headline for the featured collection.",
    rows: 2,
    fallback: "Curated lots, ready to ship.",
  },
  {
    key: "featured_intro",
    type: "text",
    section: "homepage",
    label: "Featured intro",
    hint: "Introductory paragraph for the featured collection.",
    rows: 3,
    fallback:
      "A small selection from across our categories — chosen for character, condition, and the way they present.",
  },
  // Homepage → Journal preview imagery
  {
    key: "journal_card_coffee",
    type: "image",
    section: "homepage",
    label: "Journal preview — coffee",
    hint: "Read by the homepage journal preview.",
    imageRole: "Cover for the Kirinyaga journal card",
  },
  {
    key: "journal_card_horticulture",
    type: "image",
    section: "homepage",
    label: "Journal preview — horticulture",
    hint: "Read by the homepage journal preview.",
    imageRole: "Cover for the cupping-at-origin journal card",
  },
  {
    key: "journal_card_tea",
    type: "image",
    section: "homepage",
    label: "Journal preview — tea",
    hint: "Read by the homepage journal preview.",
    imageRole: "Cover for the farm-to-export journal card",
  },
  // About
  {
    key: "about_hero",
    type: "image",
    section: "about",
    label: "About hero image",
    hint: "Read by /about.",
    imageRole: "Background image behind the About hero",
  },
  // Quality
  {
    key: "quality_hero",
    type: "image",
    section: "quality",
    label: "Quality hero image",
    hint: "Read by /quality.",
    imageRole: "Background image behind the Quality hero",
  },
  // Origins
  {
    key: "origins_body_kirinyaga",
    type: "image",
    section: "origins",
    label: "Kirinyaga image",
    hint: "Read by /origins (Chapter I).",
    imageRole: "Kirinyaga highland landscape",
  },
  {
    key: "origins_body_terroir",
    type: "image",
    section: "origins",
    label: "Terroir image",
    hint: "Read by /origins (Chapter II).",
    imageRole: "Volcanic Kenyan soil detail",
  },
  // Export
  {
    key: "export_hero",
    type: "image",
    section: "export",
    label: "Export hero image",
    hint: "Read by /export.",
    imageRole: "Background image behind the Export hero",
  },
];

// ---- Derived helpers ------------------------------------------

export function cmsFieldsForCategories(categories: Category[]): CmsField[] {
  return categories
    .filter((c) => c.active)
    .slice()
    .sort((a, b) => a.sort_order - b.sort_order)
    .map((c) => ({
      key: categoryHeroKey(c.slug),
      type: "image" as const,
      section: "categories",
      label: `${c.name} hero image`,
      hint: `Read by /shop/${c.slug}.`,
      imageRole: `Banner behind the ${c.name} catalogue header`,
    }));
}

export const CATEGORY_HERO_SLUG_PATTERN = /^category_hero_[a-z0-9-]+$/;

export const CMS_STATIC_FIELD_BY_KEY: Record<string, CmsField> = Object.fromEntries(
  CMS_STATIC_FIELDS.map((f) => [f.key, f])
);

export function isCmsContentKey(key: string): boolean {
  if (CMS_STATIC_FIELDS.some((f) => f.key === key)) return true;
  return CATEGORY_HERO_SLUG_PATTERN.test(key);
}

export function getCmsField(key: string): CmsField | undefined {
  return CMS_STATIC_FIELDS.find((f) => f.key === key);
}

export function toCmsTextValue(value: string, field: CmsField): string {
  const v = String(value ?? "").trim();
  return v.length > CMS_TEXT_MAX_LENGTH ? v.slice(0, CMS_TEXT_MAX_LENGTH) : v;
}