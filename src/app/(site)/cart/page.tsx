import type { Metadata } from "next";
import Link from "next/link";
import { applyPromo, removeFromCart, removePromo } from "@/app/actions/cart";
import { checkoutCart } from "@/app/actions/checkout";
import { Container } from "@/components/container";
import { CourseCover } from "@/components/course-cover";
import { Icon } from "@/components/icons";
import { SubmitButton } from "@/components/submit-button";
import { getCartCourses, getCartIds, getPromoCode, ownedIds, validatePromo } from "@/lib/cart";
import { getUser } from "@/lib/data";
import { discounted } from "@/lib/promo";
import { IS_SANDBOX } from "@/lib/slickpay";
import { formatPrice } from "@/lib/types";

export const metadata: Metadata = { title: "Cart", robots: { index: false } };
export const dynamic = "force-dynamic";

const promoErrors: Record<string, string> = {
  invalid: "That promo code doesn't exist.",
  used: "This code is only valid on your first order.",
};

export default async function CartPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; detail?: string; promo_error?: string }>;
}) {
  const { error, detail, promo_error } = await searchParams;
  const [ids, user, promoCode] = await Promise.all([getCartIds(), getUser(), getPromoCode()]);
  const [courses, owned, { promo }] = await Promise.all([
    getCartCourses(ids),
    user ? ownedIds(user.id, ids) : new Set<string>(),
    validatePromo(promoCode, user?.id ?? null),
  ]);

  const payable = courses.filter((c) => !owned.has(c.id) && Number(c.price) > 0);
  const subtotal = payable.reduce((sum, c) => sum + Number(c.price), 0);
  const total = payable.reduce((sum, c) => sum + discounted(Number(c.price), promo), 0);

  return (
    <Container className="flex flex-col gap-4">
      <div>
        <h1 className="h1 display">Cart</h1>
        <p className="mt-1 text-[14.5px] text-muted">
          {courses.length} {courses.length === 1 ? "course" : "courses"}
        </p>
      </div>

      {error && (
        <div className="notice notice-red">
          <Icon name="alert" size={18} className="shrink-0 text-red-ink" />
          <span>
            {error === "empty" || error === "price"
              ? "There's nothing in your cart that can be bought right now."
              : "We couldn't start the payment. Please try again in a moment."}
            {IS_SANDBOX && detail && (
              <span className="mt-1 block break-words font-mono text-[12px] opacity-80">Test mode: {detail}</span>
            )}
          </span>
        </div>
      )}

      {courses.length === 0 ? (
        <div className="rounded-[16px] border border-dashed border-line bg-surface p-12 text-center">
          <div className="icon-tile icon-tile-lg mx-auto mb-4">
            <Icon name="cart" size={24} />
          </div>
          <p className="text-[15px] font-semibold">Your cart is empty</p>
          <p className="mt-1 text-[14px] text-muted">Add courses from their page, then pay for them all at once.</p>
          <Link href="/shop" className="btn btn-primary mt-5">
            Browse courses
          </Link>
        </div>
      ) : (
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)] lg:items-start">
          <section className="card">
            <ul>
              {courses.map((c) => {
                const isOwned = owned.has(c.id);
                const unavailable = !(Number(c.price) > 0);
                return (
                  <li
                    key={c.id}
                    className="flex items-center gap-3.5 border-b border-line-3 px-4 py-3 last:border-b-0 sm:px-[18px]"
                  >
                    <Link
                      href={`/courses/${c.slug}`}
                      className="size-14 shrink-0 overflow-hidden rounded-[10px] border border-line-3"
                    >
                      <CourseCover course={c} fit="cover" />
                    </Link>
                    <div className="min-w-0 flex-1">
                      <Link
                        href={`/courses/${c.slug}`}
                        className="line-clamp-2 text-[14.5px] font-medium hover:underline"
                      >
                        {c.name}
                      </Link>
                      <div className="mt-1 flex flex-wrap items-center gap-2 text-[13.5px]">
                        {isOwned ? (
                          <span className="tag tag-green">Already yours</span>
                        ) : unavailable ? (
                          <span className="tag tag-grey">Not available yet</span>
                        ) : promo ? (
                          <>
                            <span className="font-semibold">{formatPrice(discounted(Number(c.price), promo))}</span>
                            <span className="text-muted line-through">{formatPrice(c.price)}</span>
                          </>
                        ) : (
                          <span className="font-semibold">{formatPrice(c.price)}</span>
                        )}
                      </div>
                    </div>
                    <form action={removeFromCart}>
                      <input type="hidden" name="courseId" value={c.id} />
                      <button
                        type="submit"
                        aria-label={`Remove ${c.name}`}
                        title="Remove"
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
              <span className="eyebrow">Summary</span>
            </div>
            <div className="flex flex-col gap-4 p-5 sm:p-6">
              {!promo && promoCode && (
                <div className="notice notice-grey justify-between">
                  <span className="text-[13px]">
                    <strong>{promoCode}</strong> can&apos;t be used on this order.
                  </span>
                  <form action={removePromo}>
                    <button type="submit" className="text-[13px] font-medium underline">
                      Remove
                    </button>
                  </form>
                </div>
              )}
              {promo ? (
                <div className="notice notice-green justify-between">
                  <span className="flex items-center gap-2">
                    <Icon name="tag" size={16} />
                    <span>
                      <strong>{promo.code}</strong> · {promo.label}
                    </span>
                  </span>
                  <form action={removePromo}>
                    <button type="submit" className="text-[13px] font-medium underline">
                      Remove
                    </button>
                  </form>
                </div>
              ) : promoCode ? null : (
                <form action={applyPromo} className="flex flex-col gap-1.5">
                  <label htmlFor="promo" className="text-[13px] font-medium text-muted">
                    Promo code
                  </label>
                  <div className="flex gap-2">
                    <input
                      id="promo"
                      name="code"
                      autoComplete="off"
                      autoCapitalize="characters"
                      spellCheck={false}
                      placeholder="e.g. WELCOME10"
                      className="input min-w-0 flex-1 uppercase placeholder:normal-case"
                    />
                    <button type="submit" className="btn btn-secondary shrink-0">
                      Apply
                    </button>
                  </div>
                  {promo_error && (
                    <span className="text-[13px] text-red-ink">{promoErrors[promo_error] ?? promoErrors.invalid}</span>
                  )}
                </form>
              )}

              <dl className="flex flex-col gap-2 border-t border-line-3 pt-4 text-[14px]">
                <div className="flex justify-between">
                  <dt className="text-muted">Subtotal</dt>
                  <dd>{formatPrice(subtotal)}</dd>
                </div>
                {promo && (
                  <div className="flex justify-between text-green-ink">
                    <dt>Discount ({promo.percent}%)</dt>
                    <dd>−{formatPrice(subtotal - total)}</dd>
                  </div>
                )}
                <div className="flex justify-between text-[16px] font-semibold">
                  <dt>Total</dt>
                  <dd>{formatPrice(total)}</dd>
                </div>
              </dl>

              {payable.length > 0 ? (
                <form action={checkoutCart}>
                  <SubmitButton pendingLabel="Redirecting to payment…">
                    {user ? `Checkout — ${formatPrice(total)}` : "Sign in to checkout"}
                  </SubmitButton>
                </form>
              ) : (
                <button type="button" disabled className="btn btn-primary btn-lg w-full opacity-60">
                  Nothing to pay
                </button>
              )}
              <p className="flex items-center gap-1.5 text-[12.5px] text-muted">
                <Icon name="lock" size={14} />
                One secure payment for all courses, with CIB / Edahabia via SlickPay.
              </p>
            </div>
          </aside>
        </div>
      )}
    </Container>
  );
}
