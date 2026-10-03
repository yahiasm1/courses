import "server-only";

/**
 * Sends an email through Resend's HTTP API (https://resend.com/docs/api-reference/emails/send-email).
 * Does nothing (and logs why) when RESEND_API_KEY or EMAIL_FROM is not set.
 */
export async function sendEmail(input: { to: string | string[]; subject: string; html: string; text: string }) {
  const key = process.env.RESEND_API_KEY?.trim();
  const from = process.env.EMAIL_FROM?.trim();
  // Replies go to EMAIL_REPLY_TO, else the first NOTIFY_EMAIL address.
  const replyTo = process.env.EMAIL_REPLY_TO?.trim() || process.env.NOTIFY_EMAIL?.split(",")[0]?.trim();
  if (!key || !from) {
    console.info(`[email] skipped "${input.subject}": RESEND_API_KEY or EMAIL_FROM is not set`);
    return;
  }

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({ from, ...(replyTo ? { reply_to: replyTo } : {}), ...input }),
    signal: AbortSignal.timeout(15_000),
  });
  if (!res.ok) {
    throw new Error(`Resend ${res.status}: ${await res.text().catch(() => res.statusText)}`);
  }
}
