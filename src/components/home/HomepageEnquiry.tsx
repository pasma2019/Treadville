import Link from "next/link";
import Reveal from "@/components/Reveal";
import { buildWaLink } from "@/lib/wa-link";

const WHATSAPP_PHONE = "+254722479985";
const WHATSAPP_MSG = "Hello Treadville, I'd like to enquire about your products.";
const waLink = buildWaLink(WHATSAPP_PHONE, WHATSAPP_MSG);

export default function HomepageEnquiry() {
  return (
    <section
      aria-labelledby="enquiry-heading"
      className="enquiry-cinematic relative overflow-hidden px-6 py-28 md:py-40"
    >
      <div className="relative z-10 mx-auto max-w-[var(--content-narrow)] text-center">
        <Reveal variant="light" as="div" delay={0}>
          <p className="font-mono text-[12px] uppercase tracking-[0.2em] text-[var(--gold)]">
            Source from Kenya
          </p>
          <h2
            id="enquiry-heading"
            className="mt-8 font-display text-[clamp(2.5rem,6vw,4.5rem)] italic leading-[1.02] tracking-[-0.025em] text-[var(--ink)]"
            style={{ textWrap: "balance" }}
          >
            Ready to source
            <br />
            from Kenya?
          </h2>

          {/* Gold divider */}
          <div
            aria-hidden
            className="mx-auto mt-8 h-[2px] w-16"
            style={{ background: "var(--gold-gradient)" }}
          />

          <p className="mt-8 mx-auto max-w-[38ch] text-[1.0625rem] leading-[1.75] text-[var(--ink-soft)] md:text-[1.125rem]">
            Whether you need a single sample or a full container, Treadville
            responds to every enquiry directly.
          </p>
        </Reveal>

        <Reveal variant="light" as="div" delay={1} className="mt-12">
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center sm:gap-5">
            <Link
              href="/contact"
              className="btn-cta-glass w-full sm:w-auto"
            >
              Request an enquiry
            </Link>
            <a
              href={waLink ?? "https://wa.me/254722479985"}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-cta-ghost w-full sm:w-auto"
            >
              WhatsApp
            </a>
          </div>
        </Reveal>

        <Reveal variant="light" as="div" delay={2} className="mt-14">
          <p className="text-[0.8125rem] text-[var(--ink-muted)]">
            Or call{" "}
            <a
              href="tel:+254722479985"
              className="underline decoration-[var(--line-on-light)] underline-offset-2 transition-colors hover:text-[var(--ink)]"
            >
              +254 722 479985
            </a>
            {" · "}
            <a
              href="mailto:info@treadville.co.ke"
              className="underline decoration-[var(--line-on-light)] underline-offset-2 transition-colors hover:text-[var(--ink)]"
            >
              info@treadville.co.ke
            </a>
          </p>
        </Reveal>
      </div>
    </section>
  );
}
