import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getCourse, getMyPhone, getUser } from "@/lib/data";
import { normalizeDzPhone } from "@/lib/phone";
import { PhoneField } from "@/components/phone-field";
import { hasPurchased } from "@/lib/purchases";
import { formatPrice } from "@/lib/i18n";
import { getDict } from "@/lib/i18n/server";
import { Container } from "@/components/container";
import { CourseCover } from "@/components/course-cover";
import { Icon } from "@/components/icons";
import { buyCourse } from "@/app/actions/checkout";
import { addToCart } from "@/app/actions/cart";
import { getCartIds } from "@/lib/cart";
import { SubmitButton } from "@/components/submit-button";
import { IS_SANDBOX } from "@/lib/slickpay";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ error?: string; detail?: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const course = await getCourse(slug);
  if (!course) return { title: "Course" };
  const description = course.description?.replace(/\s+/g, " ").slice(0, 160) || undefined;
  const images = course.image_url ? [course.image_url] : undefined;
  return {
    title: course.name,
    description,
    alternates: { canonical: `/courses/${course.slug}` },
    openGraph: { title: course.name, description, images, type: "website" },
    twitter: { card: images ? "summary_large_image" : "summary", title: course.name, description, images },
  };
}

export default async function CoursePage({ params, searchParams }: Props) {
  const { slug } = await params;
  const { error, detail } = await searchParams;
  const [course, user, { locale, t }] = await Promise.all([getCourse(slug), getUser(), getDict()]);
  const c = t.course;
  if (!course) notFound();

  const [owned, cart, phone] = await Promise.all([
    user ? hasPurchased(user.id, course.id) : false,
    getCartIds(),
    user ? getMyPhone(user.id) : null,
  ]);
  const needsPhone = Boolean(user) && !normalizeDzPhone(phone);
  const inCart = cart.includes(course.id);

  return (
    <Container className="flex flex-col gap-4">
      <nav className="flex items-center gap-1.5 text-[13.5px] text-muted">
        <Link href="/" className="hover:text-ink">
          {c.breadcrumb}
        </Link>
        {course.category && (
          <>
            <Icon name="chevronRight" size={14} className="text-faint rtl:rotate-180" />
            <Link href={`/shop?category=${course.category.slug}`} className="hover:text-ink">
              {course.category.name}
            </Link>
          </>
        )}
        <Icon name="chevronRight" size={14} className="text-faint rtl:rotate-180" />
        <span className="truncate font-medium text-ink">{course.name}</span>
      </nav>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] lg:items-start">
        <div className="card">
          <div className="aspect-video bg-[var(--surface-raised)]">
            <CourseCover course={course} />
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div className="card">
            <div className="p-5 sm:p-6">
              <div className="mb-3 flex flex-wrap items-center gap-2">
                {course.category && <span className="tag tag-grey">{course.category.name}</span>}
                {course.is_featured && <span className="tag tag-amber">{c.featured}</span>}
                {owned && (
                  <span className="tag tag-green">
                    <Icon name="check" size={13} className="mr-1" strokeWidth={2.4} />
                    {c.owned}
                  </span>
                )}
              </div>
              <h1 dir="auto" className="h2 display break-words">{course.name}</h1>
              <div className="mt-3 flex items-baseline gap-2">
                <span className="price-xl display">
                  {formatPrice(course.price, locale)}
                </span>
                <span className="text-[14px] text-muted">{c.oneTime}</span>
              </div>

              {error === "phone" && (
                <div className="notice notice-red mt-4">
                  <Icon name="alert" size={18} className="shrink-0 text-red-ink" />
                  <span>{c.phoneError}</span>
                </div>
              )}
              {error === "price" && (
                <div className="notice notice-red mt-4">
                  <Icon name="alert" size={18} className="shrink-0 text-red-ink" />
                  <span>{c.notAvailable}</span>
                </div>
              )}
              {error === "checkout" && (
                <div className="notice notice-red mt-4">
                  <Icon name="alert" size={18} className="shrink-0 text-red-ink" />
                  <span>
                    {c.checkoutError}
                    {IS_SANDBOX && detail && (
                      <span className="mt-1 block break-words font-mono text-[12px] opacity-80">
                        {c.testMode}: {detail}
                      </span>
                    )}
                  </span>
                </div>
              )}

              <div className="mt-5 flex flex-col gap-2.5">
                {owned ? (
                  <a href={`/api/download/${course.id}`} className="btn btn-primary btn-lg w-full">
                    <Icon name="download" size={18} />
                    {c.download}
                  </a>
                ) : !(Number(course.price) > 0) ? (
                  <button type="button" disabled className="btn btn-primary btn-lg w-full opacity-60">
                    {c.notYet}
                  </button>
                ) : (
                  <form action={buyCourse} className="flex flex-col gap-2.5">
                    <input type="hidden" name="courseId" value={course.id} />
                    <input type="hidden" name="slug" value={course.slug} />
                    {needsPhone && <PhoneField />}
                    <SubmitButton pendingLabel={c.redirecting}>
                      {user ? c.buyNow(formatPrice(course.price, locale)) : c.signInToBuy}
                    </SubmitButton>
                  </form>
                )}
                {!owned && Number(course.price) > 0 &&
                  (inCart ? (
                    <Link href="/cart" className="btn btn-secondary btn-lg w-full">
                      <Icon name="check" size={17} strokeWidth={2.4} />
                      {c.inCart}
                    </Link>
                  ) : (
                    <form action={addToCart}>
                      <input type="hidden" name="courseId" value={course.id} />
                      <SubmitButton pendingLabel={c.adding} variant="secondary">
                        <Icon name="cart" size={17} />
                        {c.addToCart}
                      </SubmitButton>
                    </form>
                  ))}
                {course.sales_page_url && (
                  <a
                    href={course.sales_page_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-secondary btn-lg w-full"
                  >
                    {c.salesPage}
                    <Icon name="arrowUpRight" size={16} className="rtl:-scale-x-100" />
                  </a>
                )}
              </div>
            </div>
            <div className="card-foot flex items-center justify-between gap-3 text-[12.5px] text-muted">
              <span className="flex items-center gap-1.5">
                <Icon name="lock" size={14} />
                {c.secure}
              </span>
              <span className="tag tag-green hidden sm:inline-flex">{c.instant}</span>
            </div>
          </div>

          {course.description && (
            <div className="card">
              <div className="card-head">
                <span className="eyebrow">{c.about}</span>
              </div>
              <p dir="auto" className="whitespace-pre-line p-5 text-[14.5px] leading-[1.6] text-ink-2 sm:p-6">
                {course.description}
              </p>
            </div>
          )}
        </div>
      </div>
    </Container>
  );
}
