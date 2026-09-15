"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  setEnquiryStatusAction,
  deleteEnquiryAction,
} from "@/lib/admin-actions";

type Enquiry = {
  id: string;
  name: string;
  email: string;
  company: string | null;
  phone: string | null;
  type: string;
  message: string;
  status: string;
  created_at: string;
};

type Props = { enquiries: Enquiry[] };

const STATUS_LABELS: Record<string, string> = {
  new: "New",
  in_review: "In review",
  responded: "Responded",
  closed: "Closed",
};

const STATUS_OPTIONS = ["new", "in_review", "responded", "closed"] as const;

const TYPE_LABELS: Record<string, string> = {
  general: "General",
  sample: "Sample",
  export: "Export",
  wholesale: "Wholesale",
  partnership: "Partnership",
  other: "Other",
};

export default function EnquiriesClient({ enquiries }: Props) {
  const router = useRouter();
  const [, startTransition] = useTransition();
  const [expanded, setExpanded] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [busyId, setBusyId] = useState<string | null>(null);
  const [notice, setNotice] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const filtered = enquiries.filter(
    (e) =>
      (statusFilter === "all" || e.status === statusFilter) &&
      (typeFilter === "all" || e.type === typeFilter)
  );

  const counts = {
    all: enquiries.length,
    new: enquiries.filter((e) => e.status === "new").length,
    in_review: enquiries.filter((e) => e.status === "in_review").length,
    responded: enquiries.filter((e) => e.status === "responded").length,
    closed: enquiries.filter((e) => e.status === "closed").length,
  };

  const allTypes = Array.from(new Set(enquiries.map((e) => e.type))).sort();
  const hasFilters = statusFilter !== "all" || typeFilter !== "all";

  const showNotice = (type: "success" | "error", text: string) => {
    setNotice({ type, text });
    setTimeout(() => setNotice(null), 4000);
  };

  const changeStatus = (id: string, status: (typeof STATUS_OPTIONS)[number]) => {
    if (busyId) return;
    setBusyId(id);
    startTransition(async () => {
      try {
        await setEnquiryStatusAction(id, status);
        showNotice("success", `Moved to ${STATUS_LABELS[status]}.`);
        router.refresh();
      } catch {
        showNotice("error", "Could not update status. Nothing was changed.");
      } finally {
        setBusyId(null);
      }
    });
  };

  const removeEnquiry = (enquiry: Enquiry) => {
    if (busyId) return;
    if (!confirm(`Delete this enquiry from ${enquiry.name}? This cannot be undone.`)) return;
    setBusyId(enquiry.id);
    startTransition(async () => {
      try {
        await deleteEnquiryAction(enquiry.id);
        showNotice("success", "Enquiry deleted.");
        router.refresh();
      } catch {
        showNotice("error", "Could not delete enquiry. Nothing was changed.");
      } finally {
        setBusyId(null);
      }
    });
  };

  return (
    <div className="max-w-[1200px]">
      <p className="label-on-light">Business</p>
      <h1 className="mt-2 max-w-[16ch] font-display text-4xl italic leading-[1.02] tracking-[-0.015em] text-[var(--ink)]">
        Enquiries
      </h1>
      <p className="mt-4 max-w-[60ch] body-on-light">
        Messages submitted through the contact form. Update the status as you respond to each one.
      </p>

      {notice && (
        <div
          className={`mt-6 rounded border px-4 py-3 font-mono text-xs ${
            notice.type === "success"
              ? "border border-[var(--forest)]/30 bg-[var(--forest)]/5 text-[var(--forest)]"
              : "border border-red-200 bg-red-50 text-red-600"
          }`}
        >
          {notice.text}
        </div>
      )}

      <div className="mt-8 space-y-3">
        <div className="flex flex-wrap gap-2">
          <span className="self-center font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--ink-faint)]">Status:</span>
          {(["all", ...STATUS_OPTIONS] as const).map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-4 py-2 font-mono text-[10px] uppercase tracking-[0.18em] transition-colors border ${
                statusFilter === s
                  ? "border-[var(--ink)] bg-[var(--ink)] text-[var(--warm-white)]"
                  : "border-[var(--line-on-light)] text-[var(--ink-muted)] hover:border-[var(--ink)] hover:text-[var(--ink)]"
              }`}
            >
              {s === "all" ? "All" : STATUS_LABELS[s]} ({counts[s]})
            </button>
          ))}
        </div>

        {allTypes.length > 1 && (
          <div className="flex flex-wrap gap-2">
            <span className="self-center font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--ink-faint)]">Type:</span>
            <button
              onClick={() => setTypeFilter("all")}
              className={`px-4 py-2 font-mono text-[10px] uppercase tracking-[0.18em] transition-colors border ${
                typeFilter === "all"
                  ? "border-[var(--ink)] bg-[var(--ink)] text-[var(--warm-white)]"
                  : "border-[var(--line-on-light)] text-[var(--ink-muted)] hover:border-[var(--ink)] hover:text-[var(--ink)]"
              }`}
            >
              All types
            </button>
            {allTypes.map((t) => (
              <button
                key={t}
                onClick={() => setTypeFilter(t)}
                className={`px-4 py-2 font-mono text-[10px] uppercase tracking-[0.18em] transition-colors border ${
                  typeFilter === t
                    ? "border-[var(--ink)] bg-[var(--ink)] text-[var(--warm-white)]"
                    : "border-[var(--line-on-light)] text-[var(--ink-muted)] hover:border-[var(--ink)] hover:text-[var(--ink)]"
                }`}
              >
                {TYPE_LABELS[t] ?? t} ({enquiries.filter((e) => e.type === t).length})
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="mt-6 space-y-3">
        {filtered.length === 0 ? (
          <div className="card-light p-10 text-center">
            <p className="font-display text-base italic text-[var(--ink)]/60">
              {enquiries.length === 0
                ? "No enquiries yet."
                : hasFilters
                  ? "No enquiries match this filter."
                  : "No enquiries."}
            </p>
            <p className="mt-2 font-mono text-xs text-[var(--ink-faint)]">
              {enquiries.length === 0
                ? "Enquiries submitted through the contact form will appear here."
                : "Try a different status or type filter."}
            </p>
          </div>
        ) : (
          filtered.map((enquiry) => {
            const busy = busyId === enquiry.id;
            return (
              <div key={enquiry.id} className="card-light overflow-hidden">
                <button
                  onClick={() => setExpanded(expanded === enquiry.id ? null : enquiry.id)}
                  className="flex w-full items-start justify-between gap-4 p-5 text-left"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-3 flex-wrap">
                      <p className="font-display text-base italic text-[var(--ink)]">{enquiry.name}</p>
                      <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-[var(--ink-muted)]">
                        {enquiry.company || enquiry.email}
                      </span>
                      <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-[var(--ink-faint)]">
                        {enquiry.type}
                      </span>
                    </div>
                    <p className="mt-1 line-clamp-1 font-mono text-[10px] uppercase tracking-[0.15em] text-[var(--ink-faint)]">
                      {new Date(enquiry.created_at).toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    {enquiry.status === "new" ? (
                      <span className="rounded bg-[var(--champagne)]/80 px-2 py-1 font-mono text-[9px] uppercase tracking-[0.18em] text-[var(--ink)]">
                        {STATUS_LABELS[enquiry.status]}
                      </span>
                    ) : (
                      <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--ink-faint)]">
                        {STATUS_LABELS[enquiry.status] ?? enquiry.status}
                      </span>
                    )}
                    <span className="text-[var(--ink-faint)] text-sm">
                      {expanded === enquiry.id ? "▲" : "▼"}
                    </span>
                  </div>
                </button>

                {expanded === enquiry.id && (
                  <div className="border-t border-[var(--line-on-light)] px-5 py-5">
                    <div className="grid gap-5 md:grid-cols-2">
                      <div className="space-y-3">
                        <div>
                          <p className="font-mono text-[9px] uppercase tracking-[0.25em] text-[var(--ink-faint)]">Email</p>
                          <a
                            href={`mailto:${enquiry.email}`}
                            className="font-mono text-xs text-[var(--accent)] hover:underline"
                          >
                            {enquiry.email}
                          </a>
                        </div>
                        {enquiry.phone && (
                          <div>
                            <p className="font-mono text-[9px] uppercase tracking-[0.25em] text-[var(--ink-faint)]">Phone</p>
                            <a
                              href={`tel:${enquiry.phone}`}
                              className="font-mono text-xs text-[var(--accent)] hover:underline"
                            >
                              {enquiry.phone}
                            </a>
                          </div>
                        )}
                        {enquiry.company && (
                          <div>
                            <p className="font-mono text-[9px] uppercase tracking-[0.25em] text-[var(--ink-faint)]">Company</p>
                            <p className="font-mono text-xs text-[var(--ink)]">{enquiry.company}</p>
                          </div>
                        )}
                      </div>
                      <div>
                        <p className="font-mono text-[9px] uppercase tracking-[0.25em] text-[var(--ink-faint)]">Message</p>
                        <p className="mt-1 body-on-light whitespace-pre-wrap">{enquiry.message}</p>
                      </div>
                    </div>

                    <div className="mt-5 flex items-center gap-3 flex-wrap border-t border-[var(--line-on-light)] pt-5">
                      <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--ink-muted)] mr-2">
                        Status:
                      </p>
                      {STATUS_OPTIONS.map((s) => (
                        <button
                          key={s}
                          onClick={() => {
                            if (enquiry.status === s) return;
                            changeStatus(enquiry.id, s);
                          }}
                          disabled={busy}
                          className={`border px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.15em] transition-colors disabled:cursor-not-allowed disabled:opacity-40 ${
                            enquiry.status === s
                              ? "border-[var(--ink)] bg-[var(--ink)] text-[var(--warm-white)]"
                              : "border-[var(--line-on-light)] text-[var(--ink-muted)] hover:border-[var(--ink)] hover:text-[var(--ink)]"
                          }`}
                        >
                          {STATUS_LABELS[s]}
                        </button>
                      ))}
                      <button
                        onClick={() => removeEnquiry(enquiry)}
                        disabled={busy}
                        className="ml-auto font-mono text-[10px] uppercase tracking-[0.18em] text-red-600 transition-colors hover:text-red-800 disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        {busy ? "Working…" : "Delete"}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}