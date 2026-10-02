import Link from "next/link";
import { CategoriesMenu } from "@/components/categories-menu";
import { Icon } from "@/components/icons";
import { Logo } from "@/components/logo";
import { MobileSearch } from "@/components/mobile-search";
import { ThemeToggle } from "@/components/theme-toggle";
import { logout } from "@/app/actions/auth";
import { getCategories, getUser } from "@/lib/data";

export async function SiteHeader() {
  const [user, categories] = await Promise.all([getUser(), getCategories()]);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[var(--border)] bg-[var(--bg)] md:bg-[var(--bg)]/95 md:backdrop-blur-lg md:supports-[backdrop-filter]:bg-[var(--bg)]/85">
      <div className="relative mx-auto flex h-14 max-w-[1360px] items-center gap-3 px-4 sm:px-6 md:h-[72px] md:gap-5 lg:px-10">
        <div className="flex shrink-0 items-center">
          <Logo size={30} />
        </div>

        <nav className="hidden shrink-0 items-center gap-1 lg:flex" aria-label="Shop">
          <Link href="/shop" className="hdr-link shell-focus">
            Shop
          </Link>
          <CategoriesMenu categories={categories} />
        </nav>

        <div className="relative hidden min-w-0 flex-1 md:block">
          <form
            role="search"
            action="/shop"
            className="flex h-[38px] items-center gap-2 rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface)] pe-1.5 ps-4 transition-colors focus-within:border-[var(--accent)]"
          >
            <input
              type="search"
              name="q"
              autoComplete="off"
              spellCheck={false}
              enterKeyHint="search"
              aria-label="Search"
              placeholder="Search a course, a topic…"
              className="min-w-0 flex-1 border-none bg-transparent text-[0.8rem] text-[var(--text)] outline-none placeholder:text-[var(--text-soft)] [&::-webkit-search-cancel-button]:appearance-none"
            />
            <button
              type="submit"
              aria-label="Search"
              className="flex size-7 shrink-0 items-center justify-center rounded-[var(--radius-md)] text-[var(--text-soft)] transition-colors hover:bg-[var(--surface-raised)] hover:text-[var(--text)]"
            >
              <Icon name="search" size={14} />
            </button>
          </form>
        </div>

        <div className="ms-auto flex shrink-0 items-center gap-1.5 md:gap-2">
          <MobileSearch />
          <ThemeToggle className="hidden md:inline-flex" />

          {user ? (
            <>
              <Link
                href="/library"
                aria-label="My courses"
                title="My courses"
                className="hdr-link shell-focus px-2.5 text-[0.8rem]"
              >
                <Icon name="book" size={18} />
                <span className="hidden lg:inline">My courses</span>
              </Link>
              <form action={logout} className="hidden lg:inline-flex">
                <button type="submit" aria-label="Sign out" title="Sign out" className="hdr-icon shell-focus">
                  <Icon name="logout" size={18} />
                </button>
              </form>
            </>
          ) : (
            <>
              <Link
                href="/login"
                aria-label="Sign in"
                className="hdr-link shell-focus hidden px-2.5 text-[0.8rem] lg:inline-flex"
              >
                <Icon name="user" size={18} />
                <span>Sign in</span>
              </Link>
              <Link href="/signup" className="btn btn-primary h-9 text-[0.8rem]">
                Sign up
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
