import { requireAdmin } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import CategoriesClient from "@/components/admin/CategoriesClient";

export const dynamic = "force-dynamic";

async function loadCategories() {
  const supabase = await createClient();
  const { data } = await supabase.from("categories").select("*").order("sort_order");
  return (data ?? []) as Array<{
    id: string;
    name: string;
    slug: string;
    description: string | null;
    image_url: string | null;
    active: boolean;
    sort_order: number;
  }>;
}

export default async function AdminCategoriesPage() {
  await requireAdmin();
  const categories = await loadCategories();
  return <CategoriesClient categories={categories} />;
}
