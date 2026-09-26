import type { Metadata } from "next";
import Link from "next/link";
import Reveal from "@/components/Reveal";

export const revalidate = 0;

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "Terms governing your use of the Treadville website and the enquiry and ordering processes available through it.",
  alternates: {
    canonical: "/terms",
  },
};

export default function TermsPage() {
  return (
    <main className="surface-base">
      {/* Hero */}
      <section className="relative flex min-h-[50vh] flex-col justify-end px-6 pb-16 pt-40 md:pb-24 md:pt-52 lg:pb-28">
        <div aria-hidden className="page-hero-light absolute inset-0" />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-30"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, rgba(184, 134, 11, 0.05) 1px, transparent 0)",
            backgroundSize: "7px 7px",
          }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[rgba(184,134,11,0.20)] to-transparent"
        />

        <div className="relative z-10 mx-auto w-full max-w-[var(--content-wide)]">
          <Reveal as="div" delay={0}>
            <p className="font-mono text-[12px] uppercase eyebrow-gold">
              Treadville · Legal
            </p>
          </Reveal>
          <Reveal as="div" delay={1} className="mt-6">
            <h1 className="max-w-[16ch] font-display text-5xl italic leading-[1.0] tracking-[-0.02em] text-[var(--ink)] md:text-7xl">
              Terms of{" "}
              <span className="text-[var(--ink-soft)]">Service.</span>
            </h1>
          </Reveal>
          <Reveal as="div" delay={2} className="mt-6 max-w-[48ch]">
            <p className="text-[1.0625rem] leading-relaxed text-[var(--ink-soft)] md:text-[1.125rem]">
              The terms that govern your use of the Treadville website and our
              business processes.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Content */}
      <section className="relative px-6 py-24 md:py-32">
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, var(--bg-warm) 0%, var(--bg-base) 100%)",
          }}
        />
        <div className="relative z-10 mx-auto max-w-[var(--content-wide)]">
          <div className="grid grid-cols-1 gap-16 md:grid-cols-12">
            <Reveal as="div" delay={0} className="md:col-span-8 md:col-start-3">
              <div className="prose-legal">
                <p className="font-mono text-[12px] uppercase eyebrow-gold">
                  Effective date · September 2026
                </p>

                <h2 className="mt-10 font-display text-2xl italic text-[var(--ink)]">
                  1. Acceptance of these terms
                </h2>
                <p className="mt-3 text-[0.9375rem] leading-relaxed text-[var(--ink-soft)]">
                  By accessing or using the Treadville website at{" "}
                  <a href="https://treadville.co.ke" className="underline underline-offset-2 text-[var(--ink)] hover:text-[var(--ink-soft)] transition-colors">
                    treadville.co.ke
                  </a>, you agree to be bound by these Terms of Service. If you do
                  not agree, please do not use the website.
                </p>

                <h2 className="mt-10 font-display text-2xl italic text-[var(--ink)]">
                  2. About Treadville
                </h2>
                <p className="mt-3 text-[0.9375rem] leading-relaxed text-[var(--ink-soft)]">
                  Treadville is a Kenyan agricultural platform operated by Treadville
                  Company Limited. We source, process, and facilitate the trade of
                  specialty coffee, tea, horticulture, and grains. The website serves
                  as a product showcase and enquiry platform — enabling customers to
                  browse our catalogue, submit enquiries, and request quotations.
                </p>

                <h2 className="mt-10 font-display text-2xl italic text-[var(--ink)]">
                  3. Nature of the website
                </h2>
                <p className="mt-3 text-[0.9375rem] leading-relaxed text-[var(--ink-soft)]">
                  The Treadville website is an enquiry and quotation platform. Product
                  information is presented for informational and enquiry purposes
                  only. The following applies:
                </p>
                <ul className="mt-4 space-y-3 text-[0.9375rem] leading-relaxed text-[var(--ink-soft)]">
                  <li className="flex gap-3">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--accent-gold)]" />
                    <span>
                      Submitting an enquiry or adding items to a basket does not
                      constitute a binding sale or purchase agreement.
                    </span>
                  </li>
                  <li className="flex gap-3">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--accent-gold)]" />
                    <span>
                      All product availability, specifications, quantities, pricing,
                      shipping arrangements, and delivery terms require individual
                      confirmation by Treadville before any transaction is agreed.
                    </span>
                  </li>
                  <li className="flex gap-3">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--accent-gold)]" />
                    <span>
                      Product images and descriptions are provided for illustrative
                      purposes. Actual products may vary in appearance, packaging,
                      or specifications.
                    </span>
                  </li>
                </ul>

                <h2 className="mt-10 font-display text-2xl italic text-[var(--ink)]">
                  4. Enquiries and orders
                </h2>
                <p className="mt-3 text-[0.9375rem] leading-relaxed text-[var(--ink-soft)]">
                  When you submit an enquiry or order through the website:
                </p>
                <ul className="mt-4 space-y-3 text-[0.9375rem] leading-relaxed text-[var(--ink-soft)]">
                  <li className="flex gap-3">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--accent-gold)]" />
                    <span>
                      You must provide accurate and complete information. We rely on
                      this information to respond to your enquiry and process any
                      resulting order.
                    </span>
                  </li>
                  <li className="flex gap-3">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--accent-gold)]" />
                    <span>
                      You will receive a reference number confirming receipt of your
                      enquiry. This reference number confirms that your enquiry has
                      been received — it does not confirm acceptance of an order or
                      the existence of a binding agreement.
                    </span>
                  </li>
                  <li className="flex gap-3">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--accent-gold)]" />
                    <span>
                      Treadville reserves the right to decline, modify, or cancel any
                      enquiry or order at its discretion, including where product
                      availability, pricing, or regulatory requirements make
                      fulfilment impractical.
                    </span>
                  </li>
                </ul>

                <h2 className="mt-10 font-display text-2xl italic text-[var(--ink)]">
                  5. Pricing and payment
                </h2>
                <p className="mt-3 text-[0.9375rem] leading-relaxed text-[var(--ink-soft)]">
                  Prices displayed on the website, if any, are indicative and subject
                  to confirmation. Commercial terms — including pricing, payment
                  methods, currency, invoicing, and credit terms — are agreed
                  individually between Treadville and the customer as part of the
                  quotation process.
                </p>

                <h2 className="mt-10 font-display text-2xl italic text-[var(--ink)]">
                  6. Shipping and delivery
                </h2>
                <p className="mt-3 text-[0.9375rem] leading-relaxed text-[var(--ink-soft)]">
                  Shipping, delivery, and logistics arrangements are agreed on a
                  per-order basis. For international orders, additional requirements
                  may apply, including but not limited to:
                </p>
                <ul className="mt-4 space-y-3 text-[0.9375rem] leading-relaxed text-[var(--ink-soft)]">
                  <li className="flex gap-3">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--accent-gold)]" />
                    <span>Customs duties, import taxes, and brokerage fees in the destination country.</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--accent-gold)]" />
                    <span>Phytosanitary, food safety, and other regulatory import requirements.</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--accent-gold)]" />
                    <span>Shipping insurance and risk allocation, which will be specified in the order confirmation.</span>
                  </li>
                </ul>

                <h2 className="mt-10 font-display text-2xl italic text-[var(--ink)]">
                  7. Intellectual property
                </h2>
                <p className="mt-3 text-[0.9375rem] leading-relaxed text-[var(--ink-soft)]">
                  All content on the Treadville website — including text, images,
                  graphics, logos, product descriptions, layout, and design — is the
                  property of Treadville Company Limited or its content suppliers and
                  is protected by applicable intellectual property laws. You may not
                  reproduce, distribute, modify, or create derivative works from any
                  content on this website without prior written consent from
                  Treadville.
                </p>

                <h2 className="mt-10 font-display text-2xl italic text-[var(--ink)]">
                  8. Limitation of liability
                </h2>
                <p className="mt-3 text-[0.9375rem] leading-relaxed text-[var(--ink-soft)]">
                  To the fullest extent permitted by applicable law:
                </p>
                <ul className="mt-4 space-y-3 text-[0.9375rem] leading-relaxed text-[var(--ink-soft)]">
                  <li className="flex gap-3">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--accent-gold)]" />
                    <span>
                      The website and its content are provided on an &quot;as is&quot;
                      and &quot;as available&quot; basis, without warranties of any
                      kind, whether express or implied, including but not limited to
                      implied warranties of merchantability, fitness for a particular
                      purpose, or non-infringement.
                    </span>
                  </li>
                  <li className="flex gap-3">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--accent-gold)]" />
                    <span>
                      Treadville shall not be liable for any indirect, incidental,
                      special, consequential, or punitive damages arising from your
                      use of or inability to use the website.
                    </span>
                  </li>
                  <li className="flex gap-3">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--accent-gold)]" />
                    <span>
                      Treadville&apos;s total liability for any claim arising from
                      your use of the website shall not exceed the amount you paid
                      to Treadville, if any, in the twelve months preceding the
                      claim.
                    </span>
                  </li>
                </ul>

                <h2 className="mt-10 font-display text-2xl italic text-[var(--ink)]">
                  9. Indemnification
                </h2>
                <p className="mt-3 text-[0.9375rem] leading-relaxed text-[var(--ink-soft)]">
                  You agree to indemnify and hold harmless Treadville Company
                  Limited, its directors, employees, and agents from any claims,
                  losses, damages, liabilities, costs, and expenses (including
                  reasonable legal fees) arising from your use of the website or
                  your breach of these terms.
                </p>

                <h2 className="mt-10 font-display text-2xl italic text-[var(--ink)]">
                  10. Governing law
                </h2>
                <p className="mt-3 text-[0.9375rem] leading-relaxed text-[var(--ink-soft)]">
                  These Terms of Service are governed by and construed in accordance
                  with the laws of the Republic of Kenya. Any disputes arising from
                  these terms or from your use of the website shall be subject to the
                  exclusive jurisdiction of the courts of Kenya, unless otherwise
                  agreed in writing between the parties.
                </p>

                <h2 className="mt-10 font-display text-2xl italic text-[var(--ink)]">
                  11. Changes to these terms
                </h2>
                <p className="mt-3 text-[0.9375rem] leading-relaxed text-[var(--ink-soft)]">
                  We may revise these Terms of Service from time to time. The
                  updated version will be posted on this page with a revised
                  effective date. Continued use of the website after any changes
                  constitutes acceptance of the revised terms.
                </p>

                <h2 className="mt-10 font-display text-2xl italic text-[var(--ink)]">
                  12. Contact us
                </h2>
                <p className="mt-3 text-[0.9375rem] leading-relaxed text-[var(--ink-soft)]">
                  If you have any questions about these Terms of Service, please
                  contact us:
                </p>
                <div className="mt-6 rounded-sm border border-[rgba(184,134,11,0.20)] bg-[rgba(250,247,240,0.5)] p-6">
                  <p className="text-[0.9375rem] leading-relaxed text-[var(--ink)]">
                    <strong>Treadville Company Limited</strong>
                  </p>
                  <p className="mt-2 text-[0.9375rem] leading-relaxed text-[var(--ink-soft)]">
                    Email:{" "}
                    <a href="mailto:info@treadville.co.ke" className="underline underline-offset-2 text-[var(--ink)] hover:text-[var(--ink-soft)] transition-colors">
                      info@treadville.co.ke
                    </a>
                  </p>
                  <p className="mt-2 text-[0.9375rem] leading-relaxed text-[var(--ink-soft)]">
                    Phone:{" "}
                    <a href="tel:+254722479985" className="underline underline-offset-2 text-[var(--ink)] hover:text-[var(--ink-soft)] transition-colors">
                      +254 722 479985
                    </a>
                  </p>
                  <p className="mt-2 text-[0.9375rem] leading-relaxed text-[var(--ink-soft)]">
                    Location: Nairobi, Kenya
                  </p>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative px-6 py-24 md:py-28">
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, var(--bg-base) 0%, var(--bg-warm) 50%, var(--bg-base) 100%)",
          }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[rgba(184,134,11,0.15)] to-transparent"
        />
        <div className="relative z-10 mx-auto max-w-[var(--content-wide)] text-center">
          <Reveal as="div" delay={0}>
            <p className="font-mono text-[12px] uppercase eyebrow-gold">
              Related
            </p>
            <h2 className="mt-5 font-display text-3xl italic leading-tight text-[var(--ink)] md:text-4xl">
              Other legal documents
            </h2>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <Link href="/privacy" className="btn-cta">
                Privacy Policy
              </Link>
              <Link href="/contact" className="btn-cta-ghost">
                Contact us
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </main>
  );
}
