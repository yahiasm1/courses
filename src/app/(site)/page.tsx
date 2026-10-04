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
import { getDict } from "@/lib/i18n/server";

export const dynamic = "force-dynamic";

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page } = await searchParams;
  const [categories, allCourses, result, { t }] = await Promise.all([
    getCategories(),
    getCourses(),
    searchCourses({ page: Number(page) || 1, perPage: 12 }),
    getDict(),
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
                <h2 className="section-header">{t.home.popularNiches}</h2>
                <p className="mt-1 text-[0.88rem] text-muted">{t.home.pickTopic}</p>
              </div>
              <Link href="/shop" className="link linklift shrink-0 text-[0.82rem]">
                {t.home.allCourses}
              </Link>
            </div>
            <NicheGrid niches={niches} />
          </section>
        )}

        <section className="flex flex-col gap-4">
          <div className="flex items-end justify-between gap-4">
            <div>
              <h2 className="section-header">{t.home.allCourses}</h2>
              <p className="mt-1 text-[0.88rem] text-muted">
                {t.home.tagline} {result.total > 0 && `· ${t.courses(result.total)}`}
              </p>
            </div>
            <Link href="/shop" className="btn btn-secondary btn-sm shrink-0">
              <Icon name="search" size={15} />
              {t.home.searchFilter}
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
