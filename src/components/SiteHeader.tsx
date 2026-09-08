"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShoppingBag, Menu, X, ChevronDown } from "lucide-react";
import { useCart } from "./CartContext";
import { useLanguage } from "@/i18n/LanguageProvider";
import LanguageSelector from "./LanguageSelector";
import type { Category } from "@/lib/types";

const IA_LINKS = [
  { key: "origins", href: "/origins" },
  { key: "quality", href: "/quality" },
  { key: "about", href: "/about" },
  { key: "journal", href: "/journal" },
  { key: "enquire", href: "/contact" },
] as const;

export default function SiteHeader({ categories }: { categories: Category[] }) {
  const { openCart, count } = useCart();
  const { t } = useLanguage();
  const [menuOpen, setMenuOpen] = useState(false);
  const [shopOpen, setShopOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const hamburgerRef = useRef<HTMLButtonElement>(null);
  const shopRef = useRef<HTMLDivElement>(null);
  const firstLinkRef = useRef<HTMLAnchorElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (shopOpen) { setShopOpen(false); return; }
        if (menuOpen) { setMenuOpen(false); }
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [menuOpen, shopOpen]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (shopRef.current && !shopRef.current.contains(e.target as Node)) {
        setShopOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
    setShopOpen(false);
  }, [pathname]);

  const handleMenuClose = () => {
    setMenuOpen(false);
    hamburgerRef.current?.focus();
  };

  const isActive = (href: string) =>
    pathname === href || (href !== "/" && pathname.startsWith(href));

  const isShopActive = () => pathname.startsWith("/shop");

  return (
    <header className="nav-shell">
      <div className={`nav-pill ${scrolled ? "is-scrolled" : ""}`}>
        {/* Logo */}
        <Link
          href="/"
          className="flex shrink-0 items-center"
          onClick={handleMenuClose}
        >
          <span className="nav-logo text-[1.25rem]">TREADVILLE</span>
        </Link>

        {/* Desktop nav */}
        <nav
          aria-label="Main navigation"
          className="nav-links hidden lg:flex"
        >
          {/* Shop dropdown */}
          <div ref={shopRef} className="relative">
            <button
              onClick={() => setShopOpen((v) => !v)}
              aria-expanded={shopOpen}
              aria-haspopup="true"
              aria-label="Shop categories"
              className={`nav-link flex items-center gap-1.5 ${
                isShopActive() ? "is-active" : ""
              }`}
            >
              Shop
              <ChevronDown
                size={13}
                className={`transition-transform duration-200 ${shopOpen ? "rotate-180" : ""}`}
              />
            </button>
            {shopOpen && (
              <div
                className="absolute left-0 top-full z-50 mt-3 min-w-[180px] overflow-hidden rounded-xl border border-[var(--glass-border)] bg-[var(--bg-elevated)]/90 shadow-[var(--shadow-elite)] backdrop-blur-xl"
                role="menu"
              >
                <Link
                  href="/shop"
                  onClick={() => setShopOpen(false)}
                  role="menuitem"
                  className="block px-5 py-3 text-[0.95rem] text-[var(--ink-soft)] transition-colors hover:bg-[rgba(184,134,11,0.08)] hover:text-[var(--gold-deep)] focus-visible:bg-[rgba(184,134,11,0.08)] focus-visible:text-[var(--gold-deep)] focus-visible:outline-none"
                >
                  View all products
                </Link>
                {categories.map((cat) => {
                  const label = (t.nav as Record<string, string>)[cat.slug] ?? cat.name;
                  return (
                    <Link
                      key={cat.id}
                      href={`/shop/${cat.slug}`}
                      onClick={() => setShopOpen(false)}
                      role="menuitem"
                      className="block px-5 py-3 text-[0.95rem] text-[var(--ink-soft)] transition-colors hover:bg-[rgba(184,134,11,0.08)] hover:text-[var(--gold-deep)] focus-visible:bg-[rgba(184,134,11,0.08)] focus-visible:text-[var(--gold-deep)] focus-visible:outline-none"
                    >
                      {label}
                    </Link>
                  );
                })}
              </div>
            )}
          </div>

          {/* IA links */}
          {IA_LINKS.map(({ key, href }) => {
            const active = isActive(href);
            const label = (t.nav as Record<string, string>)[key] ?? key;
            return (
              <Link
                key={href}
                href={href}
                className={`nav-link ${active ? "is-active" : ""}`}
              >
                {label}
              </Link>
            );
          })}
        </nav>

        {/* Right side */}
        <div className="flex shrink-0 items-center gap-1.5 lg:gap-2">
          <button
            onClick={openCart}
            aria-label={`Open enquiry cart (${count} items)`}
            className="nav-icon-btn relative"
          >
            <ShoppingBag size={17} />
            {count > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-[var(--gold)] px-1 text-[9px] font-bold leading-none text-white">
                {count}
              </span>
            )}
          </button>
          <button
            ref={hamburgerRef}
            onClick={() => setMenuOpen((v) => !v)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            aria-controls="site-mobile-menu"
            className="nav-icon-btn lg:hidden"
          >
            {menuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        ref={menuRef}
        id="site-mobile-menu"
        aria-hidden={!menuOpen}
        inert={!menuOpen}
        className={`nav-mobile-panel lg:hidden ${menuOpen ? "is-open" : ""}`}
      >
        <nav aria-label="Mobile navigation" className="flex flex-col gap-0 px-8 py-24">
          {/* Shop section */}
          <div className="mb-2 mt-2">
            <Link
              ref={firstLinkRef}
              href="/shop"
              onClick={handleMenuClose}
              aria-current={isActive("/shop") ? "page" : undefined}
              className="mb-3 block rounded-sm text-[1.0625rem] font-medium text-[var(--gold-deep)] transition-colors hover:text-[var(--ink)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--gold)] focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
            >
              Shop
            </Link>
            {categories.map((cat) => {
              const label = (t.nav as Record<string, string>)[cat.slug] ?? cat.name;
              return (
                <Link
                  key={cat.id}
                  href={`/shop/${cat.slug}`}
                  onClick={handleMenuClose}
                  aria-current={isActive(`/shop/${cat.slug}`) ? "page" : undefined}
                  className="mb-1 block rounded-sm border-b border-[var(--line-on-light)] py-3 text-[1rem] text-[var(--ink-soft)] transition-colors hover:text-[var(--gold-deep)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--gold)] focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
                >
                  {label}
                </Link>
              );
            })}
          </div>

          {/* IA section */}
          <div className="mb-2 mt-8">
            <p className="mb-3 text-[0.75rem] font-semibold uppercase tracking-[0.12em] text-[var(--gold-deep)]">
              Company
            </p>
            {IA_LINKS.map(({ key, href }) => {
              const label = (t.nav as Record<string, string>)[key] ?? key;
              return (
                <Link
                  key={href}
                  href={href}
                  onClick={handleMenuClose}
                  aria-current={isActive(href) ? "page" : undefined}
                  className="mb-1 block rounded-sm border-b border-[var(--line-on-light)] py-3 text-[1rem] text-[var(--ink-soft)] transition-colors hover:text-[var(--gold-deep)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--gold)] focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
                >
                  {label}
                </Link>
              );
            })}
          </div>

          <div className="mt-6">
            <LanguageSelector />
          </div>
        </nav>
      </div>
    </header>
  );
}
