"use client";

import { useEffect, useRef, useState } from "react";

type CategoryImageProps = {
  src: string;
  className?: string;
  style?: React.CSSProperties;
};

export default function CategoryImage({ src, className, style }: CategoryImageProps) {
  const [failed, setFailed] = useState(false);
  const imgRef = useRef<HTMLImageElement | null>(null);

  useEffect(() => {
    const img = imgRef.current;
    if (!img) return;
    if (img.complete && img.naturalWidth === 0) {
      setFailed(true);
    }
  }, []);

  if (failed) return null;
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      ref={imgRef}
      src={src}
      alt=""
      aria-hidden
      onError={() => setFailed(true)}
      className={className}
      style={style}
      loading="lazy"
    />
  );
}
