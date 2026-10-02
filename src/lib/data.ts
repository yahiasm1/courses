import "server-only";
import { cache } from "react";
import { createClient } from "@/lib/supabase/server";
import { COURSE_COLUMNS, type Category, type Course } from "@/lib/types";

// `cache` dedupes identical calls within one request (the shell and the page
// both ask for categories, the user and the course list).

export const getCategories = cache(async (): Promise<Category[]> => {
  const supabase = await createClient();
  const { data } = await supabase
    .from("categories")
    .select("id, name, slug, image_url, sort_order")
    .order("sort_order")
    .order("name");
  return data ?? [];
});

export const getCourses = cache(
  async (opts: { categorySlug?: string; q?: string } = {}): Promise<Course[]> => {
    const supabase = await createClient();
    let query = supabase
      .from("courses")
      .select(COURSE_COLUMNS)
      .eq("is_published", true)
      .order("is_featured", { ascending: false })
      .order("created_at", { ascending: false });

    if (opts.categorySlug) {
      const { data: cat } = await supabase
        .from("categories")
        .select("id")
        .eq("slug", opts.categorySlug)
        .maybeSingle();
      if (!cat) return [];
      query = query.eq("category_id", cat.id);
    }
    if (opts.q) query = query.ilike("name", `%${opts.q}%`);

    const { data } = await query;
    return (data ?? []) as unknown as Course[];
  },
);

export async function getCourse(slug: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("courses")
    .select(COURSE_COLUMNS)
    .eq("slug", slug)
    .eq("is_published", true)
    .maybeSingle();
  return data as unknown as Course | null;
}

export const getUser = cache(async () => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
});
