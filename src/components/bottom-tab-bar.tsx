"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon, type IconName } from "@/components/icons";
import { logout } from "@/app/actions/auth";

const tabs: { href: string; label: string; icon: IconName; prefix?: boolean }[] = [
  { href: "/", label: "Home", icon: "home" },
  { href: "/shop", label: "Courses", icon: "bag" },
  { href: "/library", label: "My courses", icon: "book", prefix: true },
];

/** Fixed navigation for phones and tablets; hidden from 1024px up (see .bottom-tab-bar). */
export function BottomTabBar({ signedIn }: { signedIn: boolean }) {
  const pathname = usePathname();
  const active = (t: (typeof tabs)[number]) =>
    t.prefix ? pathname.startsWith(t.href) : pathname === t.href;

  return (
    <nav className="bottom-tab-bar" aria-label="Primary">
      {tabs.map((t) => (
        <Link key={t.href} href={t.href} className={`tab-item ${active(t) ? "tab-item-active" : ""}`}>
          <Icon name={t.icon} size={20} />
          {t.label}
        </Link>
      ))}
      {signedIn ? (
        <form action={logout} className="flex flex-1">
          <button type="submit" className="tab-item w-full">
            <Icon name="logout" size={20} />
            Sign out
          </button>
        </form>
      ) : (
        <Link href="/login" className={`tab-item ${pathname === "/login" ? "tab-item-active" : ""}`}>
          <Icon name="user" size={20} />
          Sign in
        </Link>
      )}
    </nav>
  );
}
