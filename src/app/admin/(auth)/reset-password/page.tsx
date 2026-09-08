"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getClient } from "@/lib/supabase/client";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [state, setState] = useState<"idle" | "loading" | "error">("idle");
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    const supabase = getClient();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (supabase.auth as any).onAuthStateChange((event: string) => {
      if (event === "PASSWORD_RECOVERY") {
        // User is in recovery flow
      }
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 8) {
      setState("error");
      setMessage("Password must be at least 8 characters.");
      return;
    }
    if (password !== confirm) {
      setState("error");
      setMessage("Passwords do not match.");
      return;
    }
    setState("loading");
    setMessage(null);

    const supabase = getClient();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabase.auth as any).updateUser({ password });

    if (error) {
      setState("error");
      setMessage("Unable to reset password. The link may have expired.");
    } else {
      router.push("/admin/login");
    }
  };

  return (
    <div className="w-full max-w-sm">
      <div className="text-center mb-12">
        <p className="font-display text-xl font-semibold uppercase tracking-[0.12em] text-[var(--ivory)]">
          Treadville
        </p>
        <p className="mt-1 font-mono text-[9px] uppercase tracking-[0.32em] text-[var(--ink-muted)]">
          Admin · New password
        </p>
      </div>

      <div className="border border-[rgba(212,190,145,0.15)] bg-[rgba(20,15,7,0.80)] p-8 backdrop-blur-sm">
        <h1 className="font-display text-2xl italic text-[var(--ivory)]">
          Set a new password
        </h1>
        <p className="mt-2 text-[0.9375rem] text-[var(--ivory)]/55">
          Choose a new password for your admin account.
        </p>

        <form onSubmit={handleSubmit} noValidate className="mt-8 space-y-5">
          <div>
            <label htmlFor="password" className="block mb-2.5">
              <span className="text-[1rem] text-[var(--ivory)]/80">
                New password
              </span>
            </label>
            <input
              id="password"
              type="password"
              autoComplete="new-password"
              required
              placeholder="At least 8 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={state === "loading"}
              className="field-dark w-full"
            />
          </div>

          <div>
            <label htmlFor="confirm" className="block mb-2.5">
              <span className="text-[1rem] text-[var(--ivory)]/80">
                Confirm new password
              </span>
            </label>
            <input
              id="confirm"
              type="password"
              autoComplete="new-password"
              required
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              disabled={state === "loading"}
              className="field-dark w-full"
            />
          </div>

          {message && (
            <div role="alert" className="font-mono text-[12px] text-red-300">
              {message}
            </div>
          )}

          <button
            type="submit"
            disabled={state === "loading" || !password || !confirm}
            className="w-full border border-[var(--ivory)] bg-[var(--ivory)] px-6 py-3.5 text-[15px] tracking-[0.16em] text-[var(--soil)] transition-colors hover:bg-transparent hover:text-[var(--ivory)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(212,190,145,0.50)] focus-visible:ring-offset-2 focus-visible:ring-offset-[#140f07] disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {state === "loading" ? "Saving…" : "Update password"}
          </button>

          <Link
            href="/admin/login"
            className="block text-center font-mono text-[10px] uppercase tracking-[0.20em] text-[var(--ink-muted)] transition-colors hover:text-[var(--ivory)]"
          >
            Back to sign in
          </Link>
        </form>
      </div>
    </div>
  );
}
