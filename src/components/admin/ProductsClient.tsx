"use client";

import { useState, useTransition } from "react";
import {
  deleteProductAction,
  setProductStatusAction,
  loadProductWithMetadata,
} from "@/lib/admin-actions";
import ProductStudio from "./ProductStudio";

type Product = {
  id: string;
  name: string;
  slug: string;
  category_id: string;
  description: string | null;
  price: number | null;
  image_url: string | null;
  gallery: string[];
  featured: boolean;
  status: string;
  stock: number;
  created_at: string;
  categories: { name: string };
};

type ProductWithMetadata = Product & {
  metadata: Record<string, string>;
};

type Category = {
  id: string;
  name: string;
  slug: string;
  active: boolean;
};

type Props = {
  products: Product[];
  categories: Category[];
};

type ViewMode = "list" | "add" | "edit";

export default function ProductsClient({ products, categories }: Props) {
  const [, startTransition] = useTransition();
  const [view, setView] = useState<ViewMode>("list");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingProduct, setEditingProduct] = useState<ProductWithMetadata | null>(null);
  const [serverMessage, setServerMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const showMessage = (type: "success" | "error", text: string) => {
    setServerMessage({ type, text });
    setTimeout(() => setServerMessage(null), 4000);
  };

  const handleDelete = (id: string, name: string) => {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return;
    startTransition(async () => {
      try {
        await deleteProductAction(id);
        showMessage("success", "Product deleted.");
      } catch {
        showMessage("error", "Could not delete product.");
      }
    });
  };

  const handleStatus = (id: string, currentStatus: string, name: string) => {
    const next = currentStatus === "published" ? "draft" : "published";
    const action = currentStatus === "published" ? "unpublished" : "published";
    if (!confirm(`${action.charAt(0).toUpperCase() + action.slice(1)} "${name}"?`)) return;
    startTransition(async () => {
      try {
        await setProductStatusAction(id, next as "draft" | "published");
        showMessage("success", `Product ${action}.`);
      } catch {
        showMessage("error", "Could not update status.");
      }
    });
  };

  const startEdit = (productId: string) => {
    startTransition(async () => {
      const full = await loadProductWithMetadata(productId);
      setEditingProduct(full);
      setEditingId(productId);
      setView("edit");
    });
  };

  if (view === "add") {
    return (
      <div>
        <ProductStudio
          categories={categories}
          onCancel={() => setView("list")}
          onSuccess={() => {
            setView("list");
            showMessage("success", "Product created.");
          }}
        />
      </div>
    );
  }

  if (view === "edit" && editingProduct) {
    return (
      <div>
        <button
          onClick={() => { setView("list"); setEditingId(null); setEditingProduct(null); }}
          className="mb-6 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--ink-muted)] transition-colors hover:text-[var(--ink)]"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M9 2L3 8l6 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Back to catalogue
        </button>
        <ProductStudio
          productId={editingProduct.id}
          categories={categories}
          initial={editingProduct}
          onCancel={() => { setView("list"); setEditingId(null); setEditingProduct(null); }}
          onSuccess={() => {
            setView("list");
            setEditingId(null);
            setEditingProduct(null);
            showMessage("success", "Product updated.");
          }}
        />
      </div>
    );
  }

  return (
    <div>
      <header className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-semibold text-[var(--ink)]">Products</h1>
          <p className="mt-1 font-mono text-sm text-[var(--ink-muted)]">
            {products.length} {products.length === 1 ? "product" : "products"} in catalogue
          </p>
        </div>
        <button
          onClick={() => setView("add")}
          className="border border-[var(--ink)] bg-[var(--ink)] px-6 py-3 font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--warm-white)] transition-colors hover:bg-[var(--warm-white)] hover:text-[var(--ink)]"
        >
          + Add product
        </button>
      </header>

      {serverMessage && (
        <div
          className={`mb-6 rounded px-4 py-3 font-mono text-xs ${
            serverMessage.type === "success"
              ? "border border-[var(--forest)]/30 bg-[var(--forest)]/5 text-[var(--forest)]"
              : "border border-red-200 bg-red-50 text-red-600"
          }`}
        >
          {serverMessage.text}
        </div>
      )}

      {products.length === 0 ? (
        <div className="rounded border-2 border-dashed border-[var(--line-on-light)] py-20 text-center">
          <p className="font-display text-lg italic text-[var(--ink-muted)]">
            No products yet.
          </p>
          <p className="mt-2 font-mono text-sm text-[var(--ink-faint)]">
            Add your first product to begin building the catalogue.
          </p>
          <button
            onClick={() => setView("add")}
            className="mt-6 font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--accent)] underline transition-colors hover:text-[var(--ink)]"
          >
            Add your first product
          </button>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <article
              key={product.id}
              className="overflow-hidden rounded border border-[var(--line-on-light)] bg-[var(--warm-white)] transition-shadow hover:shadow-md"
            >
              {/* Image */}
              <div className="aspect-[4/3] bg-[var(--bone)]">
                {product.image_url ? (
                  <img
                    src={product.image_url}
                    alt={product.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <p className="font-mono text-[9px] uppercase tracking-[0.15em] text-[var(--ink-faint)]">
                      No image
                    </p>
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-4">
                <div className="mb-1 flex items-start justify-between gap-2">
                  <p className="font-display text-base italic leading-tight text-[var(--ink)]">
                    {product.name}
                  </p>
                  <span
                    className={`shrink-0 rounded px-2 py-0.5 font-mono text-[8px] uppercase tracking-[0.15em] ${
                      product.status === "published"
                        ? "bg-[var(--forest)]/10 text-[var(--forest)]"
                        : "bg-[var(--champagne)]/40 text-[var(--ink)]"
                    }`}
                  >
                    {product.status}
                  </span>
                </div>
                <p className="mb-2 font-mono text-[10px] text-[var(--ink-faint)]">
                  {product.categories?.name}
                  {product.featured && " · Featured"}
                </p>
                {product.price && (
                  <p className="mb-3 font-display text-sm text-[var(--ink)]">
                    KSh {product.price.toLocaleString()}
                  </p>
                )}

                {/* Actions */}
                <div className="mt-4 flex flex-wrap gap-2 border-t border-[var(--line-on-light)] pt-3">
                  <button
                    onClick={() => startEdit(product.id)}
                    className="border border-[var(--line-on-light)] px-3 py-1.5 font-mono text-[9px] uppercase tracking-[0.15em] text-[var(--ink-muted)] transition-colors hover:border-[var(--ink)] hover:text-[var(--ink)]"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleStatus(product.id, product.status, product.name)}
                    className={`border px-3 py-1.5 font-mono text-[9px] uppercase tracking-[0.15em] transition-colors ${
                      product.status === "published"
                        ? "border-[var(--champagne)]/60 text-[var(--ink-muted)] hover:border-[var(--ink)] hover:text-[var(--ink)]"
                        : "border-[var(--forest)]/30 text-[var(--forest)] hover:border-[var(--forest)] hover:text-[var(--forest)]"
                    }`}
                  >
                    {product.status === "published" ? "Unpublish" : "Publish"}
                  </button>
                  <button
                    onClick={() => handleDelete(product.id, product.name)}
                    className="border border-red-200 px-3 py-1.5 font-mono text-[9px] uppercase tracking-[0.15em] text-red-500 transition-colors hover:border-red-500 hover:text-red-700"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
