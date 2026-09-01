"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShoppingBag, Menu, X } from "lucide-react";
import { useCart } from "./CartContext";
import type { Category } from "@/lib/types";

const IA_LINKS = [
  { href: "/origins", label: "Origins" },
  { href: "/quality", label: "Quality" },
  { href: "/export", label: "Export" },
  { href: "/about", label: "About" },
  { href: "/journal", label: "Journal" },
  { href: "/contact", label: "Contact" },
];

export default function SiteHeader({ categories }: { categories: Category[] }) {
  const { openCart, count } = useCart();
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
        className={`group relative text-sm font-medium tracking-[0.01em] transition-colors duration-[var(--dur-fast)] focus-visible:outline-none ${
          active
            ? "text-[var(--parchment)]"
            : "text-[var(--parchment)]/70 hover:text-[var(--parchment)] focus-visible:text-[var(--parchment)]"
        }`}
      >
        {label}
        <span
          aria-hidden
          className={`absolute inset-x-0 -bottom-1.5 h-px origin-left bg-[var(--accent)] transition-transform duration-[var(--dur)] ease-[var(--ease-out)] ${
            active ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100 group-focus-visible:scale-x-100"
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
      <div className="mx-auto flex h-[var(--site-header-h)] max-w-6xl items-center justify-between px-6">
        <Link href="/" className="group flex items-center gap-3" onClick={handleMenuClose}>
          <span className="font-display text-[1.4rem] font-semibold uppercase leading-none tracking-[0.14em] text-[var(--parchment)] transition-colors duration-[var(--dur-fast)] group-hover:text-white">
            Treadville
          </span>
          <span aria-hidden className="hidden h-4 w-px bg-[var(--parchment)]/20 sm:block" />
          <span className="hidden text-[9px] uppercase tracking-[0.4em] text-[var(--parchment)]/50 sm:block">
            Kenya
          </span>
        </Link>

        <nav
          aria-label="Main navigation"
          className="hidden items-center gap-7 xl:gap-8"
        >
          <Link
            href="/shop"
            aria-current={isActive("/shop") ? "page" : undefined}
            className={`group relative text-sm font-semibold tracking-[0.06em] uppercase transition-colors duration-[var(--dur-fast)] focus-visible:outline-none ${
              isActive("/shop")
                ? "text-[var(--parchment)]"
                : "text-[var(--parchment)]/80 hover:text-[var(--parchment)] focus-visible:text-[var(--parchment)]"
            }`}
          >
            Shop
            <span
              aria-hidden
              className={`absolute inset-x-0 -bottom-1.5 h-px origin-left bg-[var(--accent)] transition-transform duration-[var(--dur)] ease-[var(--ease-out)] ${
                isActive("/shop") ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100 group-focus-visible:scale-x-100"
              }`}
            />
          </Link>
          {categories.map((cat) => navLink(`/shop/${cat.slug}`, cat.name))}
          <span
            aria-hidden
            className="h-3 w-px bg-[var(--parchment)]/15"
          />
          {IA_LINKS.map(({ href, label }) => navLink(href, label))}
        </nav>

        <div className="flex items-center gap-3 md:gap-5">
          <button
            onClick={openCart}
            aria-label={`Open enquiry cart (${count} items)`}
            className="relative flex items-center gap-2 rounded-full px-2 text-sm text-[var(--parchment)]/70 transition-colors duration-[var(--dur-fast)] hover:text-[var(--parchment)] focus-visible:outline-none focus-visible:text-[var(--parchment)]"
          >
            <ShoppingBag size={18} />
            {count > 0 && (
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[var(--accent)] text-[10px] leading-none text-[var(--soil)]">
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
            className="flex items-center gap-2 text-xs font-medium tracking-[0.06em] text-[var(--parchment)]/70 transition-colors duration-[var(--dur-fast)] hover:text-[var(--parchment)] focus-visible:outline-none focus-visible:text-[var(--parchment)] md:hidden"
          >
            {menuOpen ? <X size={18} /> : <Menu size={18} />}
            <span className="hidden sm:inline">{menuOpen ? "Close" : "Menu"}</span>
          </button>
        </div>
      </div>

      {/* Mobile full-screen menu */}
      <div
        ref={menuRef}
        id="site-mobile-menu"
        aria-hidden={!menuOpen}
        className={`fixed inset-0 top-[var(--site-header-h)] z-30 flex flex-col overflow-y-auto bg-[var(--soil-muted)]/[0.97] backdrop-blur-xl transition-opacity duration-300 ease-out md:hidden ${
          menuOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      >
        <nav
          aria-label="Mobile navigation"
          className="flex flex-col gap-0 px-8 py-8"
        >
          <p className="mb-4 mt-2 font-mono text-[10px] uppercase tracking-[0.4em] text-[var(--parchment)]/40">
            Catalogue
          </p>
          <Link
            ref={firstLinkRef}
            href="/shop"
            onClick={handleMenuClose}
            aria-current={isActive("/shop") ? "page" : undefined}
            className="group flex items-center justify-between border-b border-[rgba(212,190,145,0.12)] py-4 font-display text-2xl italic tracking-[-0.01em] text-[var(--parchment)] transition-colors hover:text-[var(--accent)] focus-visible:outline-none focus-visible:text-[var(--accent)]"
          >
            Shop all
            <span
              aria-hidden
              className="h-px w-6 bg-[var(--parchment)]/30 transition-all duration-300 group-hover:w-10 group-hover:bg-[var(--accent)]"
            />
          </Link>
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/shop/${cat.slug}`}
              onClick={handleMenuClose}
              aria-current={isActive(`/shop/${cat.slug}`) ? "page" : undefined}
              className="group flex items-center justify-between border-b border-[rgba(212,190,145,0.12)] py-4 font-display text-2xl italic tracking-[-0.01em] text-[var(--parchment)] transition-colors hover:text-[var(--accent)] focus-visible:outline-none focus-visible:text-[var(--accent)]"
            >
              {cat.name}
              <span
                aria-hidden
                className="h-px w-4 bg-[var(--parchment)]/30 transition-all duration-300 group-hover:w-8 group-hover:bg-[var(--accent)]"
              />
            </Link>
          ))}

          <p className="mb-4 mt-8 font-mono text-[10px] uppercase tracking-[0.4em] text-[var(--parchment)]/40">
            Company
          </p>
          {IA_LINKS.map(({ href, label }) => (
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
          ))}
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
