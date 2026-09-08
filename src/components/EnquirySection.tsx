"use client";

import { useActionState } from "react";
import Link from "next/link";
import {
  submitEnquiryAction,
  type EnquiryFormState,
} from "@/lib/enquiry-actions";

const ENQUIRY_TYPES = [
  {
    value: "General enquiry",
    eyebrow: "General enquiry",
    headline: "Talk to Treadville",
    note: "Speak with our team about any product line.",
    accent: "var(--copper)",
  },
  {
    value: "Sample request",
    eyebrow: "Sample request",
    headline: "Request a sample",
    note: "Cup, taste, and evaluate before you commit.",
    accent: "var(--jade)",
  },
  {
    value: "Export / wholesale",
    eyebrow: "Export & wholesale",
    headline: "Request a quote",
    note: "Volume pricing and shipping terms for international buyers.",
    accent: "var(--gold)",
  },
];

const initialState: EnquiryFormState = {};

export default function EnquirySection() {
  const [state, formAction, pending] = useActionState(
    submitEnquiryAction,
    initialState
  );

  return (
    <section
      aria-labelledby="enquiry-heading"
      className="relative surface-cream px-6 py-20 md:py-28"
    >
      <div className="relative z-10 mx-auto max-w-[var(--content-wide)]">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-12 md:gap-16">
          {/* Left — headline, copy, quick-select type cards */}
          <div className="md:col-span-5">
            <p className="label-on-light">Engage with Treadville</p>
            <h2
              id="enquiry-heading"
              className="mt-6 max-w-[18ch] font-display text-3xl leading-[1.02] tracking-[-0.025em] text-[var(--ink)] md:text-5xl lg:text-[4rem]"
            >
              A conversation, not a checkout.
            </h2>
            <p className="mt-6 max-w-[44ch] text-[1.0625rem] leading-relaxed text-[var(--ink-soft)] md:text-[1.125rem]">
              Whether you are sourcing for a roastery, an importer, a retail
              shelf, or a private-label programme, our team responds to every
              enquiry directly.
            </p>

            <ul className="mt-10 space-y-4">
              {ENQUIRY_TYPES.map((card) => (
                <li key={card.value}>
                  <Link
                    href={`/contact?type=${encodeURIComponent(card.value === "General enquiry" ? "" : card.value)}`}
                    className="group flex items-start gap-5 border p-5 transition-shadow duration-[var(--dur)] hover:shadow-[var(--shadow-lift-light)]"
                    style={{
                      borderColor: "var(--line-on-light)",
                      background: "var(--warm-white)",
                    }}
                  >
                    <div
                      className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center border font-mono text-[15px] transition-all duration-[var(--dur)] group-hover:w-10"
                      style={{
                        borderColor: card.accent,
                        color: card.accent,
                      }}
                    >
                      →
                    </div>
                    <div className="min-w-0 flex-1">
                      <p
                        className="text-[13px] uppercase tracking-[0.1em]"
                        style={{ color: card.accent }}
                      >
                        {card.eyebrow}
                      </p>
                      <p className="mt-1 font-display text-xl italic text-[var(--ink)]">
                        {card.headline}
                      </p>
                      <p className="mt-1 text-[0.9375rem] leading-relaxed text-[var(--ink-muted)]">
                        {card.note}
                      </p>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Right — enquiry form */}
          <div className="md:col-span-7">
            <div
              className="p-6 md:p-8 lg:p-10"
              style={{
                background:
                  "linear-gradient(135deg, rgba(251,248,241,0.70) 0%, rgba(245,239,226,0.50) 40%, rgba(239,231,212,0.35) 100%)",
                border: "1px solid var(--line-on-light)",
                boxShadow:
                  "inset 0 1px 0 rgba(255,255,255,0.5), 0 12px 28px -8px rgba(60,45,30,0.08)",
              }}
            >
              {state.success ? (
                <div className="py-8 text-center">
                  <p className="label-on-light">Received</p>
                  <h3 className="mt-4 font-display text-2xl italic leading-tight text-[var(--ink)]">
                    Thank you.
                  </h3>
                  <p className="mt-4 max-w-[36ch] mx-auto text-[1rem] leading-relaxed text-[var(--ink-soft)]">
                    Your message has been sent. Treadville will be in touch
                    within two business days.
                  </p>
                  <p className="mt-3 text-[0.875rem] text-[var(--ink-muted)]">
                    For urgent enquiries call{" "}
                    <a
                      href="tel:+254722479985"
                      className="underline decoration-[var(--line-on-light-strong)] underline-offset-2 transition-colors hover:text-[var(--ink)]"
                    >
                      +254 722 479985
                    </a>
                  </p>
                </div>
              ) : (
                <form action={formAction} className="space-y-6">
                  <p className="text-[0.875rem] text-[var(--ink-muted)]">
                    Fields marked with{" "}
                    <span className="text-[var(--accent-sage)]">*</span> are
                    required.
                  </p>

                  {state.error && (
                    <div
                      role="alert"
                      className="border border-red-200 bg-red-50 px-4 py-3 font-mono text-xs text-red-700"
                    >
                      {state.error}
                    </div>
                  )}

                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <Field label="Your name" htmlFor="enq-home-name" required>
                      <input
                        id="enq-home-name"
                        type="text"
                        name="name"
                        required
                        placeholder="Full name"
                        className="field-light"
                        autoComplete="name"
                      />
                    </Field>
                    <Field
                      label="Work email"
                      htmlFor="enq-home-email"
                      required
                    >
                      <input
                        id="enq-home-email"
                        type="email"
                        name="email"
                        required
                        placeholder="you@company.com"
                        className="field-light"
                        autoComplete="email"
                      />
                    </Field>
                  </div>

                  <Field
                    label="Company / organisation"
                    htmlFor="enq-home-org"
                  >
                    <input
                      id="enq-home-org"
                      type="text"
                      name="organisation"
                      placeholder="Company or organisation"
                      className="field-light"
                      autoComplete="organization"
                    />
                  </Field>

                  <input type="hidden" name="type" value="General enquiry" />

                  <Field
                    label="Message"
                    htmlFor="enq-home-message"
                    required
                  >
                    <textarea
                      id="enq-home-message"
                      name="message"
                      required
                      rows={4}
                      placeholder="Tell us what you are looking for — product type, volume, destination, timeline..."
                      className="field-light resize-none"
                    />
                  </Field>

                  <button
                    type="submit"
                    disabled={pending}
                    className="w-full bg-[var(--ink)] px-8 py-4 font-mono text-[13px] uppercase tracking-[0.22em] text-[var(--warm-white)] transition-colors duration-[var(--dur)] hover:bg-[var(--accent-sage)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-sage)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--warm-white)] disabled:opacity-50"
                  >
                    {pending ? "Sending\u2026" : "Send enquiry"}
                  </button>

                  <p className="text-center text-[0.8125rem] text-[var(--ink-faint)]">
                    We respond within two business days.
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Field({
  label,
  htmlFor,
  required,
  children,
}: {
  label: string;
  htmlFor: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={htmlFor} className="mb-2 block">
        <span className="text-[0.9375rem] text-[var(--ink)]">
          {label}
          {required && (
            <span className="ml-1 text-[var(--accent-sage)]" aria-hidden>
              *
            </span>
          )}
        </span>
      </label>
      {children}
    </div>
  );
}