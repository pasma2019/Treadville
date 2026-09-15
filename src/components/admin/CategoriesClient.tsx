"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  createCategoryAction,
  updateCategoryAction,
  toggleCategoryActiveAction,
  deleteCategoryAction,
} from "@/lib/admin-actions";
import type { ProductFormState } from "@/lib/admin-actions";
import ImageUpload from "./ImageUpload";
import { useUnsavedGuard } from "@/lib/use-unsaved-guard";

type Category = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image_url: string | null;
  active: boolean;
  sort_order: number;
};

type Props = { categories: Category[] };

export default function CategoriesClient({ categories }: Props) {
  const router = useRouter();
  const [, startTransition] = useTransition();
  const [showAdd, setShowAdd] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [serverMessage, setServerMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const showMessage = (type: "success" | "error", text: string) => {
    setServerMessage({ type, text });
    setTimeout(() => setServerMessage(null), 4000);
  };

  const handleDelete = (id: string, name: string) => {
    if (busyId) return;
    if (!confirm(`Delete "${name}"? This will also delete all products in this category.`)) return;
    setBusyId(id);
    startTransition(async () => {
      try {
        await deleteCategoryAction(id);
        showMessage("success", "Category deleted.");
        router.refresh();
      } catch {
        showMessage("error", "Could not delete category. Nothing was changed.");
      } finally {
        setBusyId(null);
      }
    });
  };

  const handleToggle = (id: string, name: string, currentActive: boolean) => {
    if (busyId) return;
    const action = currentActive ? "hidden" : "activated";
    if (!confirm(`${action.charAt(0).toUpperCase() + action.slice(1)} "${name}"?`)) return;
    setBusyId(id);
    startTransition(async () => {
      try {
        await toggleCategoryActiveAction(id, !currentActive);
        showMessage("success", `Category ${action}.`);
        router.refresh();
      } catch {
        showMessage("error", "Could not update category. Nothing was changed.");
      } finally {
        setBusyId(null);
      }
    });
  };

  const editingCategory = editingId ? categories.find((c) => c.id === editingId) : undefined;

  return (
    <div>
      <header className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-semibold text-[var(--ink)]">Categories</h1>
          <p className="mt-1 font-mono text-sm text-[var(--ink-muted)]">
            {categories.length} {categories.length === 1 ? "category" : "categories"}
          </p>
        </div>
        <button
          onClick={() => setShowAdd(true)}
          className="border border-[var(--ink)] bg-[var(--ink)] px-6 py-3 font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--warm-white)] transition-colors hover:bg-[var(--warm-white)] hover:text-[var(--ink)]"
        >
          + Add category
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

      {showAdd && (
        <div className="mb-8">
          <CategoryForm
            onSuccess={() => {
              setShowAdd(false);
              showMessage("success", "Category added.");
            }}
            onCancel={() => setShowAdd(false)}
          />
        </div>
      )}

      {editingCategory && (
        <div className="mb-8">
          <button
            onClick={() => setEditingId(null)}
            className="mb-4 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--ink-muted)] transition-colors hover:text-[var(--ink)]"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M9 2L3 8l6 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Back to categories
          </button>
          <CategoryForm
            category={editingCategory}
            onSuccess={() => {
              setEditingId(null);
              showMessage("success", "Category updated.");
            }}
            onCancel={() => setEditingId(null)}
          />
        </div>
      )}

      {categories.length === 0 ? (
        <div className="rounded border-2 border-dashed border-[var(--line-on-light)] py-20 text-center">
          <p className="font-display text-lg italic text-[var(--ink-muted)]">No categories yet.</p>
          <p className="mt-2 font-mono text-sm text-[var(--ink-faint)]">
            Categories group your products on the storefront.
          </p>
          <button
            onClick={() => setShowAdd(true)}
            className="mt-6 font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--accent)] underline transition-colors hover:text-[var(--ink)]"
          >
            Add your first category
          </button>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((cat) => {
          const busy = busyId === cat.id;
          return (
            <article
              key={cat.id}
              className="overflow-hidden rounded border border-[var(--line-on-light)] bg-[var(--warm-white)] transition-shadow hover:shadow-md"
            >
              <div className="aspect-[16/7] bg-[var(--bone)]">
                {cat.image_url ? (
                  <img src={cat.image_url} alt={cat.name} className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <p className="font-mono text-[9px] uppercase tracking-[0.15em] text-[var(--ink-faint)]">No image</p>
                  </div>
                )}
              </div>
              <div className="p-4">
                <div className="mb-1 flex items-start justify-between gap-2">
                  <p className="font-display text-base italic leading-tight text-[var(--ink)]">{cat.name}</p>
                  <span
                    className={`shrink-0 rounded px-2 py-0.5 font-mono text-[8px] uppercase tracking-[0.15em] ${
                      cat.active
                        ? "bg-[var(--forest)]/10 text-[var(--forest)]"
                        : "bg-[var(--champagne)]/40 text-[var(--ink)]"
                    }`}
                  >
                    {cat.active ? "Active" : "Hidden"}
                  </span>
                </div>
                {cat.description && (
                  <p className="line-clamp-2 font-mono text-xs text-[var(--ink-muted)]">{cat.description}</p>
                )}
                <div className="mt-4 flex flex-wrap gap-2 border-t border-[var(--line-on-light)] pt-3">
                  <button
                    onClick={() => setEditingId(cat.id)}
                    disabled={busy}
                    className="border border-[var(--line-on-light)] px-3 py-1.5 font-mono text-[9px] uppercase tracking-[0.15em] text-[var(--ink-muted)] transition-colors hover:border-[var(--ink)] hover:text-[var(--ink)] disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleToggle(cat.id, cat.name, cat.active)}
                    disabled={busy}
                    className="border border-[var(--line-on-light)] px-3 py-1.5 font-mono text-[9px] uppercase tracking-[0.15em] text-[var(--ink-muted)] transition-colors hover:border-[var(--ink)] hover:text-[var(--ink)] disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    {busy ? "Working…" : cat.active ? "Hide" : "Activate"}
                  </button>
                  <button
                    onClick={() => handleDelete(cat.id, cat.name)}
                    disabled={busy}
                    className="border border-red-200 px-3 py-1.5 font-mono text-[9px] uppercase tracking-[0.15em] text-red-500 transition-colors hover:border-red-500 hover:text-red-700 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    {busy ? "Working…" : "Delete"}
                  </button>
                </div>
              </div>
            </article>
          );
        })}
        </div>
      )}
    </div>
  );
}

type CategoryFormProps = {
  category?: Category;
  onSuccess: () => void;
  onCancel: () => void;
};

function CategoryForm({ category, onSuccess, onCancel }: CategoryFormProps) {
  const [pending, startTransition] = useTransition();
  const [formState, setFormState] = useState<ProductFormState | null>(null);
  const [imageUrl, setImageUrl] = useState<string>(category?.image_url ?? "");
  const [sortOrder, setSortOrder] = useState<number>(category?.sort_order ?? 0);
  const [dirty, setDirty] = useState(false);
  useUnsavedGuard(dirty, "This category has unsaved changes. Leave without saving?");

  const markDirty = () => setDirty(true);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormState(null);
    const fd = new FormData(e.currentTarget);
    fd.set("image_url", imageUrl);
    fd.set("sort_order", String(sortOrder));

    startTransition(async () => {
      const result = category
        ? await updateCategoryAction(category.id, {}, fd)
        : await createCategoryAction({}, fd);

      if (result.error) {
        setFormState({ error: result.error });
      } else {
        onSuccess();
      }
    });
  };

  return (
    <div className="rounded border border-[var(--line-on-light)] bg-[var(--warm-white)] p-6">
      <h2 className="mb-4 flex items-center gap-3 font-display text-lg font-semibold text-[var(--ink)]">
        {category ? "Edit category" : "New category"}
        {dirty && (
          <span className="rounded bg-[var(--champagne)]/60 px-2 py-1 font-mono text-[9px] uppercase tracking-[0.18em] text-[var(--ink)]">
            Unsaved changes
          </span>
        )}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid gap-5 md:grid-cols-2">
          <div>
            <label htmlFor="cf-name" className="mb-1.5 block font-mono text-[10px] uppercase tracking-[0.20em] text-[var(--ink-muted)]">
              Name *
            </label>
            <input
              id="cf-name"
              name="name"
              type="text"
              required
              defaultValue={category?.name ?? ""}
              onChange={markDirty}
              placeholder="e.g. Specialty Coffee"
              className="field-light w-full"
            />
          </div>
          <div>
            <label htmlFor="cf-slug" className="mb-1.5 block font-mono text-[10px] uppercase tracking-[0.20em] text-[var(--ink-muted)]">
              Slug
            </label>
            <input
              id="cf-slug"
              name="slug"
              type="text"
              defaultValue={category?.slug ?? ""}
              onChange={markDirty}
              placeholder="Auto-generated if blank"
              className="field-light w-full"
            />
          </div>
          <div className="md:col-span-2">
            <label htmlFor="cf-desc" className="mb-1.5 block font-mono text-[10px] uppercase tracking-[0.20em] text-[var(--ink-muted)]">
              Description
            </label>
            <textarea
              id="cf-desc"
              name="description"
              rows={2}
              defaultValue={category?.description ?? ""}
              onChange={markDirty}
              placeholder="Brief description of this category"
              className="field-light w-full resize-none"
            />
          </div>
          <div>
            <label htmlFor="cf-order" className="mb-1.5 block font-mono text-[10px] uppercase tracking-[0.20em] text-[var(--ink-muted)]">
              Order
            </label>
            <input
              id="cf-order"
              name="sort_order"
              type="number"
              min="0"
              step="1"
              value={sortOrder}
              onChange={(e) => {
                setSortOrder(Number(e.target.value));
                markDirty();
              }}
              className="field-light w-full"
            />
            <p className="mt-1 font-mono text-[9px] text-[var(--ink-faint)]">
              Lower numbers appear first on the storefront.
            </p>
          </div>
          <div className="md:col-span-2">
            <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.20em] text-[var(--ink-muted)]">
              Category image
            </p>
            <ImageUpload
              initialUrl={imageUrl}
              onUpload={(url) => {
                setImageUrl(url);
                markDirty();
              }}
              onRemove={() => {
                setImageUrl("");
                markDirty();
              }}
              label=""
            />
          </div>
        </div>

        {formState?.error && (
          <div role="alert" className="rounded border border-red-200 bg-red-50 px-4 py-3 font-mono text-xs text-red-600">
            {formState.error}
          </div>
        )}

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={pending}
            className="border border-[var(--ink)] bg-[var(--ink)] px-6 py-3 font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--warm-white)] transition-colors hover:bg-[var(--warm-white)] hover:text-[var(--ink)] disabled:opacity-50"
          >
            {pending ? "Saving…" : category ? "Save changes" : "Add category"}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="border border-[var(--line-on-light)] px-6 py-3 font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--ink-muted)] transition-colors hover:border-[var(--ink)] hover:text-[var(--ink)]"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
