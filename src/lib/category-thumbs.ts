import type { Category } from "@/lib/types";

/** Generated thumbnails in public/categories, keyed by slugified category name. */
const THUMBS = new Set([
  "agency", "ai-agents", "ai-automation", "ai-content", "ai-creative", "ai-development",
  "ai-for-business", "ai-fundamentals", "ai-income", "ai-prompting", "ai-tools", "books",
  "branding", "business", "career", "communication", "content-creation", "copywriting",
  "creative-arts", "crm", "design", "e-commerce", "education", "entrepreneurship", "finance",
  "freelancing", "health", "investing", "lead-generation", "leadership", "marketing-strategy",
  "mindset", "other", "paid-advertising", "personal-development", "productivity", "publishing",
  "sales", "seo", "social-media", "software", "storytelling", "tech", "trading", "video", "web",
  "wellness", "writing", "youtube",
]);

const toKey = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

/** The category's own image, else its generated thumbnail, else null. */
export function categoryImage(c: Pick<Category, "name" | "slug" | "image_url">): string | null {
  if (c.image_url) return c.image_url;
  const key = [toKey(c.slug), toKey(c.name)].find((k) => THUMBS.has(k));
  return key ? `/categories/${key}.svg` : null;
}
