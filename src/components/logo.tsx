import Link from "next/link";
import { SITE_NAME } from "@/lib/site";

export function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2 text-lg font-bold tracking-tight text-brand">
      <span className="grid size-8 place-items-center rounded-lg bg-accent text-accent-ink">
        <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2.2">
          <path d="M4 6.5 12 3l8 3.5-8 3.5L4 6.5Z" strokeLinejoin="round" />
          <path d="M7 8.5V14c0 1.5 2.5 3 5 3s5-1.5 5-3V8.5" strokeLinejoin="round" />
        </svg>
      </span>
      {SITE_NAME}
    </Link>
  );
}
