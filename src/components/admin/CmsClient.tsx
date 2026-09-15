"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { setSiteContentAction } from "@/lib/admin-actions";
import {
  CMS_SECTIONS,
  CMS_STATIC_FIELDS,
  cmsFieldsForCategories,
  type CmsField,
} from "@/lib/cms-fields";
import ImageUpload from "./ImageUpload";
import type { Category } from "@/lib/types";

type Props = {
  initialValues: Record<string, string>;
  categories: Category[];
};

type SaveStatus = { state: "saving" } | { state: "saved" } | { state: "error"; message: string };

export default function CmsClient({ initialValues, categories }: Props) {
  const router = useRouter();
  const [activeSection, setActiveSection] = useState<string>(CMS_SECTIONS[0].id);
  const [draft, setDraft] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<Record<string, SaveStatus>>({});
  const [version, setVersion] = useState<Record<string, number>>({});

  const fields: CmsField[] = [
    ...CMS_STATIC_FIELDS,
    ...cmsFieldsForCategories(categories),
  ];

  const initialOf = (f: CmsField): string =>
    initialValues[f.key] ?? f.fallback ?? "";

  const visible = (f: CmsField): string =>
    f.key in draft ? draft[f.key] : initialOf(f);

  const unsaved = (f: CmsField): boolean =>
    f.key in draft && draft[f.key] !== initialOf(f);

  const saveField = async (f: CmsField) => {
    setStatus((s) => ({ ...s, [f.key]: { state: "saving" } }));
    const value = visible(f);
    const result = await setSiteContentAction(f.key, value);
    if ("error" in result) {
      setStatus((s) => ({ ...s, [f.key]: { state: "error", message: result.error } }));
      return;
    }
    setDraft((d) => {
      const next = { ...d };
      delete next[f.key];
      return next;
    });
    setVersion((v) => ({ ...v, [f.key]: (v[f.key] ?? 0) + 1 }));
    setStatus((s) => ({ ...s, [f.key]: { state: "saved" } }));
    setTimeout(() => {
      setStatus((s) => {
        if (s[f.key]?.state === "saved") {
          const next = { ...s };
          delete next[f.key];
          return next;
        }
        return s;
      });
    }, 2200);
    router.refresh();
  };

  const sections = CMS_SECTIONS.map((section) => ({
    ...section,
    fields: fields.filter((f) => f.section === section.id),
  }));

  return (
    <div className="max-w-[900px]">
      <p className="label-on-light">Site content</p>
      <h1 className="mt-2 max-w-[18ch] font-display text-4xl italic leading-[1.02] tracking-[-0.015em] text-[var(--ink)]">
        Content
      </h1>
      <p className="mt-4 max-w-[62ch] body-on-light">
        Every field here controls the exact words and images customers see. Save changes and
        they appear on the storefront immediately.
      </p>

      <div className="mt-8 flex gap-1 border-b border-[var(--line-on-light)]">
        {sections.map((section) => (
          <button
            key={section.id}
            onClick={() => setActiveSection(section.id)}
            className={`border-b-2 px-4 py-3 font-mono text-[10px] uppercase tracking-[0.18em] transition-colors ${
              activeSection === section.id
                ? "border-[var(--ink)] text-[var(--ink)]"
                : "border-transparent text-[var(--ink-muted)] hover:text-[var(--ink)]"
            }`}
          >
            {section.label}
          </button>
        ))}
      </div>

      <div className="mt-10 space-y-8">
        {sections
          .filter((s) => s.id === activeSection)
          .map((section) => (
            <div key={section.id} className="space-y-6">
              {section.fields.length === 0 && (
                <div className="rounded border border-dashed border-[var(--line-on-light)] px-6 py-10 text-center">
                  <p className="font-mono text-xs text-[var(--ink-muted)]">
                    No editable content in this section yet.
                  </p>
                </div>
              )}
              {section.fields.map((f) =>
                f.type === "image" ? (
                  <CmsImageField
                    key={`${f.key}:${version[f.key] ?? 0}`}
                    field={f}
                    value={visible(f)}
                    unsaved={unsaved(f)}
                    status={status[f.key]}
                    onStage={(value) => setDraft((d) => ({ ...d, [f.key]: value }))}
                    onSave={() => saveField(f)}
                  />
                ) : (
                  <CmsTextField
                    key={f.key}
                    field={f}
                    value={visible(f)}
                    initialValue={initialOf(f)}
                    unsaved={unsaved(f)}
                    status={status[f.key]}
                    onValue={(value) => setDraft((d) => ({ ...d, [f.key]: value }))}
                    onSave={() => saveField(f)}
                  />
                )
              )}
            </div>
          ))}
      </div>
    </div>
  );
}

function CmsTextField({
  field,
  value,
  initialValue,
  unsaved,
  status,
  onValue,
  onSave,
}: {
  field: CmsField;
  value: string;
  initialValue: string;
  unsaved: boolean;
  status?: SaveStatus;
  onValue: (value: string) => void;
  onSave: () => void;
}) {
  return (
    <div className="card-light-soft p-6">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="label-on-light">{field.label}</p>
          {field.hint && (
            <p className="mt-1 text-[11px] leading-snug text-[var(--ink-faint)]">{field.hint}</p>
          )}
        </div>
        {unsaved && <span className="shrink-0 rounded bg-[var(--champagne)]/60 px-2 py-1 font-mono text-[9px] uppercase tracking-[0.18em] text-[var(--ink)]">Unsaved</span>}
      </div>
      {!unsaved && (
        <p className="mt-2 font-mono text-[9px] uppercase tracking-[0.2em] text-[var(--ink-faint)]">
          {initialValue ? "Saved" : "No saved value yet"}
        </p>
      )}
      <div className="mt-4 flex flex-col gap-3 md:flex-row">
        <textarea
          value={value}
          onChange={(e) => onValue(e.target.value)}
          rows={field.rows ?? 3}
          className="field-light flex-1 resize-none"
          aria-label={field.label}
        />
        <div className="flex shrink-0 flex-col gap-2 md:w-auto">
          <button
            type="button"
            onClick={onSave}
            disabled={status?.state === "saving"}
            className="border border-[var(--ink)] bg-[var(--ink)] px-6 py-3 font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--warm-white)] transition-colors hover:bg-[var(--warm-white)] hover:text-[var(--ink)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(212,190,145,0.50)] focus-visible:ring-offset-2 disabled:opacity-50"
          >
            {status?.state === "saving" ? "Saving…" : status?.state === "saved" ? "Saved" : "Save"}
          </button>
          {status?.state === "error" && (
            <p role="alert" className="max-w-[220px] font-mono text-[10px] leading-snug text-red-600">
              {status.message}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

function CmsImageField({
  field,
  value,
  unsaved,
  status,
  onStage,
  onSave,
}: {
  field: CmsField;
  value: string;
  unsaved: boolean;
  status?: SaveStatus;
  onStage: (value: string) => void;
  onSave: () => void;
}) {
  return (
    <div className="card-light-soft p-6">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="label-on-light">{field.label}</p>
          {field.hint && (
            <p className="mt-1 text-[11px] leading-snug text-[var(--ink-faint)]">{field.hint}</p>
          )}
          {field.imageRole && (
            <p className="mt-1 font-mono text-[9px] uppercase tracking-[0.2em] text-[var(--ink-faint)]">
              {field.imageRole}
            </p>
          )}
        </div>
        {unsaved && <span className="shrink-0 rounded bg-[var(--champagne)]/60 px-2 py-1 font-mono text-[9px] uppercase tracking-[0.18em] text-[var(--ink)]">Unsaved</span>}
      </div>

      <div className="mt-4">
        <ImageUpload
          initialUrl={value || null}
          onUpload={(url) => onStage(url)}
          onRemove={() => onStage("")}
          label=""
        />
      </div>

      <div className="mt-4 flex items-center gap-3">
        <button
          type="button"
          onClick={onSave}
          disabled={status?.state === "saving"}
          className="border border-[var(--ink)] bg-[var(--ink)] px-6 py-3 font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--warm-white)] transition-colors hover:bg-[var(--warm-white)] hover:text-[var(--ink)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(212,190,145,0.50)] focus-visible:ring-offset-2 disabled:opacity-50"
        >
          {status?.state === "saving" ? "Saving…" : status?.state === "saved" ? "Saved" : "Save"}
        </button>
        <p className="font-mono text-[10px] text-[var(--ink-faint)]">
          {unsaved
            ? "Changes are not yet live. Removing an image only takes effect after you save."
            : "Current image shown — changes here don't affect the site until you save."}
        </p>
        {status?.state === "error" && (
          <p role="alert" className="max-w-[260px] font-mono text-[10px] leading-snug text-red-600">
            {status.message}
          </p>
        )}
      </div>
    </div>
  );
}