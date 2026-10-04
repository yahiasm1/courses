import "server-only";
import { headers } from "next/headers";
import { SITE_URL } from "@/lib/site";

/**
 * Origin of the current request (e.g. https://coursesdz.com), for links that
 * must come back to this site (SlickPay return/webhook, email confirmation).
 * Falls back to SITE_URL outside a request.
 */
export async function siteOrigin() {
  const h = await headers();
  const host = h.get("x-forwarded-host") ?? h.get("host");
  if (host) {
    const proto = h.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https");
    return `${proto}://${host}`;
  }
  return SITE_URL;
}
