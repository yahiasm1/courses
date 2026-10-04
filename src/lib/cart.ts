import "server-only";
import { cookies } from "next/headers";
import { createAdminClient, createClient } from "@/lib/supabase/server";
import { findPromo, type Promo } from "@/lib/promo";

export const CART_COOKIE = "cart";
export const PROMO_COOKIE = "promo";
export const CART_MAX = 50;

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export const cookieOptions = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/",
  maxAge: 60 * 60 * 24 * 30,
};

/** Course ids in the visitor's cart (cookie: comma-separated uuids). */
export async function getCartIds(): Promise<string[]> {
  const raw = (await cookies()).get(CART_COOKIE)?.value ?? "";
  return [...new Set(raw.split(",").filter((id) => UUID.test(id)))].slice(0, CART_MAX);
}

export function serializeCart(ids: string[]) {
  return [...new Set(ids)].slice(0, CART_MAX).join(",");
}

export async function getPromoCode() {
  return (await cookies()).get(PROMO_COOKIE)?.value ?? null;
}

export type CartCourse = { id: string; name: string; slug: string; price: number; image_url: string | null };

export async function getCartCourses(ids: string[]): Promise<CartCourse[]> {
  if (!ids.length) return [];
  const supabase = await createClient();
  const { data } = await supabase
    .from("courses")
    .select("id, name, slug, price, image_url")
    .in("id", ids)
    .eq("is_published", true);
  const byId = new Map((data ?? []).map((c) => [c.id as string, c as CartCourse]));
  return ids.map((id) => byId.get(id)).filter((c): c is CartCourse => Boolean(c));
}

/** Ids among `courseIds` the user already owns. */
export async function ownedIds(userId: string, courseIds: string[]) {
  if (!courseIds.length) return new Set<string>();
  const { data } = await createAdminClient()
    .from("purchases")
    .select("course_id")
    .eq("user_id", userId)
    .eq("status", "paid")
    .in("course_id", courseIds);
  return new Set((data ?? []).map((r) => r.course_id as string));
}

/**
 * The promo if it exists and this user may use it. First-order codes are refused
 * once the user has any paid purchase. Without a user the rule can't be checked yet.
 */
export async function validatePromo(
  code: string | null | undefined,
  userId: string | null,
): Promise<{ promo: Promo | null; error?: "invalid" | "used" }> {
  if (!code) return { promo: null };
  const promo = findPromo(code);
  if (!promo) return { promo: null, error: "invalid" };
  if (promo.firstOrderOnly && userId) {
    const { count } = await createAdminClient()
      .from("purchases")
      .select("id", { count: "exact", head: true })
      .eq("user_id", userId)
      .eq("status", "paid");
    if (count) return { promo: null, error: "used" };
  }
  return { promo };
}
