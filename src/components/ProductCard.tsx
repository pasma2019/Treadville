import Link from "next/link";
import type { Product } from "@/lib/types";
import ProductImage from "@/components/ProductImage";
import CategoryMark, { accentFor } from "@/components/CategoryMark";

type ProductCardProps = {
  product: Product;
  categorySlug?: string;
  index?: number;
  forceIdentity?: boolean;
  tone?: "dark" | "light";
  eyebrow?: string;
};

export default function ProductCard({
  product,
  categorySlug,
  index,
  forceIdentity = false,
  tone = "dark",
  eyebrow: eyebrowOverride,
}: ProductCardProps) {
  const slug = categorySlug ?? "default";
  const accent = accentFor(slug);
  const isLight = tone === "light";
  const ringOffset = isLight ? "var(--warm-white)" : "var(--soil)";
  const defaultEyebrow =
    typeof index === "number"
      ? `N° ${String(index + 1).padStart(2, "0")}`
      : "Lot";

  return (
    <Link
      href={`/product/${product.slug}`}
      className="group block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2"
      aria-label={`View ${product.name}`}
      style={
        {
          ["--accent" as string]: accent,
          "--tw-ring-offset-color": ringOffset,
        } as React.CSSProperties
      }
    >
      <div
        className={
          isLight
            ? "stage-product-card relative aspect-[4/5] w-full overflow-hidden"
            : "relative aspect-[4/5] w-full overflow-hidden bg-[var(--soil-raised)] shadow-[var(--shadow-soft)] transition-shadow duration-500 ease-out group-hover:shadow-[var(--shadow-lift)] group-focus-visible:shadow-[var(--shadow-lift)]"
        }
      >
        {product.image_url && !forceIdentity ? (
          <ProductImage
            src={product.image_url}
            alt={product.name}
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-[700ms] ease-out group-hover:scale-[1.06]"
          />
        ) : (
          <ProductIdentity
            slug={slug}
            name={product.name}
            eyebrow={eyebrowOverride ?? defaultEyebrow}
            tone={tone}
          />
        )}
        {!isLight && (
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-[var(--soil)]/70 to-transparent opacity-0 transition-opacity duration-500 ease-out group-hover:opacity-100 group-focus-visible:opacity-100"
          />
        )}
      </div>
      <div className="mt-4 flex items-baseline justify-between gap-3 md:mt-5">
        <p
          className={
            isLight
              ? "font-display text-lg italic leading-tight text-[var(--ink)]"
              : "font-display text-base leading-tight text-[var(--parchment)]"
          }
        >
          {product.name}
        </p>
        {isLight ? (
          <p
            className="shrink-0 whitespace-nowrap label-on-light"
            style={{ color: accent }}
          >
            Enquire
          </p>
        ) : (
          <p className="shrink-0 whitespace-nowrap font-mono text-xs uppercase tracking-[0.28em] text-[var(--accent)]">
            Enquire
          </p>
        )}
      </div>
    </Link>
  );
}

function ProductIdentity({
  slug,
  name,
  eyebrow,
  tone = "dark",
}: {
  slug: string;
  name: string;
  eyebrow: string;
  tone?: "dark" | "light";
}) {
  const isLight = tone === "light";

  const darkGradient =
    slug === "coffee"
      ? "radial-gradient(80% 60% at 50% 20%, rgba(255, 220, 168, 0.22) 0%, rgba(14, 11, 8, 0) 60%),radial-gradient(120% 80% at 20% 18%, rgba(168, 70, 31, 0.42) 0%, rgba(22, 17, 13, 0) 60%),linear-gradient(180deg, #2a160c 0%, #14080a 100%)"
      : slug === "tea"
      ? "radial-gradient(80% 60% at 50% 20%, rgba(196, 220, 168, 0.18) 0%, rgba(14, 18, 12, 0) 60%),radial-gradient(120% 80% at 20% 18%, rgba(92, 116, 64, 0.40) 0%, rgba(22, 17, 13, 0) 60%),linear-gradient(180deg, #161c12 0%, #0a100a 100%)"
      : slug === "horticulture"
      ? "radial-gradient(80% 60% at 50% 20%, rgba(196, 220, 168, 0.16) 0%, rgba(14, 18, 8, 0) 60%),radial-gradient(120% 80% at 20% 18%, rgba(147, 161, 60, 0.40) 0%, rgba(22, 17, 13, 0) 60%),linear-gradient(180deg, #1a1c0e 0%, #0d1006 100%)"
      : slug === "grains"
      ? "radial-gradient(80% 60% at 50% 20%, rgba(232, 196, 124, 0.22) 0%, rgba(14, 11, 8, 0) 60%),radial-gradient(120% 80% at 20% 18%, rgba(201, 154, 61, 0.40) 0%, rgba(22, 17, 13, 0) 60%),linear-gradient(180deg, #21180a 0%, #14100a 100%)"
      : "radial-gradient(80% 60% at 50% 20%, rgba(232, 196, 124, 0.16) 0%, rgba(14, 11, 8, 0) 60%),radial-gradient(120% 80% at 20% 18%, rgba(168, 70, 31, 0.30) 0%, rgba(22, 17, 13, 0) 60%),linear-gradient(180deg, #1f1610 0%, #15100a 100%)";

  const lightGradient =
    slug === "coffee"
      ? "radial-gradient(80% 60% at 50% 20%, rgba(184, 114, 58, 0.32) 0%, rgba(184, 114, 58, 0) 60%),radial-gradient(120% 80% at 20% 18%, rgba(107, 58, 28, 0.18) 0%, rgba(245, 232, 212, 0) 60%),linear-gradient(180deg, #f5e8d4 0%, #faf5ee 100%)"
      : slug === "tea"
      ? "radial-gradient(80% 60% at 50% 20%, rgba(122, 158, 122, 0.35) 0%, rgba(122, 158, 122, 0) 60%),radial-gradient(120% 80% at 20% 18%, rgba(216, 232, 207, 0.25) 0%, rgba(234, 240, 227, 0) 60%),linear-gradient(180deg, #eaf0e3 0%, #f5f3e8 100%)"
      : slug === "horticulture"
      ? "radial-gradient(80% 60% at 50% 20%, rgba(147, 161, 60, 0.30) 0%, rgba(147, 161, 60, 0) 60%),radial-gradient(120% 80% at 20% 18%, rgba(232, 240, 212, 0.30) 0%, rgba(232, 240, 212, 0) 60%),linear-gradient(180deg, #e8f0d4 0%, #f5f3e8 100%)"
      : slug === "grains"
      ? "radial-gradient(80% 60% at 50% 20%, rgba(201, 154, 61, 0.32) 0%, rgba(201, 154, 61, 0) 60%),radial-gradient(120% 80% at 20% 18%, rgba(245, 230, 196, 0.30) 0%, rgba(245, 230, 196, 0) 60%),linear-gradient(180deg, #f5e6c4 0%, #f8f1de 100%)"
      : "radial-gradient(80% 60% at 50% 20%, rgba(122, 158, 122, 0.20) 0%, rgba(122, 158, 122, 0) 60%),linear-gradient(180deg, #f5e8d4 0%, #faf5ee 100%)";

  return (
    <div
      className="absolute inset-0 flex flex-col justify-between p-5 md:p-7"
      style={{ background: isLight ? lightGradient : darkGradient }}
    >
      {isLight && (
        <>
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
                "radial-gradient(60% 40% at 50% 30%, rgba(122, 158, 122, 0.06) 0%, transparent 70%)",
            }}
          />
        </>
      )}
      {!isLight && (
        <>
          <div
            aria-hidden
            className="absolute inset-0 opacity-30 mix-blend-soft-light"
            style={{
              backgroundImage:
                "radial-gradient(circle at 1px 1px, rgba(236, 227, 206, 0.20) 1px, transparent 0)",
              backgroundSize: "5px 5px",
            }}
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(50% 35% at 50% 30%, rgba(255, 240, 220, 0.18) 0%, rgba(14, 11, 8, 0) 70%)",
            }}
          />
        </>
      )}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-5 top-5 h-px"
        style={{
          background: isLight ? "var(--accent)" : "var(--accent)",
          opacity: isLight ? 0.65 : 0.55,
        }}
      />
      <div className="relative flex items-start justify-between">
        {isLight ? (
          <p className="label-on-light">{eyebrow}</p>
        ) : (
          <p className="font-mono text-[9px] uppercase tracking-[0.32em] text-[var(--parchment)]/55">
            {eyebrow}
          </p>
        )}
      </div>
      <div className="relative flex flex-1 items-center justify-center">
        <CategoryMark
          slug={slug}
          className={
            isLight
              ? "h-32 w-32 opacity-[0.28] transition-opacity duration-700 ease-out group-hover:opacity-40 md:h-40 md:w-40"
              : "h-32 w-32 opacity-[0.18] transition-opacity duration-700 ease-out group-hover:opacity-30 md:h-40 md:w-40"
          }
          style={{ strokeWidth: 0.8 }}
        />
      </div>
      <div className="relative">
        <p
          className={
            isLight
              ? "font-display text-[1.85rem] italic leading-[1.02] tracking-[-0.018em] text-[var(--ink)] md:text-[2.25rem]"
              : "font-display text-[1.85rem] italic leading-[1.02] tracking-[-0.018em] text-[var(--parchment)] md:text-[2.25rem]"
          }
          style={{ textWrap: "balance" }}
        >
          {name}
        </p>
        {isLight ? (
          <div className="mt-3 flex items-center gap-2 label-on-light">
            <span aria-hidden className="h-px w-6 bg-[var(--ink-faint)]" />
            <span>Treadville · {slug === "default" ? "Lot" : slug}</span>
          </div>
        ) : (
          <div className="mt-3 flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.32em] text-[var(--parchment)]/45">
            <span aria-hidden className="h-px w-6 bg-[var(--parchment)]/30" />
            <span>Treadville · {slug === "default" ? "Lot" : slug}</span>
          </div>
        )}
      </div>
    </div>
  );
}
