import "server-only";
import type { User } from "@supabase/supabase-js";
import { sendEmail } from "@/lib/email";
import { esc, layout } from "@/lib/email-layout";
import { findPromo } from "@/lib/promo";
import { isLocale, type Locale } from "@/lib/i18n";
import { SITE_NAME, SITE_URL } from "@/lib/site";
import { createAdminClient } from "@/lib/supabase/server";

const WELCOME_CODE = "WELCOME10";
/** Only accounts this new get the welcome email (so old users signing in by link don't). */
const MAX_ACCOUNT_AGE_MS = 7 * 24 * 60 * 60 * 1000;

/** Builds the welcome email for a new user, with the steps to claim WELCOME10. */
export function welcomeEmail(firstName: string | null, site: string, locale: Locale = "en") {
  const promo = findPromo(WELCOME_CODE);
  const percent = promo?.percent ?? 10;
  const host = site.replace(/^https?:\/\//, "");
  const a = (path: string, label: string) => `<a href="${site}${path}" style="color:#7c5cff;">${label}</a>`;
  const ar = locale === "ar";

  const copy = ar
    ? {
        subject: `مرحبًا بك في ${SITE_NAME}: خصم ${percent}% على طلبك الأول`,
        hello: firstName ? `مرحبًا ${esc(firstName)}!` : `مرحبًا بك في ${SITE_NAME}!`,
        intro: `شكرًا لانضمامك إلى ${SITE_NAME}. يمكنك الآن الوصول إلى مكتبتنا الكاملة من الدورات، الجاهزة للتحميل فور تأكيد الدفع.`,
        gift: `وكهدية ترحيب، إليك <strong>خصم ${percent}% على طلبك الأول</strong>:`,
        how: "كيف تستفيد من الخصم",
        steps: [
          `تصفّح الدورات على ${a("/shop", `<span dir="ltr">${host}/shop</span>`)}.`,
          `افتح أي دورة واضغط <strong>أضف إلى السلة</strong>. أضف ما تشاء من الدورات.`,
          `افتح ${a("/cart", "سلتك")} (أيقونة السلة أعلى الصفحة).`,
          `اكتب <strong dir="ltr">${WELCOME_CODE}</strong> في خانة <strong>كود الخصم</strong> واضغط <strong>تطبيق</strong>.`,
          `تحقّق من خصم ${percent}% في الملخّص، ثم اضغط <strong>إتمام الشراء</strong> وادفع بـ CIB أو الذهبية.`,
          `ستظهر دوراتك في ${a("/library", "دوراتي")}، جاهزة للتحميل.`,
        ],
        note: "الكود صالح مرة واحدة، على طلبك الأول فقط، ومن السلة فقط (ليس مع «اشترِ الآن»). سجّل الدخول قبل إتمام الشراء ليُطبَّق على حسابك.",
        cta: "ابدأ التصفّح",
        textSteps: [
          `1. تصفّح الدورات: ${site}/shop`,
          "2. افتح أي دورة واضغط «أضف إلى السلة».",
          `3. افتح سلتك: ${site}/cart`,
          `4. اكتب ${WELCOME_CODE} في خانة «كود الخصم» واضغط «تطبيق».`,
          `5. تحقّق من خصم ${percent}%، ثم اضغط «إتمام الشراء» وادفع بـ CIB أو الذهبية.`,
          `6. ستظهر دوراتك في «دوراتي»: ${site}/library`,
        ],
      }
    : {
        subject: `Welcome to ${SITE_NAME}: ${percent}% off your first order`,
        hello: firstName ? `Welcome, ${esc(firstName)}!` : `Welcome to ${SITE_NAME}!`,
        intro: `Thanks for joining ${SITE_NAME}. You now have access to our full library of courses, ready to download the moment your payment is confirmed.`,
        gift: `As a welcome gift, here's <strong>${percent}% off your first order</strong>:`,
        how: "How to claim your discount",
        steps: [
          `Browse the courses at ${a("/shop", `${host}/shop`)}.`,
          `Open a course and click <strong>Add to cart</strong>. Add as many as you like.`,
          `Open your ${a("/cart", "cart")} (the cart icon at the top of the page).`,
          `Type <strong>${WELCOME_CODE}</strong> in the <strong>Promo code</strong> box and click <strong>Apply</strong>.`,
          `Check the ${percent}% discount in the summary, then click <strong>Checkout</strong> and pay with CIB or Edahabia.`,
          `Your courses appear in ${a("/library", "My courses")}, ready to download.`,
        ],
        note: "The code works once, on your first order, and only from the cart (not with Buy now). Sign in before checking out so it's applied to your account.",
        cta: "Start browsing",
        textSteps: [
          `1. Browse the courses at ${site}/shop`,
          "2. Open a course and click Add to cart. Add as many as you like.",
          `3. Open your cart: ${site}/cart`,
          `4. Type ${WELCOME_CODE} in the Promo code box and click Apply.`,
          `5. Check the ${percent}% discount in the summary, then click Checkout and pay with CIB or Edahabia.`,
          `6. Your courses appear in My courses (${site}/library), ready to download.`,
        ],
      };

  const P = 'style="margin:0 0 12px 0;font-size:15px;line-height:1.6;color:#3d3a4f;"';
  const listPad = ar ? "padding-right:20px;padding-left:0;" : "padding-left:20px;";
  const html = layout(
    copy.hello,
    `<p ${P}>${copy.intro}</p>
<p ${P}>${copy.gift}</p>
<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:4px 0 16px 0;"><tr>
<td dir="ltr" style="border:2px dashed #7c5cff;border-radius:12px;background:#f3f0ff;padding:12px 22px;font-family:'Courier New',Courier,monospace;font-size:22px;font-weight:700;letter-spacing:.12em;color:#4634e8;">${WELCOME_CODE}</td>
</tr></table>
<p style="margin:16px 0 8px 0;font-size:15px;font-weight:700;color:#14121f;">${copy.how}</p>
<ol style="margin:0 0 12px 0;${listPad}font-size:14.5px;line-height:1.7;color:#3d3a4f;">${copy.steps.map((s) => `<li style="margin:0 0 4px 0;">${s}</li>`).join("")}</ol>
<p style="margin:0 0 4px 0;font-size:13px;line-height:1.6;color:#6b6880;">${copy.note}</p>`,
    { href: `${site}/shop`, label: copy.cta },
    locale,
  );

  const text = [
    copy.hello.replace(/<[^>]+>/g, ""),
    "",
    copy.intro,
    "",
    copy.gift.replace(/<[^>]+>/g, ""),
    "",
    `    ${WELCOME_CODE}`,
    "",
    copy.how + ":",
    ...copy.textSteps,
    "",
    copy.note,
    "",
    SITE_NAME,
  ].join("\n");

  return { subject: copy.subject, html, text };
}

/**
 * Sends the welcome email once per new account, recording it in app_metadata.
 * Never throws: a failed email must not break sign-up or sign-in.
 */
export async function sendWelcomeEmailOnce(user: User | null) {
  try {
    if (!user?.email || user.app_metadata?.welcome_email_sent_at) return;
    if (Date.now() - new Date(user.created_at).getTime() > MAX_ACCOUNT_AGE_MS) return;

    const firstName = (user.user_metadata?.first_name as string | undefined)?.trim() || null;
    const locale = isLocale(user.user_metadata?.locale) ? user.user_metadata.locale : "en";
    const sent = await sendEmail({ to: user.email, ...welcomeEmail(firstName, SITE_URL, locale) });
    if (!sent) return; // not configured yet: try again on a later sign-in
    await createAdminClient().auth.admin.updateUserById(user.id, {
      app_metadata: { ...user.app_metadata, welcome_email_sent_at: new Date().toISOString() },
    });
  } catch (e) {
    console.error("[email] welcome email failed:", e);
  }
}
