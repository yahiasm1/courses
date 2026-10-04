import "server-only";
import type { User } from "@supabase/supabase-js";
import { sendEmail } from "@/lib/email";
import { esc, layout } from "@/lib/email-layout";
import { findPromo } from "@/lib/promo";
import { SITE_NAME } from "@/lib/site";
import { createAdminClient } from "@/lib/supabase/server";

const WELCOME_CODE = "WELCOME10";
/** Only accounts this new get the welcome email (so old users signing in by link don't). */
const MAX_ACCOUNT_AGE_MS = 7 * 24 * 60 * 60 * 1000;

/** Builds the welcome email for a new user, with the steps to claim WELCOME10. */
export function welcomeEmail(firstName: string | null, site: string) {
  const promo = findPromo(WELCOME_CODE);
  const percent = promo?.percent ?? 10;
  const hello = firstName ? `Welcome, ${esc(firstName)}!` : "Welcome to Courses DZ!";
  const steps = [
    `Browse the courses at <a href="${site}/shop" style="color:#7c5cff;">${site.replace(/^https?:\/\//, "")}/shop</a>.`,
    `Open a course and click <strong>Add to cart</strong>. Add as many as you like.`,
    `Open your <a href="${site}/cart" style="color:#7c5cff;">cart</a> (the cart icon at the top of the page).`,
    `Type <strong>${WELCOME_CODE}</strong> in the <strong>Promo code</strong> box and click <strong>Apply</strong>.`,
    `Check the ${percent}% discount in the summary, then click <strong>Checkout</strong> and pay with CIB or Edahabia.`,
    `Your courses appear in <a href="${site}/library" style="color:#7c5cff;">My courses</a>, ready to download.`,
  ];
  const P = 'style="margin:0 0 12px 0;font-size:15px;line-height:1.6;color:#3d3a4f;"';

  const html = layout(
    hello,
    `<p ${P}>Thanks for joining ${SITE_NAME}. You now have access to our full library of courses, ready to download the moment your payment is confirmed.</p>
<p ${P}>As a welcome gift, here's <strong>${percent}% off your first order</strong>:</p>
<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:4px 0 16px 0;"><tr>
<td style="border:2px dashed #7c5cff;border-radius:12px;background:#f3f0ff;padding:12px 22px;font-family:'Courier New',Courier,monospace;font-size:22px;font-weight:700;letter-spacing:.12em;color:#4634e8;">${WELCOME_CODE}</td>
</tr></table>
<p style="margin:16px 0 8px 0;font-size:15px;font-weight:700;color:#14121f;">How to claim your discount</p>
<ol style="margin:0 0 12px 0;padding-left:20px;font-size:14.5px;line-height:1.7;color:#3d3a4f;">${steps.map((s) => `<li style="margin:0 0 4px 0;">${s}</li>`).join("")}</ol>
<p style="margin:0 0 4px 0;font-size:13px;line-height:1.6;color:#6b6880;">The code works once, on your first order, and only from the cart (not with Buy now). Sign in before checking out so it's applied to your account.</p>`,
    { href: `${site}/shop`, label: "Start browsing" },
  );

  const text = [
    firstName ? `Welcome, ${firstName}!` : "Welcome to Courses DZ!",
    "",
    `Thanks for joining ${SITE_NAME}. As a welcome gift, here's ${percent}% off your first order:`,
    "",
    `    ${WELCOME_CODE}`,
    "",
    "How to claim your discount:",
    `1. Browse the courses at ${site}/shop`,
    "2. Open a course and click Add to cart. Add as many as you like.",
    `3. Open your cart: ${site}/cart`,
    `4. Type ${WELCOME_CODE} in the Promo code box and click Apply.`,
    `5. Check the ${percent}% discount in the summary, then click Checkout and pay with CIB or Edahabia.`,
    `6. Your courses appear in My courses (${site}/library), ready to download.`,
    "",
    "The code works once, on your first order, and only from the cart (not with Buy now).",
    "",
    SITE_NAME,
  ].join("\n");

  return { subject: `Welcome to ${SITE_NAME}: ${percent}% off your first order`, html, text };
}

/**
 * Sends the welcome email once per new account, recording it in app_metadata.
 * Never throws: a failed email must not break sign-up or sign-in.
 */
export async function sendWelcomeEmailOnce(user: User | null, site: string) {
  try {
    if (!user?.email || user.app_metadata?.welcome_email_sent_at) return;
    if (Date.now() - new Date(user.created_at).getTime() > MAX_ACCOUNT_AGE_MS) return;

    const firstName = (user.user_metadata?.first_name as string | undefined)?.trim() || null;
    await sendEmail({ to: user.email, ...welcomeEmail(firstName, site.replace(/\/+$/, "")) });
    await createAdminClient().auth.admin.updateUserById(user.id, {
      app_metadata: { ...user.app_metadata, welcome_email_sent_at: new Date().toISOString() },
    });
  } catch (e) {
    console.error("[email] welcome email failed:", e);
  }
}
