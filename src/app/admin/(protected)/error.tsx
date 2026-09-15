"use client";

import Link from "next/link";

type AdminErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function AdminError({ reset }: AdminErrorProps) {
  return (
    <div className="flex min-h-[60vh] items-center">
      <div className="mx-auto max-w-xl text-center">
        <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-[var(--gold-deep)]">
          Admin error
        </p>
        <h1 className="mt-5 font-display text-2xl italic leading-tight text-[var(--ink)] md:text-3xl">
          This admin view could not be loaded.
        </h1>
        <p className="mx-auto mt-4 max-w-md text-[1rem] leading-[1.7] text-[var(--ink-soft)]">
          An unexpected error interrupted the request. Retry, or return to the
          dashboard to continue.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <button type="button" onClick={() => reset()} className="btn-cta">
            Try again
          </button>
          <Link href="/admin" className="btn-cta-ghost">
            Back to dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}