import "server-only";
import { cache } from "react";
import { createClient } from "@/lib/supabase/server";
import { COURSE_COLUMNS, type Category, type Course } from "@/lib/types";

// `cache` dedupes identical calls within one request (the header and the page
// both ask for categories, the user and the full course list).

export const getCategories = cache(async (): Promise<Category[]> => {
  const supabase = await createClient();
  const { data } = await supabase
    .from("categories")
    .select("id, name, slug, image_url, sort_order")
    .order("sort_order")
    .order("name");
  return data ?? [];
});

/** Every published course: featured first, then in table order (first row added = first shown). */
export const getCourses = cache(async (): Promise<Course[]> => {
  const supabase = await createClient();
  const { data } = await supabase
    .from("courses")
    .select(COURSE_COLUMNS)
    .eq("is_published", true)
    .order("is_featured", { ascending: false })
    .order("created_at", { ascending: true });
  return (data ?? []) as unknown as Course[];
});

export type CourseSort = "newest" | "price-asc" | "price-desc";

export type CourseQuery = {
  categorySlug?: string;
  q?: string;
  minPrice?: number;
  maxPrice?: number;
  sort?: CourseSort;
  page?: number;
  perPage?: number;
};

export type CoursePage = {
  courses: Course[];
  total: number;
  page: number;
  perPage: number;
  totalPages: number;
};

/** Filtered, sorted and paginated course search. */
export async function searchCourses(opts: CourseQuery = {}): Promise<CoursePage> {
  const perPage = opts.perPage ?? 12;
  const requested = Math.max(1, Math.floor(opts.page ?? 1));
  const supabase = await createClient();

  let query = supabase
    .from("courses")
    .select(COURSE_COLUMNS, { count: "exact" })
    .eq("is_published", true);

  if (opts.categorySlug) {
    const { data: cat } = await supabase
      .from("categories")
      .select("id")
      .eq("slug", opts.categorySlug)
      .maybeSingle();
    if (!cat) return { courses: [], total: 0, page: 1, perPage, totalPages: 0 };
    query = query.eq("category_id", cat.id);
  }
  if (opts.q) query = query.ilike("name", `%${opts.q}%`);
  if (opts.minPrice !== undefined) query = query.gte("price", opts.minPrice);
  if (opts.maxPrice !== undefined) query = query.lte("price", opts.maxPrice);

  switch (opts.sort) {
    case "price-asc":
      query = query.order("price", { ascending: true });
      break;
    case "price-desc":
      query = query.order("price", { ascending: false });
      break;
    default:
      query = query.order("is_featured", { ascending: false }).order("created_at", { ascending: true });
  }

  const from = (requested - 1) * perPage;
  const { data, count } = await query.range(from, from + perPage - 1);
  const total = count ?? 0;
  const totalPages = Math.ceil(total / perPage);

  return {
    courses: (data ?? []) as unknown as Course[],
    total,
    page: requested,
    perPage,
    totalPages,
  };
}

export async function getCourse(slug: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("courses")
    .select(COURSE_COLUMNS)
    .eq("slug", slug)
    .eq("is_published", true)
    .maybeSingle();
  // A database error must not look like "course not found" (404).
  if (error) throw error;
  return data as unknown as Course | null;
}

export const getUser = cache(async () => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
});
