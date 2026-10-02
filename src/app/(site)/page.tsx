import Link from "next/link";
import { getCategories, getCourses } from "@/lib/data";
import { CourseGrid } from "@/components/course-card";
import { CategoryChips } from "@/components/category-chips";
import { Icon } from "@/components/icons";
import { TrustStrip } from "@/components/trust-strip";
import { SITE_TAGLINE } from "@/lib/site";

export const dynamic = "force-dynamic";

const tileTones = [
  "linear-gradient(150deg,#a78bfa,#6d3bf0)",
  "linear-gradient(150deg,#2e90fa,#175cd3)",
  "linear-gradient(150deg,#17b26a,#079455)",
  "linear-gradient(150deg,#4a4a44,#17170f)",
];

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;
  const [categories, courses, allCourses] = await Promise.all([
    getCategories(),
    getCourses({ categorySlug: category }),
    getCourses(),
  ]);

  const counts = new Map<string, number>();
  allCourses.forEach(
    (c) => c.category_id && counts.set(c.category_id, (counts.get(c.category_id) ?? 0) + 1),
  );
  const current = categories.find((c) => c.slug === category);

  return (
    <div className="flex flex-col gap-4">
      {/* Page header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="h1">{current?.name ?? "All courses"}</h1>
          <p className="mt-1 text-[14.5px] text-muted">
            {current
              ? `${courses.length} ${courses.length === 1 ? "course" : "courses"} in this category`
              : SITE_TAGLINE}
          </p>
        </div>
        <Link href="/library" className="btn btn-secondary self-start sm:self-auto">
          <Icon name="book" size={17} />
          My courses
        </Link>
      </div>

      <CategoryChips categories={categories} active={category} basePath="/" />

      <CourseGrid courses={courses} />

      {categories.length > 0 && (
        <section className="card mt-2">
          <div className="card-head">
            <span className="eyebrow">Popular categories</span>
            <Link href="/shop" className="link text-[13px]">
              See all
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-3 p-4 md:grid-cols-4">
            {categories.map((c, i) => (
              <Link
                key={c.id}
                href={`/shop?category=${c.slug}`}
                className="group relative flex aspect-[5/3] flex-col justify-end overflow-hidden rounded-[12px] p-3.5 text-white"
              >
                {c.image_url ? (
                  <img
                    src={c.image_url}
                    alt=""
                    className="absolute inset-0 size-full object-cover transition duration-300 group-hover:scale-105"
                  />
                ) : (
                  <div className="absolute inset-0" style={{ background: tileTones[i % 4] }} />
                )}
                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(17,17,16,0)_40%,rgba(17,17,16,.55)_100%)]" />
                <span className="relative text-[15px] font-semibold tracking-[-.01em]">{c.name}</span>
                <span className="relative mt-0.5 flex items-center gap-1 text-[12.5px] text-white/80">
                  {counts.get(c.id) ?? 0} {counts.get(c.id) === 1 ? "course" : "courses"}
                  <Icon name="arrowRight" size={13} />
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}

      <TrustStrip />
    </div>
  );
}
