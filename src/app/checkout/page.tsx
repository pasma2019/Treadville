"use client";

import { useState } from "react";
import Link from "next/link";
import { useCart } from "@/components/CartContext";
import Reveal from "@/components/Reveal";
import CategoryMark from "@/components/CategoryMark";

export default function CheckoutPage() {
  const { lines, removeFromCart, clearCart } = useCart();
  const [submitted, setSubmitted] = useState(false);
  const totalItems = lines.reduce((sum, l) => sum + l.qty, 0);

  if (submitted) {
    return (
      <main className="surface-footer">
        <div className="mx-auto max-w-2xl px-6 py-32 text-center">
          <Reveal as="div" delay={0}>
            <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-[rgba(212,190,145,0.55)]">
              Received
            </p>
            <h1 className="mt-4 font-display text-3xl italic text-[var(--ivory)] md:text-5xl">
              Thank you.
            </h1>
            <p className="mt-4 text-sm leading-relaxed text-[rgba(236,227,206,0.65)]">
              Your enquiry has been received. We&apos;ll respond within two
              business days with a specification, pricing, and shipping options.
            </p>
            <Link
              href="/"
              className="mt-8 inline-flex items-center gap-3 border border-[var(--ivory)] px-8 py-3 font-mono text-[11px] uppercase tracking-[0.28em] text-[var(--ivory)] transition-colors hover:bg-[var(--ivory)] hover:text-[var(--soil)]"
            >
              Return home
            </Link>
          </Reveal>
        </div>
      </main>
    );
  }

  if (lines.length === 0) {
    return (
      <main className="surface-footer">
        <div className="mx-auto max-w-2xl px-6 py-32 text-center">
          <Reveal as="div" delay={0}>
            <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-[rgba(212,190,145,0.55)]">
              Enquiry
            </p>
            <h1 className="mt-4 font-display text-3xl italic text-[var(--ivory)] md:text-5xl">
              Your enquiry is empty
            </h1>
            <p className="mt-4 text-sm leading-relaxed text-[rgba(236,227,206,0.65)]">
              Add products to your enquiry to request a quotation.
            </p>
            <Link
              href="/shop"
              className="mt-8 inline-flex items-center gap-3 border border-[var(--ivory)] px-8 py-3 font-mono text-[11px] uppercase tracking-[0.28em] text-[var(--ivory)] transition-colors hover:bg-[var(--ivory)] hover:text-[var(--soil)]"
            >
              Browse catalogue
            </Link>
          </Reveal>
        </div>
      </main>
    );
  }

  return (
    <main className="surface-footer">
      <div className="mx-auto max-w-[var(--content-wide)] px-6 py-16 md:py-24">
        <Reveal as="div" delay={0}>
          <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-[rgba(212,190,145,0.55)]">
            Enquiry review
          </p>
          <h1 className="mt-4 max-w-[16ch] font-display text-4xl italic leading-[1.02] tracking-[-0.015em] text-[var(--ivory)] md:text-5xl">
            Review your request
          </h1>
        </Reveal>

        <div className="mt-12 grid grid-cols-1 gap-12 md:grid-cols-12 md:gap-10">
          <div className="md:col-span-7">
            <Reveal as="div" delay={0}>
              <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-[rgba(212,190,145,0.55)]">
                Products
              </p>
              <ul className="mt-5 divide-y divide-[rgba(212,190,145,0.18)]">
                {lines.map((line) => (
                  <li
                    key={line.product.id}
                    className="flex items-center gap-5 py-6"
                  >
                    <div className="stage-product-card relative h-24 w-20 flex-shrink-0 overflow-hidden">
                      {line.product.image_url ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={line.product.image_url}
                          alt={line.product.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center">
                          <CategoryMark slug="default" className="h-8 w-8 opacity-30" />
                        </div>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-display text-lg italic text-[var(--ivory)]">
                        {line.product.name}
                      </p>
                      <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.28em] text-[rgba(212,190,145,0.55)]">
                        Quantity · {line.qty}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeFromCart(line.product.id)}
                      className="font-mono text-[10px] uppercase tracking-[0.28em] text-[rgba(236,227,206,0.55)] transition-colors hover:text-[var(--ivory)]"
                    >
                      Remove
                    </button>
                  </li>
                ))}
              </ul>

              <div className="mt-8 border-t border-[rgba(212,190,145,0.20)] pt-6">
                <div className="flex items-baseline justify-between">
                  <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-[rgba(212,190,145,0.55)]">
                    Total items
                  </p>
                  <p className="font-display text-2xl italic text-[var(--ivory)]">
                    {totalItems}
                  </p>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-[rgba(236,227,206,0.65)]">
                  Pricing is provided by Treadville after enquiry review. Our
                  team will respond with a specification, quote, and shipping
                  estimate.
                </p>
              </div>
            </Reveal>
          </div>

          <div className="md:col-span-5">
            <Reveal as="div" delay={1}>
              <div className="border border-[rgba(212,190,145,0.18)] bg-[rgba(20,15,7,0.55)] p-7 backdrop-blur-sm">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    clearCart();
                    setSubmitted(true);
                  }}
                  className="space-y-5"
                  noValidate
                >
                  <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-[rgba(212,190,145,0.55)]">
                    Your details
                  </p>
                  <input
                    type="text"
                    required
                    placeholder="Full name"
                    className="field-dark"
                    autoComplete="name"
                  />
                  <input
                    type="email"
                    required
                    placeholder="Email address"
                    className="field-dark"
                    autoComplete="email"
                  />
                  <input
                    type="tel"
                    placeholder="Phone (optional)"
                    className="field-dark"
                    autoComplete="tel"
                  />
                  <textarea
                    rows={3}
                    placeholder="Notes — destination, timeline, sample request…"
                    className="field-dark resize-none"
                  />
                  <button
                    type="submit"
                    className="w-full border border-[var(--ivory)] bg-[var(--ivory)] px-8 py-3.5 font-mono text-[11px] uppercase tracking-[0.28em] text-[var(--soil)] transition-colors hover:bg-transparent hover:text-[var(--ivory)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(212,190,145,0.50)] focus-visible:ring-offset-2 focus-visible:ring-offset-[#140f07]"
                  >
                    Send enquiry
                  </button>
                  <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-[rgba(212,190,145,0.55)]">
                    Prototype · No payment is processed
                  </p>
                </form>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </main>
  );
}
