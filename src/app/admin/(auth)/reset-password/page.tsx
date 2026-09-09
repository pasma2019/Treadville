"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getClient } from "@/lib/supabase/client";
import AdminAuthShell from "@/components/admin/AdminAuthShell";

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
    <AdminAuthShell
      script="Admin"
      title="Set a new password"
      description="Choose a new password for your admin account."
    >
      <form onSubmit={handleSubmit} noValidate className="space-y-5">
        <div>
          <label htmlFor="password" className="block mb-2.5">
            <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-[var(--ivory)]/70">
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
            className="field-dark rounded-md"
          />
        </div>

        <div>
          <label htmlFor="confirm" className="block mb-2.5">
            <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-[var(--ivory)]/70">
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
            className="field-dark rounded-md"
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
          className="btn-admin w-full"
        >
          {state === "loading" ? "Saving…" : "Update password"}
        </button>

        <Link
          href="/admin/login"
          className="block text-center font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--ivory)]/45 transition-colors hover:text-[var(--ivory)]"
        >
          Back to sign in
        </Link>
      </form>
    </AdminAuthShell>
  );
}