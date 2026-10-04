import "server-only";
import { sendEmail } from "@/lib/email";
import { details, esc, layout } from "@/lib/email-layout";
import { SITE_NAME } from "@/lib/site";
import { formatPrice } from "@/lib/types";

export type PaidOrder = {
  /** First purchase id of the order. */
  id: string;
  items: { name: string; amount: number }[];
  invoiceId: string;
  buyerEmail: string | null;
  buyerName: string | null;
};

/** Receipt to the buyer, plus a sale notice to NOTIFY_EMAIL when set. Failures are logged, not thrown. */
export async function sendPurchaseEmails(p: PaidOrder) {
  const site = (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/+$/, "");
  const total = p.items.reduce((sum, i) => sum + i.amount, 0);
  const price = formatPrice(total);
  const single = p.items.length === 1;
  const title = single ? p.items[0].name : `${p.items.length} courses`;
  const course = single ? `<strong>${esc(p.items[0].name)}</strong> is` : `<strong>your ${p.items.length} courses</strong> are`;
  const rows: [string, string][] = [
    ...p.items.map((i): [string, string] => [esc(i.name), formatPrice(i.amount)]),
    ["Total", price],
    ["Invoice", `#${esc(p.invoiceId)}`],
  ];
  const plainItems = p.items.map((i) => `- ${i.name}: ${formatPrice(i.amount)}`).join("\n");
  const jobs: Promise<void>[] = [];

  if (p.buyerEmail) {
    jobs.push(
      sendEmail({
        to: p.buyerEmail,
        subject: `Your purchase: ${title}`,
        html: layout(
          "Thanks for your purchase!",
          `<p style="margin:0 0 12px 0;font-size:15px;line-height:1.6;color:#3d3a4f;">Your payment is confirmed and ${course} now in My courses, ready to download.</p>${details(rows)}`,
          { href: `${site}/library`, label: "Go to My courses" },
        ),
        text: `Thanks for your purchase!\n\n${plainItems}\nTotal: ${price}\nInvoice: #${p.invoiceId}\n\nDownload from My courses: ${site}/library\n\n${SITE_NAME}`,
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
        subject: `New sale: ${title} (${price})`,
        html: layout("New sale", details([...rows, ["Buyer", esc(buyer)], ["Purchase", esc(p.id)]])),
        text: `New sale\n\n${plainItems}\nTotal: ${price}\nBuyer: ${buyer}\nInvoice: #${p.invoiceId}\nPurchase: ${p.id}`,
      }),
    );
  }

  const results = await Promise.allSettled(jobs);
  results.forEach((r) => r.status === "rejected" && console.error("[email] purchase email failed:", r.reason));
}
