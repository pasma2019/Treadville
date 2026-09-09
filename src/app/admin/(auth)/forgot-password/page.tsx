"use client";

import { useState } from "react";
import Link from "next/link";
import { getClient } from "@/lib/supabase/client";
import AdminAuthShell from "@/components/admin/AdminAuthShell";

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
    <AdminAuthShell
      script="Admin"
      title="Reset your password"
      description="Enter your email and we will send a secure reset link."
    >
      {state === "sent" ? (
        <div className="border border-[rgba(212,190,145,0.20)] bg-[rgba(212,190,145,0.05)] p-5">
          <p className="text-[1rem] text-[var(--ivory)]">Check your inbox.</p>
          <p className="mt-2 text-[0.9375rem] leading-relaxed text-[var(--ivory)]/65">
            A reset link has been sent to{" "}
            <span className="text-[var(--gold-light)]">{email}</span>. The link
            expires in 1 hour.
          </p>
          <Link
            href="/admin/login"
            className="mt-6 inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--gold-light)] transition-colors hover:text-[var(--ivory)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--gold-light)] focus-visible:ring-offset-2 focus-visible:ring-offset-[#140f07]"
          >
            <span aria-hidden className="h-px w-5 bg-current" />
            Back to sign in
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit} noValidate className="space-y-5">
          <div>
            <label htmlFor="email" className="block mb-2.5">
              <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-[var(--ivory)]/70">
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
              className="field-dark rounded-md"
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
            className="btn-admin w-full"
          >
            {state === "loading" ? "Sending…" : "Send reset link"}
          </button>

          <Link
            href="/admin/login"
            className="block text-center font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--ivory)]/45 transition-colors hover:text-[var(--ivory)]"
          >
            Back to sign in
          </Link>
        </form>
      )}
    </AdminAuthShell>
  );
}