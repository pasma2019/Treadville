import { getCategories, getProducts } from "@/lib/queries";
import Link from "next/link";

export const revalidate = 0;

export default async function AdminDashboard() {
  const [categories, products] = await Promise.all([getCategories(), getProducts()]);
  const published = products.filter((p) => p.status === "published").length;

  const cards = [
    { label: "Categories", value: categories.length, accent: "var(--champagne)" },
    { label: "Products", value: products.length, accent: "var(--sand)" },
    { label: "Published", value: published, accent: "var(--accent)" },
    { label: "Draft", value: products.length - published, accent: "var(--ink-muted)" },
  ];

  return (
    <div>
      <p className="label-on-light">Overview</p>
      <h1 className="mt-2 max-w-[16ch] font-display text-4xl italic leading-[1.02] tracking-[-0.015em] text-[var(--ink)]">
        Dashboard
      </h1>
      <p className="mt-4 max-w-[52ch] body-on-light">
        Catalogue overview. Navigate to categories, products, or content to make
        changes — they reflect immediately on the storefront.
      </p>

      <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-4">
        {cards.map((c) => (
          <div
            key={c.label}
            className="card-light-soft group relative overflow-hidden p-6"
          >
            <div
              aria-hidden
              className="absolute bottom-0 right-0 h-24 w-24 rounded-full opacity-[0.06] transition-opacity duration-500 group-hover:opacity-10"
              style={{ background: c.accent }}
            />
            <p
              className="font-display text-5xl italic"
              style={{ color: c.accent }}
            >
              {c.value}
            </p>
            <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--ink-muted)]">
              {c.label}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-12 grid grid-cols-1 gap-4 md:grid-cols-3">
        {[
          { href: "/admin/categories", label: "Manage categories", note: "Add or edit the four product chapters" },
          { href: "/admin/products", label: "Manage products", note: "Add products, set categories, publish" },
          { href: "/admin/content", label: "Edit content", note: "Homepage hero and story text" },
        ].map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="group card-light flex flex-col gap-2 p-6"
          >
            <p className="font-display text-lg italic text-[var(--ink)]">
              {item.label}
            </p>
            <p className="body-on-light">{item.note}</p>
            <div className="mt-2 inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.28em] text-[var(--ink-muted)]">
              <span className="h-px w-6 bg-[var(--ink-muted)] transition-all duration-300 group-hover:w-10 group-hover:bg-[var(--accent)]" />
              Open
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-12 border-t border-[var(--line-on-light)] pt-10">
        <p className="label-on-light">Next steps</p>
        <p className="mt-3 max-w-[60ch] body-on-light">
          Orders, customers, authentication, and payment integration are
          intentionally not built in this prototype. The catalogue is the proof
          of concept.
        </p>
        <Link
          href="/"
          className="mt-6 inline-flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.28em] text-[var(--ink-muted)] transition-colors hover:text-[var(--ink)]"
        >
          <span className="h-px w-6 bg-current" />
          View storefront
        </Link>
      </div>
    </div>
  );
}
