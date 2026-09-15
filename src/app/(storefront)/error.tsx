"use client";

import Link from "next/link";

type StorefrontErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function StorefrontError({ reset }: StorefrontErrorProps) {
  return (
    <main className="surface-base flex min-h-[60vh] items-center px-6 py-28">
      <div className="mx-auto max-w-xl text-center">
        <p className="font-mono text-[11px] uppercase eyebrow-gold">Something went wrong</p>
        <h1 className="mt-5 font-display text-3xl italic leading-tight text-[var(--ink)] md:text-4xl">
          We could not load this page.
        </h1>
        <p className="mx-auto mt-4 max-w-md text-[1.0625rem] leading-[1.7] text-[var(--ink-soft)]">
          An unexpected error interrupted the request. Try again, or return to
          the field for more from Treadville.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <button type="button" onClick={() => reset()} className="btn-cta">
            Try again
          </button>
          <Link href="/" className="btn-cta-ghost">
            Back to home
          </Link>
        </div>
      </div>
    </main>
  );
}