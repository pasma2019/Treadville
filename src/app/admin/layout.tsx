"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_LINKS = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/categories", label: "Categories" },
  { href: "/admin/products", label: "Products" },
  { href: "/admin/content", label: "Content" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isActive = (href: string) =>
    href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);

  return (
    <div className="flex min-h-screen surface-warm">
      <aside className="w-60 shrink-0 border-r border-[var(--line-on-light)] bg-[var(--ivory)]">
        <div className="sticky top-0 flex h-screen flex-col px-6 py-8">
          <div>
            <Link href="/" className="group block">
              <p className="font-display text-base font-semibold uppercase tracking-[0.12em] text-[var(--ink)] transition-colors group-hover:text-[var(--accent)]">
                Treadville
              </p>
              <p className="mt-0.5 font-mono text-[9px] uppercase tracking-[0.32em] text-[var(--ink-muted)]">
                Admin · Prototype
              </p>
            </Link>
          </div>

          <nav aria-label="Admin navigation" className="mt-12 flex flex-col gap-1">
            {NAV_LINKS.map(({ href, label }) => {
              const active = isActive(href);
              return (
                <Link
                  key={href}
                  href={href}
                  className={`group flex items-center gap-3 border-l-2 px-3 py-2.5 font-mono text-[11px] uppercase tracking-[0.24em] transition-all duration-[var(--dur-fast)] ${
                    active
                      ? "border-[var(--accent)] bg-[var(--champagne)]/[0.12] text-[var(--ink)]"
                      : "border-transparent text-[var(--ink-muted)] hover:border-[var(--champagne)] hover:text-[var(--ink)]"
                  }`}
                >
                  <span className="h-px w-5 flex-shrink-0 bg-current opacity-30 transition-all duration-300 group-hover:w-7 group-hover:opacity-60" />
                  {label}
                </Link>
              );
            })}
          </nav>

          <div className="mt-auto">
            <div className="border-t border-[var(--line-on-light)] pt-6">
              <Link
                href="/"
                className="group inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.28em] text-[var(--ink-muted)] transition-colors hover:text-[var(--ink)]"
              >
                <span
                  aria-hidden
                  className="h-px w-5 bg-[var(--ink-muted)] transition-all duration-300 group-hover:w-7 group-hover:bg-[var(--accent)]"
                />
                Back to storefront
              </Link>
            </div>
            <p className="mt-4 font-mono text-[9px] uppercase tracking-[0.28em] text-[var(--ink-whisper)]">
              No authentication yet
            </p>
          </div>
        </div>
      </aside>

      <div className="flex-1 px-8 py-10 lg:px-12">{children}</div>
    </div>
  );
}
