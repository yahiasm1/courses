import type { Metadata } from "next";
import { getCategories, getCourses } from "@/lib/data";
import { CourseGrid } from "@/components/course-card";
import { CategoryChips } from "@/components/category-chips";

export const metadata: Metadata = { title: "Shop" };
export const dynamic = "force-dynamic";

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; q?: string }>;
}) {
  const { category, q } = await searchParams;
  const [categories, courses] = await Promise.all([
    getCategories(),
    getCourses({ categorySlug: category, q }),
  ]);
  const current = categories.find((c) => c.slug === category);

  return (
    <div className="pt-6 sm:pt-8">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{current?.name ?? "All courses"}</h1>
          <p className="mt-1 text-muted">
            {courses.length} {courses.length === 1 ? "course" : "courses"}
            {q ? ` matching “${q}”` : ""}
          </p>
        </div>
        <form className="w-full sm:max-w-xs">
          {category && <input type="hidden" name="category" value={category} />}
          <input
            name="q"
            defaultValue={q}
            placeholder="Search courses…"
            className="w-full rounded-xl border border-line bg-surface px-4 py-2.5 text-sm outline-none focus:border-accent"
          />
        </form>
      </div>
      <div className="mb-6">
        <CategoryChips categories={categories} active={category} />
      </div>
      <CourseGrid courses={courses} />
    </div>
  );
}
