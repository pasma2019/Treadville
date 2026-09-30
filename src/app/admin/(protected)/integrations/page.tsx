import { requireRole, ForbiddenError } from "@/lib/auth";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

// Reserved payment-provider configuration contract. These are the names read by
// src/lib/payment-config.ts. They are NOT read by this page, and setting them
// does not enable payment collection — no provider call, webhook, or payment
// record exists yet. Listed here for reference only; see
// Docs/slice-24-payment-architecture.md.
const MPESA_VARS = [
  { key: "PAYMENT_MPESA_CONSUMER_KEY", label: "Consumer Key" },
  { key: "PAYMENT_MPESA_CONSUMER_SECRET", label: "Consumer Secret", secret: true },
  { key: "PAYMENT_MPESA_PASSKEY", label: "Passkey", secret: true },
  { key: "PAYMENT_MPESA_SHORTCODE", label: "Business Shortcode" },
  { key: "PAYMENT_MPESA_TILL_NUMBER", label: "Till Number" },
  { key: "PAYMENT_MPESA_PAYBILL_NUMBER", label: "Paybill Number" },
  { key: "PAYMENT_MPESA_CALLBACK_URL", label: "Callback URL" },
];

const STRIPE_VARS = [
  { key: "PAYMENT_STRIPE_SECRET_KEY", label: "Secret Key", secret: true },
  { key: "PAYMENT_STRIPE_PUBLISHABLE_KEY", label: "Publishable Key" },
  { key: "PAYMENT_STRIPE_WEBHOOK_SECRET", label: "Webhook Secret", secret: true },
];

type VarStatus = { key: string; label: string; value: string | null; secret?: boolean };

async function checkVars(vars: typeof MPESA_VARS): Promise<VarStatus[]> {
  // Intentionally does not read process.env. Nothing here reports live
  // configuration state, because no payment integration is operational — a
  // "configured" reading would imply a capability that does not exist.
  return vars.map((v) => ({
    ...v,
    value: null,
  }));
}

export default async function AdminIntegrationsPage() {
  try {
    await requireRole(["SYSTEM_ADMIN"]);
  } catch (e) {
    if (e instanceof ForbiddenError) {
      return (
        <div className="max-w-[600px]">
          <p className="label-on-light">Access denied</p>
          <h1 className="mt-2 font-display text-4xl italic text-[var(--ink)]">403</h1>
          <p className="mt-4 body-on-light">
            You need System Administrator access to view this page.
          </p>
        </div>
      );
    }
    redirect("/admin");
  }

  const mpesaVars = await checkVars(MPESA_VARS);
  const stripeVars = await checkVars(STRIPE_VARS);

  return (
    <div className="max-w-[900px]">
      <p className="label-on-light">System configuration</p>
      <h1 className="mt-2 max-w-[16ch] font-display text-4xl italic leading-[1.02] tracking-[-0.015em] text-[var(--ink)]">
        Integrations
      </h1>
      <p className="mt-4 max-w-[60ch] body-on-light">
        Configure external service connections. Sensitive values are never displayed once saved.
      </p>

      <div className="mt-10 space-y-8">
        {/* M-PESA / Daraja */}
        <section className="card-light p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-3">
                <h2 className="font-display text-xl italic text-[var(--ink)]">
                  M-PESA / Safaricom Daraja
                </h2>
                <span className="border border-[var(--sand)] bg-[var(--champagne)]/20 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.15em] text-[var(--ink)]">
                  Not implemented
                </span>
              </div>
              <p className="mt-2 body-on-light">
                Mobile money payments via Safaricom&apos;s Daraja API are
                planned. No Daraja request is made today: there is no API call,
                no callback endpoint, and no payment record. Payment will be
                introduced with the quote layer, once an approved merchant
                arrangement exists.
              </p>
            </div>
            <div className="shrink-0 text-right">
              <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--ink-faint)]">
                Unavailable
              </p>
              <p className="mt-1 font-mono text-[9px] uppercase tracking-[0.15em] text-[var(--ink-faint)]">
                Reserved configuration
              </p>
            </div>
          </div>

          <div className="mt-6 space-y-3">
            {mpesaVars.map((v) => (
              <div key={v.key} className="grid grid-cols-[200px_1fr] items-center gap-4">
                <div>
                  <p className="font-mono text-[11px] text-[var(--ink)]">{v.label}</p>
                  <p className="font-mono text-[9px] uppercase tracking-[0.15em] text-[var(--ink-faint)]">{v.key}</p>
                </div>
                <div className="rounded border border-[var(--line-on-light)] bg-[var(--bone)] px-3 py-2 font-mono text-xs text-[var(--ink-muted)]">
                  {v.value
                    ? v.secret
                      ? "••••••••••••••••"
                      : v.value
                    : <span className="text-[var(--ink-faint)] italic">Not set — configure in environment</span>
                  }
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 border-t border-[var(--line-on-light)] pt-5">
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--ink-muted)]">
              Reserved environment variables
            </p>
            <p className="mt-2 font-mono text-[11px] text-[var(--ink-faint)]">
              Reference only. These names are read by <code className="bg-[var(--bone)] px-1 py-0.5">src/lib/payment-config.ts</code> and are listed here for
              documentation. They are not read by this page, and setting them
              does not enable payments.
            </p>
          </div>
        </section>

        {/* Stripe */}
        <section className="card-light p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="font-display text-xl italic text-[var(--ink)]">Stripe</h2>
              <p className="mt-2 body-on-light">
                Card and international payment processing are planned. Not
                implemented, and not yet required.
              </p>
            </div>
            <div className="shrink-0 text-right">
              <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--ink-faint)]">
                Unavailable
              </p>
              <p className="mt-1 font-mono text-[9px] uppercase tracking-[0.15em] text-[var(--ink-faint)]">
                Reserved configuration
              </p>
            </div>
          </div>

          <div className="mt-6 space-y-3">
            {stripeVars.map((v) => (
              <div key={v.key} className="grid grid-cols-[200px_1fr] items-center gap-4">
                <div>
                  <p className="font-mono text-[11px] text-[var(--ink)]">{v.label}</p>
                  <p className="font-mono text-[9px] uppercase tracking-[0.15em] text-[var(--ink-faint)]">{v.key}</p>
                </div>
                <div className="rounded border border-[var(--line-on-light)] bg-[var(--bone)] px-3 py-2 font-mono text-xs text-[var(--ink-muted)]">
                  {v.value
                    ? v.secret
                      ? "••••••••••••••••"
                      : v.value
                    : <span className="text-[var(--ink-faint)] italic">Not set</span>
                  }
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Supabase */}
        <section className="card-light p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="font-display text-xl italic text-[var(--ink)]">Supabase</h2>
              <p className="mt-2 body-on-light">
                Database, authentication, and storage for Treadville. Configured via <code className="bg-[var(--bone)] px-1 py-0.5">NEXT_PUBLIC_SUPABASE_URL</code> and related variables.
              </p>
            </div>
            <div className="shrink-0 text-right">
              <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--accent)]">
                Active
              </p>
              <p className="mt-1 font-mono text-[9px] uppercase tracking-[0.15em] text-[var(--ink-faint)]">
                Connected
              </p>
            </div>
          </div>
        </section>
      </div>

      <div className="mt-10 border-t border-[var(--line-on-light)] pt-8">
        <p className="label-on-light">Security notice</p>
        <p className="mt-3 max-w-[65ch] body-on-light">
          Integration secrets, should they be introduced, are read from
          server-side environment variables only and are never exposed to the
          browser. No payment integration is currently configured or active,
          and no payment endpoint exists at this time.
        </p>
      </div>
    </div>
  );
}
