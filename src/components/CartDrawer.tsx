"use client";

import { useEffect, useRef } from "react";
import { X } from "lucide-react";
import { useCart } from "./CartContext";
import Link from "next/link";

export default function CartDrawer() {
  const { lines, isOpen, closeCart, removeFromCart, count, notice, dismissNotice } = useCart();
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLElement>(null);
  const wasOpen = useRef(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        e.preventDefault();
        closeCart();
      }
    };
    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
      wasOpen.current = true;
      const timer = setTimeout(() => closeButtonRef.current?.focus(), 60);
      return () => {
        clearTimeout(timer);
        document.removeEventListener("keydown", handleKeyDown);
        document.body.style.overflow = "";
      };
    }
    document.body.style.overflow = "";
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, closeCart]);

  return (
    <>
      <div
        className={`fixed inset-0 z-40 bg-black/50 transition-opacity duration-300 ease-out ${
          isOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={closeCart}
        aria-hidden
        role="presentation"
      />
      <aside
        ref={panelRef}
        className={`fixed right-0 top-0 z-50 flex h-full w-full max-w-sm flex-col border-l border-[var(--glass-border)] bg-[var(--warm-white)]/92 backdrop-blur-xl transition-transform duration-300 ease-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
        aria-label="Shopping cart"
        aria-hidden={!isOpen}
        onKeyDown={(e) => e.key === "Escape" && closeCart()}
      >
        <div className="flex items-center justify-between border-b border-[var(--glass-border)] px-6 py-6">
          <h2 className="font-display text-xl text-[var(--ink)]">Your order</h2>
          <button
            ref={closeButtonRef}
            onClick={closeCart}
            aria-label="Close cart"
            className="text-[var(--ink-soft)] transition-colors hover:text-[var(--gold-deep)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--gold)]"
          >
            <X size={20} />
          </button>
        </div>

        {notice && (
          <div
            role="status"
            className="flex items-start justify-between gap-3 border-b border-[var(--glass-border)] bg-[var(--sand)]/10 px-6 py-3"
          >
            <p className="text-xs leading-relaxed text-[var(--ink-muted)]">{notice}</p>
            <button
              onClick={dismissNotice}
              aria-label="Dismiss notice"
              className="shrink-0 font-mono text-[10px] uppercase tracking-wide text-[var(--ink-faint)] transition-colors hover:text-[var(--ink)]"
            >
              Dismiss
            </button>
          </div>
        )}

        {lines.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center px-6">
            <p className="max-w-[20rem] text-center text-sm leading-relaxed text-[var(--ink-muted)]">
              Nothing here yet — add a product to get started.
            </p>
          </div>
        ) : (
          <ul className="flex-1 space-y-0 overflow-y-auto px-6 py-2">
            {lines.map((line, idx) => (
              <li
                key={line.product.id}
                className={`flex items-start justify-between gap-3 py-4 ${
                  idx < lines.length - 1 ? "border-b border-[var(--line-on-light)]" : ""
                }`}
              >
                <div className="min-w-0">
                  <p className="font-display text-base leading-tight text-[var(--ink)]">{line.product.name}</p>
                  <p className="mt-1 font-mono text-xs text-[var(--gold-deep)]">
                    Quantity · {line.qty}
                  </p>
                </div>
                <button
                  onClick={() => removeFromCart(line.product.id)}
                  aria-label={`Remove ${line.product.name}`}
                  className="shrink-0 font-mono text-xs uppercase tracking-wide text-[var(--ink-faint)] transition-colors hover:text-[var(--gold-deep)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--gold)]"
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        )}

        <div className="border-t border-[var(--glass-border)] bg-[var(--warm-white)]/70 px-6 py-5">
          <div className="flex items-baseline justify-between">
            <span className="font-mono text-xs uppercase tracking-[0.28em] text-[var(--gold-deep)]">
              Items
            </span>
            <span className="font-display text-base text-[var(--ink)]">
              {count} {count === 1 ? "product" : "products"}
            </span>
          </div>
          <Link
            href="/checkout"
            onClick={closeCart}
            className="btn-cta mt-4 w-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--gold)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--warm-white)]"
          >
            Proceed to checkout
          </Link>
          <p className="mt-3 text-center text-[10px] uppercase tracking-widest text-[var(--ink-faint)]">
            Prototype checkout — no payment is processed.
          </p>
        </div>
      </aside>
    </>
  );
}