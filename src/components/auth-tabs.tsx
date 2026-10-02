"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { Suspense } from "react";

const tabs = [
  { href: "/login", name: "Sign in" },
  { href: "/signup", name: "Sign up" },
];

function AuthTabsInner() {
  const pathname = usePathname();
  const next = useSearchParams().get("next");
  const query = next ? `?next=${encodeURIComponent(next)}` : "";

  return (
    <div className="flex items-center gap-1.5">
      <Link href="/" className="pill">
        Courses
      </Link>
      {tabs.map((t) => (
        <Link
          key={t.href}
          href={`${t.href}${query}`}
          className={`pill ${pathname === t.href ? "pill-active" : ""}`}
        >
          {t.name}
        </Link>
      ))}
    </div>
  );
}

export function AuthTabs() {
  return (
    <Suspense>
      <AuthTabsInner />
    </Suspense>
  );
}
