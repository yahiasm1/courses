"use client";

import Link from "next/link";
import { useEffect } from "react";
import { Icon } from "@/components/icons";

export default function SiteError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="mx-auto flex max-w-md flex-col items-center px-4 py-20 text-center">
      <div className="icon-tile icon-tile-lg mb-4">
        <Icon name="alert" size={24} />
      </div>
      <h1 className="h2 display">Something went wrong</h1>
      <p className="mt-2 text-[14.5px] text-muted">
        We couldn&apos;t load this page. Please try again in a moment.
      </p>
      <div className="mt-6 flex gap-2.5">
        <button type="button" onClick={reset} className="btn btn-primary">
          Try again
        </button>
        <Link href="/" className="btn btn-secondary">
          Back to courses
        </Link>
      </div>
    </div>
  );
}
