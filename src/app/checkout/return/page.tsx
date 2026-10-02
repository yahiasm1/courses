import Link from "next/link";
import { confirmPurchase } from "@/lib/purchases";
import { getUser } from "@/lib/data";
import { createClient } from "@/lib/supabase/server";

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
    <div className="mx-auto max-w-md pt-16 text-center">
      <div
        className={`mx-auto mb-5 grid size-16 place-items-center rounded-full ${
          paid ? "bg-accent/15 text-accent" : "bg-surface-2 text-muted"
        }`}
      >
        <svg viewBox="0 0 24 24" className="size-8" fill="none" stroke="currentColor" strokeWidth="2.2">
          {paid ? (
            <path d="m5 12 4.5 4.5L19 7" strokeLinecap="round" strokeLinejoin="round" />
          ) : (
            <path d="M12 7v5l3 2M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" strokeLinecap="round" />
          )}
        </svg>
      </div>
      <h1 className="text-2xl font-bold">{paid ? "Payment successful" : "Payment not confirmed yet"}</h1>
      <p className="mt-2 text-muted">
        {paid
          ? "Your course is ready in My courses."
          : "If you completed the payment, it can take a minute to confirm. Refresh this page or check My courses."}
      </p>
      <div className="mt-6 flex justify-center gap-3">
        <Link href="/library" className="rounded-xl bg-accent px-5 py-2.5 font-semibold text-accent-ink">
          My courses
        </Link>
        <Link href="/" className="rounded-xl border border-line px-5 py-2.5 font-medium text-muted">
          Back to courses
        </Link>
      </div>
    </div>
  );
}
