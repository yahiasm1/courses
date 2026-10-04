import Link from "next/link";
import { getDict } from "@/lib/i18n/server";
import { CONTACT_EMAIL, SITE_NAME } from "@/lib/site";

export async function Footer() {
  const { t } = await getDict();
  return (
    <footer className="border-t border-[var(--border)] bg-[var(--surface)]">
      <div className="mx-auto flex max-w-[1360px] flex-wrap items-center justify-between gap-x-6 gap-y-2 px-4 py-5 text-[0.78rem] text-muted sm:px-6 lg:px-10">
        <span>
          © {new Date().getFullYear()} {SITE_NAME}. {t.footer.rights}
        </span>
        <nav className="flex flex-wrap items-center gap-x-5 gap-y-1">
          <Link href="/shop" className="hover:text-ink">
            {t.nav.allCourses}
          </Link>
          <Link href="/library" className="hover:text-ink">
            {t.nav.myCourses}
          </Link>
          <a href={`mailto:${CONTACT_EMAIL}`} className="hover:text-ink">
            {CONTACT_EMAIL}
          </a>
          <span className="font-mono text-[0.7rem]">CIB · Edahabia · SlickPay</span>
        </nav>
      </div>
    </footer>
  );
}
