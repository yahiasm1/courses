"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { Icon } from "@/components/icons";

function CrumbsInner({ categories }: { categories: { slug: string; name: string }[] }) {
  const pathname = usePathname();
  const category = useSearchParams().get("category");

  let root = "Browse";
  let leaf = "All courses";
  if (pathname === "/shop") {
    leaf = categories.find((c) => c.slug === category)?.name ?? "Shop";
  } else if (pathname.startsWith("/courses/")) {
    leaf = "Course";
  } else if (pathname.startsWith("/library")) {
    root = "Account";
    leaf = "My courses";
  }

  return (
    <div className="flex min-w-0 flex-1 items-center gap-2 overflow-hidden text-[14.5px] text-muted">
      <span className="hidden sm:block">{root}</span>
      <Icon name="chevronRight" size={16} className="hidden shrink-0 text-faint sm:block" />
      <span className="truncate font-semibold text-ink">{leaf}</span>
    </div>
  );
}

export function Crumbs(props: { categories: { slug: string; name: string }[] }) {
  return (
    <Suspense fallback={<div className="flex-1" />}>
      <CrumbsInner {...props} />
    </Suspense>
  );
}
