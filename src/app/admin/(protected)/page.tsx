import Link from "next/link";
import { requireAdmin, isAdmin } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { formatAuditAction, isBusinessAction } from "@/lib/audit-utils";
import type { AdminRole } from "@/lib/types";
import type { AuditLog } from "@/lib/types";

export const dynamic = "force-dynamic";

type Counts = {
  products: number;
  publishedProducts: number;
  draftProducts: number;
  categories: number;
  activeCategories: number;
  articles: number;
  publishedArticles: number;
  enquiries: { new: number; total: number };
  recentProducts: { id: string; name: string; status: string; updated_at: string | null }[];
  recentEnquiries: { id: string; name: string; type: string; created_at: string; status: string }[];
};

async function loadDashboardCounts(): Promise<Counts> {
  const supabase = await createClient();

  const [productsAll, productsPublished, productsDraft, categories, categoriesActive,
    articlesAll, articlesPublished, enquiriesAll, enquiriesNew,
    recentProducts, recentEnquiries] =
    await Promise.all([
      supabase.from("products").select("id", { count: "exact", head: true }),
      supabase.from("products").select("id", { count: "exact", head: true }).eq("status", "published"),
      supabase.from("products").select("id", { count: "exact", head: true }).eq("status", "draft"),
      supabase.from("categories").select("id", { count: "exact", head: true }),
      supabase.from("categories").select("id", { count: "exact", head: true }).eq("active", true),
      supabase.from("articles").select("id", { count: "exact", head: true }),
      supabase.from("articles").select("id", { count: "exact", head: true }).eq("status", "published"),
      supabase.from("enquiries").select("id", { count: "exact", head: true }),
      supabase.from("enquiries").select("id", { count: "exact", head: true }).eq("status", "new"),
      supabase
        .from("products")
        .select("id, name, status, updated_at, created_at")
        .order("created_at", { ascending: false })
        .limit(5),
      supabase
        .from("enquiries")
        .select("id, name, type, created_at, status")
        .order("created_at", { ascending: false })
        .limit(5),
    ]);

  return {
    products: productsAll.count ?? 0,
    publishedProducts: productsPublished.count ?? 0,
    draftProducts: productsDraft.count ?? 0,
    categories: categories.count ?? 0,
    activeCategories: categoriesActive.count ?? 0,
    articles: articlesAll.count ?? 0,
    publishedArticles: articlesPublished.count ?? 0,
    enquiries: {
      new: enquiriesNew.count ?? 0,
      total: enquiriesAll.count ?? 0,
    },
    recentProducts: (recentProducts.data ?? []).map((p: any) => ({
      id: p.id as string,
      name: p.name as string,
      status: p.status as string,
      updated_at: (p.updated_at as string | null) ?? (p.created_at as string | null),
    })),
    recentEnquiries: (recentEnquiries.data ?? []).map((e: any) => ({
      id: e.id as string,
      name: e.name as string,
      type: e.type as string,
      created_at: e.created_at as string,
      status: e.status as string,
    })),
  };
}

async function loadRecentActivity() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("audit_log")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(8);
  return (data as AuditLog[] | null) ?? [];
}

export default async function AdminDashboard() {
  const user = await requireAdmin();
  const [counts, recentActivity] = await Promise.all([
    loadDashboardCounts(),
    loadRecentActivity(),
  ]);

  const businessActivity = recentActivity.filter((a) => isBusinessAction(a.action));

  const cards = [
    {
      label: "Published products",
      value: counts.publishedProducts,
      accent: "var(--accent)",
      href: "/admin/products",
    },
    {
      label: "Draft products",
      value: counts.draftProducts,
      accent: "var(--ink-muted)",
      href: "/admin/products",
    },
    {
      label: "Active categories",
      value: counts.activeCategories,
      accent: "var(--champagne)",
      href: "/admin/categories",
    },
    {
      label: "New enquiries",
      value: counts.enquiries.new,
      accent: "var(--sand)",
      href: "/admin/enquiries",
    },
  ];

  return (
    <div className="max-w-[1200px]">
      <p className="label-on-light">Overview</p>
      <h1 className="mt-2 max-w-[16ch] font-display text-4xl italic leading-[1.02] tracking-[-0.015em] text-[var(--ink)]">
        Dashboard
      </h1>
      <p className="mt-4 max-w-[60ch] body-on-light">
        Catalogue and enquiry activity. Items that need attention appear first.
      </p>

      <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-4">
        {cards.map((c) => (
          <Link
            key={c.label}
            href={c.href}
            className="card-light-soft group relative block overflow-hidden p-6 transition-all hover:bg-[var(--bone)]"
          >
            <div
              aria-hidden
              className="absolute bottom-0 right-0 h-20 w-20 rounded-full opacity-[0.06] transition-opacity duration-500 group-hover:opacity-12"
              style={{ background: c.accent }}
            />
            <p className="font-display text-5xl italic" style={{ color: c.accent }}>
              {c.value}
            </p>
            <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.20em] text-[var(--ink-muted)]">
              {c.label}
            </p>
          </Link>
        ))}
      </div>

      <div className="mt-14 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="card-light p-6">
          <div className="flex items-end justify-between">
            <p className="label-on-light">Recent products</p>
            <Link
              href="/admin/products"
              className="font-mono text-[10px] uppercase tracking-[0.20em] text-[var(--ink-muted)] transition-colors hover:text-[var(--ink)]"
            >
              View all
            </Link>
          </div>
          {counts.recentProducts.length === 0 ? (
            <p className="mt-6 font-display text-base italic text-[var(--ink)]/70">
              No products yet. <Link href="/admin/products" className="text-[var(--accent)] underline-offset-2 hover:underline">Add your first product</Link>.
            </p>
          ) : (
            <ul className="mt-4 divide-y divide-[var(--line-on-light)]">
              {counts.recentProducts.map((p) => (
                <li key={p.id} className="flex items-center justify-between py-3">
                  <div className="min-w-0 flex-1">
                    <p className="font-display text-base italic text-[var(--ink)] truncate">{p.name}</p>
                    {p.updated_at && (
                      <p className="mt-0.5 font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--ink-faint)]">
                        {new Date(p.updated_at).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                  <span
                    className={`font-mono text-[10px] uppercase tracking-[0.20em] ${
                      p.status === "published" ? "text-[var(--accent)]" : "text-[var(--ink-faint)]"
                    }`}
                  >
                    {p.status}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="card-light p-6">
          <div className="flex items-end justify-between">
            <p className="label-on-light">Recent enquiries</p>
            <Link
              href="/admin/enquiries"
              className="font-mono text-[10px] uppercase tracking-[0.20em] text-[var(--ink-muted)] transition-colors hover:text-[var(--ink)]"
            >
              View all
            </Link>
          </div>
          {counts.recentEnquiries.length === 0 ? (
            <p className="mt-6 font-display text-base italic text-[var(--ink)]/70">
              No enquiries yet.
            </p>
          ) : (
            <ul className="mt-4 divide-y divide-[var(--line-on-light)]">
              {counts.recentEnquiries.map((e) => (
                <li key={e.id} className="flex items-center justify-between gap-4 py-3">
                  <div className="min-w-0 flex-1">
                    <p className="font-display text-base italic text-[var(--ink)] truncate">{e.name}</p>
                    <p className="mt-0.5 font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--ink-faint)]">
                      {e.type} · {new Date(e.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <span
                    className={`font-mono text-[10px] uppercase tracking-[0.20em] ${
                      e.status === "new" ? "text-[var(--sand)]" : "text-[var(--ink-faint)]"
                    }`}
                  >
                    {e.status.replace("_", " ")}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {businessActivity.length > 0 && (
        <div className="mt-14 card-light p-6">
          <div className="flex items-end justify-between">
            <p className="label-on-light">Recent activity</p>
            <Link
              href="/admin/activity"
              className="font-mono text-[10px] uppercase tracking-[0.20em] text-[var(--ink-muted)] transition-colors hover:text-[var(--ink)]"
            >
              View all
            </Link>
          </div>
          <ul className="mt-4 divide-y divide-[var(--line-on-light)]">
            {businessActivity.slice(0, 6).map((a) => (
              <li key={a.id} className="flex items-center justify-between gap-4 py-3">
                <div className="min-w-0 flex-1">
                  <p className="font-mono text-xs text-[var(--ink)]">
                    {formatAuditAction(a.action)}
                  </p>
                  {a.details && typeof a.details === "object" && "name" in a.details && (
                    <p className="mt-0.5 font-display text-sm italic text-[var(--ink-muted)] truncate">
                      {(a.details as { name: string }).name}
                    </p>
                  )}
                  <p className="mt-0.5 font-mono text-[10px] text-[var(--ink-faint)]">
                    {a.actor_email ?? "System"} · {new Date(a.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-14 border-t border-[var(--line-on-light)] pt-10">
        <p className="label-on-light">Quick actions</p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link
            href="/admin/products"
            className="border border-[var(--ink)] bg-[var(--ink)] px-5 py-2.5 font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--warm-white)] transition-colors hover:bg-[var(--warm-white)] hover:text-[var(--ink)]"
          >
            Manage products
          </Link>
          <Link
            href="/admin/categories"
            className="border border-[var(--ink)] bg-transparent px-5 py-2.5 font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--ink)] transition-colors hover:bg-[var(--ink)] hover:text-[var(--warm-white)]"
          >
            Manage categories
          </Link>
          <Link
            href="/admin/content"
            className="border border-[var(--ink)] bg-transparent px-5 py-2.5 font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--ink)] transition-colors hover:bg-[var(--ink)] hover:text-[var(--warm-white)]"
          >
            Edit site copy
          </Link>
        </div>
      </div>
    </div>
  );
}
