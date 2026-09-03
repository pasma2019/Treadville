"use client";

import { useState, useRef, useCallback } from "react";
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
  const dragStartX = useRef<number | null>(null);

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

  const isMulti = safe.length > 1;
  const go = useCallback(
    (delta: 1 | -1) => {
      setDirection(delta);
      setActive((a) => (a + delta + safe.length) % safe.length);
    },
    [safe.length]
  );
  const goFirst = useCallback(() => {
    setDirection(-1);
    setActive(0);
  }, []);
  const goLast = useCallback(() => {
    setDirection(1);
    setActive(safe.length - 1);
  }, [safe.length]);

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    dragStartX.current = e.clientX;
    (e.target as HTMLElement).closest('[role="tabpanel"]')?.setAttribute("data-drag", "true");
  };
  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (dragStartX.current === null) return;
    const delta = e.clientX - dragStartX.current;
    dragStartX.current = null;
    (e.target as HTMLElement).closest('[role="tabpanel"]')?.removeAttribute("data-drag");
    if (Math.abs(delta) > 48) {
      go(delta < 0 ? 1 : -1);
    }
  };
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft" || e.key === "ArrowUp") { e.preventDefault(); go(-1); }
    if (e.key === "ArrowRight" || e.key === "ArrowDown") { e.preventDefault(); go(1); }
    if (e.key === "Home") { e.preventDefault(); goFirst(); }
    if (e.key === "End") { e.preventDefault(); goLast(); }
  };

  return (
    <div className="flex flex-col gap-3">
      <div
        className="stage-product relative aspect-[4/5] w-full overflow-hidden md:aspect-[5/6]"
        role="tabpanel"
        aria-label={alt}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onKeyDown={handleKeyDown}
        tabIndex={0}
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
              className="absolute left-3 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center border border-[var(--parchment)]/30 bg-[rgba(20,15,11,0.45)] text-[var(--parchment)] backdrop-blur-md transition-all duration-[var(--dur-fast)] hover:bg-[rgba(20,15,11,0.65)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--parchment)] motion-reduce:transition-none"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              type="button"
              onClick={() => go(1)}
              aria-label="Next image"
              className="absolute right-3 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center border border-[var(--parchment)]/30 bg-[rgba(20,15,11,0.45)] text-[var(--parchment)] backdrop-blur-md transition-all duration-[var(--dur-fast)] hover:bg-[rgba(20,15,11,0.65)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--parchment)] motion-reduce:transition-none"
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
          className="flex gap-2 overflow-x-auto pb-0.5"
          role="tablist"
          aria-label="Product images"
        >
          {safe.map((src, i) => (
            <button
              key={src}
              type="button"
              role="tab"
              aria-selected={i === active}
              aria-label={`View image ${i + 1}`}
              onClick={() => {
                setDirection(i > active ? 1 : -1);
                setActive(i);
              }}
              className="group relative h-14 w-14 shrink-0 overflow-hidden border transition-all duration-[var(--dur-fast)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ink)] focus-visible:ring-offset-2 motion-reduce:transition-none"
              style={{
                borderColor: i === active ? "var(--ink)" : "var(--line-on-light)",
              }}
            >
              <ProductImage
                src={src}
                alt=""
                className="absolute inset-0 h-full w-full object-cover opacity-90 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100 motion-reduce:transition-none"
              />
              {i === active && (
                <span
                  aria-hidden
                  className="absolute inset-0 border-2"
                  style={{ borderColor: "var(--ink)" }}
                />
              )}
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