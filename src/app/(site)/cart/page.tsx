import type { Metadata } from "next";
import Link from "next/link";
import { applyPromo, removeFromCart, removePromo } from "@/app/actions/cart";
import { checkoutCart } from "@/app/actions/checkout";
import { Container } from "@/components/container";
import { CourseCover } from "@/components/course-cover";
import { Icon } from "@/components/icons";
import { SubmitButton } from "@/components/submit-button";
import { getCartCourses, getCartIds, getPromoCode, ownedIds, validatePromo } from "@/lib/cart";
import { getMyPhone, getUser } from "@/lib/data";
import { normalizeDzPhone } from "@/lib/phone";
import { PhoneField } from "@/components/phone-field";
import { PixelOnSubmit } from "@/components/pixel-events";
import { discounted } from "@/lib/promo";
import { IS_SANDBOX } from "@/lib/slickpay";
import { formatPrice } from "@/lib/i18n";
import { getDict } from "@/lib/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getDict();
  return { title: t.cart.title, robots: { index: false } };
}
export const dynamic = "force-dynamic";

export default async function CartPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; detail?: string; promo_error?: string }>;
}) {
  const { error, detail, promo_error } = await searchParams;
  const [ids, user, promoCode, { locale, t }] = await Promise.all([getCartIds(), getUser(), getPromoCode(), getDict()]);
  const c = t.cart;
  const price = (n: number) => formatPrice(n, locale);
  const promoErrors: Record<string, string> = { invalid: c.promoInvalid, used: c.promoUsed };
  const [courses, owned, { promo }] = await Promise.all([
    getCartCourses(ids),
    user ? ownedIds(user.id, ids) : new Set<string>(),
    validatePromo(promoCode, user?.id ?? null),
  ]);

  const needsPhone = Boolean(user) && !normalizeDzPhone(user ? await getMyPhone(user.id) : null);
  const payable = courses.filter((c) => !owned.has(c.id) && Number(c.price) > 0);
  const subtotal = payable.reduce((sum, c) => sum + Number(c.price), 0);
  const total = payable.reduce((sum, c) => sum + discounted(Number(c.price), promo), 0);

  return (
    <Container className="flex flex-col gap-4">
      <div>
        <h1 className="h1 display">{c.title}</h1>
        <p className="mt-1 text-[14.5px] text-muted">{c.count(courses.length)}</p>
      </div>

      {error && (
        <div className="notice notice-red">
          <Icon name="alert" size={18} className="shrink-0 text-red-ink" />
          <span>
            {error === "phone"
              ? t.course.phoneError
              : error === "empty" || error === "price"
                ? c.nothingToBuy
                : c.checkoutError}
            {IS_SANDBOX && detail && (
              <span className="mt-1 block break-words font-mono text-[12px] opacity-80">
                {t.course.testMode}: {detail}
              </span>
            )}
          </span>
        </div>
      )}

      {courses.length === 0 ? (
        <div className="rounded-[16px] border border-dashed border-line bg-surface p-12 text-center">
          <div className="icon-tile icon-tile-lg mx-auto mb-4">
            <Icon name="cart" size={24} />
          </div>
          <p className="text-[15px] font-semibold">{c.emptyTitle}</p>
          <p className="mt-1 text-[14px] text-muted">{c.emptyText}</p>
          <Link href="/shop" className="btn btn-primary mt-5">
            {c.browse}
          </Link>
        </div>
      ) : (
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)] lg:items-start">
          <section className="card">
            <ul>
              {courses.map((course) => {
                const isOwned = owned.has(course.id);
                const unavailable = !(Number(course.price) > 0);
                return (
                  <li
                    key={course.id}
                    className="flex items-center gap-3.5 border-b border-line-3 px-4 py-3 last:border-b-0 sm:px-[18px]"
                  >
                    <Link
                      href={`/courses/${course.slug}`}
                      className="size-14 shrink-0 overflow-hidden rounded-[10px] border border-line-3"
                    >
                      <CourseCover course={course} fit="cover" />
                    </Link>
                    <div className="min-w-0 flex-1">
                      <Link
                        href={`/courses/${course.slug}`}
                        dir="auto"
                        className="line-clamp-2 text-[14.5px] font-medium hover:underline"
                      >
                        {course.name}
                      </Link>
                      <div className="mt-1 flex flex-wrap items-center gap-2 text-[13.5px]">
                        {isOwned ? (
                          <span className="tag tag-green">{c.alreadyYours}</span>
                        ) : unavailable ? (
                          <span className="tag tag-grey">{c.notAvailable}</span>
                        ) : promo ? (
                          <>
                            <span className="font-semibold">{price(discounted(Number(course.price), promo))}</span>
                            <span className="text-muted line-through">{price(course.price)}</span>
                          </>
                        ) : (
                          <span className="font-semibold">{price(course.price)}</span>
                        )}
                      </div>
                    </div>
                    <form action={removeFromCart}>
                      <input type="hidden" name="courseId" value={course.id} />
                      <button
                        type="submit"
                        aria-label={c.removeItem(course.name)}
                        title={c.remove}
                        className="hdr-icon shell-focus text-muted"
                      >
                        <Icon name="trash" size={17} />
                      </button>
                    </form>
                  </li>
                );
              })}
            </ul>
          </section>

          <aside className="card">
            <div className="card-head">
              <span className="eyebrow">{c.summary}</span>
            </div>
            <div className="flex flex-col gap-4 p-5 sm:p-6">
              {!promo && promoCode && (
                <div className="notice notice-grey justify-between">
                  <span className="text-[13px]">
                    {c.promoCantUse(promoCode)}
                  </span>
                  <form action={removePromo}>
                    <button type="submit" className="text-[13px] font-medium underline">
                      {c.remove}
                    </button>
                  </form>
                </div>
              )}
              {promo ? (
                <div className="notice notice-green justify-between">
                  <span className="flex items-center gap-2">
                    <Icon name="tag" size={16} />
                    <span>
                      <strong>{promo.code}</strong> · {c.promoLabel(promo.percent)}
                    </span>
                  </span>
                  <form action={removePromo}>
                    <button type="submit" className="text-[13px] font-medium underline">
                      {c.remove}
                    </button>
                  </form>
                </div>
              ) : promoCode ? null : (
                <form action={applyPromo} className="flex flex-col gap-1.5">
                  <label htmlFor="promo" className="text-[13px] font-medium text-muted">
                    {c.promoCode}
                  </label>
                  <div className="flex gap-2">
                    <input
                      id="promo"
                      name="code"
                      autoComplete="off"
                      autoCapitalize="characters"
                      spellCheck={false}
                      placeholder={c.promoPlaceholder}
                      className="input min-w-0 flex-1 uppercase placeholder:normal-case"
                    />
                    <button type="submit" className="btn btn-secondary shrink-0">
                      {c.apply}
                    </button>
                  </div>
                  {promo_error && (
                    <span className="text-[13px] text-red-ink">{promoErrors[promo_error] ?? promoErrors.invalid}</span>
                  )}
                </form>
              )}

              <dl className="flex flex-col gap-2 border-t border-line-3 pt-4 text-[14px]">
                <div className="flex justify-between">
                  <dt className="text-muted">{c.subtotal}</dt>
                  <dd>{price(subtotal)}</dd>
                </div>
                {promo && (
                  <div className="flex justify-between text-green-ink">
                    <dt>{c.discount(promo.percent)}</dt>
                    <dd dir="ltr">−{price(subtotal - total)}</dd>
                  </div>
                )}
                <div className="flex justify-between text-[16px] font-semibold">
                  <dt>{c.total}</dt>
                  <dd>{price(total)}</dd>
                </div>
              </dl>

              {payable.length > 0 ? (
                <PixelOnSubmit
                  event="InitiateCheckout"
                  params={{
                    content_ids: payable.map((x) => x.id),
                    content_type: "product",
                    num_items: payable.length,
                    value: total,
                    currency: "DZD",
                  }}
                >
                <form action={checkoutCart} className="flex flex-col gap-3">
                  {needsPhone && <PhoneField />}
                  <SubmitButton pendingLabel={t.course.redirecting}>
                    {user ? c.checkout(price(total)) : c.signInToCheckout}
                  </SubmitButton>
                </form>
                </PixelOnSubmit>
              ) : (
                <button type="button" disabled className="btn btn-primary btn-lg w-full opacity-60">
                  {c.nothingToPay}
                </button>
              )}
              <p className="flex items-center gap-1.5 text-[12.5px] text-muted">
                <Icon name="lock" size={14} />
                {c.secure}
              </p>
            </div>
          </aside>
        </div>
      )}
    </Container>
  );
}
