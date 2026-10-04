import type { Metadata } from "next";
import Link from "next/link";
import { confirmPurchase } from "@/lib/purchases";
import { getUser } from "@/lib/data";
import { createClient } from "@/lib/supabase/server";
import { AutoRefresh } from "@/components/auto-refresh";
import { Icon } from "@/components/icons";
import { PruneCart } from "@/components/prune-cart";
import { getDict } from "@/lib/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getDict();
  return { title: t.payment.title, robots: { index: false } };
}
export const dynamic = "force-dynamic";

export default async function CheckoutReturnPage({
  searchParams,
}: {
  searchParams: Promise<{ purchase?: string; invoice_id?: string }>;
}) {
  const { purchase, invoice_id } = await searchParams;
  const user = await getUser();

  let status: string | null = null;
  if (purchase && user) {
    // Only check purchases that belong to the signed-in user.
    const supabase = await createClient();
    const { data } = await supabase.from("purchases").select("id").eq("id", purchase).maybeSingle();
    if (data) {
      status = await confirmPurchase(purchase, invoice_id).catch((e) => {
        console.error("[checkout/return] could not confirm purchase", purchase, e);
        return "pending";
      });
    }
  }

  const paid = status === "paid";
  const { t } = await getDict();
  const p = t.payment;

  return (
    <div className="authcard text-center">
      <div className={`icon-tile icon-tile-lg mx-auto mb-[18px] ${paid ? "" : "icon-tile-grey"}`}>
        <Icon name={paid ? "checkCircle" : "clock"} size={26} />
      </div>
      <h1 className="h2 display mb-2">
        {paid ? p.success : p.pending}
      </h1>
      <p className="mb-[22px] text-[15px] leading-[1.5] text-muted">
        {paid ? p.successText : p.pendingText}
      </p>
      {paid && <PruneCart />}
      {!paid && status !== null && <AutoRefresh />}
      {!paid && (
        <div className="notice notice-grey mb-[18px] justify-center">
          <span>{p.pendingNote}</span>
        </div>
      )}
      <Link href="/library" className="btn btn-primary btn-lg w-full">
        <Icon name="book" size={18} />
        {p.goLibrary}
      </Link>
      <Link href="/" className="btn btn-secondary mt-2.5 h-[44px] w-full rounded-[12px]">
        {p.back}
      </Link>
    </div>
  );
}
