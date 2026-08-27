import Link from "next/link";
import type { Product } from "@/lib/types";

export default function ProductCard({ product }: { product: Product }) {
  return (
    <Link
      href={`/product/${product.slug}`}
      className="group block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--soil)]"
      aria-label={`View ${product.name}${product.price ? `, KSh ${product.price.toLocaleString()}` : ""}`}
    >
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-[var(--soil-raised)] shadow-[var(--shadow-soft)] transition-shadow duration-500 ease-out group-hover:shadow-[var(--shadow-lift)] group-focus-visible:shadow-[var(--shadow-lift)]">
        {product.image_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={product.image_url}
            alt={product.name}
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-[700ms] ease-out group-hover:scale-[1.06]"
          />
        ) : (
          <div className="flex h-full items-center justify-center font-mono text-xs text-[var(--parchment)]/30">
            Image pending
          </div>
        )}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-[var(--soil)]/55 to-transparent opacity-0 transition-opacity duration-500 ease-out group-hover:opacity-100 group-focus-visible:opacity-100"
        />
      </div>
      <div className="mt-4 flex items-baseline justify-between gap-3">
        <p className="font-display text-base leading-tight text-[var(--parchment)] transition-colors duration-300 ease-out group-hover:text-[var(--parchment)]">
          {product.name}
        </p>
        {product.price ? (
          <p className="shrink-0 whitespace-nowrap font-mono text-xs text-[var(--parchment)]/60">
            KSh {product.price.toLocaleString()}
          </p>
        ) : (
          <p className="shrink-0 whitespace-nowrap font-mono text-xs text-[var(--accent)]">
            Request quote
          </p>
        )}
      </div>
    </Link>
  );
}
