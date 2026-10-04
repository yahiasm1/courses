"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { Icon } from "@/components/icons";
import { useI18n } from "@/components/i18n-provider";

/** Search button for small screens; expands a search row under the header. */
export function MobileSearch() {
  const [open, setOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const pathname = usePathname();
  const { t } = useI18n();

  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  return (
    <>
      <button
        type="button"
        aria-label={t.nav.search}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="hdr-icon shell-focus md:hidden"
      >
        <Icon name={open ? "close" : "search"} size={18} />
      </button>
      {open && (
        <div className="absolute inset-x-0 top-full border-b border-[var(--border)] bg-[var(--bg)] p-3 md:hidden">
          <form role="search" action="/shop" className="search h-11">
            <Icon name="search" size={16} className="text-faint" />
            <input
              ref={inputRef}
              type="search"
              name="q"
              autoComplete="off"
              enterKeyHint="search"
              placeholder={t.nav.searchCourses}
              aria-label={t.nav.search}
            />
            <button type="submit" className="btn btn-primary btn-sm h-8">
              {t.nav.search}
            </button>
          </form>
        </div>
      )}
    </>
  );
}
