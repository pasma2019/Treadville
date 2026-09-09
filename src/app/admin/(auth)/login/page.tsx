"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { getClient } from "@/lib/supabase/client";
import AdminAuthShell from "@/components/admin/AdminAuthShell";

type State = "idle" | "loading" | "error";

function LoginForm() {
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

      <div>
        <div className="mb-2.5 flex items-center justify-between gap-4">
          <label htmlFor="password" className="block">
            <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-[var(--ivory)]/70">
              Password
            </span>
          </label>
          <Link
            href="/admin/forgot-password"
            className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--gold-light)]/70 transition-colors hover:text-[var(--gold-light)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--gold-light)] focus-visible:ring-offset-2 focus-visible:ring-offset-[#140f07]"
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
          className="field-dark rounded-md"
        />
      </div>

      <div className="flex items-center justify-between">
        <label className="flex cursor-pointer items-center gap-2.5">
          <input
            type="checkbox"
            name="remember"
            className="h-4 w-4 rounded-sm border border-[var(--gold-light)]/30 bg-transparent accent-[var(--gold-light)]"
          />
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--ivory)]/60">
            Remember me
          </span>
        </label>
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
        className="btn-admin w-full"
      >
        {state === "loading" ? "Signing in…" : "Sign in to Operations"}
      </button>
    </form>
  );
}

export default function AdminLoginPage() {
  return (
    <AdminAuthShell
      script="Admin"
      title="Welcome back"
      description="Sign in to continue to Treadville Operations."
    >
      <Suspense
        fallback={
          <div className="space-y-5">
            <div className="block h-[110px] w-full animate-pulse rounded-md bg-[rgba(212,190,145,0.06)]" />
            <div className="block h-[46px] w-full animate-pulse rounded-[10px] bg-[rgba(212,190,145,0.10)]" />
          </div>
        }
      >
        <LoginForm />
      </Suspense>
    </AdminAuthShell>
  );
}