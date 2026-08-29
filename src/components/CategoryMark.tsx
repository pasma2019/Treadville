import type { CSSProperties } from "react";

export type CategoryMarkSlug = "coffee" | "tea" | "horticulture" | "grains" | "default";

const ACCENTS: Record<CategoryMarkSlug, string> = {
  coffee: "var(--accent-coffee)",
  tea: "var(--accent-tea)",
  horticulture: "var(--accent-horticulture)",
  grains: "var(--accent-grains)",
  default: "var(--accent)",
};

export function accentFor(slug: string): string {
  return ACCENTS[slug as CategoryMarkSlug] ?? ACCENTS.default;
}

type MarkProps = {
  slug: string;
  className?: string;
  style?: CSSProperties;
};

export default function CategoryMark({ slug, className, style }: MarkProps) {
  const accent = accentFor(slug);
  const baseProps = {
    className,
    style,
    "aria-hidden": true,
    fill: "none",
    stroke: accent,
    strokeWidth: 1.25,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };
  switch (slug) {
    case "coffee":
      return (
        <svg viewBox="0 0 64 64" {...baseProps}>
          <ellipse cx="32" cy="34" rx="11" ry="16" />
          <path d="M32 18 C 31 14, 33 10, 32 8" />
          <path d="M21 32 C 17 30, 14 33, 13 36" />
          <path d="M43 32 C 47 30, 50 33, 51 36" />
        </svg>
      );
    case "tea":
      return (
        <svg viewBox="0 0 64 64" {...baseProps}>
          <path d="M32 12 C 22 22, 22 36, 32 50 C 42 36, 42 22, 32 12 Z" />
          <path d="M32 12 L 32 50" />
          <path d="M27 28 L 32 32 L 37 28" />
        </svg>
      );
    case "horticulture":
      return (
        <svg viewBox="0 0 64 64" {...baseProps}>
          <circle cx="32" cy="28" r="6" />
          <path d="M32 34 C 32 42, 28 48, 22 50" />
          <path d="M32 34 C 32 42, 36 48, 42 50" />
          <path d="M32 22 C 32 16, 28 14, 24 16" />
          <path d="M32 22 C 32 16, 36 14, 40 16" />
        </svg>
      );
    case "grains":
      return (
        <svg viewBox="0 0 64 64" {...baseProps}>
          <path d="M32 8 L 32 56" />
          <path d="M32 18 C 26 18, 22 22, 22 28 C 28 28, 32 24, 32 18 Z" />
          <path d="M32 18 C 38 18, 42 22, 42 28 C 36 28, 32 24, 32 18 Z" />
          <path d="M32 32 C 26 32, 22 36, 22 42 C 28 42, 32 38, 32 32 Z" />
          <path d="M32 32 C 38 32, 42 36, 42 42 C 36 42, 32 38, 32 32 Z" />
        </svg>
      );
    default:
      return (
        <svg viewBox="0 0 64 64" {...baseProps}>
          <circle cx="32" cy="32" r="14" />
          <circle cx="32" cy="32" r="6" />
        </svg>
      );
  }
}
