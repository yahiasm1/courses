import Link from "next/link";
import { getCategories, getCourses, searchCourses } from "@/lib/data";
import { Container } from "@/components/container";
import { CourseGrid } from "@/components/course-card";
import { Hero } from "@/components/hero";
import { Icon } from "@/components/icons";
import { Pagination } from "@/components/pagination";
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
  const niches = [...categories].sort((a, b) => (counts.get(b.id) ?? 0) - (counts.get(a.id) ?? 0));

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
            <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
              {niches.map((c, i) => (
                <Link
                  key={c.id}
                  href={`/shop?category=${c.slug}`}
                  className="group relative flex aspect-[5/3] flex-col justify-end overflow-hidden rounded-[var(--radius-lg)] border border-[var(--border)] p-3.5 text-white lift"
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
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black/80" />
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
