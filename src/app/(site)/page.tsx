import Link from "next/link";
import { getCategories, getCourses, searchCourses } from "@/lib/data";
import { Container } from "@/components/container";
import { CourseGrid } from "@/components/course-card";
import { Hero } from "@/components/hero";
import { Icon } from "@/components/icons";
import { NicheGrid } from "@/components/niche-grid";
import { Pagination } from "@/components/pagination";
import { TrustStrip } from "@/components/trust-strip";
import { categoryImage } from "@/lib/category-thumbs";
import { SITE_TAGLINE } from "@/lib/site";

export const dynamic = "force-dynamic";

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page } = await searchParams;
  const [categories, allCourses, result] = await Promise.all([
    getCategories(),
    getCourses(),
    searchCourses({ page: Number(page) || 1, perPage: 12 }),
  ]);

  const counts = new Map<string, number>();
  allCourses.forEach(
    (c) => c.category_id && counts.set(c.category_id, (counts.get(c.category_id) ?? 0) + 1),
  );
  const niches = [...categories]
    .sort((a, b) => (counts.get(b.id) ?? 0) - (counts.get(a.id) ?? 0))
    .map((c) => ({ id: c.id, name: c.name, slug: c.slug, image: categoryImage(c), count: counts.get(c.id) ?? 0 }));

  return (
    <>
      <Hero categories={categories} courses={allCourses} />

      <Container className="flex flex-col gap-10">
        {niches.length > 0 && (
          <section className="flex flex-col gap-4">
            <div className="flex items-end justify-between gap-4">
              <div>
                <h2 className="section-header">Popular niches</h2>
                <p className="mt-1 text-[0.88rem] text-muted">Pick a topic and dive in.</p>
              </div>
              <Link href="/shop" className="link linklift shrink-0 text-[0.82rem]">
                All courses
              </Link>
            </div>
            <NicheGrid niches={niches} />
          </section>
        )}

        <section className="flex flex-col gap-4">
          <div className="flex items-end justify-between gap-4">
            <div>
              <h2 className="section-header">All courses</h2>
              <p className="mt-1 text-[0.88rem] text-muted">
                {SITE_TAGLINE} {result.total > 0 && `· ${result.total} ${result.total === 1 ? "course" : "courses"}`}
              </p>
            </div>
            <Link href="/shop" className="btn btn-secondary btn-sm shrink-0">
              <Icon name="search" size={15} />
              Search &amp; filter
            </Link>
          </div>
          <CourseGrid courses={result.courses} />
          <Pagination page={result.page} totalPages={result.totalPages} basePath="/" />
        </section>

        <TrustStrip />
      </Container>
    </>
  );
}
