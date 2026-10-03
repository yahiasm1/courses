import Link from "next/link";
import { SITE_NAME } from "@/lib/site";

/** Brand mark (public/brand/logo-mark.svg) plus the name, last word in the accent colour. */
export function Logo({ size = 34 }: { size?: number }) {
  const cut = SITE_NAME.lastIndexOf(" ");
  const [lead, tail] = cut > 0 ? [SITE_NAME.slice(0, cut), SITE_NAME.slice(cut + 1)] : [SITE_NAME, ""];
  return (
    <Link href="/" className="flex items-center gap-[10px] text-ink" aria-label={SITE_NAME}>
      <img
        src="/brand/logo-mark.svg"
        alt=""
        width={size}
        height={size}
        className="shrink-0 drop-shadow-[0_6px_16px_var(--accent-shadow)]"
      />
      <span className="display text-[17px]" aria-hidden>
        {lead}
        {tail && <span className="text-[var(--accent)]"> {tail}</span>}
      </span>
    </Link>
  );
}
