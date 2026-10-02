import { NextResponse, type NextRequest } from "next/server";
import { confirmPurchase } from "@/lib/purchases";

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
    return NextResponse.json({ error: "invalid signature" }, { status: 401 });
  }

  const meta = (body.webhook_meta_data ?? body.meta_data ?? body.metadata ?? {}) as Record<
    string,
    string
  >;
  const purchaseId = meta.purchase_id;
  if (!purchaseId) return NextResponse.json({ ok: true, ignored: true });

  const status = await confirmPurchase(purchaseId);
  return NextResponse.json({ ok: true, status });
}
