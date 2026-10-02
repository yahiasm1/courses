import Link from "next/link";
import { Icon } from "@/components/icons";
import { Logo } from "@/components/logo";

export default function NotFound() {
  return (
    <div className="authwrap">
      <div className="mb-7 flex w-full max-w-[1060px] items-center justify-between gap-4">
        <Logo size={32} />
        <Link href="/" className="pill">
          Courses
        </Link>
      </div>
      <div className="authcard text-center">
        <div className="icon-tile icon-tile-lg icon-tile-grey mx-auto mb-[18px]">
          <Icon name="help" size={26} />
        </div>
        <h1 className="h2 display mb-2">Page not found</h1>
        <p className="mb-[22px] text-[15px] leading-[1.5] text-muted">
          The page you&apos;re looking for doesn&apos;t exist or has moved.
        </p>
        <Link href="/" className="btn btn-primary btn-lg w-full">
          Back to courses
        </Link>
      </div>
    </div>
  );
}
