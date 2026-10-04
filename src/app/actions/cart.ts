"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { CART_COOKIE, PROMO_COOKIE, cookieOptions, getCartIds, serializeCart, validatePromo } from "@/lib/cart";
import { getUser } from "@/lib/data";

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
