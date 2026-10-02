import Link from "next/link";
import { Logo } from "@/components/logo";
import { CONTACT_EMAIL, SITE_NAME, SITE_TAGLINE } from "@/lib/site";
import { getCategories } from "@/lib/data";

export async function Footer() {
  const categories = await getCategories();
  return (
    <footer className="mt-16 border-t border-line bg-surface">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-4">
        <div className="space-y-3">
          <Logo />
          <p className="text-sm text-muted">{SITE_TAGLINE}</p>
        </div>
        <div>
          <h3 className="mb-3 text-sm font-semibold">Categories</h3>
          <ul className="space-y-2 text-sm text-muted">
            {categories.slice(0, 6).map((c) => (
              <li key={c.id}>
                <Link href={`/shop?category=${c.slug}`} className="hover:text-ink">
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="mb-3 text-sm font-semibold">Account</h3>
          <ul className="space-y-2 text-sm text-muted">
            <li><Link href="/library" className="hover:text-ink">My courses</Link></li>
            <li><Link href="/login" className="hover:text-ink">Sign in</Link></li>
            <li><Link href="/signup" className="hover:text-ink">Create account</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="mb-3 text-sm font-semibold">Help</h3>
          <ul className="space-y-2 text-sm text-muted">
            <li><a href={`mailto:${CONTACT_EMAIL}`} className="hover:text-ink">{CONTACT_EMAIL}</a></li>
            <li>Secure payment via SlickPay</li>
            <li>CIB · Edahabia</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-line py-5 text-center text-xs text-muted">
        © {new Date().getFullYear()} {SITE_NAME}. All rights reserved.
      </div>
    </footer>
  );
}
