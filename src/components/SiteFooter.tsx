import Link from "next/link";
import Reveal from "@/components/Reveal";
import { Mail, Phone, MapPin } from "lucide-react";
import { buildWaLink } from "@/lib/wa-link";

export default function SiteFooter() {
  const year = new Date().getFullYear();
  const waLink = buildWaLink("+254722479985", "Hello Treadville, I'd like to enquire about your products.");

  return (
    <footer
      aria-labelledby="footer-heading"
      className="surface-footer relative px-6 py-16 md:py-20"
    >
      <div aria-hidden className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[rgba(184,134,11,0.30)] to-transparent" />

      <div className="mx-auto max-w-[var(--content-wide)]">
        {/* Main footer grid */}
        <Reveal
          as="div"
          delay={0}
          className="footer-grid"
        >
          {/* Brand */}
          <div>
            <p className="type-micro text-[var(--gold)]/60">
              TREADVILLE · KENYA
            </p>
            <h2
              id="footer-heading"
              className="mt-4 max-w-[20ch] font-display text-2xl leading-tight tracking-[-0.01em] text-[var(--ivory)] md:text-3xl"
            >
              Exceptional products.{" "}
              <span className="italic text-[var(--ivory)]/60">
                Traceable origins.
              </span>
            </h2>
            <p className="mt-4 max-w-xs text-[var(--text-body)] leading-relaxed text-[var(--ivory)]/55">
              Premium agricultural products — coffee, tea, horticulture, and grains
              — sourced across Kenya&apos;s volcanic highlands and fertile plains.
            </p>
          </div>

          {/* EXPLORE */}
          <div>
            <p className="type-micro text-[var(--gold)]/50">
              Explore
            </p>
            <nav
              aria-label="Footer catalogue navigation"
              className="mt-5 space-y-3.5"
            >
              <Link
                href="/shop"
                className="block rounded-sm text-[var(--text-body)] text-[var(--ivory)]/65 transition-colors hover:text-[var(--ivory)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-sage)] focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
              >
                Full catalogue
              </Link>
              <Link
                href="/shop/coffee"
                className="block rounded-sm text-[var(--text-body)] text-[var(--ivory)]/65 transition-colors hover:text-[var(--ivory)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-sage)] focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
              >
                Coffee
              </Link>
              <Link
                href="/shop/tea"
                className="block rounded-sm text-[var(--text-body)] text-[var(--ivory)]/65 transition-colors hover:text-[var(--ivory)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-sage)] focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
              >
                Tea
              </Link>
              <Link
                href="/shop/horticulture"
                className="block rounded-sm text-[var(--text-body)] text-[var(--ivory)]/65 transition-colors hover:text-[var(--ivory)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-sage)] focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
              >
                Horticulture
              </Link>
              <Link
                href="/shop/grains"
                className="block rounded-sm text-[var(--text-body)] text-[var(--ivory)]/65 transition-colors hover:text-[var(--ivory)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-sage)] focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
              >
                Grains
              </Link>
            </nav>
          </div>

          {/* WORK WITH US */}
          <div>
            <p className="type-micro text-[var(--gold)]/50">
              Work with us
            </p>
            <nav
              aria-label="Footer work with us navigation"
              className="mt-5 space-y-3.5"
            >
              <Link
                href="/contact?type=sample"
                className="block rounded-sm text-[var(--text-body)] text-[var(--ivory)]/65 transition-colors hover:text-[var(--ivory)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-sage)] focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
              >
                Request a sample
              </Link>
              <Link
                href="/contact?type=quote"
                className="block rounded-sm text-[var(--text-body)] text-[var(--ivory)]/65 transition-colors hover:text-[var(--ivory)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-sage)] focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
              >
                Export enquiry
              </Link>
              <Link
                href="/contact"
                className="block rounded-sm text-[var(--text-body)] text-[var(--ivory)]/65 transition-colors hover:text-[var(--ivory)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-sage)] focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
              >
                Wholesale
              </Link>
            </nav>
          </div>

          {/* COMPANY */}
          <div>
            <p className="type-micro text-[var(--gold)]/50">
              Company
            </p>
            <nav
              aria-label="Footer company navigation"
              className="mt-5 space-y-3.5"
            >
              <Link
                href="/about"
                className="block rounded-sm text-[var(--text-body)] text-[var(--ivory)]/65 transition-colors hover:text-[var(--ivory)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-sage)] focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
              >
                Our story
              </Link>
              <Link
                href="/quality"
                className="block rounded-sm text-[var(--text-body)] text-[var(--ivory)]/65 transition-colors hover:text-[var(--ivory)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-sage)] focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
              >
                Quality
              </Link>
              <Link
                href="/origins"
                className="block rounded-sm text-[var(--text-body)] text-[var(--ivory)]/65 transition-colors hover:text-[var(--ivory)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-sage)] focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
              >
                Origins
              </Link>
              <Link
                href="/journal"
                className="block rounded-sm text-[var(--text-body)] text-[var(--ivory)]/65 transition-colors hover:text-[var(--ivory)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-sage)] focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
              >
                Journal
              </Link>
            </nav>
          </div>

          {/* CONTACT */}
          <div className="min-w-0">
            <p className="type-micro text-[var(--gold)]/50">
              Contact
            </p>
            <ul className="mt-5 space-y-3.5">
              <li className="flex min-w-0 items-start gap-3">
                <Mail
                  size={14}
                  className="mt-0.5 shrink-0 text-[var(--ivory)]/35"
                  aria-hidden
                />
                <a
                  href="mailto:info@treadville.co.ke"
                  className="min-w-0 rounded-sm text-[var(--text-body)] text-[var(--ivory)]/65 transition-colors hover:text-[var(--ivory)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-sage)] focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
                  style={{ overflowWrap: "break-word", wordBreak: "break-word" }}
                >
                  info@treadville.co.ke
                </a>
              </li>
              <li className="flex min-w-0 items-start gap-3">
                <Phone
                  size={14}
                  className="mt-0.5 shrink-0 text-[var(--ivory)]/35"
                  aria-hidden
                />
                <a
                  href="tel:+254722479985"
                  className="min-w-0 rounded-sm text-[var(--text-body)] text-[var(--ivory)]/65 transition-colors hover:text-[var(--ivory)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-sage)] focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
                >
                  +254 722 479985
                </a>
              </li>
              {waLink && (
                <li className="flex min-w-0 items-start gap-3">
                  <svg
                    aria-hidden="true"
                    className="mt-0.5 h-[14px] w-[14px] shrink-0 text-[var(--ivory)]/35"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                  <a
                    href={waLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="min-w-0 rounded-sm text-[var(--text-body)] text-[var(--ivory)]/65 transition-colors hover:text-[var(--ivory)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-sage)] focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
                  >
                    WhatsApp
                  </a>
                </li>
              )}
              <li className="flex items-start gap-3">
                <MapPin
                  size={14}
                  className="mt-0.5 shrink-0 text-[var(--ivory)]/35"
                  aria-hidden
                />
                <span className="rounded-sm text-[var(--text-body)] text-[var(--ivory)]/65">
                  Nairobi, Kenya
                </span>
              </li>
            </ul>
            <Link
              href="/contact"
              className="mt-6 inline-flex items-center gap-2 rounded-sm text-[var(--text-body)] text-[var(--ivory)]/55 transition-colors hover:text-[var(--ivory)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-sage)] focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
            >
              Open enquiry
              <span aria-hidden className="h-px w-6 bg-current transition-all duration-300" />
            </Link>
          </div>
        </Reveal>

        {/* Bottom bar */}
        <Reveal
          as="div"
          delay={1}
          className="mt-12 border-t border-[rgba(184,134,11,0.12)] pt-8 md:mt-16 md:flex md:items-center md:justify-between md:gap-8"
        >
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            <p className="text-[var(--text-body-sm)] text-[var(--ivory)]/40">
              &copy; {year} Treadville Company Limited
            </p>
            <span className="hidden text-[var(--ivory)]/15 sm:inline">·</span>
            <Link
              href="/privacy"
              className="rounded-sm text-[var(--text-body-sm)] text-[var(--ivory)]/40 transition-colors hover:text-[var(--ivory)]/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-sage)] focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
            >
              Privacy Policy
            </Link>
            <span className="hidden text-[var(--ivory)]/15 sm:inline">·</span>
            <Link
              href="/terms"
              className="rounded-sm text-[var(--text-body-sm)] text-[var(--ivory)]/40 transition-colors hover:text-[var(--ivory)]/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-sage)] focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
            >
              Terms of Service
            </Link>
          </div>
          <p className="mt-3 text-[var(--text-body-sm)] text-[var(--ivory)]/40 md:mt-0">
            Digital experience by PASCO LABS
          </p>
        </Reveal>
      </div>
    </footer>
  );
}
