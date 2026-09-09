import Link from "next/link";
import Reveal from "@/components/Reveal";

export default function NotFound() {
  return (
    <main className="surface-base">
      <div className="mx-auto flex min-h-[85vh] max-w-[var(--content-wide)] flex-col justify-end px-6 pb-24 pt-40 md:pb-32 md:pt-56">
        <Reveal as="div" delay={0}>
          <p className="font-mono text-[10px] uppercase eyebrow-gold">
            404
          </p>
        </Reveal>
        <Reveal as="div" delay={1} className="mt-6">
          <h1 className="max-w-[16ch] font-display text-5xl italic leading-[1.0] tracking-[-0.02em] text-[var(--ink)] md:text-7xl lg:text-8xl">
            This page has{" "}
            <span className="text-[var(--ink-soft)]">
              moved or doesn&apos;t exist.
            </span>
          </h1>
        </Reveal>
        <Reveal as="div" delay={2} className="mt-8 max-w-[48ch]">
          <p className="text-base leading-relaxed text-[var(--ink-soft)] md:text-lg">
            If you followed a link, it may be out of date. Navigate back to the
            catalogue or return to the homepage.
          </p>
        </Reveal>
        <Reveal as="div" delay={3} className="mt-10 flex flex-wrap items-center gap-4">
          <Link href="/shop" className="btn-cta">
            Browse catalogue
          </Link>
          <Link href="/" className="btn-cta-ghost">
            Return home
          </Link>
        </Reveal>
      </div>
    </main>
  );
}
