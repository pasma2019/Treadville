import Link from "next/link";
import type { Product } from "@/lib/types";

export default function ProductCard({ product }: { product: Product }) {
  return (
    <Link href={`/product/${product.slug}`} className="group block">
      <div className="aspect-[4/5] w-full overflow-hidden bg-[var(--soil-raised)]">
        {product.image_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={product.image_url}
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center font-mono text-xs text-[var(--parchment)]/30">
            Image pending
          </div>
        )}
      </div>
      <div className="mt-3 flex items-start justify-between gap-2">
        <p className="font-display text-base leading-tight">{product.name}</p>
        {product.price ? (
          <p className="whitespace-nowrap font-mono text-xs text-[var(--parchment)]/60">
            KSh {product.price.toLocaleString()}
          </p>
        ) : (
          <p className="whitespace-nowrap font-mono text-xs text-accent">Request quote</p>
        )}
      </div>
    </Link>
  );
}
