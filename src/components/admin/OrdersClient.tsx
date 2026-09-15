"use client";

import { useState } from "react";
import Link from "next/link";
import { ORDER_STATUSES, ORDER_STATUS_LABELS } from "@/lib/order-status";
import type { OrderStatus } from "@/lib/types";

type OrderRow = {
  id: string;
  reference_number: string;
  customer_name: string;
  status: OrderStatus;
  created_at: string;
  item_count: number;
};

type Props = {
  orders: OrderRow[];
  counts: Record<OrderStatus, number>;
};

export default function OrdersClient({ orders, counts }: Props) {
  const [statusFilter, setStatusFilter] = useState<OrderStatus | "all">("all");

  const filtered =
    statusFilter === "all"
      ? orders
      : orders.filter((o) => o.status === statusFilter);

  const total = ORDER_STATUSES.reduce((sum, s) => sum + counts[s], 0);

  return (
    <div className="max-w-[1200px]">
      <p className="label-on-light">Business</p>
      <h1 className="mt-2 max-w-[16ch] font-display text-4xl italic leading-[1.02] tracking-[-0.015em] text-[var(--ink)]">
        Orders
      </h1>
      <p className="mt-4 max-w-[60ch] body-on-light">
        Customer submissions from the basket. Open an order to review line items, update its status, and add internal notes.
      </p>

      <div className="mt-8 space-y-3">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setStatusFilter("all")}
            className={`px-4 py-2 font-mono text-[10px] uppercase tracking-[0.18em] transition-colors border ${
              statusFilter === "all"
                ? "border-[var(--ink)] bg-[var(--ink)] text-[var(--warm-white)]"
                : "border-[var(--line-on-light)] text-[var(--ink-muted)] hover:border-[var(--ink)] hover:text-[var(--ink)]"
            }`}
          >
            All ({total})
          </button>
          {ORDER_STATUSES.map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-4 py-2 font-mono text-[10px] uppercase tracking-[0.18em] transition-colors border ${
                statusFilter === s
                  ? "border-[var(--ink)] bg-[var(--ink)] text-[var(--warm-white)]"
                  : "border-[var(--line-on-light)] text-[var(--ink-muted)] hover:border-[var(--ink)] hover:text-[var(--ink)]"
              }`}
            >
              {ORDER_STATUS_LABELS[s]} ({counts[s]})
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6 space-y-3">
        {filtered.length === 0 ? (
          <div className="card-light p-10 text-center">
            <p className="font-display text-base italic text-[var(--ink)]/60">
              {statusFilter === "all"
                ? "No orders yet. Orders appear here as customers submit them."
                : "No orders in this status."}
            </p>
          </div>
        ) : (
          filtered.map((o) => (
            <Link
              key={o.id}
              href={`/admin/orders/${o.id}`}
              className="card-light group flex items-start justify-between gap-4 p-5 transition-colors hover:bg-[var(--bone)]"
            >
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-3 flex-wrap">
                  <p className="font-mono text-sm tracking-[0.06em] text-[var(--ink)]">
                    {o.reference_number}
                  </p>
                  <p className="font-display text-base italic text-[var(--ink)] truncate">
                    {o.customer_name}
                  </p>
                </div>
                <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.15em] text-[var(--ink-faint)]">
                  {o.item_count} {o.item_count === 1 ? "item" : "items"} ·{" "}
                  {new Date(o.created_at).toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
              <span
                className={`shrink-0 font-mono text-[10px] uppercase tracking-[0.18em] ${
                  o.status === "pending"
                    ? "text-[var(--sand)]"
                    : o.status === "cancelled"
                      ? "text-[var(--ink-faint)]"
                      : "text-[var(--accent)]"
                }`}
              >
                {ORDER_STATUS_LABELS[o.status]}
              </span>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}