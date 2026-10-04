"use client";

import { useEffect } from "react";
import { track, type PixelEvent } from "@/lib/pixel";

/**
 * Fires a Meta Pixel event once when shown. With `onceKey`, it fires only once per
 * browser session for that key (e.g. a Purchase isn't re-sent when the page is refreshed).
 */
export function PixelOnView({
  event,
  params,
  onceKey,
}: {
  event: PixelEvent;
  params?: Record<string, unknown>;
  onceKey?: string;
}) {
  const json = JSON.stringify(params ?? {});
  useEffect(() => {
    const key = onceKey ? `pixel:${event}:${onceKey}` : null;
    try {
      if (key && sessionStorage.getItem(key)) return;
      if (key) sessionStorage.setItem(key, "1");
    } catch {
      /* storage unavailable: still track */
    }
    track(event, JSON.parse(json));
  }, [event, json, onceKey]);
  return null;
}

/** Fires a Meta Pixel event when a form inside it is submitted (e.g. Add to cart, Checkout). */
export function PixelOnSubmit({
  event,
  params,
  children,
}: {
  event: PixelEvent;
  params?: Record<string, unknown>;
  children: React.ReactNode;
}) {
  return <div onSubmit={() => track(event, params)}>{children}</div>;
}
