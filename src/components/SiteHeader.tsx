"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShoppingBag, Menu, X } from "lucide-react";
import { useCart } from "./CartContext";
import { useLanguage } from "@/i18n/LanguageProvider";
import LanguageSelector from "./LanguageSelector";
import type { Category } from "@/lib/types";

const IA_LINKS = [
  { key: "origins", href: "/origins" },
  { key: "quality", href: "/quality" },
  { key: "export", href: "/export" },
  { key: "about", href: "/about" },
  { key: "journal", href: "/journal" },
  { key: "contact", href: "/contact" },
] as const;

export default function SiteHeader({ categories }: { categories: Category[] }) {
  const { openCart, count } = useCart();
  const { t } = useLanguage();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const hamburgerRef = useRef<HTMLButtonElement>(null);
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
      if (e.key === "Escape" && menuOpen) {
        e.preventDefault();
        setMenuOpen(false);
      }
    };
    if (menuOpen) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
      const timer = setTimeout(() => firstLinkRef.current?.focus(), 60);
      return () => {
        clearTimeout(timer);
        document.removeEventListener("keydown", handleKeyDown);
        document.body.style.overflow = "";
      };
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  const handleMenuClose = () => {
    setMenuOpen(false);
    hamburgerRef.current?.focus();
  };

  const isActive = (href: string) =>
    pathname === href || (href !== "/" && pathname.startsWith(href));

  const navLink = (href: string, label: string) => {
    const active = isActive(href);
    return (
      <Link
        key={href}
        href={href}
        aria-current={active ? "page" : undefined}
        className={`group relative text-[11px] font-medium uppercase tracking-[0.20em] transition-colors duration-[var(--dur-fast)] focus-visible:outline-none ${
          active
            ? "text-[var(--parchment)]"
            : "text-[var(--parchment)]/72 hover:text-[var(--parchment)] focus-visible:text-[var(--parchment)]"
        }`}
      >
        {label}
        <span
          aria-hidden
          className={`absolute inset-x-0 -bottom-1.5 h-px origin-left bg-[var(--accent)] transition-transform duration-[var(--dur)] ease-[var(--ease-out)] ${
            active
              ? "scale-x-100"
              : "scale-x-0 group-hover:scale-x-100 group-focus-visible:scale-x-100"
          }`}
        />
      </Link>
    );
  };

  return (
    <header
      className={`sticky top-0 z-40 transition-[background-color,border-color,box-shadow] duration-300 ease-[var(--ease-out)] ${
        scrolled
          ? "site-nav backdrop-blur-[var(--glass-cinema-blur)]"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <div
        className={`mx-auto flex items-center justify-between gap-6 px-6 transition-[height] duration-300 ease-[var(--ease-out)] ${
          scrolled ? "h-[56px]" : "h-[68px]"
        }`}
        style={{ maxWidth: "min(1280px, calc(100% - 32px))" }}
      >
        <Link
          href="/"
          className="group flex shrink-0 items-center gap-3"
          onClick={handleMenuClose}
        >
          <span className="font-display text-[1.4rem] font-semibold uppercase leading-none tracking-[0.16em] text-[var(--parchment)] transition-colors duration-[var(--dur-fast)] group-hover:text-white">
            Treadville
          </span>
          <span
            aria-hidden
            className="hidden h-4 w-px bg-[var(--parchment)]/20 md:block"
          />
          <span className="hidden font-mono text-[9px] uppercase tracking-[0.4em] text-[var(--parchment)]/50 md:block">
            Kenya
          </span>
        </Link>

        <nav
          aria-label="Main navigation"
          className="hidden items-center justify-center gap-7 lg:flex lg:gap-8"
        >
          {navLink("/shop", t.nav.shop)}
          {categories.map((cat) => {
            const label = (t.nav as Record<string, string>)[cat.slug] ?? cat.name;
            return navLink(`/shop/${cat.slug}`, label);
          })}
          <span
            aria-hidden
            className="h-3 w-px bg-[var(--parchment)]/15"
          />
          {IA_LINKS.map(({ key, href }) =>
            navLink(href, (t.nav as Record<string, string>)[key] ?? key)
          )}
        </nav>

        <div className="flex shrink-0 items-center gap-3 lg:gap-5">
          <LanguageSelector className="hidden md:flex" />
          <span aria-hidden className="hidden h-3 w-px bg-[var(--parchment)]/15 md:block" />
          <button
            onClick={openCart}
            aria-label={`Open enquiry cart (${count} items)`}
            className="group flex items-center gap-2 px-1 text-[var(--parchment)]/72 transition-colors duration-[var(--dur-fast)] hover:text-[var(--parchment)] focus-visible:outline-none focus-visible:text-[var(--parchment)]"
          >
            <ShoppingBag size={16} />
            <span className="font-mono text-[10px] uppercase tracking-[0.20em] hidden lg:inline">
              {t.nav.shop === "Boutique" || t.nav.shop === "Sortiment" ? "Enquiry" : "Enquire"}
            </span>
            {count > 0 && (
              <span className="flex h-4 w-4 items-center justify-center rounded-full bg-[var(--accent)] text-[9px] leading-none text-[var(--soil)]">
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
            className="flex items-center gap-2 px-1 text-[var(--parchment)]/72 transition-colors duration-[var(--dur-fast)] hover:text-[var(--parchment)] focus-visible:outline-none focus-visible:text-[var(--parchment)] lg:hidden"
          >
            {menuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      <div
        ref={menuRef}
        id="site-mobile-menu"
        aria-hidden={!menuOpen}
        className={`fixed inset-0 top-[var(--site-header-h)] z-30 flex flex-col overflow-y-auto bg-[var(--soil-muted)]/[0.97] backdrop-blur-xl transition-opacity duration-300 ease-out lg:hidden ${
          menuOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      >
        <nav
          aria-label="Mobile navigation"
          className="flex flex-col gap-0 px-8 py-8"
        >
          <p className="mb-4 mt-2 font-mono text-[10px] uppercase tracking-[0.4em] text-[var(--parchment)]/40">
            {t.footer.catalogue}
          </p>
          <Link
            ref={firstLinkRef}
            href="/shop"
            onClick={handleMenuClose}
            aria-current={isActive("/shop") ? "page" : undefined}
            className="group flex items-center justify-between border-b border-[rgba(212,190,145,0.12)] py-4 font-display text-2xl italic tracking-[-0.01em] text-[var(--parchment)] transition-colors hover:text-[var(--accent)] focus-visible:outline-none focus-visible:text-[var(--accent)]"
          >
            {t.nav.shopAll}
            <span
              aria-hidden
              className="h-px w-6 bg-[var(--parchment)]/30 transition-all duration-300 group-hover:w-10 group-hover:bg-[var(--accent)]"
            />
          </Link>
          {categories.map((cat) => {
            const label = (t.nav as Record<string, string>)[cat.slug] ?? cat.name;
            return (
              <Link
                key={cat.id}
                href={`/shop/${cat.slug}`}
                onClick={handleMenuClose}
                aria-current={isActive(`/shop/${cat.slug}`) ? "page" : undefined}
                className="group flex items-center justify-between border-b border-[rgba(212,190,145,0.12)] py-4 font-display text-2xl italic tracking-[-0.01em] text-[var(--parchment)] transition-colors hover:text-[var(--accent)] focus-visible:outline-none focus-visible:text-[var(--accent)]"
              >
                {label}
                <span
                  aria-hidden
                  className="h-px w-4 bg-[var(--parchment)]/30 transition-all duration-300 group-hover:w-8 group-hover:bg-[var(--accent)]"
                />
              </Link>
            );
          })}

          <p className="mb-4 mt-8 font-mono text-[10px] uppercase tracking-[0.4em] text-[var(--parchment)]/40">
            {t.footer.company}
          </p>
          {IA_LINKS.map(({ key, href }) => {
            const label = (t.nav as Record<string, string>)[key] ?? key;
            return (
              <Link
                key={href}
                href={href}
                onClick={handleMenuClose}
                aria-current={isActive(href) ? "page" : undefined}
                className="group flex items-center justify-between border-b border-[rgba(212,190,145,0.12)] py-4 font-mono text-sm uppercase tracking-[0.24em] text-[var(--parchment)]/75 transition-colors hover:text-[var(--parchment)] focus-visible:outline-none focus-visible:text-[var(--parchment)]"
              >
                {label}
                <span
                  aria-hidden
                  className="h-px w-4 bg-[var(--parchment)]/30 transition-all duration-300 group-hover:w-8 group-hover:bg-[var(--accent)]"
                />
              </Link>
            );
          })}

          <div className="mt-8 flex items-center gap-4">
            <LanguageSelector />
          </div>
        </nav>

        <div className="mt-auto border-t border-[var(--parchment)]/10 px-8 py-6">
          <p className="font-mono text-[10px] uppercase tracking-[0.35em] text-[var(--parchment)]/40">
            Volcanic Highlands · Kenya
          </p>
        </div>
      </div>
    </header>
  );
}
