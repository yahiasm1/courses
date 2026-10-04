import type { Metadata } from "next";
import Link from "next/link";
import { getCategories, searchCourses, type CourseSort } from "@/lib/data";
import { Container } from "@/components/container";
import { CourseGrid } from "@/components/course-card";
import { CategoryChips } from "@/components/category-chips";
import { Icon } from "@/components/icons";
import { Pagination } from "@/components/pagination";

export const metadata: Metadata = {
  title: "All courses",
  description: "Browse every course on Courses DZ. Pay in DA with CIB or Edahabia and download instantly.",
  alternates: { canonical: "/shop" },
};
export const dynamic = "force-dynamic";

const sorts: { value: CourseSort; label: string }[] = [
  { value: "newest", label: "Newest first" },
  { value: "price-asc", label: "Price: low to high" },
  { value: "price-desc", label: "Price: high to low" },
];

function num(v: string | undefined) {
  if (v === undefined || v === "") return undefined;
  const n = Number(v);
  return Number.isFinite(n) && n >= 0 ? n : undefined;
}

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{
    category?: string;
    q?: string;
    min?: string;
    max?: string;
    sort?: string;
    page?: string;
  }>;
}) {
  const sp = await searchParams;
  const q = sp.q?.trim() || undefined;
  const minPrice = num(sp.min);
  const maxPrice = num(sp.max);
  const sort = sorts.some((s) => s.value === sp.sort) ? (sp.sort as CourseSort) : "newest";
  const page = Number(sp.page) || 1;

  const [categories, result] = await Promise.all([
    getCategories(),
    searchCourses({ categorySlug: sp.category, q, minPrice, maxPrice, sort, page, perPage: 12 }),
  ]);
  const current = categories.find((c) => c.slug === sp.category);
  const hasFilters = Boolean(q || sp.category || minPrice !== undefined || maxPrice !== undefined || sort !== "newest");

  const params = {
    q,
    category: sp.category,
    min: minPrice !== undefined ? String(minPrice) : undefined,
    max: maxPrice !== undefined ? String(maxPrice) : undefined,
    sort: sort !== "newest" ? sort : undefined,
  };
  const chipParams = { q: params.q, min: params.min, max: params.max, sort: params.sort };
  const countLabel = `${result.total} ${result.total === 1 ? "course" : "courses"}${
    q ? ` matching “${q}”` : ""
  }`;

  return (
    <Container className="flex flex-col gap-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="h1 display">{current?.name ?? "All courses"}</h1>
          <p className="mt-1 text-[0.9rem] text-muted">{countLabel}</p>
        </div>
        {hasFilters && (
          <Link href="/shop" className="btn btn-ghost btn-sm self-start sm:self-auto">
            <Icon name="close" size={14} />
            Clear filters
          </Link>
        )}
      </div>

      <section className="card">
        <form className="flex flex-col gap-3 border-b border-[var(--border)] p-3.5 sm:p-4">
          {sp.category && <input type="hidden" name="category" value={sp.category} />}
          <div className="grid gap-2.5 md:grid-cols-[minmax(0,1.6fr)_repeat(2,minmax(0,0.7fr))_minmax(0,1fr)_auto]">
            <label className="search h-11">
              <Icon name="search" size={16} className="text-faint" />
              <input
                type="search"
                name="q"
                defaultValue={q}
                placeholder="Search courses…"
                aria-label="Search courses"
                autoComplete="off"
              />
            </label>
            <label className="search h-11">
              <span className="text-[0.75rem] text-faint">Min</span>
              <input
                type="number"
                name="min"
                min={0}
                step={100}
                inputMode="numeric"
                defaultValue={minPrice}
                placeholder="0"
                aria-label="Minimum price"
              />
              <span className="text-[0.75rem] text-faint">DA</span>
            </label>
            <label className="search h-11">
              <span className="text-[0.75rem] text-faint">Max</span>
              <input
                type="number"
                name="max"
                min={0}
                step={100}
                inputMode="numeric"
                defaultValue={maxPrice}
                placeholder="Any"
                aria-label="Maximum price"
              />
              <span className="text-[0.75rem] text-faint">DA</span>
            </label>
            <label className="search h-11">
              <Icon name="chevronDown" size={14} className="text-faint" />
              <select
                name="sort"
                defaultValue={sort}
                aria-label="Sort by"
                className="min-w-0 flex-1 cursor-pointer appearance-none bg-transparent text-[0.875rem] text-[var(--text)] outline-none"
              >
                {sorts.map((s) => (
                  <option key={s.value} value={s.value} className="bg-[var(--surface)] text-[var(--text)]">
                    {s.label}
                  </option>
                ))}
              </select>
            </label>
            <button type="submit" className="btn btn-primary h-11">
              Apply
            </button>
          </div>
          <div className="flex flex-col gap-2">
            <span className="eyebrow">Niche</span>
            <CategoryChips categories={categories} active={sp.category} params={chipParams} bleed={false} />
          </div>
        </form>

        <div className="bg-[var(--bg)] p-3.5 sm:p-4">
          {result.courses.length === 0 && hasFilters ? (
            <div className="rounded-[var(--radius-lg)] border border-dashed border-[var(--border-strong)] bg-[var(--surface)] p-12 text-center">
              <p className="text-[15px] font-semibold">No courses match these filters</p>
              <p className="mt-1 text-[14px] text-muted">Try another niche, a wider price range or a shorter search.</p>
              <Link href="/shop" className="btn btn-secondary mt-5">
                Clear filters
              </Link>
            </div>
          ) : (
            <CourseGrid courses={result.courses} />
          )}
        </div>

        <div className="card-foot flex flex-col items-center gap-3 text-[13px] text-muted sm:flex-row sm:justify-between">
          <span>
            {countLabel}
            {result.totalPages > 1 && ` · page ${result.page} of ${result.totalPages}`}
          </span>
          <Pagination page={result.page} totalPages={result.totalPages} basePath="/shop" params={params} />
        </div>
      </section>
    </Container>
  );
}
