import Link from "next/link";
import type { Category } from "@/lib/types";

export function CategoryChips({
  categories,
  active,
  basePath = "/shop",
}: {
  categories: Category[];
  active?: string;
  basePath?: string;
}) {
  const chip = (isActive: boolean) =>
    `shrink-0 rounded-full border px-4 py-2 text-sm font-medium transition ${
      isActive
        ? "border-ink bg-ink text-bg"
        : "border-line bg-surface text-muted hover:border-ink/30 hover:text-ink"
    }`;

  return (
    <div className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 sm:mx-0 sm:flex-wrap sm:px-0">
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
