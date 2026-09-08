"use client";

import { useState } from "react";

export default function CategoryImageLayer({
  src,
  className,
}: {
  src: string;
  className?: string;
}) {
  const [failed, setFailed] = useState(false);
  if (failed) return null;
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt=""
      aria-hidden
      onError={() => setFailed(true)}
      className={className}
    />
  );
}
