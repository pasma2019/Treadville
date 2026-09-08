"use client";

import { useState, useTransition } from "react";
import {
  createArticleAction,
  updateArticleAction,
  setArticleStatusAction,
  deleteArticleAction,
} from "@/lib/admin-actions";
import type { Article } from "@/lib/types";
import ArticleForm from "./ArticleForm";

type Props = { articles: Article[] };

const STATUS_LABELS: Record<string, string> = {
  draft: "Draft",
  published: "Published",
};

const STATUS_CLASS: Record<string, string> = {
  draft: "bg-[var(--champagne)]/40 text-[var(--ink)]",
  published: "bg-[var(--forest)]/10 text-[var(--forest)]",
};

export default function JournalClient({ articles }: Props) {
  const [filter, setFilter] = useState<"all" | "draft" | "published">("all");
  const [editing, setEditing] = useState<Article | null>(null);
  const [creating, setCreating] = useState(false);
  const [, startTransition] = useTransition();

  const filtered = articles.filter((a) =>
    filter === "all" ? true : a.status === filter
  );

  const handleStatus = (id: string, status: "draft" | "published") => {
    startTransition(async () => {
      await setArticleStatusAction(id, status);
    });
  };

  const handleDelete = (id: string) => {
    if (!confirm("Delete this article? This cannot be undone.")) return;
    startTransition(async () => {
      await deleteArticleAction(id);
    });
  };

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex gap-1">
          {(["all", "draft", "published"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`border px-4 py-2 font-mono text-[10px] uppercase tracking-[0.18em] transition-colors ${
                filter === f
                  ? "border-[var(--ink)] bg-[var(--ink)] text-[var(--warm-white)]"
                  : "border-[var(--line-on-light)] text-[var(--ink-muted)] hover:border-[var(--ink)] hover:text-[var(--ink)]"
              }`}
            >
              {f === "all" ? "All" : f === "draft" ? "Drafts" : "Published"}
              <span className="ml-1.5 opacity-60">
                {f === "all" ? articles.length : articles.filter((a) => a.status === f).length}
              </span>
            </button>
          ))}
        </div>
        <button
          onClick={() => setCreating(true)}
          className="border border-[var(--ink)] bg-[var(--ink)] px-5 py-2 font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--warm-white)] transition-colors hover:bg-[var(--warm-white)] hover:text-[var(--ink)]"
        >
          New article
        </button>
      </div>

      {(creating || editing) && (
        <div className="mb-8 rounded border border-[var(--line-on-light)] bg-[var(--warm-white)] p-6">
          <h2 className="mb-4 font-display text-lg font-semibold text-[var(--ink)]">
            {editing ? "Edit article" : "New article"}
          </h2>
          <ArticleForm
            article={editing ?? undefined}
            onSuccess={() => {
              setCreating(false);
              setEditing(null);
            }}
            onCancel={() => {
              setCreating(false);
              setEditing(null);
            }}
          />
        </div>
      )}

      {filtered.length === 0 ? (
        <div className="rounded border border-dashed border-[var(--line-on-light)] py-16 text-center">
          <p className="font-display text-base italic text-[var(--ink-muted)]">
            {filter === "all" ? "No articles yet." : `No ${filter} articles.`}
          </p>
          <p className="mt-2 font-mono text-sm text-[var(--ink-faint)]">
            {filter === "all" ? "Create your first article to get started." : ""}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((article) => (
            <article
              key={article.id}
              className="flex flex-col gap-4 rounded border border-[var(--line-on-light)] bg-[var(--warm-white)] p-5 md:flex-row md:items-start md:justify-between"
            >
              <div className="flex gap-4">
                {article.cover_image_url && (
                  <div className="h-16 w-16 shrink-0 overflow-hidden rounded">
                    <img
                      src={article.cover_image_url}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                  </div>
                )}
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-display text-base font-medium text-[var(--ink)] truncate">
                      {article.title}
                    </h3>
                    <span
                      className={`shrink-0 rounded px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.18em] ${STATUS_CLASS[article.status]}`}
                    >
                      {STATUS_LABELS[article.status]}
                    </span>
                  </div>
                  {article.excerpt && (
                    <p className="mt-1 line-clamp-2 font-mono text-xs text-[var(--ink-muted)]">
                      {article.excerpt}
                    </p>
                  )}
                  <p className="mt-1.5 font-mono text-[10px] text-[var(--ink-faint)]">
                    {article.author_name && <span>{article.author_name} · </span>}
                    Updated {new Date(article.updated_at).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                  </p>
                </div>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <button
                  onClick={() => handleStatus(article.id, article.status === "published" ? "draft" : "published")}
                  className="border border-[var(--line-on-light)] px-3 py-1.5 font-mono text-[9px] uppercase tracking-[0.15em] text-[var(--ink-muted)] transition-colors hover:border-[var(--ink)] hover:text-[var(--ink)]"
                >
                  {article.status === "published" ? "Unpublish" : "Publish"}
                </button>
                <button
                  onClick={() => setEditing(article)}
                  className="border border-[var(--line-on-light)] px-3 py-1.5 font-mono text-[9px] uppercase tracking-[0.15em] text-[var(--ink-muted)] transition-colors hover:border-[var(--ink)] hover:text-[var(--ink)]"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(article.id)}
                  className="border border-red-200 px-3 py-1.5 font-mono text-[9px] uppercase tracking-[0.15em] text-red-500 transition-colors hover:border-red-500 hover:text-red-700"
                >
                  Delete
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
