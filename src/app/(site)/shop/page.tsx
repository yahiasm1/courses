import type { Metadata } from "next";
import { getCategories, getCourses } from "@/lib/data";
import { CourseGrid } from "@/components/course-card";
import { CategoryChips } from "@/components/category-chips";
import { Icon } from "@/components/icons";

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
  const countLabel = `${courses.length} ${courses.length === 1 ? "course" : "courses"}${
    q ? ` matching “${q}”` : ""
  }`;

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="h1 display">{current?.name ?? "Shop"}</h1>
        <p className="mt-1 text-[14.5px] text-muted">{countLabel}</p>
      </div>

      <section className="card">
        <div className="flex flex-col gap-2.5 border-b border-line-3 p-3.5 sm:flex-row sm:items-center sm:px-4">
          <form className="search w-full sm:max-w-[320px] sm:flex-1">
            {category && <input type="hidden" name="category" value={category} />}
            <Icon name="search" size={18} className="text-faint" />
            <input name="q" defaultValue={q} placeholder="Search courses…" aria-label="Search courses" />
          </form>
          <CategoryChips categories={categories} active={category} bleed={false} />
        </div>
        <div className="bg-surface-2 p-3.5 sm:p-4">
          <CourseGrid courses={courses} />
        </div>
        <div className="card-foot flex items-center justify-between text-[13px] text-muted">
          <span>{countLabel}</span>
          <span className="flex items-center gap-1 font-semibold text-green-ink">
            <Icon name="flash" size={14} />
            Instant download
          </span>
        </div>
      </section>
    </div>
  );
}
