// Change these to your brand.
export const SITE_NAME = "Courses DZ";
export const SITE_TAGLINE = "Pay in DA with CIB or Edahabia, download instantly.";
export const CONTACT_EMAIL = "contact@coursesdz.com";

/** Public address of the site. NEXT_PUBLIC_SITE_URL overrides it (e.g. http://localhost:3000 in dev). */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL?.trim() || "https://coursesdz.com").replace(/\/+$/, "");

// Meta (Facebook) Pixel. NEXT_PUBLIC_META_PIXEL_ID overrides it; set it to "" to turn the pixel off.
export const META_PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID ?? "1754172102480342";

// Telegram channel banner shown above the header. Set to "" to hide the banner.
export const TELEGRAM_URL = "https://t.me/+EiStikDuZ-80MzNk";
