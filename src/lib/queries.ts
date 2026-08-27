import { supabase } from "./supabase";
import type { Category, Product, SiteContent } from "./types";

// ---- Categories ----

export async function getCategories(): Promise<Category[]> {
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .order("sort_order", { ascending: true });
  if (error) throw error;
  return data ?? [];
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function createCategory(input: Partial<Category>) {
  const { data, error } = await supabase.from("categories").insert(input).select().single();
  if (error) throw error;
  return data;
}

export async function updateCategory(id: string, input: Partial<Category>) {
  const { data, error } = await supabase.from("categories").update(input).eq("id", id).select().single();
  if (error) throw error;
  return data;
}

export async function deleteCategory(id: string) {
  const { error } = await supabase.from("categories").delete().eq("id", id);
  if (error) throw error;
}

// ---- Products ----

export async function getProducts(opts?: { categorySlug?: string; publishedOnly?: boolean }): Promise<Product[]> {
  let query = supabase.from("products").select("*, categories!inner(slug)").order("created_at", { ascending: false });
  if (opts?.categorySlug) query = query.eq("categories.slug", opts.categorySlug);
  if (opts?.publishedOnly) query = query.eq("status", "published");
  const { data, error } = await query;
  if (error) throw error;
  return (data as unknown as Product[]) ?? [];
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const { data, error } = await supabase.from("products").select("*").eq("slug", slug).maybeSingle();
  if (error) throw error;
  return data;
}

export async function getFeaturedProducts(): Promise<Product[]> {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("featured", true)
    .eq("status", "published")
    .limit(6);
  if (error) throw error;
  return data ?? [];
}

export async function createProduct(input: Partial<Product>) {
  const { data, error } = await supabase.from("products").insert(input).select().single();
  if (error) throw error;
  return data;
}

export async function updateProduct(id: string, input: Partial<Product>) {
  const { data, error } = await supabase.from("products").update(input).eq("id", id).select().single();
  if (error) throw error;
  return data;
}

export async function deleteProduct(id: string) {
  const { error } = await supabase.from("products").delete().eq("id", id);
  if (error) throw error;
}

// ---- Site content ----

export async function getSiteContent(): Promise<Record<string, string>> {
  const { data, error } = await supabase.from("site_content").select("*");
  if (error) throw error;
  return Object.fromEntries((data ?? []).map((row: SiteContent) => [row.key, row.value ?? ""]));
}

export async function setSiteContent(key: string, value: string) {
  const { error } = await supabase.from("site_content").upsert({ key, value, updated_at: new Date().toISOString() }, { onConflict: "key" });
  if (error) throw error;
}
