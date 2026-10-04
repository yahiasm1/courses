import Link from "next/link";
import { Icon } from "@/components/icons";
import { getDict } from "@/lib/i18n/server";

type Params = Record<string, string | number | undefined>;

function href(basePath: string, params: Params, page: number) {
  const sp = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== "" && k !== "page") sp.set(k, String(v));
  });
  if (page > 1) sp.set("page", String(page));
  const qs = sp.toString();
  return qs ? `${basePath}?${qs}` : basePath;
}

/** Numbered pagination with a window around the current page. */
export async function Pagination({
  page,
  totalPages,
  basePath,
  params = {},
}: {
  page: number;
  totalPages: number;
  basePath: string;
  params?: Params;
}) {
  if (totalPages <= 1) return null;
  const { t } = await getDict();
  const pg = t.pagination;

  const pages = new Set<number>([1, totalPages, page - 1, page, page + 1]);
  const list = [...pages].filter((p) => p >= 1 && p <= totalPages).sort((a, b) => a - b);

  const item = (p: number) => (
    <Link
      key={p}
      href={href(basePath, params, p)}
      aria-current={p === page ? "page" : undefined}
      className={`pill min-w-9 justify-center ${p === page ? "pill--active" : ""}`}
    >
      {p}
    </Link>
  );

  return (
    <nav aria-label={pg.label} className="flex flex-wrap items-center justify-center gap-1.5">
      {page > 1 ? (
        <Link href={href(basePath, params, page - 1)} className="pill" aria-label={pg.prevPage}>
          <Icon name="chevronRight" size={14} className="rotate-180 rtl:rotate-0" />
          {pg.prev}
        </Link>
      ) : (
        <span className="pill opacity-40">
          <Icon name="chevronRight" size={14} className="rotate-180 rtl:rotate-0" />
          {pg.prev}
        </span>
      )}
      {list.map((p, i) => (
        <span key={p} className="contents">
          {i > 0 && list[i - 1] !== p - 1 && <span className="px-1 text-muted">…</span>}
          {item(p)}
        </span>
      ))}
      {page < totalPages ? (
        <Link href={href(basePath, params, page + 1)} className="pill" aria-label={pg.nextPage}>
          {pg.next}
          <Icon name="chevronRight" size={14} className="rtl:rotate-180" />
        </Link>
      ) : (
        <span className="pill opacity-40">
          {pg.next}
          <Icon name="chevronRight" size={14} className="rtl:rotate-180" />
        </span>
      )}
    </nav>
  );
}
