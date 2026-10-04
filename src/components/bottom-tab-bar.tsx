"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon, type IconName } from "@/components/icons";
import { logout } from "@/app/actions/auth";
import { useI18n } from "@/components/i18n-provider";

const tabs: { href: string; label: "home" | "coursesTab" | "myCourses"; icon: IconName; prefix?: boolean }[] = [
  { href: "/", label: "home", icon: "home" },
  { href: "/shop", label: "coursesTab", icon: "bag" },
  { href: "/library", label: "myCourses", icon: "book", prefix: true },
];

/** Fixed navigation for phones and tablets; hidden from 1024px up (see .bottom-tab-bar). */
export function BottomTabBar({ signedIn }: { signedIn: boolean }) {
  const pathname = usePathname();
  const { t } = useI18n();
  const active = (tab: (typeof tabs)[number]) =>
    tab.prefix ? pathname.startsWith(tab.href) : pathname === tab.href;

  return (
    <nav className="bottom-tab-bar" aria-label={t.nav.primary}>
      {tabs.map((tab) => (
        <Link key={tab.href} href={tab.href} className={`tab-item ${active(tab) ? "tab-item-active" : ""}`}>
          <Icon name={tab.icon} size={20} />
          {t.nav[tab.label]}
        </Link>
      ))}
      {signedIn ? (
        <form action={logout} className="flex flex-1">
          <button type="submit" className="tab-item w-full">
            <Icon name="logout" size={20} />
            {t.nav.signOut}
          </button>
        </form>
      ) : (
        <Link href="/login" className={`tab-item ${pathname === "/login" ? "tab-item-active" : ""}`}>
          <Icon name="user" size={20} />
          {t.nav.signIn}
        </Link>
      )}
    </nav>
  );
}
