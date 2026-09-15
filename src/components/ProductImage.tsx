"use client";

import { useState } from "react";

type ProductImageProps = {
  src: string;
  alt: string;
  className?: string;
};

export default function ProductImage({ src, alt, className }: ProductImageProps) {
  const [failed, setFailed] = useState(false);
  if (failed) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-[var(--ivory)] font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--ink-faint)]">
        <span className="border border-[var(--line-on-light)] px-3 py-2">Image pending</span>
      </div>
    );
  }
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      loading="lazy"
      onError={() => setFailed(true)}
      className={className}
    />
  );
}
