"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createAdminClient, createClient } from "@/lib/supabase/server";
import { IS_SANDBOX, createInvoice } from "@/lib/slickpay";
import { PROMO_COOKIE, getCartIds, getPromoCode, ownedIds, validatePromo } from "@/lib/cart";
import { discounted } from "@/lib/promo";
import { siteOrigin } from "@/lib/site-origin";

/** Back to `back` with an error; in test mode the reason is shown on the page too. */
function fail(back: string, reason: string): never {
  const detail = IS_SANDBOX ? `&detail=${encodeURIComponent(reason.slice(0, 300))}` : "";
  redirect(`${back}?error=checkout${detail}`);
}

/**
 * Creates one pending purchase per course and a single SlickPay invoice covering
 * them all, then returns the payment URL. The first purchase id identifies the
 * order on the return page and in the webhook.
 */
async function startCheckout(courseIds: string[], opts: { back: string; promoCode?: string | null }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect(`/login?next=${encodeURIComponent(opts.back)}`);

  const { data: rows } = await supabase
    .from("courses")
    .select("id, name, price")
    .in("id", courseIds)
    .eq("is_published", true);
  const owned = await ownedIds(user.id, courseIds);
  const courses = (rows ?? []).filter((c) => !owned.has(c.id) && Number(c.price) > 0);
  if (!courses.length) {
    redirect(owned.size ? "/library" : `${opts.back}?error=${rows?.length ? "price" : "empty"}`);
  }

  const { promo, error: promoError } = await validatePromo(opts.promoCode, user.id);
  if (promoError) {
    // Drop the refused code so it can't block every later checkout.
    (await cookies()).delete(PROMO_COOKIE);
    redirect(`${opts.back}?promo_error=${promoError}`);
  }

  const lines = courses.map((c) => ({ course: c, amount: discounted(Number(c.price), promo) }));
  const total = lines.reduce((sum, l) => sum + l.amount, 0);

  const { data: profile } = await supabase
    .from("profiles")
    .select("first_name, last_name, phone")
    .eq("id", user.id)
    .maybeSingle();

  const admin = createAdminClient();
  // A new checkout replaces any unpaid one for the same courses (second tab, Back button).
  // If an old invoice is still paid later, confirmation honours it anyway.
  await admin
    .from("purchases")
    .update({ status: "failed" })
    .eq("user_id", user.id)
    .eq("status", "pending")
    .in("course_id", courses.map((c) => c.id));

  const { data: purchases, error } = await admin
    .from("purchases")
    .insert(lines.map((l) => ({ user_id: user.id, course_id: l.course.id, amount: l.amount })))
    .select("id");
  if (error || !purchases?.length) {
    console.error("[checkout] could not create the purchase rows:", error);
    fail(opts.back, `Database: ${error?.message ?? "no rows returned"}`);
  }
  const ids = purchases.map((p) => p.id as string);
  const primary = ids[0];

  const site = await siteOrigin();
  try {
    const invoice = await createInvoice({
      amount: total,
      returnUrl: `${site}/checkout/return?purchase=${primary}`,
      webhookUrl: `${site}/api/slickpay/webhook`,
      firstname: profile?.first_name || "Customer",
      lastname: profile?.last_name || "-",
      email: user.email ?? "",
      phone: profile?.phone || "0000000000",
      address: "Algeria",
      items: lines.map((l) => ({
        name: promo ? `${l.course.name} (${promo.code} -${promo.percent}%)` : l.course.name,
        price: l.amount,
      })),
      metadata: { purchase_id: primary },
    });

    // Confirmation relies on this link between our rows and the invoice: retry once, then fail.
    const save = () => admin.from("purchases").update({ slickpay_invoice_id: String(invoice.id) }).in("id", ids);
    let { error: saveError } = await save();
    if (saveError) ({ error: saveError } = await save());
    if (saveError) throw new Error(`Database: could not save invoice ${invoice.id}: ${saveError.message}`);
    return invoice.url;
  } catch (e) {
    console.error("[checkout] SlickPay invoice failed:", e);
    await admin.from("purchases").update({ status: "failed" }).in("id", ids);
    fail(opts.back, e instanceof Error ? e.message : String(e));
  }
}

/** "Buy now" on a course page. */
export async function buyCourse(formData: FormData) {
  const courseId = String(formData.get("courseId") ?? "");
  const slug = String(formData.get("slug") ?? "");
  const url = await startCheckout([courseId], { back: `/courses/${slug}` });
  redirect(url);
}

/**
 * Checkout of everything in the cart, with the applied promo code. The cart is kept
 * until payment is confirmed (see pruneCart), so cancelling on SlickPay loses nothing.
 */
export async function checkoutCart() {
  const ids = await getCartIds();
  if (!ids.length) redirect("/cart");
  const url = await startCheckout(ids, { back: "/cart", promoCode: await getPromoCode() });
  redirect(url);
}
