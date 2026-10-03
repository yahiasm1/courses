import "server-only";
import { headers } from "next/headers";

/**
 * Origin of the current request (e.g. https://your-app.vercel.app), for links that
 * must come back to this site (SlickPay return/webhook, email confirmation).
 * Falls back to NEXT_PUBLIC_SITE_URL outside a request.
 */
export async function siteOrigin() {
  const h = await headers();
  const host = h.get("x-forwarded-host") ?? h.get("host");
  if (host) {
    const proto = h.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https");
    return `${proto}://${host}`;
  }
  return (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/+$/, "");
}
