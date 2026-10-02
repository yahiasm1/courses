import type { IconName } from "@/components/icons";
import type { Category } from "@/lib/types";

/** Plain-data nav model, safe to pass from server to client components. */
export type NavItem = {
  href: string;
  name: string;
  icon: IconName;
  badge?: string;
  /** Category slug — active when `/shop?category=<slug>`. */
  category?: string;
  /** Match any path starting with `href`. */
  prefix?: boolean;
};

export type NavGroup = { label: string; items: NavItem[] };

export function buildNav(
  categories: Category[],
  counts: Map<string, number>,
  signedIn: boolean,
): NavGroup[] {
  const groups: NavGroup[] = [
    {
      label: "",
      items: [
        { href: "/", name: "All courses", icon: "grid" },
        { href: "/shop", name: "Shop", icon: "bag" },
      ],
    },
  ];

  if (categories.length > 0) {
    groups.push({
      label: "Categories",
      items: categories.map((c) => ({
        href: `/shop?category=${c.slug}`,
        name: c.name,
        icon: "tag",
        category: c.slug,
        badge: counts.get(c.id) ? String(counts.get(c.id)) : undefined,
      })),
    });
  }

  groups.push({
    label: "Account",
    items: signedIn
      ? [{ href: "/library", name: "My courses", icon: "book", prefix: true }]
      : [
          { href: "/library", name: "My courses", icon: "book", prefix: true },
          { href: "/login", name: "Sign in", icon: "login" },
          { href: "/signup", name: "Create account", icon: "user" },
        ],
  });

  return groups;
}
