import Link from "next/link";

const items = [
  { href: "/", label: "Home", d: "M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1v-9.5Z" },
  { href: "/shop", label: "Shop", d: "M4 7h16l-1.5 12.5a1 1 0 0 1-1 .5h-11a1 1 0 0 1-1-.5L4 7Zm4 0V6a4 4 0 0 1 8 0v1" },
  { href: "/library", label: "My courses", d: "M4 5h6a2 2 0 0 1 2 2v13a2 2 0 0 0-2-2H4V5Zm16 0h-6a2 2 0 0 0-2 2v13a2 2 0 0 1 2-2h6V5Z" },
];

export function MobileNav() {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-3 border-t border-line bg-surface/95 backdrop-blur md:hidden">
      {items.map((i) => (
        <Link key={i.href} href={i.href} className="flex flex-col items-center gap-1 py-2.5 text-xs text-muted">
          <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round">
            <path d={i.d} />
          </svg>
          {i.label}
        </Link>
      ))}
    </nav>
  );
}
