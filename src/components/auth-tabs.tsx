"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { useI18n } from "@/components/i18n-provider";

const tabs = [
  { href: "/login", name: "signIn" },
  { href: "/signup", name: "signUp" },
] as const;

function AuthTabsInner() {
  const pathname = usePathname();
  const { t } = useI18n();
  const next = useSearchParams().get("next");
  const query = next ? `?next=${encodeURIComponent(next)}` : "";

  return (
    <div className="flex items-center gap-1.5">
      <Link href="/" className="pill hidden sm:inline-flex">
        {t.auth.courses}
      </Link>
      {tabs.map((tab) => (
        <Link
          key={tab.href}
          href={`${tab.href}${query}`}
          className={`pill ${pathname === tab.href ? "pill--active" : ""}`}
        >
          {t.nav[tab.name]}
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
