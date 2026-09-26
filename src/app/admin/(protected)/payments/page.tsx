import { requireAdmin } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import PaymentsClient from "@/components/admin/PaymentsClient";

export const dynamic = "force-dynamic";

type PaymentRow = {
  id: string;
  order_id: string;
  provider: string;
  amount: number;
  currency: string;
  status: string;
  reference_number: string;
  provider_reference: string | null;
  metadata: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
  orders: { reference_number: string } | null;
};

async function loadPayments(supabase: Awaited<ReturnType<typeof createClient>>): Promise<PaymentRow[]> {
  const { data } = await supabase
    .from("payments")
    .select("*, orders(reference_number)")
    .order("created_at", { ascending: false });
  return (data ?? []) as PaymentRow[];
}

export default async function AdminPaymentsPage() {
  await requireAdmin();
  const supabase = await createClient();
  const payments = await loadPayments(supabase);

  return (
    <PaymentsClient
      payments={payments.map((p) => ({
        id: p.id,
        order_reference: p.orders?.reference_number ?? "—",
        provider: p.provider,
        amount: p.amount,
        currency: p.currency,
        status: p.status,
        reference_number: p.reference_number,
        provider_reference: p.provider_reference,
        created_at: p.created_at,
      }))}
    />
  );
}
