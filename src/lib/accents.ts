const CATEGORY_ACCENTS: Record<string, string> = {
  coffee: "var(--accent-coffee)",
  tea: "var(--accent-tea)",
  horticulture: "var(--accent-horticulture)",
  grains: "var(--accent-grains)",
};

export const DEFAULT_ACCENT = "var(--accent-coffee)";

export function categoryAccent(slug: string): string {
  return CATEGORY_ACCENTS[slug] ?? DEFAULT_ACCENT;
}
