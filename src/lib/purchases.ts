import "server-only";
import { createAdminClient } from "@/lib/supabase/server";
import { isInvoicePaid } from "@/lib/slickpay";

/**
 * Re-checks a pending purchase with SlickPay and marks it paid if the
 * invoice is completed. Never trusts the caller — the answer comes from SlickPay.
 */
export async function confirmPurchase(purchaseId: string) {
  const admin = createAdminClient();
  const { data: purchase } = await admin
    .from("purchases")
    .select("id, status, slickpay_invoice_id")
    .eq("id", purchaseId)
    .maybeSingle();

  if (!purchase) return null;
  if (purchase.status === "paid" || !purchase.slickpay_invoice_id) return purchase.status;

  const paid = await isInvoicePaid(purchase.slickpay_invoice_id);
  if (!paid) return purchase.status;

  await admin
    .from("purchases")
    .update({ status: "paid", paid_at: new Date().toISOString() })
    .eq("id", purchase.id)
    .eq("status", "pending");
  return "paid";
}

export async function hasPurchased(userId: string, courseId: string) {
  const admin = createAdminClient();
  const { count } = await admin
    .from("purchases")
    .select("id", { count: "exact", head: true })
    .eq("user_id", userId)
    .eq("course_id", courseId)
    .eq("status", "paid");
  return (count ?? 0) > 0;
}
