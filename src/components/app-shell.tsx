import Link from "next/link";
import { Crumbs } from "@/components/crumbs";
import { Footer } from "@/components/footer";
import { Icon } from "@/components/icons";
import { Logo } from "@/components/logo";
import { MobileDrawer } from "@/components/mobile-drawer";
import { NavLinks } from "@/components/nav-links";
import { logout } from "@/app/actions/auth";
import { getCategories, getCourses, getUser } from "@/lib/data";
import { buildNav } from "@/lib/nav";
import { SITE_TAGLINE } from "@/lib/site";

function SignOut({ className = "" }: { className?: string }) {
  return (
    <form action={logout}>
      <button type="submit" className={`nav-item w-full ${className}`}>
        <Icon name="logout" size={19} />
        <span className="flex-1 text-left">Sign out</span>
      </button>
    </form>
  );
}

function PromoCard() {
  return (
    <div className="rounded-[14px] border border-[#ddd3ff] bg-[linear-gradient(160deg,#ebe4ff,#f8f6ff)] p-[15px]">
      <div className="brand-mark mb-[11px] !h-[30px] !w-[30px] rounded-[9px]">
        <Icon name="lock" size={16} strokeWidth={2} />
      </div>
      <div className="text-[14.5px] font-bold tracking-[-.01em]">Secure checkout</div>
      <p className="mb-3 mt-[5px] text-[12.5px] leading-[1.45] text-[#5b4a8f]">
        Pay with CIB or Edahabia. Your course lands in My courses right after payment.
      </p>
      <Link
        href="/shop"
        className="btn btn-secondary h-[38px] w-full rounded-[10px] border-[#c9b8ff] text-[13px]"
      >
        <Icon name="bag" size={16} className="text-accent-ink" />
        Browse courses
      </Link>
    </div>
  );
}

export async function AppShell({ children }: { children: React.ReactNode }) {
  const [user, categories, courses] = await Promise.all([getUser(), getCategories(), getCourses()]);

  const counts = new Map<string, number>();
  courses.forEach(
    (c) => c.category_id && counts.set(c.category_id, (counts.get(c.category_id) ?? 0) + 1),
  );
  const nav = buildNav(categories, counts, Boolean(user));
  const crumbCategories = categories.map((c) => ({ slug: c.slug, name: c.name }));

  const meta = user?.user_metadata as { first_name?: string } | undefined;
  const displayName = meta?.first_name || user?.email?.split("@")[0] || "";
  const initial = displayName.charAt(0) || "?";

  return (
    <div className="desk">
      <div className="shell">
        {/* ---- Sidebar (tablet and up) ---- */}
        <aside className="sidebar">
          <div className="border-b border-line-3 p-[14px]">
            <div className="flex items-center gap-[11px] rounded-[13px] border border-line-2 bg-surface px-[11px] py-[10px] shadow-[0_1px_2px_rgba(16,24,40,.04)]">
              <Logo size={32} />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto px-[14px] py-3">
            <NavLinks groups={nav} />
            {user && (
              <div className="mt-0.5">
                <SignOut />
              </div>
            )}
          </div>
          <div className="border-t border-line-3 p-[14px]">
            <PromoCard />
          </div>
        </aside>

        {/* ---- Main column ---- */}
        <div className="main">
          <header className="topbar">
            <MobileDrawer
              groups={nav}
              footer={
                user ? (
                  <SignOut />
                ) : (
                  <p className="px-2 text-[12.5px] leading-relaxed text-muted">{SITE_TAGLINE}</p>
                )
              }
            />
            <Crumbs categories={crumbCategories} />

            <form action="/shop" className="topbar-search search w-[260px] shrink-0">
              <Icon name="search" size={18} className="text-faint" />
              <input name="q" placeholder="Search courses…" aria-label="Search courses" />
            </form>

            <div className="flex shrink-0 items-center gap-2">
              {user ? (
                <>
                  <Link href="/library" className="btn btn-primary h-[38px]">
                    <Icon name="book" size={17} />
                    <span className="hidden sm:inline">My courses</span>
                  </Link>
                  <Link href="/library" className="avatar" title={user.email ?? undefined}>
                    {initial}
                  </Link>
                </>
              ) : (
                <>
                  <Link href="/login" className="btn btn-secondary hidden h-[38px] sm:inline-flex">
                    Sign in
                  </Link>
                  <Link href="/signup" className="btn btn-primary h-[38px]">
                    <Icon name="plus" size={17} />
                    Sign up
                  </Link>
                </>
              )}
            </div>
          </header>

          <div className="pad">{children}</div>

          <Footer />
        </div>
      </div>
    </div>
  );
}
