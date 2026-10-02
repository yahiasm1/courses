import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getCourse, getUser } from "@/lib/data";
import { hasPurchased } from "@/lib/purchases";
import { formatPrice } from "@/lib/types";
import { CourseCover } from "@/components/course-cover";
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
    <div className="pt-6 sm:pt-8">
      <nav className="mb-5 flex items-center gap-2 text-sm text-muted">
        <Link href="/" className="hover:text-ink">Home</Link>
        <span>/</span>
        {course.category && (
          <>
            <Link href={`/shop?category=${course.category.slug}`} className="hover:text-ink">
              {course.category.name}
            </Link>
            <span>/</span>
          </>
        )}
        <span className="truncate text-ink">{course.name}</span>
      </nav>

      <div className="grid gap-8 lg:grid-cols-[1.2fr_1fr]">
        <div className="aspect-[4/3] overflow-hidden rounded-3xl border border-line">
          <CourseCover course={course} />
        </div>

        <div className="flex flex-col gap-5">
          {course.category && (
            <span className="w-fit rounded-full bg-surface-2 px-3 py-1 text-xs font-medium text-muted">
              {course.category.name}
            </span>
          )}
          <h1 className="text-3xl font-bold leading-tight tracking-tight sm:text-4xl">{course.name}</h1>
          <p className="text-3xl font-bold">{formatPrice(course.price)}</p>

          {error === "checkout" && (
            <p className="rounded-xl border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700">
              We couldn&apos;t start the payment. Please try again in a moment.
            </p>
          )}

          <div className="rounded-2xl border border-line bg-surface p-5">
            {owned ? (
              <div className="space-y-3">
                <p className="flex items-center gap-2 text-sm font-medium">
                  <span className="size-2 rounded-full bg-accent" /> You own this course
                </p>
                <a
                  href={`/api/download/${course.id}`}
                  className="block w-full rounded-xl bg-accent px-5 py-3.5 text-center font-semibold text-accent-ink hover:brightness-95"
                >
                  Download course
                </a>
              </div>
            ) : (
              <form action={buyCourse} className="space-y-3">
                <input type="hidden" name="courseId" value={course.id} />
                <input type="hidden" name="slug" value={course.slug} />
                <SubmitButton pendingLabel="Redirecting to payment…">
                  {user ? `Buy now — ${formatPrice(course.price)}` : "Sign in to buy"}
                </SubmitButton>
                <p className="text-center text-xs text-muted">
                  Secure payment with CIB / Edahabia via SlickPay
                </p>
              </form>
            )}

            {course.sales_page_url && (
              <a
                href={course.sales_page_url}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 block w-full rounded-xl border border-line px-5 py-3 text-center text-sm font-medium text-muted hover:text-ink"
              >
                View full sales page ↗
              </a>
            )}
          </div>

          {course.description && (
            <div>
              <h2 className="mb-2 font-semibold">About this course</h2>
              <p className="whitespace-pre-line leading-relaxed text-muted">{course.description}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
