"use client";

import { useEffect, useMemo, useActionState } from "react";
import Link from "next/link";
import { useCart } from "@/components/CartContext";
import Reveal from "@/components/Reveal";
import CategoryMark from "@/components/CategoryMark";
import { submitOrderAction, type OrderFormState } from "@/lib/order-actions";

const initialState: OrderFormState = {};

export default function CheckoutPage() {
  const { lines, removeFromCart, clearCart } = useCart();
  const [state, formAction, pending] = useActionState(submitOrderAction, initialState);
  const totalItems = lines.reduce((sum, l) => sum + l.qty, 0);

  const itemsJson = useMemo(
    () =>
      JSON.stringify(lines.map((l) => ({ product_id: l.product.id, quantity: l.qty }))),
    [lines]
  );

  useEffect(() => {
    if (state.success) clearCart();
  }, [state.success, clearCart]);

  if (state.success) {
    return (
      <main className="surface-base">
        <div className="mx-auto max-w-2xl px-6 py-32 text-center">
          <Reveal as="div" delay={0}>
            <p className="font-mono text-[10px] uppercase eyebrow-gold">
              Received
            </p>
            <h1 className="mt-4 font-display text-3xl italic text-[var(--ink)] md:text-5xl">
              Thank you.
            </h1>
            <p className="mt-4 text-sm leading-relaxed text-[var(--ink-soft)]">
              Your enquiry has been received. We&apos;ll respond within two
              business days with a specification, pricing, and shipping options.
            </p>
            {state.referenceNumber && (
              <p className="mt-6 font-mono text-xs uppercase tracking-[0.28em] text-[var(--gold-deep)]">
                Reference · {state.referenceNumber}
              </p>
            )}
            <Link
              href="/"
              className="btn-cta mt-8"
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
      <main className="surface-base">
        <div className="mx-auto max-w-2xl px-6 py-32 text-center">
          <Reveal as="div" delay={0}>
            <p className="font-mono text-[10px] uppercase eyebrow-gold">
              Enquiry
            </p>
            <h1 className="mt-4 font-display text-3xl italic text-[var(--ink)] md:text-5xl">
              Your enquiry is empty
            </h1>
            <p className="mt-4 text-sm leading-relaxed text-[var(--ink-soft)]">
              Add products to your enquiry to request a quotation.
            </p>
            <Link
              href="/shop"
              className="btn-cta mt-8"
            >
              Browse catalogue
            </Link>
          </Reveal>
        </div>
      </main>
    );
  }

  return (
    <main className="surface-base">
      <div className="mx-auto max-w-[var(--content-wide)] px-6 pt-28 pb-16 md:pt-32 md:pb-24">
        <Reveal as="div" delay={0}>
          <p className="font-mono text-[10px] uppercase eyebrow-gold">
            Enquiry review
          </p>
          <h1 className="mt-4 max-w-[16ch] font-display text-4xl italic leading-[1.02] tracking-[-0.015em] text-[var(--ink)] md:text-5xl">
            Review your request
          </h1>
        </Reveal>

        <div className="mt-12 grid grid-cols-1 gap-12 md:grid-cols-12 md:gap-10">
          <div className="md:col-span-7">
            <Reveal as="div" delay={0}>
              <p className="font-mono text-[10px] uppercase eyebrow-gold">
                Products
              </p>
              <ul className="mt-5 divide-y divide-[rgba(184,134,11,0.15)]">
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
                      <p className="truncate font-display text-lg italic text-[var(--ink)]">
                        {line.product.name}
                      </p>
                      <p className="mt-1 font-mono text-[10px] uppercase eyebrow-gold">
                        Quantity · {line.qty}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeFromCart(line.product.id)}
                      className="font-mono text-[10px] uppercase tracking-[0.28em] text-[var(--ink-faint)] transition-colors hover:text-[var(--gold-deep)]"
                    >
                      Remove
                    </button>
                  </li>
                ))}
              </ul>

              <div className="mt-8 border-t border-[rgba(184,134,11,0.20)] pt-6">
                <div className="flex items-baseline justify-between">
                  <p className="font-mono text-[10px] uppercase eyebrow-gold">
                    Total items
                  </p>
                  <p className="font-display text-2xl italic text-[var(--ink)]">
                    {totalItems}
                  </p>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-[var(--ink-soft)]">
                  Pricing is provided by Treadville after enquiry review. Our
                  team will respond with a specification, quote, and shipping
                  estimate.
                </p>
              </div>
            </Reveal>
          </div>

          <div className="md:col-span-5">
            <Reveal as="div" delay={1}>
              <div className="glass-card">
                <form
                  action={formAction}
                  className="space-y-5"
                  noValidate
                >
                  <p className="font-mono text-[10px] uppercase eyebrow-gold">
                    Your details
                  </p>
                  <input
                    type="text"
                    name="full_name"
                    required
                    placeholder="Full name"
                    className="field-light"
                    autoComplete="name"
                  />
                  <input
                    type="email"
                    name="email"
                    required
                    placeholder="Email address"
                    className="field-light"
                    autoComplete="email"
                  />
                  <input
                    type="tel"
                    name="phone"
                    required
                    placeholder="Phone number"
                    className="field-light"
                    autoComplete="tel"
                  />
                  <textarea
                    name="customer_notes"
                    rows={3}
                    placeholder="Notes — destination, timeline, sample request…"
                    className="field-light resize-none"
                  />
                  {state.error && (
                    <div
                      role="alert"
                      className="border border-red-300 bg-red-50 px-4 py-3 font-mono text-xs text-red-700"
                    >
                      {state.error}
                    </div>
                  )}
                  <input type="hidden" name="items" value={itemsJson} />
                  <button
                    type="submit"
                    disabled={pending}
                    className="btn-cta w-full disabled:opacity-50"
                  >
                    {pending ? "Sending…" : "Send enquiry"}
                  </button>
                  <p className="font-mono text-[10px] uppercase text-[var(--gold-deep)]">
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
