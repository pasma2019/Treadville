"use client";

import { useState, useTransition } from "react";
import {
  createArticleAction,
  updateArticleAction,
} from "@/lib/admin-actions";
import type { Article } from "@/lib/types";
import type { ArticleFormState } from "@/lib/admin-actions";
import ImageUpload from "./ImageUpload";
import TiptapEditor from "./TiptapEditor";
import { useUnsavedGuard } from "@/lib/use-unsaved-guard";

type Props = {
  article?: Article;
  onSuccess: () => void;
  onCancel: () => void;
};

export default function ArticleForm({ article, onSuccess, onCancel }: Props) {
  const [pending, startTransition] = useTransition();
  const [formState, setFormState] = useState<ArticleFormState | null>(null);
  const [imageUrl, setImageUrl] = useState<string>(article?.cover_image_url ?? "");
  const [publishNow, setPublishNow] = useState(article?.status === "published");
  const [bodyContent, setBodyContent] = useState(article?.body ?? "");
  const [dirty, setDirty] = useState(false);
  useUnsavedGuard(dirty, "This article has unsaved changes. Leave without saving?");

  const markDirty = () => setDirty(true);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormState(null);
    const fd = new FormData(e.currentTarget);
    fd.set("cover_image_url", imageUrl);
    fd.set("status", publishNow ? "published" : "draft");
    fd.set("body", bodyContent);

    startTransition(async () => {
      const result = article
        ? await updateArticleAction(article.id, {}, fd)
        : await createArticleAction({}, fd);

      if (result.error) {
        setFormState({ error: result.error });
      } else {
        onSuccess();
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {dirty && (
        <p className="inline-flex rounded bg-[var(--champagne)]/60 px-2 py-1 font-mono text-[9px] uppercase tracking-[0.18em] text-[var(--ink)]">
          Unsaved changes
        </p>
      )}
      <div className="grid gap-5 md:grid-cols-2">
        <div>
          <label htmlFor="af-title" className="mb-1.5 block font-mono text-[10px] uppercase tracking-[0.20em] text-[var(--ink-muted)]">
            Title *
          </label>
          <input
            id="af-title"
            name="title"
            type="text"
            required
            defaultValue={article?.title ?? ""}
            onChange={markDirty}
            placeholder="e.g. The Harvest Season Begins"
            className="field-light w-full"
          />
        </div>
        <div>
          <label htmlFor="af-slug" className="mb-1.5 block font-mono text-[10px] uppercase tracking-[0.20em] text-[var(--ink-muted)]">
            Slug
          </label>
          <input
            id="af-slug"
            name="slug"
            type="text"
            defaultValue={article?.slug ?? ""}
            onChange={markDirty}
            placeholder="Auto-generated if blank"
            className="field-light w-full"
          />
        </div>
        <div>
          <label htmlFor="af-author" className="mb-1.5 block font-mono text-[10px] uppercase tracking-[0.20em] text-[var(--ink-muted)]">
            Author
          </label>
          <input
            id="af-author"
            name="author_name"
            type="text"
            defaultValue={article?.author_name ?? ""}
            onChange={markDirty}
            placeholder="e.g. Eunice Wanjiku"
            className="field-light w-full"
          />
        </div>
        <div className="flex flex-col">
          <span className="mb-1.5 block font-mono text-[10px] uppercase tracking-[0.20em] text-[var(--ink-muted)]">
            Cover image
          </span>
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
        <div className="md:col-span-2">
          <label htmlFor="af-excerpt" className="mb-1.5 block font-mono text-[10px] uppercase tracking-[0.20em] text-[var(--ink-muted)]">
            Excerpt
          </label>
          <textarea
            id="af-excerpt"
            name="excerpt"
            rows={2}
            defaultValue={article?.excerpt ?? ""}
            onChange={markDirty}
            placeholder="A brief summary shown in article listings…"
            className="field-light w-full resize-none"
          />
        </div>
        <div className="md:col-span-2">
          <span className="mb-1.5 block font-mono text-[10px] uppercase tracking-[0.20em] text-[var(--ink-muted)]">
            Body
          </span>
          <TiptapEditor
            content={bodyContent}
            onChange={(v) => {
              setBodyContent(v);
              markDirty();
            }}
            placeholder="Write the full article here…"
          />
        </div>
        <div className="md:col-span-2 flex items-center gap-6">
          <label className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.15em] text-[var(--ink)]">
            <input
              type="checkbox"
              checked={publishNow}
              onChange={(e) => {
                setPublishNow(e.target.checked);
                markDirty();
              }}
              className="h-4 w-4 accent-[var(--accent)]"
            />
            Publish immediately
          </label>
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
          {pending ? "Saving…" : article ? "Save changes" : "Create article"}
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
  );
}
