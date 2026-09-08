import { requireAdmin } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import ProductsClient from "@/components/admin/ProductsClient";

export const dynamic = "force-dynamic";

async function loadProducts() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("products")
    .select("*, categories!inner(name)")
    .order("created_at", { ascending: false });
  return (data ?? []) as Array<{
    id: string;
    name: string;
    slug: string;
    category_id: string;
    description: string | null;
    price: number | null;
    image_url: string | null;
    gallery: string[];
    featured: boolean;
    status: string;
    stock: number;
    created_at: string;
    categories: { name: string };
  }>;
}

async function loadCategories() {
  const supabase = await createClient();
  const { data } = await supabase.from("categories").select("*").order("sort_order");
  return (data ?? []) as Array<{
    id: string;
    name: string;
    slug: string;
    active: boolean;
  }>;
}

export default async function AdminProductsPage() {
  await requireAdmin();
  const [products, categories] = await Promise.all([loadProducts(), loadCategories()]);

  return <ProductsClient products={products} categories={categories} />;
}
