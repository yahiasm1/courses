export type Category = {
  id: string;
  name: string;
  slug: string;
  image_url: string | null;
  sort_order: number;
};

/** Course as the public sees it — download_url is deliberately absent. */
export type Course = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image_url: string | null;
  price: number;
  sales_page_url: string | null;
  category_id: string | null;
  is_featured: boolean;
  created_at: string;
  category?: Pick<Category, "name" | "slug"> | null;
};

/** Columns anon/authenticated are allowed to select (see supabase/schema.sql). */
export const COURSE_COLUMNS =
  "id, name, slug, description, image_url, price, sales_page_url, category_id, is_featured, created_at, category:categories(name, slug)";

export function formatPrice(price: number) {
  return `${new Intl.NumberFormat("en-US").format(Number(price))} DA`;
}
