"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import ProductImage from "@/components/ProductImage";
import CategoryMark from "@/components/CategoryMark";

type Props = {
  images: string[];
  alt: string;
  categorySlug: string;
};

export default function ProductGallery({ images, alt, categorySlug }: Props) {
  const safe = images.filter(Boolean);
  const hasImages = safe.length > 0;
  const [active, setActive] = useState(0);
  const [direction, setDirection] = useState<1 | -1>(1);

  if (!hasImages) {
    return (
      <div className="stage-product relative flex aspect-[4/5] w-full flex-col items-center justify-center overflow-hidden md:aspect-[5/6]">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, rgba(26, 20, 16, 0.10) 1px, transparent 0)",
            backgroundSize: "6px 6px",
          }}
        />
        <CategoryMark slug={categorySlug} className="h-28 w-28 opacity-30" />
        <p className="mt-6 font-mono text-[11px] uppercase tracking-[0.3em] text-[var(--ink-muted)]">
          Image coming soon
        </p>
      </div>
    );
  }

  const current = safe[Math.min(active, safe.length - 1)];
  const isMulti = safe.length > 1;
  const go = (delta: 1 | -1) => {
    setDirection(delta);
    setActive((a) => (a + delta + safe.length) % safe.length);
  };

  return (
    <div className="flex flex-col gap-3">
      <div
        className="stage-product relative aspect-[4/5] w-full overflow-hidden md:aspect-[5/6]"
        aria-roledescription="carousel"
        aria-label={alt}
      >
        {safe.map((src, i) => (
          <div
            key={src}
            aria-hidden={i !== active}
            className="absolute inset-0 transition-opacity duration-[700ms] ease-[var(--ease-out)] motion-reduce:transition-none"
            style={{
              opacity: i === active ? 1 : 0,
              pointerEvents: i === active ? "auto" : "none",
            }}
          >
            <ProductImage
              src={src}
              alt={i === 0 ? alt : `${alt} — image ${i + 1}`}
              className="absolute inset-0 h-full w-full object-cover"
            />
          </div>
        ))}

        {isMulti && (
          <>
            <button
              type="button"
              onClick={() => go(-1)}
              aria-label="Previous image"
              className="absolute left-3 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center border border-[var(--parchment)]/30 bg-[rgba(20,15,11,0.45)] text-[var(--parchment)] backdrop-blur-md transition-colors duration-[var(--dur-fast)] hover:bg-[rgba(20,15,11,0.65)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--parchment)] motion-reduce:transition-none"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              type="button"
              onClick={() => go(1)}
              aria-label="Next image"
              className="absolute right-3 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center border border-[var(--parchment)]/30 bg-[rgba(20,15,11,0.45)] text-[var(--parchment)] backdrop-blur-md transition-colors duration-[var(--dur-fast)] hover:bg-[rgba(20,15,11,0.65)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--parchment)] motion-reduce:transition-none"
            >
              <ChevronRight size={16} />
            </button>
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 rounded-full border border-[var(--parchment)]/20 bg-[rgba(20,15,11,0.45)] px-3 py-1.5 backdrop-blur-md">
              <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--parchment)]/85">
                {String(active + 1).padStart(2, "0")} / {String(safe.length).padStart(2, "0")}
              </span>
            </div>
          </>
        )}
      </div>

      {isMulti && (
        <div
          className="flex gap-2 overflow-x-auto"
          role="tablist"
          aria-label="Product images"
        >
          {safe.map((src, i) => (
            <button
              key={src}
              type="button"
              role="tab"
              aria-selected={i === active}
              onClick={() => {
                setDirection(i > active ? 1 : -1);
                setActive(i);
              }}
              className="group relative h-16 w-16 shrink-0 overflow-hidden border transition-colors duration-[var(--dur-fast)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ink)] motion-reduce:transition-none"
              style={{
                borderColor: i === active ? "var(--ink)" : "var(--line-on-light)",
              }}
            >
              <ProductImage
                src={src}
                alt=""
                className="absolute inset-0 h-full w-full object-cover opacity-90 transition-opacity duration-300 group-hover:opacity-100 motion-reduce:transition-none"
              />
            </button>
          ))}
        </div>
      )}

      <span className="sr-only" aria-live="polite">
        Image {active + 1} of {safe.length}
      </span>
    </div>
  );
}