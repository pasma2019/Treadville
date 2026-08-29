"use client";

import { useState } from "react";

/**
 * Renders an image only after it has loaded.
 * If the image fails to load, returns null so the atmosphere layer
 * remains visible. Prevents the "broken image" icon from briefly
 * appearing when the seed references a missing local asset.
 *
 * Until onLoad fires (or the image errors), nothing is rendered —
 * the atmosphere + ChapterMark remain the visible empty-state,
 * which is the correct behaviour for prototype imagery.
 */
export default function CategoryImageLayer({
  src,
  className,
}: {
  src: string;
  className?: string;
}) {
  const [shouldRender, setShouldRender] = useState(false);
  const [failed, setFailed] = useState(false);
  if (failed || !shouldRender) return null;
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt=""
      aria-hidden
      onLoad={() => setShouldRender(true)}
      onError={() => setFailed(true)}
      className={className}
    />
  );
}
