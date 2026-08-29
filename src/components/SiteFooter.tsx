import Link from "next/link";
import Reveal from "@/components/Reveal";

export default function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer
      aria-labelledby="footer-heading"
      className="relative border-t border-[var(--line-strong)] px-6 py-20 md:py-28"
      style={{ background: "var(--soil-muted)", color: "var(--parchment)" }}
    >
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-px bg-[var(--line-strong)]" />

      <div className="mx-auto max-w-[var(--content-wide)]">
        <Reveal as="div" delay={0} className="grid grid-cols-1 gap-12 md:grid-cols-12 md:gap-10">
          <div className="md:col-span-7">
            <p className="font-mono text-[10px] uppercase tracking-[0.35em] text-[var(--parchment)]/40">
              Treadville · Kenya
            </p>
            <h2
              id="footer-heading"
              className="mt-6 max-w-[18ch] font-display text-3xl leading-[1.04] tracking-[-0.015em] text-[var(--parchment)] md:text-5xl lg:text-[4.25rem]"
            >
              Exceptional products. <span className="italic text-[var(--parchment)]/70">Traceable origins.</span>
            </h2>
            <p className="mt-6 max-w-md text-sm leading-relaxed text-[var(--parchment)]/60 md:text-base">
              Premium African products — coffee, tea, horticulture, and grains — sourced across Kenya&apos;s volcanic highlands and fertile plains.
            </p>
            <Link
              href="/shop"
              className="group mt-8 inline-flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.32em] text-[var(--parchment)]/80 transition-colors duration-[var(--dur-fast)] ease-[var(--ease-out)] hover:text-[var(--parchment)] focus-visible:outline-none focus-visible:text-[var(--parchment)]"
            >
              <span>Explore the catalogue</span>
              <span
                aria-hidden
                className="h-px w-6 bg-[var(--parchment)]/40 transition-[width,background-color] duration-[var(--dur)] ease-[var(--ease-out)] group-hover:w-10 group-hover:bg-[var(--accent)] group-focus-visible:w-10 group-focus-visible:bg-[var(--accent)]"
              />
            </Link>
          </div>

          <div className="md:col-span-3">
            <p className="font-mono text-[10px] uppercase tracking-[0.35em] text-[var(--parchment)]/40">
              Explore
            </p>
            <nav aria-label="Footer exploration" className="mt-5">
              <ul className="space-y-3">
                <li>
                  <Link
                    href="/shop"
                    className="font-display text-base text-[var(--parchment)]/85 transition-colors duration-[var(--dur-fast)] ease-[var(--ease-out)] hover:text-[var(--parchment)] focus-visible:outline-none focus-visible:text-[var(--parchment)]"
                  >
                    Shop
                  </Link>
                </li>
                <li>
                  <Link
                    href="/shop/coffee"
                    className="font-mono text-[11px] uppercase tracking-[0.28em] text-[var(--parchment)]/55 transition-colors duration-[var(--dur-fast)] ease-[var(--ease-out)] hover:text-[var(--parchment)] focus-visible:outline-none focus-visible:text-[var(--parchment)]"
                  >
                    Coffee
                  </Link>
                </li>
                <li>
                  <Link
                    href="/shop/tea"
                    className="font-mono text-[11px] uppercase tracking-[0.28em] text-[var(--parchment)]/55 transition-colors duration-[var(--dur-fast)] ease-[var(--ease-out)] hover:text-[var(--parchment)] focus-visible:outline-none focus-visible:text-[var(--parchment)]"
                  >
                    Tea
                  </Link>
                </li>
                <li>
                  <Link
                    href="/shop/horticulture"
                    className="font-mono text-[11px] uppercase tracking-[0.28em] text-[var(--parchment)]/55 transition-colors duration-[var(--dur-fast)] ease-[var(--ease-out)] hover:text-[var(--parchment)] focus-visible:outline-none focus-visible:text-[var(--parchment)]"
                  >
                    Horticulture
                  </Link>
                </li>
                <li>
                  <Link
                    href="/shop/grains"
                    className="font-mono text-[11px] uppercase tracking-[0.28em] text-[var(--parchment)]/55 transition-colors duration-[var(--dur-fast)] ease-[var(--ease-out)] hover:text-[var(--parchment)] focus-visible:outline-none focus-visible:text-[var(--parchment)]"
                  >
                    Grains
                  </Link>
                </li>
              </ul>
            </nav>
          </div>

          <div className="min-w-0 md:col-span-2">
            <p className="font-mono text-[10px] uppercase tracking-[0.35em] text-[var(--parchment)]/40">
              Contact
            </p>
            <ul className="mt-5 space-y-2 font-mono text-[10px] uppercase tracking-[0.28em] text-[var(--parchment)]/55 [overflow-wrap:anywhere]">
              <li>Nairobi, Kenya</li>
              <li>info@treadville.co.ke</li>
              <li>+254 722 479985</li>
            </ul>
          </div>
        </Reveal>

        <Reveal as="div" delay={1} className="mt-16 flex flex-col gap-4 border-t border-[var(--line)] pt-8 md:mt-24 md:flex-row md:items-center md:justify-between">
          <div className="font-mono text-[9px] uppercase tracking-[0.4em] text-[var(--parchment)]/45">
            <span aria-hidden className="mr-3 inline-block h-px w-8 align-middle bg-[var(--line)]" />
            © {year} Treadville Company Limited
          </div>
          <p className="font-mono text-[9px] uppercase tracking-[0.4em] text-[var(--parchment)]/45">
            30+ years in Kenyan agriculture
          </p>
        </Reveal>
      </div>
    </footer>
  );
}
