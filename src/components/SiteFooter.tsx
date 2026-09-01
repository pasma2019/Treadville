import Link from "next/link";
import Reveal from "@/components/Reveal";

export default function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer
      aria-labelledby="footer-heading"
      className="relative surface-footer px-6 py-20 md:py-28"
    >
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-px bg-[rgba(236,227,206,0.14)]" />

      <div className="mx-auto max-w-[var(--content-wide)]">
        <Reveal as="div" delay={0} className="grid grid-cols-1 gap-12 md:grid-cols-12 md:gap-10">
          <div className="md:col-span-6">
            <p className="label-on-light" style={{ color: "rgba(236,227,206,0.45)" }}>
              Treadville · Kenya
            </p>
            <h2
              id="footer-heading"
              className="mt-6 max-w-[18ch] font-display text-3xl leading-[1.04] tracking-[-0.015em] text-[var(--ivory)] md:text-5xl lg:text-[4rem]"
            >
              Exceptional products.{" "}
              <span className="italic text-[rgba(236,227,206,0.7)]">
                Traceable origins.
              </span>
            </h2>
            <p className="mt-6 max-w-md text-sm leading-relaxed text-[rgba(236,227,206,0.62)] md:text-base">
              Premium agricultural products — coffee, tea, horticulture, and
              grains — sourced across Kenya&apos;s volcanic highlands and
              fertile plains.
            </p>
            <Link
              href="/shop"
              className="group mt-8 inline-flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.32em] text-[var(--ivory)]/80 transition-colors duration-[var(--dur-fast)] ease-[var(--ease-out)] hover:text-[var(--ivory)]"
            >
              <span>Explore the catalogue</span>
              <span
                aria-hidden
                className="h-px w-6 bg-[var(--ivory)]/40 transition-[width,background-color] duration-[var(--dur)] ease-[var(--ease-out)] group-hover:w-10 group-hover:bg-[var(--accent)]"
              />
            </Link>
          </div>

          <div className="md:col-span-2">
            <p className="label-on-light" style={{ color: "rgba(236,227,206,0.45)" }}>
              Catalogue
            </p>
            <nav aria-label="Footer catalogue" className="mt-5">
              <ul className="space-y-3">
                <li>
                  <Link
                    href="/shop"
                    className="font-display text-base text-[var(--ivory)]/85 transition-colors hover:text-[var(--ivory)]"
                  >
                    Shop all
                  </Link>
                </li>
                <li>
                  <Link
                    href="/shop/coffee"
                    className="font-mono text-[11px] uppercase tracking-[0.28em] text-[rgba(236,227,206,0.55)] transition-colors hover:text-[var(--ivory)]"
                  >
                    Coffee
                  </Link>
                </li>
                <li>
                  <Link
                    href="/shop/tea"
                    className="font-mono text-[11px] uppercase tracking-[0.28em] text-[rgba(236,227,206,0.55)] transition-colors hover:text-[var(--ivory)]"
                  >
                    Tea
                  </Link>
                </li>
                <li>
                  <Link
                    href="/shop/horticulture"
                    className="font-mono text-[11px] uppercase tracking-[0.28em] text-[rgba(236,227,206,0.55)] transition-colors hover:text-[var(--ivory)]"
                  >
                    Horticulture
                  </Link>
                </li>
                <li>
                  <Link
                    href="/shop/grains"
                    className="font-mono text-[11px] uppercase tracking-[0.28em] text-[rgba(236,227,206,0.55)] transition-colors hover:text-[var(--ivory)]"
                  >
                    Grains
                  </Link>
                </li>
              </ul>
            </nav>
          </div>

          <div className="md:col-span-2">
            <p className="label-on-light" style={{ color: "rgba(236,227,206,0.45)" }}>
              Company
            </p>
            <nav aria-label="Footer company" className="mt-5">
              <ul className="space-y-3">
                <li>
                  <Link
                    href="/origins"
                    className="font-mono text-[11px] uppercase tracking-[0.28em] text-[rgba(236,227,206,0.55)] transition-colors hover:text-[var(--ivory)]"
                  >
                    Origins
                  </Link>
                </li>
                <li>
                  <Link
                    href="/quality"
                    className="font-mono text-[11px] uppercase tracking-[0.28em] text-[rgba(236,227,206,0.55)] transition-colors hover:text-[var(--ivory)]"
                  >
                    Quality
                  </Link>
                </li>
                <li>
                  <Link
                    href="/export"
                    className="font-mono text-[11px] uppercase tracking-[0.28em] text-[rgba(236,227,206,0.55)] transition-colors hover:text-[var(--ivory)]"
                  >
                    Export
                  </Link>
                </li>
                <li>
                  <Link
                    href="/about"
                    className="font-mono text-[11px] uppercase tracking-[0.28em] text-[rgba(236,227,206,0.55)] transition-colors hover:text-[var(--ivory)]"
                  >
                    About
                  </Link>
                </li>
                <li>
                  <Link
                    href="/journal"
                    className="font-mono text-[11px] uppercase tracking-[0.28em] text-[rgba(236,227,206,0.55)] transition-colors hover:text-[var(--ivory)]"
                  >
                    Journal
                  </Link>
                </li>
              </ul>
            </nav>
          </div>

          <div className="min-w-0 md:col-span-2">
            <p className="label-on-light" style={{ color: "rgba(236,227,206,0.45)" }}>
              Contact
            </p>
            <ul className="mt-5 space-y-2 font-mono text-[10px] uppercase tracking-[0.28em] text-[rgba(236,227,206,0.55)] [overflow-wrap:anywhere]">
              <li>Nairobi, Kenya</li>
              <li>info@treadville.co.ke</li>
              <li>+254 722 479985</li>
            </ul>
            <Link
              href="/contact"
              className="mt-4 inline-block font-mono text-[11px] uppercase tracking-[0.32em] text-[var(--ivory)] underline decoration-[var(--accent)] underline-offset-4 transition-colors hover:text-[var(--accent)]"
            >
              Open enquiry
            </Link>
          </div>
        </Reveal>

        {/* Pasco Labs signature — subtle premium credit */}
        <Reveal as="div" delay={1} className="mt-16 grid grid-cols-1 gap-6 border-t border-[rgba(236,227,206,0.14)] pt-8 md:mt-24 md:grid-cols-12 md:items-center md:gap-10">
          <div className="md:col-span-7">
            <p className="font-mono text-[9px] uppercase tracking-[0.4em] text-[rgba(236,227,206,0.45)]">
              <span aria-hidden className="mr-3 inline-block h-px w-8 align-middle bg-[rgba(236,227,206,0.30)]" />
              © {year} Treadville Company Limited
            </p>
          </div>
          <div className="md:col-span-5 md:text-right">
            <p
              className="font-mono text-[9px] uppercase tracking-[0.32em] text-[rgba(236,227,206,0.50)]"
              style={{ lineHeight: 1.6 }}
            >
              Digital experience crafted by
            </p>
            <p className="mt-1 font-display text-base tracking-[0.18em] text-[var(--ivory)]">
              PASCO LABS
            </p>
            <p className="mt-0.5 font-mono text-[8.5px] uppercase tracking-[0.36em] text-[rgba(236,227,206,0.45)]">
              Strategy · Design · Technology
            </p>
          </div>
        </Reveal>
      </div>
    </footer>
  );
}
