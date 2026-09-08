"use client";

import { useState, useTransition } from "react";
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
  const [, startTransition] = useTransition();
  const [expanded, setExpanded] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");

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

  return (
    <div className="max-w-[1200px]">
      <p className="label-on-light">Business</p>
      <h1 className="mt-2 max-w-[16ch] font-display text-4xl italic leading-[1.02] tracking-[-0.015em] text-[var(--ink)]">
        Enquiries
      </h1>
      <p className="mt-4 max-w-[60ch] body-on-light">
        Messages submitted through the contact form. Update the status as you respond to each one.
      </p>

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
              No enquiries in this category.
            </p>
          </div>
        ) : (
          filtered.map((enquiry) => (
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
                  <span
                    className={`font-mono text-[10px] uppercase tracking-[0.18em] ${
                      enquiry.status === "new"
                        ? "text-[var(--sand)]"
                        : "text-[var(--ink-faint)]"
                    }`}
                  >
                    {STATUS_LABELS[enquiry.status] ?? enquiry.status}
                  </span>
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
                          startTransition(async () => {
                            await setEnquiryStatusAction(enquiry.id, s);
                          });
                        }}
                        className={`border px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.15em] transition-colors ${
                          enquiry.status === s
                            ? "border-[var(--ink)] bg-[var(--ink)] text-[var(--warm-white)]"
                            : "border-[var(--line-on-light)] text-[var(--ink-muted)] hover:border-[var(--ink)] hover:text-[var(--ink)]"
                        }`}
                      >
                        {STATUS_LABELS[s]}
                      </button>
                    ))}
                    <button
                      onClick={() => {
                        if (!confirm("Delete this enquiry? This cannot be undone.")) return;
                        startTransition(async () => {
                          await deleteEnquiryAction(enquiry.id);
                        });
                      }}
                      className="ml-auto font-mono text-[10px] uppercase tracking-[0.18em] text-red-600 transition-colors hover:text-red-800"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
