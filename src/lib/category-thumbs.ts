import type { Category } from "@/lib/types";

/**
 * Generated thumbnails in public/categories, keyed by slugified category name,
 * with the two gradient colours each one is drawn with.
 */
const THUMBS: Record<string, [from: string, to: string]> = {
  "agency": ["#3b82f6", "#1e3a8a"],
  "ai-agents": ["#6366f1", "#312e81"],
  "ai-automation": ["#8b5cf6", "#4c1d95"],
  "ai-content": ["#8b5cf6", "#4c1d95"],
  "ai-creative": ["#d946ef", "#701a75"],
  "ai-development": ["#6366f1", "#312e81"],
  "ai-for-business": ["#8b5cf6", "#4c1d95"],
  "ai-fundamentals": ["#6366f1", "#312e81"],
  "ai-income": ["#d946ef", "#701a75"],
  "ai-prompting": ["#d946ef", "#701a75"],
  "ai-tools": ["#8b5cf6", "#4c1d95"],
  "books": ["#b45309", "#431407"],
  "branding": ["#a855f7", "#581c87"],
  "business": ["#64748b", "#0f172a"],
  "career": ["#4f46e5", "#1e1b4b"],
  "communication": ["#0891b2", "#083344"],
  "content-creation": ["#f43f5e", "#4c0519"],
  "copywriting": ["#f59e0b", "#78350f"],
  "creative-arts": ["#fb923c", "#7c2d12"],
  "crm": ["#2563eb", "#172554"],
  "design": ["#f472b6", "#701a75"],
  "e-commerce": ["#06b6d4", "#164e63"],
  "education": ["#0d9488", "#042f2e"],
  "entrepreneurship": ["#f97316", "#431407"],
  "finance": ["#14b8a6", "#134e4a"],
  "freelancing": ["#0ea5e9", "#082f49"],
  "health": ["#e11d48", "#4c0519"],
  "investing": ["#22c55e", "#14532d"],
  "lead-generation": ["#ef4444", "#7f1d1d"],
  "leadership": ["#7c3aed", "#2e1065"],
  "marketing-strategy": ["#f43f5e", "#881337"],
  "mindset": ["#c026d3", "#4a044e"],
  "other": ["#71717a", "#18181b"],
  "paid-advertising": ["#f97316", "#7c2d12"],
  "personal-development": ["#16a34a", "#052e16"],
  "productivity": ["#2563eb", "#1e1b4b"],
  "publishing": ["#a16207", "#422006"],
  "sales": ["#eab308", "#713f12"],
  "seo": ["#0ea5e9", "#0c4a6e"],
  "social-media": ["#ec4899", "#831843"],
  "software": ["#3b82f6", "#172554"],
  "storytelling": ["#d97706", "#451a03"],
  "tech": ["#06b6d4", "#083344"],
  "trading": ["#10b981", "#064e3b"],
  "video": ["#fb7185", "#881337"],
  "web": ["#0284c7", "#0c4a6e"],
  "wellness": ["#10b981", "#022c22"],
  "writing": ["#ca8a04", "#422006"],
  "youtube": ["#ef4444", "#450a0a"],
};

const toKey = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

type CategoryLike = Pick<Category, "name" | "slug">;

function thumbKey(c: CategoryLike) {
  return [toKey(c.slug), toKey(c.name)].find((k) => k in THUMBS);
}

/** The category's generated thumbnail, or null if it has none. */
export function categoryThumb(c: CategoryLike): string | null {
  const key = thumbKey(c);
  return key ? `/categories/${key}.svg` : null;
}

/** Gradient colours of the category's generated thumbnail, or null. */
export function categoryPalette(c: CategoryLike): [from: string, to: string] | null {
  const key = thumbKey(c);
  return key ? THUMBS[key] : null;
}

/** The category's own image, else its generated thumbnail, else null. */
export function categoryImage(c: CategoryLike & Pick<Category, "image_url">): string | null {
  return c.image_url ?? categoryThumb(c);
}
