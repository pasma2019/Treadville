"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { getClient } from "@/lib/supabase/client";

type State = "idle" | "loading" | "error";

export default function AdminLoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") ?? "/admin";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [state, setState] = useState<State>("idle");
  const [message, setMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;

    setState("loading");
    setMessage(null);

    const supabase = getClient();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabase.auth as any).signInWithPassword({ email, password });

    if (error) {
      setState("error");
      setMessage("Unable to sign in. Please check your email and password.");
    } else {
      router.push(next);
      router.refresh();
    }
  };

  return (
    <div className="w-full max-w-sm">
      {/* Logo / wordmark */}
      <div className="text-center mb-12">
        <p className="font-display text-xl font-semibold uppercase tracking-[0.12em] text-[var(--ivory)]">
          Treadville
        </p>
        <p className="mt-1 font-mono text-[9px] uppercase tracking-[0.32em] text-[var(--ink-muted)]">
          Admin
        </p>
      </div>

      {/* Card */}
      <div className="border border-[rgba(212,190,145,0.15)] bg-[rgba(20,15,7,0.80)] p-8 backdrop-blur-sm">
        <h1 className="font-display text-2xl italic text-[var(--ivory)]">
          Sign in
        </h1>
        <p className="mt-2 text-[0.9375rem] text-[var(--ivory)]/55">
          Access the Treadville admin panel.
        </p>

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

          <div>
            <div className="flex items-end justify-between mb-2.5">
              <label htmlFor="password" className="block">
                <span className="text-[1rem] text-[var(--ivory)]/80">
                  Password
                </span>
              </label>
              <Link
                href="/admin/forgot-password"
                className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--accent)]/70 transition-colors hover:text-[var(--accent)]"
              >
                Forgot password?
              </Link>
            </div>
            <input
              id="password"
              type="password"
              name="password"
              autoComplete="current-password"
              required
              placeholder="Your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={state === "loading"}
              className="field-dark w-full"
            />
          </div>

          {message && (
            <div
              role="alert"
              className="border border-red-800/40 bg-red-950/40 px-4 py-3 font-mono text-[12px] text-red-300"
            >
              {message}
            </div>
          )}

          <button
            type="submit"
            disabled={state === "loading" || !email || !password}
            className="w-full border border-[var(--ivory)] bg-[var(--ivory)] px-6 py-3.5 text-[15px] tracking-[0.16em] text-[var(--soil)] transition-colors hover:bg-transparent hover:text-[var(--ivory)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(212,190,145,0.50)] focus-visible:ring-offset-2 focus-visible:ring-offset-[#140f07] disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {state === "loading" ? "Signing in…" : "Sign in"}
          </button>
        </form>
      </div>

      {/* Footer */}
      <p className="mt-6 text-center font-mono text-[10px] uppercase tracking-[0.20em] text-[var(--ink-muted)]">
        <Link href="/" className="hover:text-[var(--accent)] transition-colors">
          Back to storefront
        </Link>
      </p>
    </div>
  );
}
