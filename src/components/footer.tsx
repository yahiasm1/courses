import Link from "next/link";
import { CONTACT_EMAIL, SITE_NAME } from "@/lib/site";

export function Footer() {
  return (
    <footer className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2 border-t border-line-3 bg-surface-2 px-[18px] py-4 text-[12.5px] text-muted md:px-6">
      <span>
        © {new Date().getFullYear()} {SITE_NAME}. All rights reserved.
      </span>
      <nav className="flex flex-wrap items-center gap-x-5 gap-y-1">
        <Link href="/shop" className="hover:text-ink">
          Shop
        </Link>
        <Link href="/library" className="hover:text-ink">
          My courses
        </Link>
        <a href={`mailto:${CONTACT_EMAIL}`} className="hover:text-ink">
          {CONTACT_EMAIL}
        </a>
        <span className="font-mono text-[11.5px]">CIB · Edahabia · SlickPay</span>
      </nav>
    </footer>
  );
}
