"use client";

import { useState } from "react";
import Reveal from "@/components/Reveal";

const ENQUIRY_TYPES = [
  "General enquiry",
  "Sample request",
  "Export / wholesale",
  "Press & media",
  "Partnership",
];

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  return (
    <main className="surface-footer">
      {/* Hero */}
      <section className="relative flex min-h-[50vh] flex-col justify-end px-6 pb-14 pt-40 md:pb-20 md:pt-52">
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(175deg, #0f0b08 0%, #1a1209 40%, #261c12 70%, #1e1508 100%)",
          }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-30"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, rgba(212, 190, 145, 0.06) 1px, transparent 0)",
            backgroundSize: "7px 7px",
          }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[rgba(212,190,145,0.25)] to-transparent"
        />

        <div className="relative z-10 mx-auto w-full max-w-[var(--content-wide)]">
          <Reveal as="div" delay={0}>
            <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-[rgba(236,227,206,0.45)]">
              Treadville · Contact
            </p>
          </Reveal>
          <Reveal as="div" delay={1} className="mt-4">
            <h1 className="max-w-[14ch] font-display text-4xl italic leading-[1.0] tracking-[-0.02em] text-[var(--ivory)] md:text-6xl lg:text-7xl">
              A conversation,{" "}
              <span className="text-[rgba(236,227,206,0.55)]">
                not a form.
              </span>
            </h1>
          </Reveal>
          <Reveal as="div" delay={2} className="mt-5 max-w-[48ch]">
            <p className="text-sm leading-relaxed text-[rgba(236,227,206,0.70)]">
              Tell us what you&apos;re looking for. We&apos;ll respond within two
              business days.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Form + info */}
      <section className="relative px-6 py-16 md:py-24">
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, #1e1508 0%, #140f07 100%)",
          }}
        />
        <div className="relative z-10 mx-auto max-w-[var(--content-wide)]">
          <div className="grid grid-cols-1 gap-16 md:grid-cols-12 md:gap-12">
            {/* Form */}
            <div className="md:col-span-7">
              <Reveal as="div" delay={0}>
                {submitted ? (
                  <div className="border border-[rgba(212,190,145,0.30)] bg-[rgba(20,15,7,0.60)] p-10 backdrop-blur-sm">
                    <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-[rgba(212,190,145,0.55)]">
                      Received
                    </p>
                    <h2 className="mt-4 font-display text-2xl italic leading-tight text-[var(--ivory)]">
                      Thank you for reaching out.
                    </h2>
                    <p className="mt-4 text-sm leading-relaxed text-[rgba(236,227,206,0.68)]">
                      We&apos;ll be in touch within two business days. If your
                      enquiry is urgent, reach us directly at{" "}
                      <a
                        href="tel:+254722479985"
                        className="underline decoration-[rgba(212,190,145,0.40)] underline-offset-2 transition-colors hover:text-[var(--ivory)]"
                      >
                        +254 722 479985
                      </a>
                      .
                    </p>
                  </div>
                ) : (
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      setSubmitted(true);
                    }}
                    className="space-y-6"
                    noValidate
                  >
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                      <Field label="Name" required>
                        <input
                          type="text"
                          name="name"
                          required
                          placeholder="Your full name"
                          className="field-dark"
                          autoComplete="name"
                        />
                      </Field>
                      <Field label="Email" required>
                        <input
                          type="email"
                          name="email"
                          required
                          placeholder="your@email.com"
                          className="field-dark"
                          autoComplete="email"
                        />
                      </Field>
                    </div>
                    <Field label="Organisation" optional>
                      <input
                        type="text"
                        name="organisation"
                        placeholder="Company or business name"
                        className="field-dark"
                        autoComplete="organization"
                      />
                    </Field>
                    <Field label="Enquiry type" required>
                      <select
                        name="type"
                        required
                        className="field-dark cursor-pointer"
                        defaultValue=""
                      >
                        <option value="" disabled>
                          Select an enquiry type
                        </option>
                        {ENQUIRY_TYPES.map((t) => (
                          <option key={t} value={t}>
                            {t}
                          </option>
                        ))}
                      </select>
                    </Field>
                    <Field label="Message" required>
                      <textarea
                        name="message"
                        required
                        rows={5}
                        placeholder="Tell us what you are looking for — product type, volume, destination, timeline..."
                        className="field-dark resize-none"
                      />
                    </Field>
                    <button
                      type="submit"
                      className="w-full border border-[var(--ivory)] bg-[var(--ivory)] px-8 py-3.5 font-mono text-[11px] uppercase tracking-[0.28em] text-[var(--soil)] transition-colors hover:bg-transparent hover:text-[var(--ivory)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(212,190,145,0.50)] focus-visible:ring-offset-2 focus-visible:ring-offset-[#140f07]"
                    >
                      Send enquiry
                    </button>
                  </form>
                )}
              </Reveal>
            </div>

            {/* Info */}
            <div className="md:col-span-4 md:col-start-9">
              <Reveal as="div" delay={1} className="space-y-10">
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-[rgba(212,190,145,0.55)]">
                    Direct contact
                  </p>
                  <ul className="mt-4 space-y-3">
                    <li>
                      <a
                        href="mailto:info@treadville.co.ke"
                        className="block font-mono text-sm text-[rgba(236,227,206,0.80)] transition-colors hover:text-[var(--ivory)]"
                      >
                        info@treadville.co.ke
                      </a>
                    </li>
                    <li>
                      <a
                        href="tel:+254722479985"
                        className="block font-mono text-sm text-[rgba(236,227,206,0.80)] transition-colors hover:text-[var(--ivory)]"
                      >
                        +254 722 479985
                      </a>
                    </li>
                  </ul>
                </div>

                <div>
                  <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-[rgba(212,190,145,0.55)]">
                    Location
                  </p>
                  <p className="mt-4 font-mono text-sm text-[rgba(236,227,206,0.80)]">
                    Nairobi, Kenya
                  </p>
                </div>

                <div>
                  <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-[rgba(212,190,145,0.55)]">
                    Response time
                  </p>
                  <p className="mt-4 text-sm leading-relaxed text-[rgba(236,227,206,0.80)]">
                    Within two business days.
                    <br />
                    Export enquiries may take slightly longer
                    due to specification review.
                  </p>
                </div>

                <div className="border-t border-[rgba(212,190,145,0.18)] pt-8">
                  <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-[rgba(212,190,145,0.55)]">
                    Quick options
                  </p>
                  <ul className="mt-4 space-y-3">
                    {[
                      { label: "Request a sample", href: "/contact?type=sample" },
                      { label: "Export enquiry", href: "/export" },
                      { label: "Browse catalogue", href: "/shop" },
                    ].map((link) => (
                      <li key={link.label}>
                        <a
                          href={link.href}
                          className="inline-flex items-center gap-2 font-mono text-sm text-[rgba(212,190,145,0.75)] transition-colors hover:text-[var(--ivory)]"
                        >
                          <span aria-hidden className="h-px w-4 bg-[rgba(212,190,145,0.45)]" />
                          {link.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

function Field({
  label,
  required,
  optional,
  children,
}: {
  label: string;
  required?: boolean;
  optional?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-2 block">
        <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-[rgba(212,190,145,0.60)]">
          {label}
          {optional && (
            <span className="ml-1.5 text-[rgba(212,190,145,0.40)]"> (optional)</span>
          )}
          {required && (
            <span className="ml-1.5 text-[rgba(212,190,145,0.40)]" aria-hidden>*</span>
          )}
        </span>
      </label>
      {children}
    </div>
  );
}
