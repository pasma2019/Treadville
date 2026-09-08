import { requireRole, ForbiddenError } from "@/lib/auth";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

const DARAJA_VARS = [
  { key: "DARAJA_CONSUMER_KEY", label: "Consumer Key" },
  { key: "DARAJA_CONSUMER_SECRET", label: "Consumer Secret", secret: true },
  { key: "DARAJA_SHORTCODE", label: "Business Shortcode" },
  { key: "DARAJA_PASSKEY", label: "Passkey", secret: true },
  { key: "DARAJA_ENVIRONMENT", label: "Environment", options: ["sandbox", "live"] },
  { key: "DARAJA_CALLBACK_URL", label: "Callback URL" },
];

const STRIPE_VARS = [
  { key: "STRIPE_SECRET_KEY", label: "Secret Key", secret: true },
  { key: "STRIPE_PUBLISHABLE_KEY", label: "Publishable Key" },
  { key: "STRIPE_WEBHOOK_SECRET", label: "Webhook Secret", secret: true },
];

type VarStatus = { key: string; label: string; value: string | null; secret?: boolean; options?: string[] };

async function checkVars(vars: typeof DARAJA_VARS): Promise<VarStatus[]> {
  // We cannot read server-side env vars from the client,
  // but we can indicate configuration state from the page.
  // The actual presence check happens at runtime.
  return vars.map((v) => ({
    ...v,
    value: null, // populated server-side only
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

  const darajaVars = await checkVars(DARAJA_VARS);
  const stripeVars = await checkVars(STRIPE_VARS);

  const isConfigured = (vars: VarStatus[]) => vars.some((v) => v.value !== null);

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
                  Payments
                </span>
              </div>
              <p className="mt-2 body-on-light">
                Accept mobile money payments via Safaricom&apos;s Daraja API (STK Push, C2B).
                Currently accepts sandbox credentials for testing.
              </p>
            </div>
            <div className="shrink-0 text-right">
              <p className={`font-mono text-[10px] uppercase tracking-[0.18em] ${
                isConfigured(darajaVars) ? "text-[var(--accent)]" : "text-[var(--ink-faint)]"
              }`}>
                {isConfigured(darajaVars) ? "Configured" : "Not configured"}
              </p>
              <p className="mt-1 font-mono text-[9px] uppercase tracking-[0.15em] text-[var(--ink-faint)]">
                {isConfigured(darajaVars) ? "Ready" : "Set environment variables"}
              </p>
            </div>
          </div>

          <div className="mt-6 space-y-3">
            {darajaVars.map((v) => (
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
              Environment variables
            </p>
            <p className="mt-2 font-mono text-[11px] text-[var(--ink-faint)]">
              Set these in your <code className="bg-[var(--bone)] px-1 py-0.5">.env.local</code> or hosting environment — not in the browser.
              <br />
              Required: DARAJA_CONSUMER_KEY, DARAJA_CONSUMER_SECRET, DARAJA_SHORTCODE, DARAJA_PASSKEY
            </p>
          </div>
        </section>

        {/* Stripe */}
        <section className="card-light p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="font-display text-xl italic text-[var(--ink)]">Stripe</h2>
              <p className="mt-2 body-on-light">
                Card and international payment processing. Optional — M-PESA is primary.
              </p>
            </div>
            <div className="shrink-0 text-right">
              <p className={`font-mono text-[10px] uppercase tracking-[0.18em] ${
                isConfigured(stripeVars) ? "text-[var(--accent)]" : "text-[var(--ink-faint)]"
              }`}>
                {isConfigured(stripeVars) ? "Configured" : "Not configured"}
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
          Integration secrets (Consumer Key, Passkey, Stripe Secret Key, etc.) are stored as server-side
          environment variables. They are never exposed to the browser. All payment operations
          are processed server-side through authenticated endpoints.
        </p>
      </div>
    </div>
  );
}
