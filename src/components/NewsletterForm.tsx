"use client";

import { useState } from "react";

export default function NewsletterForm() {
  const [submitted, setSubmitted] = useState(false);

  return (
    <form
      className="mt-4 flex flex-col gap-3"
      onSubmit={(e) => {
        e.preventDefault();
        setSubmitted(true);
      }}
      aria-label="Newsletter signup (prototype — not functional)"
    >
      <label htmlFor="footer-email" className="sr-only">
        Email address
      </label>
      {submitted ? (
        <p
          className="font-mono text-[10px] uppercase tracking-[0.3em] text-[rgba(212,190,145,0.70)]"
          role="status"
        >
          Thank you — this is a demo.
        </p>
      ) : (
        <>
          <input
            id="footer-email"
            type="email"
            name="email"
            placeholder="your@email.com"
            className="field-dark"
            autoComplete="email"
            aria-describedby="footer-newsletter-note"
          />
          <button
            type="submit"
            className="w-full border border-[var(--ivory)] bg-[var(--ivory)] px-6 py-2.5 font-mono text-[10px] uppercase tracking-[0.28em] text-[var(--soil)] transition-colors hover:bg-transparent hover:text-[var(--ivory)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(212,190,145,0.50)] focus-visible:ring-offset-2 focus-visible:ring-offset-[#140f07]"
          >
            Subscribe
          </button>
        </>
      )}
      <p
        id="footer-newsletter-note"
        className="font-mono text-[8px] uppercase tracking-[0.3em] text-[rgba(236,227,206,0.35)]"
      >
        TODO: Wire to Supabase / CRM. Currently non-functional.
      </p>
    </form>
  );
}