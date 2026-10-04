/** Shared, email-client-safe HTML building blocks (tables + inline styles). */

export const esc = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

export function layout(heading: string, body: string, cta?: { href: string; label: string }) {
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

export function details(rows: [string, string][]) {
  const tr = rows
    .map(
      ([k, v]) =>
        `<tr><td style="padding:8px 0;color:#6b6880;font-size:14px;">${k}</td><td style="padding:8px 0;color:#14121f;font-size:14px;font-weight:700;text-align:right;">${v}</td></tr>`,
    )
    .join("");
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:8px 0 12px 0;border-top:1px solid #eeecf5;border-bottom:1px solid #eeecf5;font-family:Arial,Helvetica,sans-serif;">${tr}</table>`;
}
