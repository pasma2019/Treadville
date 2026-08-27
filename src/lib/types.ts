export type Category = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image_url: string | null;
  active: boolean;
  sort_order: number;
  created_at: string;
};

export type Product = {
  id: string;
  category_id: string;
  name: string;
  slug: string;
  description: string | null;
  price: number | null;
  image_url: string | null;
  gallery: string[];
  featured: boolean;
  stock: number;
  status: "draft" | "published";
  created_at: string;
};

export type SiteContent = {
  id: string;
  key: string;
  value: string | null;
  updated_at: string;
};
