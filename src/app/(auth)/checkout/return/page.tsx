import Link from "next/link";
import { confirmPurchase } from "@/lib/purchases";
import { getUser } from "@/lib/data";
import { createClient } from "@/lib/supabase/server";
import { Icon } from "@/components/icons";

export const dynamic = "force-dynamic";

export default async function CheckoutReturnPage({
  searchParams,
}: {
  searchParams: Promise<{ purchase?: string }>;
}) {
  const { purchase } = await searchParams;
  const user = await getUser();

  let status: string | null = null;
  if (purchase && user) {
    // Only check purchases that belong to the signed-in user.
    const supabase = await createClient();
    const { data } = await supabase.from("purchases").select("id").eq("id", purchase).maybeSingle();
    if (data) status = await confirmPurchase(purchase).catch(() => "pending");
  }

  const paid = status === "paid";

  return (
    <div className="authcard text-center">
      <div className={`icon-tile icon-tile-lg mx-auto mb-[18px] ${paid ? "" : "icon-tile-grey"}`}>
        <Icon name={paid ? "checkCircle" : "clock"} size={26} />
      </div>
      <h1 className="h2 display mb-2">
        {paid ? "Payment successful" : "Payment not confirmed yet"}
      </h1>
      <p className="mb-[22px] text-[15px] leading-[1.5] text-muted">
        {paid
          ? "Your course is ready in My courses."
          : "If you completed the payment, it can take a minute to confirm. Refresh this page or check My courses."}
      </p>
      {!paid && (
        <div className="notice notice-grey mb-[18px] justify-center">
          <span>Payments are confirmed with SlickPay before a download link is shown.</span>
        </div>
      )}
      <Link href="/library" className="btn btn-primary btn-lg w-full">
        <Icon name="book" size={18} />
        Go to My courses
      </Link>
      <Link href="/" className="btn btn-secondary mt-2.5 h-[44px] w-full rounded-[12px]">
        Back to courses
      </Link>
    </div>
  );
}
