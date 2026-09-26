"use client";

import { useState } from "react";

type PaymentRow = {
  id: string;
  order_reference: string;
  provider: string;
  amount: number;
  currency: string;
  status: string;
  reference_number: string;
  provider_reference: string | null;
  created_at: string;
};

type Props = {
  payments: PaymentRow[];
};

const STATUS_STYLES: Record<string, string> = {
  pending: "bg-[var(--champagne)]/40 text-[var(--ink-muted)]",
  processing: "bg-blue-50 text-blue-700",
  completed: "bg-green-50 text-green-700",
  failed: "bg-red-50 text-red-700",
  cancelled: "bg-[var(--bone)] text-[var(--ink-muted)]",
  refunded: "bg-orange-50 text-orange-700",
};

const PROVIDER_LABELS: Record<string, string> = {
  mpesa: "M-Pesa",
  stripe: "Stripe",
};

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-KE", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function formatAmount(amount: number, currency: string): string {
  return new Intl.NumberFormat("en-KE", {
    style: "currency",
    currency: currency,
    minimumFractionDigits: 2,
  }).format(amount);
}

export default function PaymentsClient({ payments }: Props) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display text-2xl font-semibold italic text-[var(--ink)]">
          Payments
        </h1>
        <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.20em] text-[var(--ink-muted)]">
          {payments.length} record{payments.length !== 1 ? "s" : ""}
        </p>
      </div>

      {payments.length === 0 ? (
        <div className="card-light-soft p-8 text-center">
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--ink-muted)]">
            No payment records yet
          </p>
          <p className="mt-2 text-sm text-[var(--ink-soft)]">
            Payment records will appear here once payment providers are configured
            and transactions are processed.
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {payments.map((payment) => (
            <div
              key={payment.id}
              className="card-light-soft overflow-hidden"
            >
              <button
                type="button"
                onClick={() =>
                  setExpandedId(expandedId === payment.id ? null : payment.id)
                }
                className="flex w-full items-center gap-4 p-5 text-left transition-colors hover:bg-[var(--bone)]/50"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-3">
                    <p className="font-display text-sm italic text-[var(--ink)]">
                      {payment.order_reference}
                    </p>
                    <span className="font-mono text-[9px] uppercase tracking-[0.15em] text-[var(--ink-faint)]">
                      ·
                    </span>
                    <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-[var(--ink-faint)]">
                      {payment.reference_number}
                    </p>
                  </div>
                  <div className="mt-1.5 flex items-center gap-3">
                    <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-[var(--ink-muted)]">
                      {PROVIDER_LABELS[payment.provider] ?? payment.provider}
                    </span>
                    <span className="font-mono text-[10px] text-[var(--ink-faint)]">
                      {formatAmount(payment.amount, payment.currency)}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span
                    className={`rounded px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.15em] ${
                      STATUS_STYLES[payment.status] ?? "bg-[var(--bone)] text-[var(--ink-muted)]"
                    }`}
                  >
                    {payment.status}
                  </span>
                  <span className="font-mono text-[10px] text-[var(--ink-faint)]">
                    {formatDate(payment.created_at)}
                  </span>
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 12 12"
                    fill="none"
                    className={`text-[var(--ink-faint)] transition-transform ${
                      expandedId === payment.id ? "rotate-180" : ""
                    }`}
                  >
                    <path
                      d="M3 4.5L6 7.5L9 4.5"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </button>

              {expandedId === payment.id && (
                <div className="border-t border-[var(--line-on-light)] px-5 py-4">
                  <dl className="grid grid-cols-2 gap-x-8 gap-y-3 md:grid-cols-3">
                    <div>
                      <dt className="font-mono text-[9px] uppercase tracking-[0.20em] text-[var(--ink-faint)]">
                        Payment ID
                      </dt>
                      <dd className="mt-0.5 font-mono text-[11px] text-[var(--ink)]">
                        {payment.id}
                      </dd>
                    </div>
                    <div>
                      <dt className="font-mono text-[9px] uppercase tracking-[0.20em] text-[var(--ink-faint)]">
                        Provider Reference
                      </dt>
                      <dd className="mt-0.5 font-mono text-[11px] text-[var(--ink)]">
                        {payment.provider_reference ?? "—"}
                      </dd>
                    </div>
                    <div>
                      <dt className="font-mono text-[9px] uppercase tracking-[0.20em] text-[var(--ink-faint)]">
                        Order Reference
                      </dt>
                      <dd className="mt-0.5 font-mono text-[11px] text-[var(--ink)]">
                        {payment.order_reference}
                      </dd>
                    </div>
                    <div>
                      <dt className="font-mono text-[9px] uppercase tracking-[0.20em] text-[var(--ink-faint)]">
                        Amount
                      </dt>
                      <dd className="mt-0.5 font-mono text-[11px] text-[var(--ink)]">
                        {formatAmount(payment.amount, payment.currency)}
                      </dd>
                    </div>
                    <div>
                      <dt className="font-mono text-[9px] uppercase tracking-[0.20em] text-[var(--ink-faint)]">
                        Created
                      </dt>
                      <dd className="mt-0.5 font-mono text-[11px] text-[var(--ink)]">
                        {new Date(payment.created_at).toLocaleString("en-KE")}
                      </dd>
                    </div>
                    <div>
                      <dt className="font-mono text-[9px] uppercase tracking-[0.20em] text-[var(--ink-faint)]">
                        Status
                      </dt>
                      <dd className="mt-0.5">
                        <span
                          className={`rounded px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.15em] ${
                            STATUS_STYLES[payment.status] ?? "bg-[var(--bone)] text-[var(--ink-muted)]"
                          }`}
                        >
                          {payment.status}
                        </span>
                      </dd>
                    </div>
                  </dl>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
