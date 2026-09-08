"use client";

import { useState, useCallback, useTransition, useEffect } from "react";
import ImageUpload from "./ImageUpload";
import {
  createProductAction,
  updateProductAction,
  deleteProductAction,
  setProductStatusAction,
  upsertProductMetadata,
} from "@/lib/admin-actions";
import type { ProductFormState } from "@/lib/admin-actions";
import { METADATA_SCHEMAS } from "@/lib/product-metadata";

type Category = { id: string; name: string; slug: string; active: boolean };

type Props = {
  productId?: string;
  categories: Category[];
  initial?: {
    name: string;
    slug: string;
    category_id: string;
    description: string | null;
    price: number | null;
    image_url: string | null;
    gallery: string[];
    stock: number;
    featured: boolean;
    status: string;
    categories: { name: string; slug?: string };
    metadata?: Record<string, string>;
  };
  onCancel: () => void;
  onSuccess: () => void;
};

export default function ProductStudio({ productId, categories, initial, onCancel, onSuccess }: Props) {
  const [, startTransition] = useTransition();
  const [pending, setPending] = useState(false);
  const [formState, setFormState] = useState<ProductFormState | null>(null);

  // Form state
  const [name, setName] = useState(initial?.name ?? "");
  const [slug, setSlug] = useState(initial?.slug ?? "");
  const [slugEdited, setSlugEdited] = useState(false);
  const [categoryId, setCategoryId] = useState(initial?.category_id ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [price, setPrice] = useState(initial?.price?.toString() ?? "");
  const [stock, setStock] = useState(initial?.stock?.toString() ?? "0");
  const [featured, setFeatured] = useState(initial?.featured ?? false);
  const [primaryImage, setPrimaryImage] = useState<string | null>(initial?.image_url ?? null);
  const [gallery, setGallery] = useState<string[]>(initial?.gallery ?? []);
  const [publishOnSave, setPublishOnSave] = useState(initial?.status === "published");

  // Metadata state
  const [metadata, setMetadata] = useState<Record<string, string>>(initial?.metadata ?? {});
  const [categoryChanged, setCategoryChanged] = useState(false);

  const selectedCategory = categories.find((c) => c.id === categoryId);
  const categorySlug = selectedCategory?.slug ?? "";
  const metadataFields = METADATA_SCHEMAS[categorySlug] ?? [];

  // When category changes, prune metadata to only fields in the new schema
  useEffect(() => {
    if (!categoryId) return;
    const validKeys = new Set(metadataFields.map((f) => f.key));
    const pruned: Record<string, string> = {};
    let changed = false;
    for (const [k, v] of Object.entries(metadata)) {
      if (validKeys.has(k)) {
        pruned[k] = v;
      } else {
        changed = true;
      }
    }
    if (changed) {
      setMetadata(pruned);
      setCategoryChanged(true);
    }
  }, [categoryId]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleMetadataChange = (key: string, value: string) => {
    setMetadata((prev) => ({ ...prev, [key]: value }));
  };

  const handleNameChange = (val: string) => {
    setName(val);
    if (!slugEdited) {
      setSlug(val.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""));
    }
  };

  const handleSlugChange = (val: string) => {
    setSlugEdited(true);
    setSlug(val.toLowerCase().replace(/[^a-z0-9-]+/g, "-").replace(/^-|-$/g, "-"));
  };

  const addToGallery = (url: string) => {
    setGallery((prev) => {
      if (prev.includes(url)) return prev;
      return [...prev, url];
    });
  };

  const removeFromGallery = (url: string) => {
    setGallery((prev) => prev.filter((u) => u !== url));
  };

  const removePrimary = () => {
    setPrimaryImage(null);
  };

  const moveGalleryItem = (from: number, to: number) => {
    setGallery((prev) => {
      const next = [...prev];
      const [moved] = next.splice(from, 1);
      next.splice(to, 0, moved);
      return next;
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) { setFormState({ error: "Product name is required." }); return; }
    if (!categoryId) { setFormState({ error: "Please choose a category." }); return; }
    setFormState(null);
    setPending(true);

    const fd = new FormData();
    fd.set("name", name.trim());
    fd.set("slug", slug.trim() || name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""));
    fd.set("category_id", categoryId);
    fd.set("description", description.trim());
    fd.set("price", price.trim());
    fd.set("stock", stock.trim() || "0");
    fd.set("featured", featured ? "on" : "");
    fd.set("status", publishOnSave ? "published" : "draft");
    fd.set("image_url", primaryImage ?? "");
    fd.set("gallery", JSON.stringify(gallery));

    startTransition(async () => {
      let effectiveProductId = productId;

      if (productId) {
        const result = await updateProductAction(productId, {}, fd);
        if (result.error) {
          setPending(false);
          setFormState({ error: result.error });
          return;
        }
      } else {
        const result = await createProductAction({}, fd);
        if (result.error) {
          setPending(false);
          setFormState({ error: result.error });
          return;
        }
        effectiveProductId = result.productId;
      }

      // Save metadata if we have a product ID
      if (effectiveProductId) {
        const metaResult = await upsertProductMetadata(effectiveProductId, metadata);
        if ("error" in metaResult && metaResult.error) {
          setPending(false);
          setFormState({ error: "Product saved, but metadata could not be saved: " + metaResult.error });
          return;
        }
      }

      setPending(false);
      onSuccess();
    });
  };

  return (
    <div className="grid gap-10 lg:grid-cols-[1fr,380px]">
      {/* Left: Form */}
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="font-display text-xl font-semibold text-[var(--ink)]">
            {productId ? "Edit product" : "New product"}
          </h2>
          <button
            type="button"
            onClick={onCancel}
            className="border border-[var(--line-on-light)] px-4 py-2 font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--ink-muted)] transition-colors hover:border-[var(--ink)] hover:text-[var(--ink)]"
          >
            Cancel
          </button>
        </div>

        {/* Section: Identity */}
        <section>
          <h3 className="mb-4 font-mono text-[10px] uppercase tracking-[0.25em] text-[var(--ink-faint)]">
            Identity
          </h3>
          <div className="space-y-4">
            <div>
              <label htmlFor="ps-name" className="mb-1.5 block font-mono text-[10px] uppercase tracking-[0.20em] text-[var(--ink-muted)]">
                Product name *
              </label>
              <input
                id="ps-name"
                type="text"
                value={name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="e.g. Kenya AA — Kirinyaga"
                required
                className="field-light w-full"
              />
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label htmlFor="ps-slug" className="mb-1.5 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.20em] text-[var(--ink-muted)]">
                  Slug
                  <span className="font-mono text-[9px] normal-case tracking-none text-[var(--ink-faint)]">
                    {slugEdited ? "manual" : "auto"}
                  </span>
                </label>
                <input
                  id="ps-slug"
                  type="text"
                  value={slug}
                  onChange={(e) => handleSlugChange(e.target.value)}
                  placeholder="auto-generated"
                  className="field-light w-full"
                />
              </div>
              <div>
                <label htmlFor="ps-category" className="mb-1.5 block font-mono text-[10px] uppercase tracking-[0.20em] text-[var(--ink-muted)]">
                  Category *
                </label>
                <select
                  id="ps-category"
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  required
                  className="field-light w-full cursor-pointer"
                >
                  <option value="">Choose category…</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <label htmlFor="ps-description" className="mb-1.5 block font-mono text-[10px] uppercase tracking-[0.20em] text-[var(--ink-muted)]">
                Description
              </label>
              <textarea
                id="ps-description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                placeholder="Origin, process, tasting notes, provenance…"
                className="field-light w-full resize-none"
              />
            </div>
          </div>
        </section>

        {/* Section: Images */}
        <section>
          <h3 className="mb-4 font-mono text-[10px] uppercase tracking-[0.25em] text-[var(--ink-faint)]">
            Images
          </h3>
          <div className="space-y-6">
            {/* Primary image */}
            <ImageUpload
              bucket="product-images"
              initialUrl={primaryImage}
              onUpload={(url) => setPrimaryImage(url)}
              onRemove={removePrimary}
              label="Primary image"
            />

            {/* Gallery */}
            <div>
              <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.20em] text-[var(--ink-muted)]">
                Gallery ({gallery.length})
              </p>
              {gallery.length > 0 ? (
                <div className="space-y-3">
                  <p className="font-mono text-[9px] text-[var(--ink-faint)]">
                    Drag to reorder. Click × to remove.
                  </p>
                  <div className="flex flex-wrap gap-3">
                    {gallery.map((url, i) => (
                      <GalleryItem
                        key={url}
                        url={url}
                        index={i}
                        total={gallery.length}
                        onRemove={() => removeFromGallery(url)}
                        onMoveLeft={() => i > 0 && moveGalleryItem(i, i - 1)}
                        onMoveRight={() => i < gallery.length - 1 && moveGalleryItem(i, i + 1)}
                        isPrimary={url === primaryImage}
                        onSetPrimary={() => {
                          const prev = primaryImage;
                          setPrimaryImage(url);
                          setGallery((g) => {
                            const next = g.filter((u) => u !== url);
                            if (prev) return [prev, ...next];
                            return next;
                          });
                        }}
                      />
                    ))}
                  </div>
                </div>
              ) : (
                <p className="font-mono text-xs text-[var(--ink-faint)] italic">
                  No gallery images yet. Upload images below.
                </p>
              )}
              {/* Upload more into gallery */}
              <div className="mt-4 max-w-sm">
                <ImageUpload
                  bucket="product-images"
                  onUpload={addToGallery}
                  label="Add gallery image"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Section: Commerce */}
        <section>
          <h3 className="mb-4 font-mono text-[10px] uppercase tracking-[0.25em] text-[var(--ink-faint)]">
            Commerce &amp; Stock
          </h3>
          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <label htmlFor="ps-price" className="mb-1.5 block font-mono text-[10px] uppercase tracking-[0.20em] text-[var(--ink-muted)]">
                Price (KSh)
              </label>
              <input
                id="ps-price"
                type="number"
                min="0"
                step="50"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="Leave blank for quote"
                className="field-light w-full"
              />
            </div>
            <div>
              <label htmlFor="ps-stock" className="mb-1.5 block font-mono text-[10px] uppercase tracking-[0.20em] text-[var(--ink-muted)]">
                Stock
              </label>
              <input
                id="ps-stock"
                type="number"
                min="0"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                className="field-light w-full"
              />
            </div>
            <div className="flex flex-col justify-end gap-3">
              <label className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.15em] text-[var(--ink)]">
                <input
                  type="checkbox"
                  checked={featured}
                  onChange={(e) => setFeatured(e.target.checked)}
                  className="h-4 w-4 accent-[var(--accent)]"
                />
                Featured
              </label>
              <label className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.15em] text-[var(--ink)]">
                <input
                  type="checkbox"
                  checked={publishOnSave}
                  onChange={(e) => setPublishOnSave(e.target.checked)}
                  className="h-4 w-4 accent-[var(--accent)]"
                />
                Publish now
              </label>
            </div>
          </div>
        </section>

        {/* Section: Category details */}
        <section>
          <h3 className="mb-4 font-mono text-[10px] uppercase tracking-[0.25em] text-[var(--ink-faint)]">
            Category details
          </h3>
          {!categoryId ? (
            <p className="font-mono text-xs text-[var(--ink-faint)] italic">
              Select a category to see relevant fields.
            </p>
          ) : metadataFields.length === 0 ? (
            <p className="font-mono text-xs text-[var(--ink-faint)] italic">
              No details configured for this category yet.
            </p>
          ) : (
            <div className="space-y-4">
              {categoryChanged && (
                <p className="rounded bg-[var(--champagne)]/30 px-3 py-2 font-mono text-[10px] text-[var(--ink-muted)]">
                  Some details may no longer apply to this category. Incompatible fields have been cleared.
                </p>
              )}
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {metadataFields.map((field) => (
                  <div key={field.key}>
                    <label
                      htmlFor={`meta-${field.key}`}
                      className="mb-1.5 block font-mono text-[10px] uppercase tracking-[0.20em] text-[var(--ink-muted)]"
                    >
                      {field.label}
                    </label>
                    <input
                      id={`meta-${field.key}`}
                      type="text"
                      value={metadata[field.key] ?? ""}
                      onChange={(e) => handleMetadataChange(field.key, e.target.value)}
                      placeholder={field.placeholder}
                      className="field-light w-full"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>

        {/* Error */}
        {formState?.error && (
          <div role="alert" className="rounded border border-red-200 bg-red-50 px-4 py-3 font-mono text-xs text-red-600">
            {formState.error}
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3 border-t border-[var(--line-on-light)] pt-6">
          <button
            type="submit"
            disabled={pending}
            className="border border-[var(--ink)] bg-[var(--ink)] px-8 py-3 font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--warm-white)] transition-colors hover:bg-[var(--warm-white)] hover:text-[var(--ink)] disabled:opacity-50"
          >
            {pending ? "Saving…" : productId ? "Save changes" : "Create product"}
          </button>
          {!productId && (
            <button
              type="button"
              onClick={() => {
                setFormState(null);
                setPending(true);
                const fd = new FormData();
                fd.set("name", name.trim());
                fd.set("slug", slug.trim() || name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""));
                fd.set("category_id", categoryId);
                fd.set("description", description.trim());
                fd.set("price", price.trim());
                fd.set("stock", stock.trim() || "0");
                fd.set("featured", featured ? "on" : "");
                fd.set("status", "draft");
                fd.set("image_url", primaryImage ?? "");
                fd.set("gallery", JSON.stringify(gallery));
                startTransition(async () => {
                  const result = await createProductAction({}, fd);
                  if (result.error) {
                    setPending(false);
                    setFormState({ error: result.error });
                    return;
                  }
                  if (result.productId) {
                    const metaResult = await upsertProductMetadata(result.productId, metadata);
                    if ("error" in metaResult && metaResult.error) {
                      setPending(false);
                      setFormState({ error: "Product saved, but metadata could not be saved: " + metaResult.error });
                      return;
                    }
                  }
                  setPending(false);
                  onSuccess();
                });
              }}
              disabled={pending || !name.trim() || !categoryId}
              className="border border-[var(--line-on-light)] px-6 py-3 font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--ink-muted)] transition-colors hover:border-[var(--ink)] hover:text-[var(--ink)] disabled:opacity-50"
            >
              Save as draft
            </button>
          )}
        </div>
      </form>

      {/* Right: Live Preview */}
      <div className="hidden lg:block">
        <div className="sticky top-10">
          <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.25em] text-[var(--ink-faint)]">
            Preview
          </p>
          <div className="overflow-hidden rounded border border-[var(--line-on-light)] bg-[var(--warm-white)]">
            {/* Image */}
            <div className="aspect-square bg-[var(--bone)]">
              {primaryImage ? (
                <img
                  src={primaryImage}
                  alt={name || "Product image"}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full items-center justify-center">
                  <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-[var(--ink-faint)]">
                    No image
                  </p>
                </div>
              )}
            </div>
            {/* Gallery strip */}
            {gallery.length > 0 && (
              <div className="flex h-14 gap-1 overflow-x-auto border-t border-[var(--line-on-light)] bg-[var(--ivory)] p-1">
                {gallery.slice(0, 4).map((url) => (
                  <div key={url} className="h-full w-14 shrink-0 overflow-hidden rounded">
                    <img src={url} alt="" className="h-full w-full object-cover" />
                  </div>
                ))}
              </div>
            )}
            {/* Info */}
            <div className="p-4">
              {selectedCategory && (
                <p className="mb-1 font-mono text-[9px] uppercase tracking-[0.20em] text-[var(--accent)]">
                  {selectedCategory.name}
                </p>
              )}
              <p className="font-display text-lg italic leading-tight text-[var(--ink)]">
                {name || "Product name"}
              </p>
              {description && (
                <p className="mt-2 line-clamp-3 font-mono text-xs text-[var(--ink-muted)]">
                  {description}
                </p>
              )}
              {price && (
                <p className="mt-3 font-display text-base text-[var(--ink)]">
                  KSh {Number(price).toLocaleString()}
                </p>
              )}
              <div className="mt-4">
                <p className="w-full border border-[var(--ink)] px-4 py-2.5 text-center font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--ink)]">
                  Request enquiry
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function GalleryItem({
  url,
  index,
  total,
  onRemove,
  onMoveLeft,
  onMoveRight,
  isPrimary,
  onSetPrimary,
}: {
  url: string;
  index: number;
  total: number;
  onRemove: () => void;
  onMoveLeft: () => void;
  onMoveRight: () => void;
  isPrimary: boolean;
  onSetPrimary: () => void;
}) {
  return (
    <div className={`relative group rounded border ${isPrimary ? "border-[var(--accent)]" : "border-[var(--line-on-light)]"}`}>
      <img src={url} alt="" className="h-20 w-20 rounded object-cover" />
      <button
        type="button"
        onClick={onRemove}
        className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full border border-[var(--line-on-light)] bg-[var(--warm-white)] text-[var(--ink-muted)] opacity-0 transition-opacity group-hover:opacity-100 hover:border-red-400 hover:text-red-600"
        aria-label="Remove image"
      >
        <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
          <path d="M2 2l6 6M8 2L2 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
      </button>
      {isPrimary && (
        <span className="absolute bottom-1 left-1 rounded bg-[var(--accent)] px-1 py-0.5 font-mono text-[7px] uppercase tracking-[0.1em] text-white">
          Main
        </span>
      )}
      <div className="absolute inset-y-0 left-0 flex items-center opacity-0 transition-opacity group-hover:opacity-100">
        <button
          type="button"
          onClick={onMoveLeft}
          disabled={index === 0}
          className="flex h-5 w-4 items-center justify-center rounded-r bg-[var(--ink)]/60 text-white disabled:opacity-30"
          aria-label="Move left"
        >
          <svg width="8" height="8" viewBox="0 0 8 8" fill="none"><path d="M5 1L2 4l3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </button>
      </div>
      <div className="absolute inset-y-0 right-0 flex items-center opacity-0 transition-opacity group-hover:opacity-100">
        <button
          type="button"
          onClick={onMoveRight}
          disabled={index === total - 1}
          className="flex h-5 w-4 items-center justify-center rounded-l bg-[var(--ink)]/60 text-white disabled:opacity-30"
          aria-label="Move right"
        >
          <svg width="8" height="8" viewBox="0 0 8 8" fill="none"><path d="M3 1l3 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </button>
      </div>
      {!isPrimary && (
        <button
          type="button"
          onClick={onSetPrimary}
          className="absolute bottom-1 right-1 rounded bg-[var(--ink)]/60 px-1 py-0.5 font-mono text-[7px] uppercase tracking-[0.1em] text-white opacity-0 transition-opacity group-hover:opacity-100"
          title="Set as primary image"
        >
          Set main
        </button>
      )}
    </div>
  );
}
