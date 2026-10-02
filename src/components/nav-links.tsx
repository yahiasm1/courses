"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { Icon } from "@/components/icons";
import type { NavGroup, NavItem } from "@/lib/nav";

function isActive(item: NavItem, pathname: string, category: string | null) {
  if (item.category) return pathname === "/shop" && category === item.category;
  if (item.prefix) return pathname.startsWith(item.href);
  if (item.href === "/shop") return pathname === "/shop" && !category;
  return pathname === item.href;
}

function NavList({ groups }: { groups: NavGroup[] }) {
  const pathname = usePathname();
  const category = useSearchParams().get("category");

  return (
    <>
      {groups.map((g, gi) => (
        <div key={g.label || gi} className={gi === 0 ? "" : "mt-4"}>
          {g.label && <div className="nav-label">{g.label}</div>}
          <div className="flex flex-col gap-0.5">
            {g.items.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`nav-item ${isActive(item, pathname, category) ? "nav-item-active" : ""}`}
              >
                <Icon name={item.icon} size={19} />
                <span className="min-w-0 flex-1 truncate">{item.name}</span>
                {item.badge && <span className="nav-badge">{item.badge}</span>}
              </Link>
            ))}
          </div>
        </div>
      ))}
    </>
  );
}

export function NavLinks({ groups }: { groups: NavGroup[] }) {
  return (
    <Suspense>
      <NavList groups={groups} />
    </Suspense>
  );
}
