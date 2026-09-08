"use client";

import { useActionState, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { track } from "@vercel/analytics";
import Reveal from "@/components/Reveal";
import { submitEnquiryAction, type EnquiryFormState } from "@/lib/enquiry-actions";

const ENQUIRY_TYPES = [
  "General enquiry",
  "Sample request",
  "Export / wholesale",
  "Press & media",
  "Partnership",
];

const initialState: EnquiryFormState = {};

export default function ContactPage() {
  const [state, formAction, pending] = useActionState(submitEnquiryAction, initialState);
  const searchParams = useSearchParams();
  const [productContext, setProductContext] = useState<string>("");
  const productSlug = searchParams.get("product");

  useEffect(() => {
    if (productSlug) {
      track("product_enquiry_started", { product_slug: productSlug });
      fetch(`/api/product-context?slug=${encodeURIComponent(productSlug)}`)
        .then((r) => r.json())
        .then((data) => {
          if (data.name) {
            setProductContext(`Enquiry regarding: ${data.name}`);
            track("product_enquiry_loaded", { product_slug: productSlug });
          }
        })
        .catch(() => {
          // Graceful — no product context shown
        });
    }
  }, [productSlug]);

  const initialType = searchParams.get("type") || "";

  useEffect(() => {
    if (state.success) {
      track("enquiry_submitted", {
        type: initialType || "unknown",
        has_product: productContext ? "1" : "0",
      });
    }
  }, [state.success, productContext, initialType]);

  return (
    <main className="surface-footer">
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
            <p className="text-[0.9375rem] text-[rgba(236,227,206,0.55)]">
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
            <p className="text-[1.0625rem] leading-relaxed text-[rgba(236,227,206,0.70)] md:text-[1.125rem]">
              Tell us what you&apos;re looking for. We&apos;ll respond within two
              business days.
            </p>
          </Reveal>
        </div>
      </section>

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
            <div className="md:col-span-7">
              <Reveal as="div" delay={0}>
                {state.success ? (
                  <div className="border border-[rgba(212,190,145,0.30)] bg-[rgba(20,15,7,0.60)] p-10 backdrop-blur-sm">
                    <p className="text-[0.9375rem] text-[rgba(236,227,206,0.55)]">
                      Received
                    </p>
                    <h2 className="mt-4 font-display text-2xl italic leading-tight text-[var(--ivory)]">
                      Thank you.
                    </h2>
                    <p className="mt-4 text-[1rem] leading-relaxed text-[var(--ivory)]/75">
                      Your message has been sent. Treadville will be in touch within
                      two business days. For urgent enquiries, you can also reach
                      us directly at{" "}
                      <a
                        href="tel:+254722479985"
                        className="underline decoration-[rgba(212,190,145,0.40)] underline-offset-2 transition-colors hover:text-[var(--ivory)]"
                      >
                        +254 722 479985
                      </a>{" "}
                      or{" "}
                      <a
                        href="mailto:info@treadville.co.ke"
                        className="underline decoration-[rgba(212,190,145,0.40)] underline-offset-2 transition-colors hover:text-[var(--ivory)]"
                      >
                        info@treadville.co.ke
                      </a>
                      .
                    </p>
                  </div>
                ) : (
                  <form action={formAction} className="space-y-7">
                    {productContext && (
                      <div className="rounded border border-[rgba(212,190,145,0.25)] bg-[rgba(20,15,7,0.40)] px-4 py-3 font-mono text-[11px] text-[rgba(212,190,145,0.70)]">
                        Enquiry regarding: <span className="text-[rgba(212,190,145,0.95)]">{productContext}</span>
                      </div>
                    )}
                    <p className="text-[0.9375rem] leading-relaxed text-[rgba(236,227,206,0.65)]">
                      Fields marked with <span className="text-[var(--accent-sage)]">*</span> are required.
                    </p>
                    {state.error && (
                      <div
                        role="alert"
                        className="border border-red-800/40 bg-red-950/40 px-4 py-3 font-mono text-xs text-red-300"
                      >
                        {state.error}
                      </div>
                    )}
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                      <Field label="Your name" htmlFor="name" required>
                        <input
                          id="name"
                          type="text"
                          name="name"
                          required
                          placeholder="Your full name"
                          className="field-dark"
                          autoComplete="name"
                        />
                      </Field>
                      <Field label="Work email" htmlFor="email" required>
                        <input
                          id="email"
                          type="email"
                          name="email"
                          required
                          placeholder="you@company.com"
                          className="field-dark"
                          autoComplete="email"
                        />
                      </Field>
                    </div>
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                      <Field label="Company" htmlFor="organisation" optional>
                        <input
                          id="organisation"
                          type="text"
                          name="organisation"
                          placeholder="Company or organisation"
                          className="field-dark"
                          autoComplete="organization"
                        />
                      </Field>
                      <Field label="Phone" htmlFor="phone" optional>
                        <input
                          id="phone"
                          type="tel"
                          name="phone"
                          placeholder="+254 ..."
                          className="field-dark"
                          autoComplete="tel"
                        />
                      </Field>
                    </div>
                    <Field label="What can we help you with?" htmlFor="type" required>
                      <select
                        id="type"
                        name="type"
                        required
                        className="field-dark cursor-pointer"
                        defaultValue={searchParams.get("type") ?? ""}
                      >
                        <option value="" disabled>
                          Select an option
                        </option>
                        {ENQUIRY_TYPES.map((t) => (
                          <option key={t} value={t}>
                            {t}
                          </option>
                        ))}
                      </select>
                    </Field>
                    {productContext && (
                      <input type="hidden" name="product_context" value={productContext} />
                    )}
                    <Field label="Message" htmlFor="message" required>
                      <textarea
                        id="message"
                        name="message"
                        required
                        rows={6}
                        placeholder="Tell us what you are looking for — product type, volume, destination, timeline..."
                        className="field-dark resize-none"
                      />
                    </Field>
                    <button
                      type="submit"
                      disabled={pending}
                      className="w-full border border-[var(--ivory)] bg-[var(--ivory)] px-8 py-4 text-[1rem] text-[var(--soil)] transition-colors hover:bg-transparent hover:text-[var(--ivory)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(212,190,145,0.50)] focus-visible:ring-offset-2 focus-visible:ring-offset-[#140f07] disabled:opacity-50"
                    >
                      {pending ? "Sending…" : "Send enquiry"}
                    </button>
                  </form>
                )}
              </Reveal>
            </div>

            <div className="md:col-span-4 md:col-start-9">
              <Reveal as="div" delay={1} className="space-y-10">
                <div>
                  <p className="text-[0.9375rem] text-[rgba(236,227,206,0.55)]">
                    Direct contact
                  </p>
                  <ul className="mt-3 space-y-2.5">
                    <li>
                      <a
                        href="mailto:info@treadville.co.ke"
                        className="block text-[1rem] text-[var(--ivory)] transition-colors hover:text-white"
                      >
                        info@treadville.co.ke
                      </a>
                    </li>
                    <li>
                      <a
                        href="tel:+254722479985"
                        className="block text-[1rem] text-[var(--ivory)] transition-colors hover:text-white"
                      >
                        +254 722 479985
                      </a>
                    </li>
                  </ul>
                </div>

                <div>
                  <p className="text-[0.9375rem] text-[rgba(236,227,206,0.55)]">
                    Location
                  </p>
                  <p className="mt-3 text-[1rem] text-[var(--ivory)]">
                    Nairobi, Kenya
                  </p>
                </div>

                <div>
                  <p className="text-[0.9375rem] text-[rgba(236,227,206,0.55)]">
                    Response time
                  </p>
                  <p className="mt-3 text-[1rem] leading-relaxed text-[var(--ivory)]">
                    Within two business days.
                  </p>
                </div>

                <div className="border-t border-[rgba(212,190,145,0.18)] pt-8">
                  <p className="text-[0.9375rem] text-[rgba(236,227,206,0.55)]">
                    Other ways to engage
                  </p>
                  <ul className="mt-3 space-y-2.5">
                    {[
                      { label: "Request a sample", href: "/contact?type=sample" },
                      { label: "Export enquiry", href: "/export" },
                      { label: "Browse catalogue", href: "/shop" },
                    ].map((link) => (
                      <li key={link.label}>
                        <a
                          href={link.href}
                          className="inline-flex items-center gap-2 text-[1rem] text-[var(--ivory)]/75 transition-colors hover:text-[var(--ivory)]"
                        >
                          <span aria-hidden className="h-px w-4 bg-[rgba(212,190,145,0.40)]" />
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
  htmlFor,
  required,
  optional,
  children,
}: {
  label: string;
  htmlFor: string;
  required?: boolean;
  optional?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={htmlFor} className="mb-2.5 block">
        <span className="text-[1rem] text-[rgba(236,227,206,0.85)]">
          {label}
          {optional && (
            <span className="ml-1.5 text-[0.875rem] text-[rgba(236,227,206,0.50)]">
              (optional)
            </span>
          )}
          {required && (
            <span className="ml-1.5 text-[var(--accent-sage)]" aria-hidden>
              *
            </span>
          )}
        </span>
      </label>
      {children}
    </div>
  );
}
