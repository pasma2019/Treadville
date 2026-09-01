import Link from "next/link";
import Reveal from "@/components/Reveal";

export default function NotFound() {
  return (
    <main className="surface-footer">
      <div className="mx-auto flex min-h-[85vh] max-w-[var(--content-wide)] flex-col justify-end px-6 pb-24 pt-40 md:pb-32 md:pt-56">
        <Reveal as="div" delay={0}>
          <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-[rgba(236,227,206,0.45)]">
            404
          </p>
        </Reveal>
        <Reveal as="div" delay={1} className="mt-6">
          <h1 className="max-w-[16ch] font-display text-5xl italic leading-[1.0] tracking-[-0.02em] text-[var(--ivory)] md:text-7xl lg:text-8xl">
            This page has{" "}
            <span className="text-[rgba(236,227,206,0.55)]">
              moved or doesn&apos;t exist.
            </span>
          </h1>
        </Reveal>
        <Reveal as="div" delay={2} className="mt-8 max-w-[48ch]">
          <p className="text-base leading-relaxed text-[rgba(236,227,206,0.70)] md:text-lg">
            If you followed a link, it may be out of date. Navigate back to the
            catalogue or return to the homepage.
          </p>
        </Reveal>
        <Reveal as="div" delay={3} className="mt-10 flex flex-wrap items-center gap-4">
          <Link
            href="/shop"
            className="inline-flex items-center gap-3 border border-[var(--ivory)] px-8 py-3 font-mono text-[11px] uppercase tracking-[0.28em] text-[var(--ivory)] transition-colors hover:bg-[var(--ivory)] hover:text-[var(--soil)]"
          >
            Browse catalogue
          </Link>
          <Link
            href="/"
            className="inline-flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.28em] text-[rgba(236,227,206,0.65)] underline decoration-[rgba(212,190,145,0.40)] underline-offset-4 transition-colors hover:text-[var(--ivory)]"
          >
            Return home
          </Link>
        </Reveal>
      </div>
    </main>
  );
}
