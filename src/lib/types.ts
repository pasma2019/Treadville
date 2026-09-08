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

export type AdminRole = "OWNER" | "SYSTEM_ADMIN" | null;

export type Enquiry = {
  id: string;
  name: string;
  email: string;
  company: string | null;
  phone: string | null;
  type: string;
  message: string;
  status: "new" | "in_review" | "responded" | "closed";
  created_at: string;
};

export type AuditLog = {
  id: string;
  actor_id: string;
  actor_email: string | null;
  action: string;
  entity: string;
  entity_id: string | null;
  details: Record<string, unknown> | null;
  created_at: string;
};

export type Article = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  body: string | null;
  author_name: string | null;
  cover_image_url: string | null;
  status: "draft" | "published";
  published_at: string | null;
  created_at: string;
  updated_at: string;
};

export type StorageFile = {
  id: string;
  storage_path: string;
  original_filename: string | null;
  mime_type: string | null;
  file_size: number | null;
  bucket: string;
  uploader_id: string | null;
  created_at: string;
};

export type ProductMetadata = {
  id: string;
  product_id: string;
  key: string;
  value: string | null;
  created_at: string;
  updated_at: string;
};

export type MetadataField = {
  key: string;
  label: string;
  placeholder: string;
};
