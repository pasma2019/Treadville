import type { CSSProperties } from "react";

type CategoryBadgeProps = {
  label: string;
  accent: string;
  className?: string;
};

export default function CategoryBadge({ label, accent, className }: CategoryBadgeProps) {
  return (
    <span className={["cat-badge", className].filter(Boolean).join(" ")}>
      <span
        aria-hidden
        className="cat-badge-dot"
        style={{ "--cat-badge-dot": accent } as CSSProperties}
      />
      <span className="cat-badge-label">{label}</span>
    </span>
  );
}