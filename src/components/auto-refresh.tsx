"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

/** Re-renders the current server page every `everyMs`, up to `times` times. */
export function AutoRefresh({ everyMs = 4000, times = 8 }: { everyMs?: number; times?: number }) {
  const router = useRouter();
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (count >= times) return;
    const t = setTimeout(() => {
      router.refresh();
      setCount((c) => c + 1);
    }, everyMs);
    return () => clearTimeout(t);
  }, [count, times, everyMs, router]);

  return null;
}
