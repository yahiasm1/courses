import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getCourse, getUser } from "@/lib/data";
import { hasPurchased } from "@/lib/purchases";
import { formatPrice } from "@/lib/types";
import { Container } from "@/components/container";
import { CourseCover } from "@/components/course-cover";
import { Icon } from "@/components/icons";
import { buyCourse } from "@/app/actions/checkout";
import { SubmitButton } from "@/components/submit-button";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ error?: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const course = await getCourse((await params).slug);
  return { title: course?.name ?? "Course", description: course?.description ?? undefined };
}

export default async function CoursePage({ params, searchParams }: Props) {
  const { slug } = await params;
  const { error } = await searchParams;
  const [course, user] = await Promise.all([getCourse(slug), getUser()]);
  if (!course) notFound();

  const owned = user ? await hasPurchased(user.id, course.id) : false;

  return (
    <Container className="flex flex-col gap-4">
      <nav className="flex items-center gap-1.5 text-[13.5px] text-muted">
        <Link href="/" className="hover:text-ink">
          Courses
        </Link>
        {course.category && (
          <>
            <Icon name="chevronRight" size={14} className="text-faint" />
            <Link href={`/shop?category=${course.category.slug}`} className="hover:text-ink">
              {course.category.name}
            </Link>
          </>
        )}
        <Icon name="chevronRight" size={14} className="text-faint" />
        <span className="truncate font-medium text-ink">{course.name}</span>
      </nav>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] lg:items-start">
        <div className="card">
          <div className="aspect-[4/3] bg-[var(--surface-raised)]">
            <CourseCover course={course} />
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div className="card">
            <div className="p-5 sm:p-6">
              <div className="mb-3 flex flex-wrap items-center gap-2">
                {course.category && <span className="tag tag-grey">{course.category.name}</span>}
                {course.is_featured && <span className="tag tag-amber">Featured</span>}
                {owned && (
                  <span className="tag tag-green">
                    <Icon name="check" size={13} className="mr-1" strokeWidth={2.4} />
                    Owned
                  </span>
                )}
              </div>
              <h1 className="h2 display">{course.name}</h1>
              <div className="mt-3 flex items-baseline gap-2">
                <span className="price-xl display">
                  {formatPrice(course.price)}
                </span>
                <span className="text-[14px] text-muted">one-time</span>
              </div>

              {error === "checkout" && (
                <div className="notice notice-red mt-4">
                  <Icon name="alert" size={18} className="shrink-0 text-red-ink" />
                  <span>We couldn&apos;t start the payment. Please try again in a moment.</span>
                </div>
              )}

              <div className="mt-5 flex flex-col gap-2.5">
                {owned ? (
                  <a href={`/api/download/${course.id}`} className="btn btn-primary btn-lg w-full">
                    <Icon name="download" size={18} />
                    Download course
                  </a>
                ) : (
                  <form action={buyCourse} className="flex flex-col gap-2.5">
                    <input type="hidden" name="courseId" value={course.id} />
                    <input type="hidden" name="slug" value={course.slug} />
                    <SubmitButton pendingLabel="Redirecting to payment…">
                      {user ? `Buy now — ${formatPrice(course.price)}` : "Sign in to buy"}
                    </SubmitButton>
                  </form>
                )}
                {course.sales_page_url && (
                  <a
                    href={course.sales_page_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-secondary btn-lg w-full"
                  >
                    View full sales page
                    <Icon name="arrowUpRight" size={16} />
                  </a>
                )}
              </div>
            </div>
            <div className="card-foot flex items-center justify-between gap-3 text-[12.5px] text-muted">
              <span className="flex items-center gap-1.5">
                <Icon name="lock" size={14} />
                Secure payment with CIB / Edahabia via SlickPay
              </span>
              <span className="tag tag-green hidden sm:inline-flex">Instant access</span>
            </div>
          </div>

          {course.description && (
            <div className="card">
              <div className="card-head">
                <span className="eyebrow">About this course</span>
              </div>
              <p className="whitespace-pre-line p-5 text-[14.5px] leading-[1.6] text-ink-2 sm:p-6">
                {course.description}
              </p>
            </div>
          )}
        </div>
      </div>
    </Container>
  );
}
