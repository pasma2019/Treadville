import { requireAdmin } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import OrdersClient from "@/components/admin/OrdersClient";
import type { OrderStatus } from "@/lib/types";
import { ORDER_STATUSES } from "@/lib/order-status";

export const dynamic = "force-dynamic";

type OrderListRow = {
  id: string;
  reference_number: string;
  customer_name: string;
  status: OrderStatus;
  created_at: string;
  order_items: { order_id: string }[];
};

async function loadCounts(supabase: Awaited<ReturnType<typeof createClient>>): Promise<Record<OrderStatus, number>> {
  const counters = await Promise.all(
    ORDER_STATUSES.map((status) =>
      supabase.from("orders").select("id", { count: "exact", head: true }).eq("status", status)
    )
  );
  return Object.fromEntries(
    ORDER_STATUSES.map((status, i) => [status, counters[i].count ?? 0])
  ) as Record<OrderStatus, number>;
}

async function loadOrders(supabase: Awaited<ReturnType<typeof createClient>>): Promise<OrderListRow[]> {
  const { data } = await supabase
    .from("orders")
    .select("id, reference_number, customer_name, status, created_at, order_items(order_id)")
    .order("created_at", { ascending: false });
  return (data ?? []) as OrderListRow[];
}

export default async function AdminOrdersPage() {
  await requireAdmin();
  const supabase = await createClient();
  const [counts, orders] = await Promise.all([loadCounts(supabase), loadOrders(supabase)]);

  return (
    <OrdersClient
      orders={orders.map((o) => ({
        id: o.id,
        reference_number: o.reference_number,
        customer_name: o.customer_name,
        status: o.status,
        created_at: o.created_at,
        item_count: o.order_items?.length ?? 0,
      }))}
      counts={counts}
    />
  );
}