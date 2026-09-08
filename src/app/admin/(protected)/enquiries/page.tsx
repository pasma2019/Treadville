import { requireAdmin } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import EnquiriesClient from "@/components/admin/EnquiriesClient";

export const dynamic = "force-dynamic";

async function loadEnquiries() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("enquiries")
    .select("*")
    .order("created_at", { ascending: false });
  return (data ?? []) as Array<{
    id: string;
    name: string;
    email: string;
    company: string | null;
    phone: string | null;
    type: string;
    message: string;
    status: string;
    created_at: string;
  }>;
}

export default async function AdminEnquiriesPage() {
  await requireAdmin();
  const enquiries = await loadEnquiries();
  return <EnquiriesClient enquiries={enquiries} />;
}
