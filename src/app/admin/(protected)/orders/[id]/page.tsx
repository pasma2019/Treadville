import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import OrderDetailClient from "@/components/admin/OrderDetailClient";

export const dynamic = "force-dynamic";

type OrderDetailRow = {
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

type OrderItemRow = {
  product_name: string;
  quantity: number;
};

type OtherOrderRow = {
  id: string;
  reference_number: string;
  status: string;
  created_at: string;
};

type OrderCommunicationRow = {
  id: string;
  channel: string;
  message_summary: string;
  sent_by_email: string | null;
  sent_at: string;
};

export default async function AdminOrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  await requireAdmin();

  const supabase = await createClient();

  const { data: order } = await supabase
    .from("orders")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (!order) notFound();

  const orderRow = order as unknown as OrderDetailRow;

  const [{ data: items }, { data: otherOrders }, { data: communications }] = await Promise.all([
    supabase
      .from("order_items")
      .select("product_name, quantity")
      .eq("order_id", id)
      .order("created_at", { ascending: true }),
    supabase
      .from("orders")
      .select("id, reference_number, status, created_at")
      .eq("customer_id", orderRow.customer_id)
      .neq("id", id)
      .order("created_at", { ascending: false })
      .limit(5),
    supabase
      .from("order_communications")
      .select("id, channel, message_summary, sent_by_email, sent_at")
      .eq("order_id", id)
      .order("sent_at", { ascending: false })
      .order("created_at", { ascending: false }),
  ]);

  return (
    <OrderDetailClient
      order={orderRow}
      items={(items as OrderItemRow[] | null) ?? []}
      otherOrders={(otherOrders as OtherOrderRow[] | null) ?? []}
      communications={(communications as OrderCommunicationRow[] | null) ?? []}
    />
  );
}