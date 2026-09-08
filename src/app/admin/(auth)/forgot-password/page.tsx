"use client";

import { useState } from "react";
import Link from "next/link";
import { getClient } from "@/lib/supabase/client";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "loading" | "sent">("idle");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setState("loading");
    setError(null);

    const supabase = getClient();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabase.auth as any).resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/admin/reset-password`,
    });

    if (error) {
      setError("If an account exists for this email, a reset link will be sent.");
      setState("idle");
    } else {
      setState("sent");
    }
  };

  return (
    <div className="w-full max-w-sm">
      <div className="text-center mb-12">
        <p className="font-display text-xl font-semibold uppercase tracking-[0.12em] text-[var(--ivory)]">
          Treadville
        </p>
        <p className="mt-1 font-mono text-[9px] uppercase tracking-[0.32em] text-[var(--ink-muted)]">
          Admin · Password reset
        </p>
      </div>

      <div className="border border-[rgba(212,190,145,0.15)] bg-[rgba(20,15,7,0.80)] p-8 backdrop-blur-sm">
        <h1 className="font-display text-2xl italic text-[var(--ivory)]">
          Reset your password
        </h1>
        <p className="mt-2 text-[0.9375rem] text-[var(--ivory)]/55">
          Enter your email and we will send a secure reset link.
        </p>

        {state === "sent" ? (
          <div className="mt-8 border border-[rgba(212,190,145,0.20)] bg-[rgba(212,190,145,0.05)] p-5">
            <p className="text-[1rem] text-[var(--ivory)]">
              Check your inbox.
            </p>
            <p className="mt-2 text-[0.9375rem] text-[var(--ivory)]/65">
              A reset link has been sent to <span className="text-[var(--accent)]">{email}</span>. The link expires in 1 hour.
            </p>
            <Link
              href="/admin/login"
              className="mt-6 inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--accent)] transition-colors hover:text-[var(--ivory)]"
            >
              <span aria-hidden className="h-px w-5 bg-current" />
              Back to sign in
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} noValidate className="mt-8 space-y-5">
            <div>
              <label htmlFor="email" className="block mb-2.5">
                <span className="text-[1rem] text-[var(--ivory)]/80">
                  Email address
                </span>
              </label>
              <input
                id="email"
                type="email"
                name="email"
                autoComplete="email"
                required
                placeholder="you@treadville.co.ke"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={state === "loading"}
                className="field-dark w-full"
              />
            </div>

            {error && (
              <div role="alert" className="font-mono text-[12px] text-[var(--ivory)]/65">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={state === "loading" || !email}
              className="w-full border border-[var(--ivory)] bg-[var(--ivory)] px-6 py-3.5 text-[15px] tracking-[0.16em] text-[var(--soil)] transition-colors hover:bg-transparent hover:text-[var(--ivory)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(212,190,145,0.50)] focus-visible:ring-offset-2 focus-visible:ring-offset-[#140f07] disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {state === "loading" ? "Sending…" : "Send reset link"}
            </button>

            <Link
              href="/admin/login"
              className="block text-center font-mono text-[10px] uppercase tracking-[0.20em] text-[var(--ink-muted)] transition-colors hover:text-[var(--ivory)]"
            >
              Back to sign in
            </Link>
          </form>
        )}
      </div>
    </div>
  );
}
