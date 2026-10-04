import "server-only";
import { createAdminClient } from "@/lib/supabase/server";
import { getInvoiceStatus } from "@/lib/slickpay";
import { sendPurchaseEmails } from "@/lib/purchase-emails";

type PurchaseRow = {
  id: string;
  user_id: string;
  status: string;
  amount: number;
  slickpay_invoice_id: string | null;
};

/**
 * Re-checks a pending purchase with SlickPay and marks it paid if the invoice
 * is completed. Never trusts the caller — the answer comes from SlickPay.
 *
 * `invoiceHint` (the invoice_id SlickPay appends to the return URL, or the one in
 * a webhook) is only used when we never stored an invoice id for this purchase,
 * and only if its amount matches and no other purchase already claimed it.
 */
export async function confirmPurchase(purchaseId: string, invoiceHint?: string | null) {
  const admin = createAdminClient();
  const { data } = await admin
    .from("purchases")
    .select("id, user_id, status, amount, slickpay_invoice_id")
    .eq("id", purchaseId)
    .maybeSingle();
  const purchase = data as unknown as PurchaseRow | null;

  if (!purchase) return null;
  if (purchase.status === "paid") return "paid";

  const invoiceId = purchase.slickpay_invoice_id ?? invoiceHint?.trim() ?? null;
  if (!invoiceId) return purchase.status;

  const invoice = await getInvoiceStatus(invoiceId);
  if (!invoice.paid) return purchase.status;

  if (!purchase.slickpay_invoice_id) {
    if (invoice.purchaseId && invoice.purchaseId !== purchase.id) return purchase.status;
    if (invoice.amount !== undefined && invoice.amount !== Number(purchase.amount)) return purchase.status;
    const { count } = await admin
      .from("purchases")
      .select("id", { count: "exact", head: true })
      .eq("slickpay_invoice_id", invoiceId)
      .neq("id", purchase.id);
    if (count) return purchase.status;
  }

  // Flip every purchase on this invoice (a cart order has one row per course).
  // Only the call that flips rows sends the emails (webhook and return page can race).
  const flip = admin
    .from("purchases")
    .update({ status: "paid", paid_at: new Date().toISOString(), slickpay_invoice_id: invoiceId })
    .eq("user_id", purchase.user_id)
    .neq("status", "paid");
  const { data: flipped } = await (purchase.slickpay_invoice_id
    ? flip.eq("slickpay_invoice_id", invoiceId)
    : flip.eq("id", purchase.id)
  ).select("id, amount, course:courses(name)");

  if (flipped?.length) {
    const items = (flipped as unknown as { amount: number; course: { name: string } | null }[]).map((r) => ({
      name: r.course?.name ?? "Course",
      amount: Number(r.amount),
    }));
    const [{ data: user }, { data: profile }] = await Promise.all([
      admin.auth.admin.getUserById(purchase.user_id),
      admin.from("profiles").select("first_name, last_name").eq("id", purchase.user_id).maybeSingle(),
    ]);
    await sendPurchaseEmails({
      id: purchase.id,
      items,
      invoiceId,
      buyerEmail: user?.user?.email ?? null,
      buyerName: [profile?.first_name, profile?.last_name].filter(Boolean).join(" ") || null,
    });
  }
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
