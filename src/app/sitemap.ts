import type { MetadataRoute } from "next";
import { getCategories, getProductBySlug, getArticles } from "@/lib/queries";

const SITE_URL = "https://treadville.co.ke";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, lastModified: now, changeFrequency: "weekly", priority: 1.0 },
    { url: `${SITE_URL}/about`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/origins`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE_URL}/quality`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE_URL}/export`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE_URL}/shop`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${SITE_URL}/journal`, lastModified: now, changeFrequency: "weekly", priority: 0.7 },
    { url: `${SITE_URL}/contact`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
  ];

  let dynamicRoutes: MetadataRoute.Sitemap = [];

  try {
    const categories = await getCategories();
    for (const cat of categories) {
      if (!cat.active) continue;
      dynamicRoutes.push({
        url: `${SITE_URL}/shop/${cat.slug}`,
        lastModified: now,
        changeFrequency: "weekly",
        priority: 0.8,
      });
    }
  } catch {
    // graceful — categories may be unavailable
  }

  try {
    const articles = await getArticles(true);
    for (const article of articles) {
      dynamicRoutes.push({
        url: `${SITE_URL}/journal/${article.slug}`,
        lastModified: new Date(article.updated_at),
        changeFrequency: "monthly",
        priority: 0.6,
      });
    }
  } catch {
    // graceful
  }

  // Products — query each category. To avoid N+1, we keep this scoped to the
  // public products surface; missing products simply don't appear.
  try {
    const categories = await getCategories();
    for (const cat of categories) {
      const { getProducts } = await import("@/lib/queries");
      const products = await getProducts({ categorySlug: cat.slug, publishedOnly: true });
      for (const product of products) {
        dynamicRoutes.push({
          url: `${SITE_URL}/product/${product.slug}`,
          lastModified: new Date(product.created_at),
          changeFrequency: "weekly",
          priority: 0.7,
        });
      }
    }
  } catch {
    // graceful
  }

  return [...staticRoutes, ...dynamicRoutes];
}
