import Link from "next/link";
import { Logo } from "@/components/logo";
import { getCategories, getUser } from "@/lib/data";
import { logout } from "@/app/actions/auth";

export async function Header() {
  const [user, categories] = await Promise.all([getUser(), getCategories()]);

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-bg/85 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-6 px-4 sm:px-6">
        <Logo />

        <nav className="hidden items-center gap-1 text-sm font-medium text-muted md:flex">
          <Link href="/shop" className="rounded-lg px-3 py-2 hover:bg-surface-2 hover:text-ink">
            Shop
          </Link>
          <div className="group relative">
            <button className="flex items-center gap-1 rounded-lg px-3 py-2 hover:bg-surface-2 hover:text-ink">
              Categories
              <svg viewBox="0 0 20 20" className="size-4" fill="currentColor">
                <path d="M5.3 7.3a1 1 0 0 1 1.4 0L10 10.6l3.3-3.3a1 1 0 1 1 1.4 1.4l-4 4a1 1 0 0 1-1.4 0l-4-4a1 1 0 0 1 0-1.4Z" />
              </svg>
            </button>
            <div className="invisible absolute left-0 top-full w-56 pt-2 opacity-0 transition group-focus-within:visible group-focus-within:opacity-100 group-hover:visible group-hover:opacity-100">
              <div className="rounded-xl border border-line bg-surface p-2 shadow-xl">
                {categories.length === 0 && (
                  <p className="px-3 py-2 text-sm text-muted">No categories yet</p>
                )}
                {categories.map((c) => (
                  <Link
                    key={c.id}
                    href={`/shop?category=${c.slug}`}
                    className="block rounded-lg px-3 py-2 text-ink hover:bg-surface-2"
                  >
                    {c.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </nav>

        <form action="/shop" className="ml-auto hidden max-w-xs flex-1 lg:block">
          <input
            name="q"
            placeholder="Search courses…"
            className="w-full rounded-xl border border-line bg-surface px-4 py-2 text-sm outline-none focus:border-accent"
          />
        </form>

        <div className="ml-auto flex items-center gap-2 lg:ml-0">
          {user ? (
            <>
              <Link
                href="/library"
                className="rounded-xl bg-accent px-4 py-2 text-sm font-semibold text-accent-ink hover:brightness-95"
              >
                My courses
              </Link>
              <form action={logout} className="hidden sm:block">
                <button className="rounded-xl border border-line px-4 py-2 text-sm font-medium text-muted hover:text-ink">
                  Sign out
                </button>
              </form>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="rounded-xl px-4 py-2 text-sm font-medium text-muted hover:text-ink"
              >
                Sign in
              </Link>
              <Link
                href="/signup"
                className="rounded-xl bg-accent px-4 py-2 text-sm font-semibold text-accent-ink hover:brightness-95"
              >
                Sign up
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
