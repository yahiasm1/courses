import "server-only";
import { sendEmail } from "@/lib/email";
import { SITE_NAME } from "@/lib/site";
import { formatPrice } from "@/lib/types";

const esc = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

function layout(heading: string, body: string, cta?: { href: string; label: string }) {
  const button = cta
    ? `<tr><td style="padding:8px 32px 8px 32px;"><table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr><td style="border-radius:10px;background:#7c5cff;"><a href="${cta.href}" target="_blank" style="display:inline-block;padding:14px 28px;font-family:Arial,Helvetica,sans-serif;font-size:15px;font-weight:700;color:#ffffff;text-decoration:none;border-radius:10px;">${cta.label}</a></td></tr></table></td></tr>`
    : "";
  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="color-scheme" content="light only"></head>
<body style="margin:0;padding:0;background:#f4f3f8;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#f4f3f8;"><tr><td align="center" style="padding:32px 16px;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:520px;background:#ffffff;border-radius:16px;overflow:hidden;border:1px solid #e7e5f0;">
<tr><td style="height:6px;background:#7c5cff;background-image:linear-gradient(90deg,#ff3a9e,#7c5cff);font-size:0;line-height:0;">&nbsp;</td></tr>
<tr><td style="padding:32px 32px 8px 32px;font-family:Arial,Helvetica,sans-serif;">
<div style="font-size:15px;font-weight:700;color:#14121f;">Courses <span style="color:#7c5cff;">DZ</span></div>
<h1 style="margin:20px 0 12px 0;font-size:22px;line-height:1.3;color:#14121f;">${heading}</h1>
${body}
</td></tr>
${button}
<tr><td style="padding:16px 32px 32px 32px;font-family:Arial,Helvetica,sans-serif;font-size:13px;line-height:1.6;color:#6b6880;">Questions? Just reply to this email.</td></tr>
</table></td></tr></table></body></html>`;
}

function details(rows: [string, string][]) {
  const tr = rows
    .map(
      ([k, v]) =>
        `<tr><td style="padding:8px 0;color:#6b6880;font-size:14px;">${k}</td><td style="padding:8px 0;color:#14121f;font-size:14px;font-weight:700;text-align:right;">${v}</td></tr>`,
    )
    .join("");
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:8px 0 12px 0;border-top:1px solid #eeecf5;border-bottom:1px solid #eeecf5;font-family:Arial,Helvetica,sans-serif;">${tr}</table>`;
}

export type PaidPurchase = {
  id: string;
  amount: number;
  invoiceId: string;
  courseName: string;
  buyerEmail: string | null;
  buyerName: string | null;
};

/** Receipt to the buyer, plus a sale notice to NOTIFY_EMAIL when set. Failures are logged, not thrown. */
export async function sendPurchaseEmails(p: PaidPurchase) {
  const site = (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/+$/, "");
  const course = esc(p.courseName);
  const price = formatPrice(p.amount);
  const rows: [string, string][] = [
    ["Course", course],
    ["Amount", price],
    ["Invoice", `#${esc(p.invoiceId)}`],
  ];
  const jobs: Promise<void>[] = [];

  if (p.buyerEmail) {
    jobs.push(
      sendEmail({
        to: p.buyerEmail,
        subject: `Your purchase: ${p.courseName}`,
        html: layout(
          "Thanks for your purchase!",
          `<p style="margin:0 0 12px 0;font-size:15px;line-height:1.6;color:#3d3a4f;">Your payment is confirmed and <strong>${course}</strong> is now in My courses, ready to download.</p>${details(rows)}`,
          { href: `${site}/library`, label: "Go to My courses" },
        ),
        text: `Thanks for your purchase!\n\n${p.courseName} is now in My courses: ${site}/library\n\nAmount: ${price}\nInvoice: #${p.invoiceId}\n\n${SITE_NAME}`,
      }),
    );
  }

  const notify = (process.env.NOTIFY_EMAIL ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  if (notify.length) {
    const buyer = [p.buyerName, p.buyerEmail].filter(Boolean).join(" · ") || "Unknown";
    jobs.push(
      sendEmail({
        to: notify,
        subject: `New sale: ${p.courseName} (${price})`,
        html: layout("New sale", details([...rows, ["Buyer", esc(buyer)], ["Purchase", esc(p.id)]])),
        text: `New sale\n\nCourse: ${p.courseName}\nAmount: ${price}\nBuyer: ${buyer}\nInvoice: #${p.invoiceId}\nPurchase: ${p.id}`,
      }),
    );
  }

  const results = await Promise.allSettled(jobs);
  results.forEach((r) => r.status === "rejected" && console.error("[email] purchase email failed:", r.reason));
}
