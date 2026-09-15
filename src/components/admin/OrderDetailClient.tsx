"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  nextOrderStatuses,
  ORDER_COMMUNICATION_CHANNELS,
  ORDER_COMMUNICATION_MAX_LENGTH,
  ORDER_STATUS_LABELS,
} from "@/lib/order-status";
import type { OrderStatus } from "@/lib/types";
import { updateOrderNotesAction, setOrderStatusAction, logOrderCommunicationAction } from "@/lib/admin-actions";
import { buildWaLink } from "@/lib/wa-link";

type OrderDetail = {
  id: string;
  reference_number: string;
  customer_id: string;
  status: string;
  customer_name: string;
  customer_phone: string;
  customer_email: string | null;
  delivery_location: string | null;
  customer_notes: string | null;
  internal_notes: string | null;
  created_at: string;
  updated_at: string;
};

type OrderItem = {
  product_name: string;
  quantity: number;
};

type OtherOrder = {
  id: string;
  reference_number: string;
  status: string;
  created_at: string;
};

type OrderCommunication = {
  id: string;
  channel: string;
  message_summary: string;
  sent_by_email: string | null;
  sent_at: string;
};

type Props = {
  order: OrderDetail;
  items: OrderItem[];
  otherOrders: OtherOrder[];
  communications: OrderCommunication[];
};

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="font-mono text-[9px] uppercase tracking-[0.25em] text-[var(--ink-faint)]">
      {children}
    </p>
  );
}

export default function OrderDetailClient({ order, items, otherOrders, communications }: Props) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [orderStatus, setOrderStatus] = useState(order.status);
  const [notes, setNotes] = useState(order.internal_notes ?? "");
  const [feedback, setFeedback] = useState<{ kind: "ok" | "error"; text: string } | null>(null);

  const [channel, setChannel] = useState<string>("whatsapp");
  const [message, setMessage] = useState(
    () => defaultCommunicationMessage(order.customer_name, order.reference_number, order.status)
  );
  const [commFeedback, setCommFeedback] = useState<{ kind: "ok" | "error"; text: string } | null>(null);

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);

  const statusLabel = (s: string) => ORDER_STATUS_LABELS[s as keyof typeof ORDER_STATUS_LABELS] ?? s;

  const waLink = buildWaLink(order.customer_phone, message);

  function saveNotes(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (pending) return;
    setFeedback(null);
    startTransition(async () => {
      const result = await updateOrderNotesAction(order.id, notes);
      setFeedback(
        "error" in result
          ? { kind: "error", text: result.error }
          : { kind: "ok", text: "Saved." }
      );
    });
  }

  function changeStatus(s: (typeof ORDER_STATUS_LABELS)[keyof typeof ORDER_STATUS_LABELS]) {
    if (orderStatus === s) return;
    if (pending) return;
    setFeedback(null);
    startTransition(async () => {
      const result = await setOrderStatusAction(order.id, s);
      if ("error" in result) {
        setFeedback({ kind: "error", text: result.error });
      } else {
        setOrderStatus(s);
        setFeedback({ kind: "ok", text: `Status set to ${s}.` });
        router.refresh();
      }
    });
  }

  function logCommunication() {
    if (!message.trim()) return;
    if (pending) return;
    setCommFeedback(null);
    startTransition(async () => {
      const result = await logOrderCommunicationAction(order.id, channel, message);
      if ("error" in result) {
        setCommFeedback({ kind: "error", text: result.error });
      } else {
        setCommFeedback({ kind: "ok", text: "Communication logged." });
        setMessage("");
        router.refresh();
      }
    });
  }

  const allowedNext = nextOrderStatuses(orderStatus as OrderStatus);

  return (
    <div className="max-w-[1200px]">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <Link
            href="/admin/orders"
            className="font-mono text-[10px] uppercase tracking-[0.20em] text-[var(--ink-muted)] transition-colors hover:text-[var(--ink)]"
          >
            ← Back to orders
          </Link>
          <p className="mt-6 font-mono text-sm tracking-[0.08em] text-[var(--ink)]">
            {order.reference_number}
          </p>
          <h1 className="mt-1 max-w-[16ch] font-display text-4xl italic leading-[1.02] tracking-[-0.015em] text-[var(--ink)]">
            {order.customer_name}
          </h1>
          <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.15em] text-[var(--ink-faint)]">
            Submitted {new Date(order.created_at).toLocaleDateString("en-GB", {
              day: "numeric",
              month: "short",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </div>
        <span
          className={`shrink-0 rounded border px-2.5 py-1 font-mono text-[11px] uppercase tracking-[0.18em] ${
            order.status === "pending"
              ? "border-[var(--sand)]/50 bg-[var(--champagne)]/60 text-[var(--ink)]"
              : order.status === "cancelled"
                ? "border-[var(--line-on-light)] text-[var(--ink-faint)]"
                : "border-[var(--accent)]/40 text-[var(--accent)]"
          }`}
        >
          {statusLabel(orderStatus)}
        </span>
      </div>

      <div className="mt-10 grid gap-6 lg:grid-cols-[2fr_1fr]">
        <div className="space-y-6">
          <section className="card-light p-6">
            <p className="label-on-light">Line items</p>
            <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.15em] text-[var(--ink-faint)]">
              {items.length} {items.length === 1 ? "line" : "lines"} · {totalItems} items
            </p>
            {items.length === 0 ? (
              <p className="mt-6 font-display text-base italic text-[var(--ink)]/60">
                No line items recorded.
              </p>
            ) : (
              <ul className="mt-4 divide-y divide-[var(--line-on-light)]">
                {items.map((item, i) => (
                  <li key={i} className="flex items-center justify-between gap-4 py-3">
                    <p className="font-display text-base italic text-[var(--ink)]">
                      {item.product_name}
                    </p>
                    <p className="font-mono text-xs text-[var(--ink-muted)]">
                      × {item.quantity}
                    </p>
                  </li>
                ))}
              </ul>
            )}
            <p className="mt-4 border-t border-[var(--line-on-light)] pt-3 font-mono text-[9px] uppercase tracking-[0.2em] text-[var(--ink-faint)]">
              Product and quantity only — prices and totals are not collected at checkout yet.
            </p>
          </section>

          <section className="card-light p-6">
            <p className="label-on-light">Internal notes</p>
            <p className="mt-1 body-on-light text-sm">
              Staff-only. Not shown to the customer.
            </p>
            <form onSubmit={saveNotes} className="mt-4">
              <label htmlFor="internal_notes" className="sr-only">
                Internal notes
              </label>
              <textarea
                id="internal_notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={5}
                placeholder="Triage notes, quote reference, next steps…"
                className="w-full resize-y rounded border border-[var(--line-on-light)] bg-[var(--ivory)] p-4 font-mono text-xs text-[var(--ink)] placeholder:text-[var(--ink-faint)] focus:border-[var(--ink)] focus:outline-none"
              />
              {feedback && (
                <p
                  className={`mt-2 font-mono text-[10px] uppercase tracking-[0.15em] ${
                    feedback.kind === "ok" ? "text-[var(--accent)]" : "text-red-600"
                  }`}
                >
                  {feedback.text}
                </p>
              )}
              <button
                type="submit"
                disabled={pending}
                className="mt-4 border border-[var(--ink)] bg-[var(--ink)] px-5 py-2.5 font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--warm-white)] transition-colors hover:bg-[var(--warm-white)] hover:text-[var(--ink)] disabled:cursor-not-allowed disabled:opacity-40"
              >
                {pending ? "Saving…" : "Save notes"}
              </button>
            </form>
          </section>

          <section className="card-light p-6">
            <p className="label-on-light">Customer communication</p>
            <p className="mt-1 body-on-light text-sm">
              Compose an outreach message. Logging records it against this order —
              it does not send anything.
            </p>

            <div className="mt-4 space-y-3">
              <div>
                <label htmlFor="comm_channel" className="sr-only">
                  Channel
                </label>
                <select
                  id="comm_channel"
                  value={channel}
                  onChange={(e) => setChannel(e.target.value)}
                  className="rounded border border-[var(--line-on-light)] bg-[var(--ivory)] px-3 py-2 font-mono text-xs text-[var(--ink)] focus:border-[var(--ink)] focus:outline-none"
                >
                  {ORDER_COMMUNICATION_CHANNELS.map((c) => (
                    <option key={c} value={c}>
                      {c === "whatsapp" ? "WhatsApp" : "Other (phone call, etc.)"}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="comm_message" className="sr-only">
                  Message summary
                </label>
                <textarea
                  id="comm_message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={6}
                  maxLength={ORDER_COMMUNICATION_MAX_LENGTH}
                  placeholder="What will be / was communicated to the customer…"
                  className="w-full resize-y rounded border border-[var(--line-on-light)] bg-[var(--ivory)] p-4 font-mono text-xs text-[var(--ink)] placeholder:text-[var(--ink-faint)] focus:border-[var(--ink)] focus:outline-none"
                />
                <p className="mt-1 font-mono text-[9px] uppercase tracking-[0.2em] text-[var(--ink-faint)]">
                  {message.length} / {ORDER_COMMUNICATION_MAX_LENGTH} characters
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                {channel === "whatsapp" ? (
                  waLink ? (
                    <a
                      href={waLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block border border-[var(--ink)] bg-[var(--ink)] px-5 py-2.5 font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--warm-white)] transition-colors hover:bg-[var(--warm-white)] hover:text-[var(--ink)]"
                    >
                      Open in WhatsApp
                    </a>
                  ) : (
                    <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-[var(--ink-faint)]">
                      No usable WhatsApp number on file — the message can still be logged.
                    </p>
                  )
                ) : (
                  <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-[var(--ink-faint)]">
                    Other channel — open WhatsApp yourself / call the customer.
                  </p>
                )}
                <button
                  onClick={logCommunication}
                  disabled={!message.trim() || pending}
                  className="border border-[var(--line-on-light)] px-5 py-2.5 font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--ink)] transition-colors hover:border-[var(--ink)] disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {pending ? "Logging…" : "Log communication"}
                </button>
              </div>

              <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-[var(--ink-faint)]">
                Opening WhatsApp does not confirm delivery. Log separately.
              </p>

              {commFeedback && (
                <p
                  className={`font-mono text-[10px] uppercase tracking-[0.15em] ${
                    commFeedback.kind === "ok" ? "text-[var(--accent)]" : "text-red-600"
                  }`}
                >
                  {commFeedback.text}
                </p>
              )}
            </div>

            <div className="mt-6">
              <p className="label-on-light">History</p>
              {communications.length === 0 ? (
                <p className="mt-3 font-display text-base italic text-[var(--ink)]/60">
                  No communications logged for this order yet.
                </p>
              ) : (
                <ul className="mt-3 space-y-4">
                  {communications.map((c) => (
                    <li key={c.id} className="rounded border border-[var(--line-on-light)] p-4">
                      <div className="flex flex-wrap items-baseline justify-between gap-2">
                        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--ink)]">
                          {c.channel === "whatsapp" ? "WhatsApp" : "Other"}
                        </p>
                        <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-[var(--ink-faint)]">
                          {new Date(c.sent_at).toLocaleString("en-GB", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                      <p className="mt-2 body-on-light whitespace-pre-wrap text-sm">
                        {c.message_summary}
                      </p>
                      <p className="mt-2 font-mono text-[9px] uppercase tracking-[0.2em] text-[var(--ink-faint)]">
                        Logged by {c.sent_by_email || "Admin"}
                      </p>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </section>

          {order.customer_notes && (
            <section className="card-light p-6">
              <FieldLabel>Customer&apos;s note</FieldLabel>
              <p className="mt-3 body-on-light whitespace-pre-wrap">{order.customer_notes}</p>
              <p className="mt-2 font-mono text-[9px] uppercase tracking-[0.2em] text-[var(--ink-faint)]">
                Read-only · submitted by the customer
              </p>
            </section>
          )}
        </div>

        <div className="space-y-6">
          <section className="card-light p-6">
            <p className="label-on-light">Customer</p>
            <div className="mt-4 space-y-3">
              <div>
                <FieldLabel>Name</FieldLabel>
                <p className="mt-1 font-display text-base italic text-[var(--ink)]">
                  {order.customer_name}
                </p>
              </div>
              <div>
                <FieldLabel>Phone</FieldLabel>
                <a
                  href={`tel:${order.customer_phone}`}
                  className="font-mono text-xs text-[var(--accent)] hover:underline"
                >
                  {order.customer_phone}
                </a>
              </div>
              {order.customer_email && (
                <div>
                  <FieldLabel>Email</FieldLabel>
                  <a
                    href={`mailto:${order.customer_email}`}
                    className="font-mono text-xs text-[var(--accent)] hover:underline"
                  >
                    {order.customer_email}
                  </a>
                </div>
              )}
              {order.delivery_location && (
                <div>
                  <FieldLabel>Delivery location</FieldLabel>
                  <p className="mt-1 font-mono text-xs text-[var(--ink)]">
                    {order.delivery_location}
                  </p>
                </div>
              )}
            </div>
            <p className="mt-5 border-t border-[var(--line-on-light)] pt-4 font-mono text-[9px] uppercase tracking-[0.2em] text-[var(--ink-faint)]">
              Snapshot at submission · not linked to the customer record
            </p>
          </section>

          <section className="card-light p-6">
            <p className="label-on-light">Status</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {allowedNext.length > 0 ? (
                allowedNext.map((s) => (
                  <button
                    key={s}
                    onClick={() => changeStatus(s)}
                    disabled={pending}
                    className="border border-[var(--line-on-light)] px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.15em] text-[var(--ink-muted)] transition-colors hover:border-[var(--ink)] hover:text-[var(--ink)] disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    {ORDER_STATUS_LABELS[s]}
                  </button>
                ))
              ) : (
                <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-[var(--ink-faint)]">
                  {statusLabel(order.status)} is terminal — no further transitions.
                </p>
              )}
            </div>
            <p className="mt-4 font-mono text-[9px] uppercase tracking-[0.2em] text-[var(--ink-faint)]">
              Valid next steps only · every change is audit-logged
            </p>
          </section>

          {otherOrders.length > 0 && (
            <section className="card-light p-6">
              <p className="label-on-light">Other orders for this customer</p>
              <ul className="mt-3 space-y-1">
                {otherOrders.map((o) => (
                  <li key={o.id}>
                    <Link
                      href={`/admin/orders/${o.id}`}
                      className="flex items-center justify-between gap-3 rounded px-1 py-1.5 transition-colors hover:bg-[var(--bone)]"
                    >
                      <span className="font-mono text-xs text-[var(--accent)] hover:underline">
                        {o.reference_number}
                      </span>
                      <span className="font-mono text-[9px] uppercase tracking-[0.15em] text-[var(--ink-faint)]">
                        {statusLabel(o.status)} ·{" "}
                        {new Date(o.created_at).toLocaleDateString("en-GB", {
                          day: "numeric",
                          month: "short",
                        })}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}

function defaultCommunicationMessage(customerName: string, referenceNumber: string, status: string): string {
  const label = ORDER_STATUS_LABELS[status as keyof typeof ORDER_STATUS_LABELS] ?? status;
  return `Hi ${customerName},\n\nThank you for your Treadville enquiry ${referenceNumber} — its current status is ${label.toLowerCase()}. We'll be in touch with the next steps shortly.`;
}