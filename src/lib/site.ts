// Change these to your brand.
export const SITE_NAME = "Courses DZ";
export const SITE_TAGLINE = "Every course I've made, in one place.";
export const CONTACT_EMAIL = "contact@coursesdz.com";

/** Public address of the site. NEXT_PUBLIC_SITE_URL overrides it (e.g. http://localhost:3000 in dev). */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL?.trim() || "https://coursesdz.com").replace(/\/+$/, "");

// Community banner shown above the header. Set to "" to hide the banner.
export const TELEGRAM_URL = "https://t.me/your-group";
