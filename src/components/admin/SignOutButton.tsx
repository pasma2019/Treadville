"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { getClient } from "@/lib/supabase/client";

export default function SignOutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSignOut = async () => {
    setLoading(true);
    const supabase = getClient();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (supabase.auth as any).signOut();
    router.push("/admin/login");
    router.refresh();
  };

  return (
    <button
      type="button"
      onClick={handleSignOut}
      disabled={loading}
      className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.20em] text-[var(--ink-muted)] transition-colors hover:text-red-700 disabled:opacity-40"
    >
      <span aria-hidden className="h-px w-5 bg-current" />
      {loading ? "Signing out…" : "Sign out"}
    </button>
  );
}
