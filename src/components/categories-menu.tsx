"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useRef, useState } from "react";
import { Icon } from "@/components/icons";
import type { Category } from "@/lib/types";

function Menu({ categories }: { categories: Pick<Category, "id" | "name" | "slug">[] }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const search = useSearchParams().toString();

  useEffect(() => setOpen(false), [pathname, search]);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onDown);
    window.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={ref} className="relative inline-flex items-center">
      <button
        type="button"
        aria-label="Categories"
        aria-expanded={open}
        aria-haspopup="true"
        data-open={open}
        onClick={() => setOpen((v) => !v)}
        className="hdr-link shell-focus select-none"
      >
        <Icon name="grid" size={18} />
        <span>Categories</span>
        <Icon
          name="chevronDown"
          size={14}
          className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && (
        <div className="menu-panel" role="menu">
          {categories.length === 0 && (
            <p className="px-3 py-2 text-[0.85rem] text-muted">No categories yet</p>
          )}
          {categories.map((c) => (
            <Link key={c.id} href={`/shop?category=${c.slug}`} className="menu-item" role="menuitem">
              <Icon name="tag" size={16} className="text-faint" />
              {c.name}
            </Link>
          ))}
          <div className="my-1 h-px bg-[var(--border)]" />
          <Link href="/shop" className="menu-item" role="menuitem">
            <Icon name="bag" size={16} className="text-faint" />
            All courses
          </Link>
        </div>
      )}
    </div>
  );
}

export function CategoriesMenu(props: { categories: Pick<Category, "id" | "name" | "slug">[] }) {
  return (
    <Suspense>
      <Menu {...props} />
    </Suspense>
  );
}
