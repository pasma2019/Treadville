import Link from "next/link";
import Reveal from "@/components/Reveal";
import { Mail, Phone, MapPin } from "lucide-react";

export default function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer
      aria-labelledby="footer-heading"
      className="surface-footer px-6 py-16 md:py-20"
    >
      <div aria-hidden className="absolute inset-x-0 top-0 h-px bg-[rgba(236,227,206,0.14)]" />

      <div className="mx-auto max-w-[var(--content-wide)]">
        {/* Main footer grid */}
        <Reveal
          as="div"
          delay={0}
          className="grid grid-cols-1 gap-10 md:grid-cols-12 md:gap-12 lg:gap-16"
        >
          {/* Brand */}
          <div className="md:col-span-4 lg:col-span-4">
            <p className="text-[0.9375rem] tracking-[0.10em] text-[var(--ivory)]/50">
              TREADVILLE · KENYA
            </p>
            <h2
              id="footer-heading"
              className="mt-4 max-w-[20ch] font-display text-2xl leading-tight tracking-[-0.01em] text-[var(--ivory)] md:text-3xl"
            >
              Exceptional products.{" "}
              <span className="italic text-[var(--ivory)]/70">
                Traceable origins.
              </span>
            </h2>
            <p className="mt-4 max-w-xs text-[0.9375rem] leading-relaxed text-[var(--ivory)]/65">
              Premium agricultural products — coffee, tea, horticulture, and grains
              — sourced across Kenya&apos;s volcanic highlands and fertile plains.
            </p>
          </div>

          {/* EXPLORE */}
          <div className="md:col-span-2 lg:col-span-2">
            <p className="text-[0.9375rem] tracking-[0.10em] text-[var(--ivory)]/50">
              Explore
            </p>
            <nav
              aria-label="Footer catalogue navigation"
              className="mt-4 space-y-4"
            >
              <Link
                href="/shop"
                className="block rounded-sm text-[0.9375rem] text-[var(--ivory)]/75 transition-colors hover:text-[var(--ivory)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-sage)] focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
              >
                Full catalogue
              </Link>
              <Link
                href="/shop/coffee"
                className="block rounded-sm text-[0.9375rem] text-[var(--ivory)]/75 transition-colors hover:text-[var(--ivory)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-sage)] focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
              >
                Coffee
              </Link>
              <Link
                href="/shop/tea"
                className="block rounded-sm text-[0.9375rem] text-[var(--ivory)]/75 transition-colors hover:text-[var(--ivory)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-sage)] focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
              >
                Tea
              </Link>
              <Link
                href="/shop/horticulture"
                className="block rounded-sm text-[0.9375rem] text-[var(--ivory)]/75 transition-colors hover:text-[var(--ivory)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-sage)] focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
              >
                Horticulture
              </Link>
              <Link
                href="/shop/grains"
                className="block rounded-sm text-[0.9375rem] text-[var(--ivory)]/75 transition-colors hover:text-[var(--ivory)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-sage)] focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
              >
                Grains
              </Link>
            </nav>
          </div>

          {/* WORK WITH US */}
          <div className="md:col-span-2 lg:col-span-2">
            <p className="text-[0.9375rem] tracking-[0.10em] text-[var(--ivory)]/50">
              Work with us
            </p>
            <nav
              aria-label="Footer work with us navigation"
              className="mt-4 space-y-4"
            >
              <Link
                href="/contact?type=sample"
                className="block rounded-sm text-[0.9375rem] text-[var(--ivory)]/75 transition-colors hover:text-[var(--ivory)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-sage)] focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
              >
                Request a sample
              </Link>
              <Link
                href="/contact?type=quote"
                className="block rounded-sm text-[0.9375rem] text-[var(--ivory)]/75 transition-colors hover:text-[var(--ivory)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-sage)] focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
              >
                Export enquiry
              </Link>
              <Link
                href="/contact"
                className="block rounded-sm text-[0.9375rem] text-[var(--ivory)]/75 transition-colors hover:text-[var(--ivory)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-sage)] focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
              >
                Wholesale
              </Link>
            </nav>
          </div>

          {/* COMPANY */}
          <div className="md:col-span-2 lg:col-span-2">
            <p className="text-[0.9375rem] tracking-[0.10em] text-[var(--ivory)]/50">
              Company
            </p>
            <nav
              aria-label="Footer company navigation"
              className="mt-4 space-y-4"
            >
              <Link
                href="/about"
                className="block rounded-sm text-[0.9375rem] text-[var(--ivory)]/75 transition-colors hover:text-[var(--ivory)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-sage)] focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
              >
                Our story
              </Link>
              <Link
                href="/quality"
                className="block rounded-sm text-[0.9375rem] text-[var(--ivory)]/75 transition-colors hover:text-[var(--ivory)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-sage)] focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
              >
                Quality
              </Link>
              <Link
                href="/origins"
                className="block rounded-sm text-[0.9375rem] text-[var(--ivory)]/75 transition-colors hover:text-[var(--ivory)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-sage)] focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
              >
                Origins
              </Link>
              <Link
                href="/journal"
                className="block rounded-sm text-[0.9375rem] text-[var(--ivory)]/75 transition-colors hover:text-[var(--ivory)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-sage)] focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
              >
                Journal
              </Link>
            </nav>
          </div>

          {/* CONTACT */}
          <div className="md:col-span-2 lg:col-span-2">
            <p className="text-[0.9375rem] tracking-[0.10em] text-[var(--ivory)]/50">
              Contact
            </p>
            <ul className="mt-4 space-y-4">
              <li className="flex items-start gap-3">
                <Mail
                  size={15}
                  className="mt-0.5 shrink-0 text-[var(--ivory)]/45"
                  aria-hidden
                />
                <a
                  href="mailto:info@treadville.co.ke"
                  className="rounded-sm text-[0.9375rem] text-[var(--ivory)]/75 transition-colors hover:text-[var(--ivory)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-sage)] focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
                >
                  info@treadville.co.ke
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Phone
                  size={15}
                  className="mt-0.5 shrink-0 text-[var(--ivory)]/45"
                  aria-hidden
                />
                <a
                  href="tel:+254722479985"
                  className="rounded-sm text-[0.9375rem] text-[var(--ivory)]/75 transition-colors hover:text-[var(--ivory)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-sage)] focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
                >
                  +254 722 479985
                </a>
              </li>
              <li className="flex items-start gap-3">
                <MapPin
                  size={15}
                  className="mt-0.5 shrink-0 text-[var(--ivory)]/45"
                  aria-hidden
                />
                <span className="rounded-sm text-[0.9375rem] text-[var(--ivory)]/75">
                  Nairobi, Kenya
                </span>
              </li>
            </ul>
            <Link
              href="/contact"
              className="mt-6 inline-flex items-center gap-2 rounded-sm text-[0.9375rem] text-[var(--ivory)]/75 transition-colors hover:text-[var(--ivory)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-sage)] focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
            >
              Open enquiry
              <span aria-hidden className="h-px w-6 bg-current transition-all duration-300" />
            </Link>
          </div>
        </Reveal>

        {/* Pasco Labs signature */}
        <Reveal
          as="div"
          delay={1}
          className="mt-12 border-t border-[rgba(236,227,206,0.14)] pt-8 md:mt-16 md:flex md:items-center md:justify-between md:gap-8"
        >
          <p className="text-[0.8125rem] text-[var(--ivory)]/45">
            &copy; {year} Treadville Company Limited
          </p>
          <p className="mt-3 text-[0.8125rem] text-[var(--ivory)]/50 md:mt-0">
            Digital experience by PASCO LABS
          </p>
        </Reveal>
      </div>
    </footer>
  );
}
