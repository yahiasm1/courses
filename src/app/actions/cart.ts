"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { CART_COOKIE, PROMO_COOKIE, cookieOptions, getCartIds, serializeCart, validatePromo } from "@/lib/cart";
import { getUser } from "@/lib/data";
import { ownedIds } from "@/lib/cart";

export async function addToCart(formData: FormData) {
  const courseId = String(formData.get("courseId") ?? "");
  const ids = await getCartIds();
  if (courseId && !ids.includes(courseId)) {
    (await cookies()).set(CART_COOKIE, serializeCart([...ids, courseId]), cookieOptions);
  }
  revalidatePath("/", "layout");
  if (formData.get("goto") === "cart") redirect("/cart");
}

export async function removeFromCart(formData: FormData) {
  const courseId = String(formData.get("courseId") ?? "");
  const ids = (await getCartIds()).filter((id) => id !== courseId);
  const jar = await cookies();
  if (ids.length) jar.set(CART_COOKIE, serializeCart(ids), cookieOptions);
  else jar.delete(CART_COOKIE);
  revalidatePath("/", "layout");
}

export async function applyPromo(formData: FormData) {
  const code = String(formData.get("code") ?? "").trim();
  if (!code) redirect("/cart");
  const user = await getUser();
  const { promo, error } = await validatePromo(code, user?.id ?? null);
  if (!promo) redirect(`/cart?promo_error=${error ?? "invalid"}`);
  (await cookies()).set(PROMO_COOKIE, promo.code, cookieOptions);
  redirect("/cart");
}

export async function removePromo() {
  (await cookies()).delete(PROMO_COOKIE);
  redirect("/cart");
}

/**
 * After a confirmed payment: removes courses the user now owns from the cart, and the
 * promo code once it can no longer be used. Called from the checkout return page.
 */
export async function pruneCart() {
  const user = await getUser();
  if (!user) return;
  const jar = await cookies();
  const ids = await getCartIds();
  const owned = await ownedIds(user.id, ids);
  const left = ids.filter((id) => !owned.has(id));
  if (left.length !== ids.length) {
    if (left.length) jar.set(CART_COOKIE, serializeCart(left), cookieOptions);
    else jar.delete(CART_COOKIE);
  }
  const code = jar.get(PROMO_COOKIE)?.value;
  if (code && !(await validatePromo(code, user.id)).promo) jar.delete(PROMO_COOKIE);
  revalidatePath("/", "layout");
}
