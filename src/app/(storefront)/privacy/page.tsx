import type { Metadata } from "next";
import Link from "next/link";
import Reveal from "@/components/Reveal";

export const revalidate = 0;

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How Treadville collects, uses, and protects your information. Our privacy practices for enquiry forms, orders, and website usage.",
  alternates: {
    canonical: "/privacy",
  },
};

export default function PrivacyPage() {
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
              Privacy{" "}
              <span className="text-[var(--ink-soft)]">Policy.</span>
            </h1>
          </Reveal>
          <Reveal as="div" delay={2} className="mt-6 max-w-[48ch]">
            <p className="text-[1.0625rem] leading-relaxed text-[var(--ink-soft)] md:text-[1.125rem]">
              How we collect, use, and protect the information you share with us.
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
                  1. Who we are
                </h2>
                <p className="mt-3 text-[0.9375rem] leading-relaxed text-[var(--ink-soft)]">
                  Treadville is a Kenyan agricultural platform operated by Treadville
                  Company Limited. We source, process, and facilitate the trade of
                  specialty coffee, tea, horticulture, and grains — locally and for
                  export. This Privacy Policy explains how we handle information
                  collected through our website at{" "}
                  <a href="https://treadville.co.ke" className="underline underline-offset-2 text-[var(--ink)] hover:text-[var(--ink-soft)] transition-colors">
                    treadville.co.ke
                  </a>.
                </p>

                <h2 className="mt-10 font-display text-2xl italic text-[var(--ink)]">
                  2. Information we collect
                </h2>
                <p className="mt-3 text-[0.9375rem] leading-relaxed text-[var(--ink-soft)]">
                  When you interact with Treadville through our website, we may
                  collect the following categories of information:
                </p>
                <ul className="mt-4 space-y-3 text-[0.9375rem] leading-relaxed text-[var(--ink-soft)]">
                  <li className="flex gap-3">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--accent-gold)]" />
                    <span>
                      <strong className="text-[var(--ink)]">Contact details</strong> —
                      your name, email address, phone number, and company or business
                      name, as provided through our enquiry or contact forms.
                    </span>
                  </li>
                  <li className="flex gap-3">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--accent-gold)]" />
                    <span>
                      <strong className="text-[var(--ink)]">Enquiry and order
                      information</strong> — product interests, order details,
                      messages, notes, and any other information you include in
                      your submissions.
                    </span>
                  </li>
                  <li className="flex gap-3">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--accent-gold)]" />
                    <span>
                      <strong className="text-[var(--ink)]">Website usage
                      data</strong> — basic analytics such as page views and session
                      duration, collected through Vercel Web Analytics. This service
                      does not use tracking cookies or cross-site advertising
                      identifiers.
                    </span>
                  </li>
                </ul>

                <h2 className="mt-10 font-display text-2xl italic text-[var(--ink)]">
                  3. How we use your information
                </h2>
                <p className="mt-3 text-[0.9375rem] leading-relaxed text-[var(--ink-soft)]">
                  We use the information we collect for the following purposes:
                </p>
                <ul className="mt-4 space-y-3 text-[0.9375rem] leading-relaxed text-[var(--ink-soft)]">
                  <li className="flex gap-3">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--accent-gold)]" />
                    <span>Responding to your enquiries and providing requested information about our products and services.</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--accent-gold)]" />
                    <span>Processing and managing product orders, quotations, and sample requests.</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--accent-gold)]" />
                    <span>Communicating with you about your orders, account, or other business matters.</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--accent-gold)]" />
                    <span>Improving our website, products, and services based on aggregated usage patterns.</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--accent-gold)]" />
                    <span>Meeting legal and regulatory obligations where applicable.</span>
                  </li>
                </ul>

                <h2 className="mt-10 font-display text-2xl italic text-[var(--ink)]">
                  4. How we store and protect your information
                </h2>
                <p className="mt-3 text-[0.9375rem] leading-relaxed text-[var(--ink-soft)]">
                  Your information is stored within our application infrastructure,
                  which uses Supabase — a cloud-hosted PostgreSQL database and
                  authentication platform. Supabase operates data centres with
                  industry-standard security practices, including encryption at rest
                  and in transit.
                </p>
                <p className="mt-3 text-[0.9375rem] leading-relaxed text-[var(--ink-soft)]">
                  We take reasonable steps to protect your personal information
                  from unauthorised access, loss, or misuse. However, no method of
                  electronic transmission or storage is completely secure, and we
                  cannot guarantee absolute security.
                </p>

                <h2 className="mt-10 font-display text-2xl italic text-[var(--ink)]">
                  5. Third-party services
                </h2>
                <p className="mt-3 text-[0.9375rem] leading-relaxed text-[var(--ink-soft)]">
                  We use the following third-party services in connection with our
                  website:
                </p>
                <ul className="mt-4 space-y-3 text-[0.9375rem] leading-relaxed text-[var(--ink-soft)]">
                  <li className="flex gap-3">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--accent-gold)]" />
                    <span>
                      <strong className="text-[var(--ink)]">Supabase</strong> —
                      database hosting, authentication, and file storage for our
                      application.
                    </span>
                  </li>
                  <li className="flex gap-3">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--accent-gold)]" />
                    <span>
                      <strong className="text-[var(--ink)]">Vercel</strong> —
                      website hosting and deployment.
                    </span>
                  </li>
                  <li className="flex gap-3">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--accent-gold)]" />
                    <span>
                      <strong className="text-[var(--ink)]">Vercel Web
                      Analytics</strong> — privacy-focused website analytics that
                      does not use tracking cookies or cross-site identifiers.
                    </span>
                  </li>
                  <li className="flex gap-3">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--accent-gold)]" />
                    <span>
                      <strong className="text-[var(--ink)]">Resend</strong> —
                      transactional email delivery for enquiry notifications.
                    </span>
                  </li>
                </ul>

                <h2 className="mt-10 font-display text-2xl italic text-[var(--ink)]">
                  6. Cookies and tracking
                </h2>
                <p className="mt-3 text-[0.9375rem] leading-relaxed text-[var(--ink-soft)]">
                  Our website does not intentionally use tracking cookies, advertising
                  cookies, or cross-site tracking technologies. The site does not
                  deploy third-party advertising scripts or social media tracking
                  pixels.
                </p>
                <p className="mt-3 text-[0.9375rem] leading-relaxed text-[var(--ink-soft)]">
                  Vercel Web Analytics may use a single, first-party, session-based
                  cookie solely for the purpose of distinguishing unique visitors.
                  This cookie does not track users across websites and expires at the
                  end of the browsing session. It is not used for advertising or
                  cross-site tracking purposes.
                </p>

                <h2 className="mt-10 font-display text-2xl italic text-[var(--ink)]">
                  7. International data transfers
                </h2>
                <p className="mt-3 text-[0.9375rem] leading-relaxed text-[var(--ink-soft)]">
                  Treadville is based in Kenya. If you are accessing our website from
                  outside Kenya, please be aware that your information may be
                  transferred to, stored, and processed in Kenya or in the countries
                  where our third-party service providers operate. By submitting your
                  information, you consent to such transfers where necessary for the
                  purposes described in this policy.
                </p>

                <h2 className="mt-10 font-display text-2xl italic text-[var(--ink)]">
                  8. Your rights
                </h2>
                <p className="mt-3 text-[0.9375rem] leading-relaxed text-[var(--ink-soft)]">
                  Depending on your location, you may have the right to:
                </p>
                <ul className="mt-4 space-y-3 text-[0.9375rem] leading-relaxed text-[var(--ink-soft)]">
                  <li className="flex gap-3">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--accent-gold)]" />
                    <span>Access the personal information we hold about you.</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--accent-gold)]" />
                    <span>Request correction of inaccurate or incomplete information.</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--accent-gold)]" />
                    <span>Request deletion of your personal information, subject to legal and operational requirements.</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--accent-gold)]" />
                    <span>Object to or restrict the processing of your information in certain circumstances.</span>
                  </li>
                </ul>
                <p className="mt-3 text-[0.9375rem] leading-relaxed text-[var(--ink-soft)]">
                  To exercise any of these rights, or if you have questions about how
                  your information is handled, please contact us using the details
                  below.
                </p>

                <h2 className="mt-10 font-display text-2xl italic text-[var(--ink)]">
                  9. Data retention
                </h2>
                <p className="mt-3 text-[0.9375rem] leading-relaxed text-[var(--ink-soft)]">
                  We retain your information for as long as necessary to fulfil the
                  purposes described in this policy, unless a longer retention period
                  is required or permitted by law. Enquiry and order records are
                  retained to support ongoing business relationships and record-keeping.
                </p>

                <h2 className="mt-10 font-display text-2xl italic text-[var(--ink)]">
                  10. Changes to this policy
                </h2>
                <p className="mt-3 text-[0.9375rem] leading-relaxed text-[var(--ink-soft)]">
                  We may update this Privacy Policy from time to time to reflect
                  changes in our practices or applicable laws. The updated policy will
                  be posted on this page with a revised effective date. We encourage
                  you to review this page periodically.
                </p>

                <h2 className="mt-10 font-display text-2xl italic text-[var(--ink)]">
                  11. Contact us
                </h2>
                <p className="mt-3 text-[0.9375rem] leading-relaxed text-[var(--ink-soft)]">
                  If you have any questions, concerns, or requests regarding this
                  Privacy Policy or how we handle your information, please contact
                  us:
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
              <Link href="/terms" className="btn-cta">
                Terms of Service
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
