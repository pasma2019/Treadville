import { supabase } from "./supabase";
import type { Article, Category, Product, SiteContent, ProductMetadata } from "./types";

// ---- Categories (public) ----

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

// ---- Products (public) ----

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

// ---- Site content (public read) ----

export async function getSiteContent(): Promise<Record<string, string>> {
  const { data, error } = await supabase.from("site_content").select("*");
  if (error) throw error;
  return Object.fromEntries((data ?? []).map((row: SiteContent) => [row.key, row.value ?? ""]));
}

// ---- Product metadata (public) ----

export async function getProductMetadata(productId: string): Promise<ProductMetadata[]> {
  const { data, error } = await supabase
    .from("product_metadata")
    .select("*")
    .eq("product_id", productId)
    .order("key");
  if (error) throw error;
  return (data as ProductMetadata[]) ?? [];
}

// ---- Articles (public) ----

export async function getArticles(publishedOnly = true): Promise<Article[]> {
  let query = supabase.from("articles").select("*").order("updated_at", { ascending: false });
  if (publishedOnly) query = query.eq("status", "published");
  const { data, error } = await query;
  if (error) {
    console.error("JOURNAL QUERY ERROR [getArticles]:", JSON.stringify(error, null, 2));
    throw error;
  }
  return (data as Article[]) ?? [];
}

export async function getArticleBySlug(slug: string): Promise<Article | null> {
  const { data, error } = await supabase
    .from("articles")
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();
  if (error) {
    console.error("JOURNAL QUERY ERROR [getArticleBySlug]:", JSON.stringify(error, null, 2));
    throw error;
  }
  return data as Article | null;
}
