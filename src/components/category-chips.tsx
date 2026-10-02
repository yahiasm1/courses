import Link from "next/link";
import type { Category } from "@/lib/types";

export function CategoryChips({
  categories,
  active,
  basePath = "/shop",
  bleed = true,
}: {
  categories: Category[];
  active?: string;
  basePath?: string;
  /** Let the row scroll edge-to-edge on phones (for rows placed directly on the page). */
  bleed?: boolean;
}) {
  const chip = (isActive: boolean) => `pill ${isActive ? "pill--active" : ""}`;

  return (
    <div
      className={`no-scrollbar flex gap-2 overflow-x-auto sm:flex-wrap ${
        bleed ? "-mx-[18px] px-[18px] sm:mx-0 sm:px-0" : ""
      }`}
    >
      <Link href={basePath} className={chip(!active)} scroll={false}>
        All
      </Link>
      {categories.map((c) => (
        <Link
          key={c.id}
          href={`${basePath}?category=${c.slug}`}
          className={chip(active === c.slug)}
          scroll={false}
        >
          {c.name}
        </Link>
      ))}
    </div>
  );
}
