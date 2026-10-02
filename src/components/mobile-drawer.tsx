"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Icon } from "@/components/icons";
import { Logo } from "@/components/logo";
import { NavLinks } from "@/components/nav-links";
import type { NavGroup } from "@/lib/nav";

/** Hamburger button + slide-in drawer, used below the tablet breakpoint. */
export function MobileDrawer({
  groups,
  footer,
}: {
  groups: NavGroup[];
  footer?: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      <button
        type="button"
        aria-label="Open menu"
        className="icon-btn menu-btn"
        onClick={() => setOpen(true)}
      >
        <Icon name="menu" size={20} />
      </button>

      <div
        aria-hidden
        onClick={() => setOpen(false)}
        className={`fixed inset-0 z-40 bg-dark/25 transition-opacity ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      <aside
        aria-hidden={!open}
        className={`fixed inset-y-0 left-0 z-50 flex w-[272px] flex-col overflow-y-auto border-r border-line-3 bg-surface p-4 shadow-[0_0_60px_-10px_rgba(16,24,40,.4)] transition-transform duration-200 ${
          open ? "translate-x-0" : "-translate-x-[105%]"
        }`}
      >
        <div className="mb-4 flex items-center gap-2">
          <div className="flex-1">
            <Logo size={32} />
          </div>
          <button
            type="button"
            aria-label="Close menu"
            className="text-muted hover:text-ink"
            onClick={() => setOpen(false)}
          >
            <Icon name="close" size={20} />
          </button>
        </div>
        <NavLinks groups={groups} />
        {footer && <div className="mt-4 border-t border-line-3 pt-4">{footer}</div>}
      </aside>
    </>
  );
}
