"use server";

import { redirect } from "next/navigation";
import { createAdminClient, createClient } from "@/lib/supabase/server";
import { createInvoice } from "@/lib/slickpay";
import { hasPurchased } from "@/lib/purchases";

export async function buyCourse(formData: FormData) {
  const courseId = String(formData.get("courseId") ?? "");
  const slug = String(formData.get("slug") ?? "");

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect(`/login?next=/courses/${slug}`);

  if (await hasPurchased(user.id, courseId)) redirect("/library");

  const { data: course } = await supabase
    .from("courses")
    .select("id, name, price")
    .eq("id", courseId)
    .maybeSingle();
  if (!course) redirect("/");

  const { data: profile } = await supabase
    .from("profiles")
    .select("first_name, last_name, phone")
    .eq("id", user.id)
    .maybeSingle();

  const admin = createAdminClient();
  const { data: purchase, error } = await admin
    .from("purchases")
    .insert({ user_id: user.id, course_id: course.id, amount: course.price })
    .select("id")
    .single();
  if (error || !purchase) redirect(`/courses/${slug}?error=checkout`);

  const site = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  let paymentUrl: string;
  try {
    const invoice = await createInvoice({
      amount: Number(course.price),
      returnUrl: `${site}/checkout/return?purchase=${purchase.id}`,
      webhookUrl: `${site}/api/slickpay/webhook`,
      firstname: profile?.first_name || "Customer",
      lastname: profile?.last_name || "-",
      email: user.email ?? "",
      phone: profile?.phone || "0000000000",
      address: "Algeria",
      itemName: course.name,
      metadata: { purchase_id: purchase.id },
    });

    await admin
      .from("purchases")
      .update({ slickpay_invoice_id: String(invoice.id) })
      .eq("id", purchase.id);
    paymentUrl = invoice.url;
  } catch (e) {
    console.error(e);
    await admin.from("purchases").update({ status: "failed" }).eq("id", purchase.id);
    redirect(`/courses/${slug}?error=checkout`);
  }

  redirect(paymentUrl);
}
