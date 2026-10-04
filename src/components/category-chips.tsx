import Link from "next/link";
import type { Category } from "@/lib/types";
import { getDict } from "@/lib/i18n/server";

type Params = Record<string, string | undefined>;

function withParams(basePath: string, params: Params, category?: string) {
  const sp = new URLSearchParams();
  if (category) sp.set("category", category);
  Object.entries(params).forEach(([k, v]) => v && sp.set(k, v));
  const qs = sp.toString();
  return qs ? `${basePath}?${qs}` : basePath;
}

export async function CategoryChips({
  categories,
  active,
  basePath = "/shop",
  params = {},
  bleed = true,
}: {
  categories: Category[];
  active?: string;
  basePath?: string;
  /** Extra query params to keep when switching category (search, price, sort). */
  params?: Params;
  /** Let the row scroll edge-to-edge on phones (for rows placed directly on the page). */
  bleed?: boolean;
}) {
  const { t } = await getDict();
  const chip = (isActive: boolean) => `pill ${isActive ? "pill--active" : ""}`;

  return (
    <div
      className={`no-scrollbar flex gap-2 overflow-x-auto sm:flex-wrap ${
        bleed ? "-mx-[18px] px-[18px] sm:mx-0 sm:px-0" : ""
      }`}
    >
      <Link href={withParams(basePath, params)} className={chip(!active)} scroll={false}>
        {t.shop.all}
      </Link>
      {categories.map((c) => (
        <Link
          key={c.id}
          href={withParams(basePath, params, c.slug)}
          className={chip(active === c.slug)}
          scroll={false}
        >
          {c.name}
        </Link>
      ))}
    </div>
  );
}
