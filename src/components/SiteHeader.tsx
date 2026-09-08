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
    const onScroll = () => setScrolled(window.scrollY > 24);
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
    <header
      className={`sticky top-0 z-40 transition-colors duration-300 ${
        scrolled
          ? "site-nav backdrop-blur-[var(--glass-cinema-blur)]"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <div
        className={`mx-auto flex h-[60px] items-center justify-between gap-6 px-6 md:h-[68px] md:px-10`}
        style={{ maxWidth: "min(1280px, calc(100% - 32px))" }}
      >
        {/* Logo */}
        <Link
          href="/"
          className="group flex shrink-0 items-center gap-3"
          onClick={handleMenuClose}
        >
          <span className="font-display text-[1.35rem] font-semibold tracking-[0.12em] text-[var(--ink)] transition-colors group-hover:text-[var(--accent)]">
            TREADVILLE
          </span>
        </Link>

        {/* Desktop nav */}
        <nav
          aria-label="Main navigation"
          className="hidden items-center gap-6 lg:flex"
        >
          {/* Shop dropdown */}
          <div ref={shopRef} className="relative">
            <button
              onClick={() => setShopOpen((v) => !v)}
              aria-expanded={shopOpen}
              aria-haspopup="true"
              aria-label="Shop categories"
              className={`flex items-center gap-1.5 rounded-sm text-[1rem] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-sage)] focus-visible:ring-offset-2 focus-visible:ring-offset-transparent ${
                isShopActive()
                  ? "text-[var(--ink)]"
                  : "text-[var(--ink-soft)] hover:text-[var(--ink)]"
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
                className="absolute left-0 top-full z-50 mt-2 min-w-[160px] border border-[var(--line-on-light)] bg-[var(--warm-white)] shadow-[var(--shadow-float-light)]"
                role="menu"
              >
                <Link
                  href="/shop"
                  onClick={() => setShopOpen(false)}
                  role="menuitem"
                  className="block rounded-sm border-b border-[var(--line-on-light)] px-5 py-3 text-[1rem] text-[var(--ink-soft)] transition-colors hover:bg-[var(--line-on-light)] hover:text-[var(--ink)] focus-visible:bg-[var(--line-on-light)] focus-visible:text-[var(--ink)] focus-visible:outline-none"
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
                      className="block rounded-sm px-5 py-3 text-[1rem] text-[var(--ink-soft)] transition-colors hover:bg-[var(--line-on-light)] hover:text-[var(--ink)] focus-visible:bg-[var(--line-on-light)] focus-visible:text-[var(--ink)] focus-visible:outline-none"
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
                className={`rounded-sm text-[1rem] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-sage)] focus-visible:ring-offset-2 focus-visible:ring-offset-transparent ${
                  active
                    ? "text-[var(--ink)]"
                    : "text-[var(--ink-soft)] hover:text-[var(--ink)]"
                }`}
              >
                {label}
              </Link>
            );
          })}
        </nav>

        {/* Right side */}
        <div className="flex shrink-0 items-center gap-3 lg:gap-5">
          <button
            onClick={openCart}
            aria-label={`Open enquiry cart (${count} items)`}
            className="flex items-center gap-2 rounded-sm text-[var(--ink-soft)] transition-colors hover:text-[var(--ink)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-sage)] focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
          >
            <ShoppingBag size={16} />
            {count > 0 && (
              <span className="flex h-4 w-4 items-center justify-center rounded-full bg-[var(--accent)] text-[9px] font-medium leading-none text-[var(--warm-white)]">
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
            className="flex items-center gap-2 rounded-sm text-[var(--ink-soft)] transition-colors hover:text-[var(--ink)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-sage)] focus-visible:ring-offset-2 focus-visible:ring-offset-transparent lg:hidden"
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
        className={`fixed inset-0 top-[60px] z-30 flex flex-col overflow-y-auto bg-[var(--warm-white)]/[0.97] backdrop-blur-xl transition-opacity duration-300 lg:hidden ${
          menuOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      >
        <nav aria-label="Mobile navigation" className="flex flex-col gap-0 px-8 py-8">
          {/* Shop section */}
          <div className="mb-2 mt-2">
            <Link
              ref={firstLinkRef}
              href="/shop"
              onClick={handleMenuClose}
              aria-current={isActive("/shop") ? "page" : undefined}
              className="mb-3 block rounded-sm text-[1.0625rem] font-medium text-[var(--ink)] transition-colors hover:text-[var(--accent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-sage)] focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
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
                  className="mb-1 block rounded-sm border-b border-[var(--line-on-light)] py-3 text-[1rem] text-[var(--ink-soft)] transition-colors hover:text-[var(--ink)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-sage)] focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
                >
                  {label}
                </Link>
              );
            })}
          </div>

          {/* IA section */}
          <div className="mb-2 mt-8">
            <p className="mb-3 text-[1.0625rem] font-medium text-[var(--ink)]">
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
                  className="mb-1 block rounded-sm border-b border-[var(--line-on-light)] py-3 text-[1rem] text-[var(--ink-soft)] transition-colors hover:text-[var(--ink)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-sage)] focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
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
