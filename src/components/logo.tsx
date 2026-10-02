import Link from "next/link";
import { Icon } from "@/components/icons";
import { SITE_NAME } from "@/lib/site";

export function Logo({ size = 34 }: { size?: number }) {
  return (
    <Link href="/" className="flex items-center gap-[10px] text-ink">
      <span className="brand-mark" style={{ width: size, height: size }}>
        <Icon name="cap" size={Math.round(size * 0.58)} strokeWidth={2} />
      </span>
      <span className="text-[16px] font-bold tracking-[-.02em]">{SITE_NAME}</span>
    </Link>
  );
}
