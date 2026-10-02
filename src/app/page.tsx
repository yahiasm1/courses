import Link from "next/link";
import { getCategories, getCourses } from "@/lib/data";
import { CourseGrid } from "@/components/course-card";
import { CategoryChips } from "@/components/category-chips";
import { SectionHeading } from "@/components/section-heading";
import { TrustStrip } from "@/components/trust-strip";
import { SITE_TAGLINE } from "@/lib/site";

export const dynamic = "force-dynamic";

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
  allCourses.forEach((c) => c.category_id && counts.set(c.category_id, (counts.get(c.category_id) ?? 0) + 1));

  return (
    <div className="space-y-14 pt-6 sm:pt-8">
      {/* Courses first — the landing view */}
      <section>
        <div className="mb-5">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">All courses</h1>
          <p className="mt-1 text-muted">{SITE_TAGLINE}</p>
        </div>
        <div className="mb-6">
          <CategoryChips categories={categories} active={category} basePath="/" />
        </div>
        <CourseGrid courses={courses} />
      </section>

      {categories.length > 0 && (
        <section>
          <SectionHeading title="Popular categories" href="/shop" linkLabel="See all categories ›" />
          <div className="grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-4">
            {categories.map((c, i) => (
              <Link
                key={c.id}
                href={`/shop?category=${c.slug}`}
                className="group relative flex aspect-[5/3] flex-col justify-end overflow-hidden rounded-2xl p-4 text-white"
              >
                {c.image_url ? (
                  <img src={c.image_url} alt="" className="absolute inset-0 size-full object-cover transition duration-300 group-hover:scale-105" />
                ) : (
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${
                      ["from-violet-600 to-indigo-800", "from-emerald-600 to-teal-800", "from-orange-500 to-rose-700", "from-sky-600 to-blue-800"][i % 4]
                    }`}
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <span className="relative text-lg font-semibold">{c.name}</span>
                <span className="relative text-sm text-white/80">
                  {counts.get(c.id) ?? 0} courses · See courses →
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
