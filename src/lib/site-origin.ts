import "server-only";
import { headers } from "next/headers";
import { SITE_URL } from "@/lib/site";

/** Hosts we trust to build links back to this site (never an arbitrary Host header). */
function trustedHosts() {
  const site = new URL(SITE_URL).host;
  return new Set(
    [
      site,
      site.startsWith("www.") ? site.slice(4) : `www.${site}`,
      process.env.VERCEL_URL, // this deployment, e.g. courses-abc123.vercel.app
      process.env.VERCEL_BRANCH_URL,
      process.env.VERCEL_PROJECT_PRODUCTION_URL,
    ].filter(Boolean) as string[],
  );
}

/**
 * Origin for links that must come back to this site (SlickPay return/webhook,
 * sign-up confirmation). Uses the visitor's host only when it is one of ours
 * (or localhost in development); otherwise SITE_URL, so a forged Host or
 * X-Forwarded-Host header can't redirect buyers or leak the webhook secret.
 */
export async function siteOrigin() {
  const h = await headers();
  const host = (h.get("x-forwarded-host") ?? h.get("host") ?? "").split(",")[0].trim().toLowerCase();
  const isLocal = process.env.NODE_ENV !== "production" && /^(localhost|127\.0\.0\.1)(:\d+)?$/.test(host);
  if (isLocal) return `http://${host}`;
  if (host && trustedHosts().has(host)) return `https://${host}`;
  return SITE_URL;
}
