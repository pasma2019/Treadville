"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function AdminNavLink({ href, label }: { href: string; label: string }) {
  const pathname = usePathname();
  const active = href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);
  return (
    <Link
      href={href}
      className={`group flex items-center gap-3 border-l-2 px-3 py-2 font-mono text-[11px] uppercase tracking-[0.20em] transition-all duration-[var(--dur-fast)] ${
        active
          ? "border-[var(--accent)] bg-[var(--champagne)]/[0.12] text-[var(--ink)]"
          : "border-transparent text-[var(--ink-muted)] hover:border-[var(--champagne)] hover:text-[var(--ink)]"
      }`}
    >
      <span className="h-px w-4 flex-shrink-0 bg-current opacity-30 transition-all duration-300 group-hover:w-6 group-hover:opacity-60" />
      {label}
    </Link>
  );
}
