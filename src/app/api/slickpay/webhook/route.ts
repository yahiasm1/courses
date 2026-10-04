import { NextResponse, type NextRequest } from "next/server";
import { confirmPurchase } from "@/lib/purchases";
import { createAdminClient } from "@/lib/supabase/server";

/**
 * SlickPay calls this when an invoice changes. We don't trust the body:
 * we only use it to find the purchase, then re-check the invoice with SlickPay.
 */
export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => ({}) as Record<string, unknown>);

  const secret = process.env.SLICKPAY_WEBHOOK_SECRET;
  const signature =
    request.headers.get("x-webhook-signature") ??
    request.headers.get("signature") ??
    (body.webhook_signature as string | undefined) ??
    (body.signature as string | undefined);
  if (secret && signature && signature !== secret) {
    // Not fatal: confirmPurchase re-checks the invoice with SlickPay before marking anything paid.
    console.warn("[slickpay webhook] signature mismatch; verifying with SlickPay anyway");
  }

  const meta = (body.webhook_meta_data ?? body.meta_data ?? body.metadata ?? {}) as Record<
    string,
    string
  >;
  const invoiceId = body.id ?? body.invoice_id;
  let purchaseId: string | undefined = meta.purchase_id;
  if (!purchaseId && invoiceId != null) {
    // Metadata not echoed back: find the order by the invoice id we stored at checkout.
    const { data } = await createAdminClient()
      .from("purchases")
      .select("id")
      .eq("slickpay_invoice_id", String(invoiceId))
      .limit(1)
      .maybeSingle();
    purchaseId = data?.id;
  }
  if (!purchaseId) return NextResponse.json({ ok: true, ignored: true });

  const status = await confirmPurchase(
    purchaseId,
    invoiceId !== undefined && invoiceId !== null ? String(invoiceId) : null,
  ).catch((e) => {
    console.error("[slickpay webhook] could not confirm purchase", purchaseId, e);
    return "error";
  });
  if (status === "error") return NextResponse.json({ ok: false }, { status: 500 });
  return NextResponse.json({ ok: true, status });
}
