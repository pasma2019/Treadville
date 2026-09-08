"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import SignOutButton from "./SignOutButton";
import type { AdminRole } from "@/lib/types";

type Props = {
  role: AdminRole;
  email: string;
  displayName: string | null;
};

type NavLink = { href: string; label: string };
type NavSection = { label: string; links: NavLink[] };

const OWNER_NAV: NavSection[] = [
  { label: "Overview", links: [{ href: "/admin", label: "Dashboard" }] },
  {
    label: "Catalogue",
    links: [
      { href: "/admin/products", label: "Products" },
      { href: "/admin/categories", label: "Categories" },
    ],
  },
  { label: "Content", links: [{ href: "/admin/content", label: "Homepage" }] },
  { label: "Journal", links: [{ href: "/admin/journal", label: "Articles" }] },
  {
    label: "Business",
    links: [{ href: "/admin/enquiries", label: "Enquiries" }],
  },
  {
    label: "Settings",
    links: [{ href: "/admin/settings", label: "Account & Business" }],
  },
];

const SYSTEM_ADMIN_NAV: NavSection[] = [
  { label: "Overview", links: [{ href: "/admin", label: "Dashboard" }] },
  {
    label: "Catalogue",
    links: [
      { href: "/admin/products", label: "Products" },
      { href: "/admin/categories", label: "Categories" },
    ],
  },
  { label: "Content", links: [{ href: "/admin/content", label: "Homepage" }] },
  { label: "Journal", links: [{ href: "/admin/journal", label: "Articles" }] },
  {
    label: "Business",
    links: [{ href: "/admin/enquiries", label: "Enquiries" }],
  },
  {
    label: "System",
    links: [
      { href: "/admin/users", label: "Users" },
      { href: "/admin/integrations", label: "Integrations" },
      { href: "/admin/security", label: "Security" },
      { href: "/admin/activity", label: "Activity" },
    ],
  },
  {
    label: "Settings",
    links: [{ href: "/admin/settings", label: "Account & Business" }],
  },
];

function AdminNavLink({ href, label }: { href: string; label: string }) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      className={`block rounded px-3 py-2 font-mono text-[11px] uppercase tracking-[0.15em] transition-colors ${
        isActive
          ? "bg-[var(--ink)] text-[var(--warm-white)]"
          : "text-[var(--ink-muted)] hover:bg-[var(--champagne)]/20 hover:text-[var(--ink)]"
      }`}
    >
      {label}
    </Link>
  );
}

export default function AdminSidebar({ role, email, displayName }: Props) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const sections = role === "SYSTEM_ADMIN" ? SYSTEM_ADMIN_NAV : OWNER_NAV;

  return (
    <>
      <button
        onClick={() => setOpen(!open)}
        aria-label="Toggle navigation"
        aria-expanded={open}
        aria-controls="admin-nav"
        className="fixed bottom-6 right-6 z-50 flex h-12 w-12 items-center justify-center rounded-full border border-[var(--line-on-light)] bg-[var(--ivory)] shadow-md lg:hidden"
      >
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          {open ? (
            <path d="M4 4l12 12M16 4L4 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          ) : (
            <>
              <path d="M3 6h14M3 10h14M3 14h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </>
          )}
        </svg>
      </button>

      {open && (
        <div
          className="fixed inset-0 z-40 bg-[var(--ink)]/60 backdrop-blur-sm lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      <aside
        id="admin-nav"
        className={`fixed inset-y-0 left-0 z-50 w-64 shrink-0 overflow-y-auto border-r border-[var(--line-on-light)] bg-[var(--ivory)] transition-transform duration-300 lg:static lg:inset-auto lg:z-auto ${
          open ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="sticky top-0 flex h-screen flex-col px-6 py-8">
          <div>
            <Link
              href="/admin"
              className="group block"
              onClick={() => setOpen(false)}
            >
              <p className="font-display text-base font-semibold uppercase tracking-[0.12em] text-[var(--ink)] transition-colors group-hover:text-[var(--accent)]">
                Treadville
              </p>
              <p className="mt-0.5 font-mono text-[9px] uppercase tracking-[0.32em] text-[var(--ink-muted)]">
                Admin · {role === "SYSTEM_ADMIN" ? "System" : "Owner"}
              </p>
            </Link>
          </div>

          <nav aria-label="Admin navigation" className="mt-10 flex flex-col gap-6 pr-1">
            {sections.map((section) => (
              <div key={section.label}>
                <p className="mb-2 px-3 font-mono text-[9px] uppercase tracking-[0.28em] text-[var(--ink-faint)]">
                  {section.label}
                </p>
                <div className="flex flex-col gap-0.5">
                  {section.links.map(({ href, label }) => (
                    <div key={href} onClick={() => setOpen(false)}>
                      <AdminNavLink href={href} label={label} />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </nav>

          <div className="mt-auto pt-6">
            <div className="border-t border-[var(--line-on-light)] pt-6 space-y-3">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.20em] text-[var(--ink-muted)]">
                  Signed in as
                </p>
                <p className="mt-1 font-display text-sm italic text-[var(--ink)] truncate">
                  {displayName || email}
                </p>
                <p className="mt-0.5 font-mono text-[10px] tracking-[0.05em] text-[var(--ink-muted)] truncate">
                  {email}
                </p>
              </div>
              <SignOutButton />
              <Link
                href="/"
                className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.20em] text-[var(--ink-muted)] transition-colors hover:text-[var(--ink)]"
              >
                <span aria-hidden className="h-px w-5 bg-current" />
                Back to storefront
              </Link>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
