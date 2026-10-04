/** Meta Pixel helpers (browser only). Safe to call before the pixel has loaded or when it's disabled. */
type Fbq = (...args: unknown[]) => void;

export type PixelEvent = "PageView" | "ViewContent" | "AddToCart" | "InitiateCheckout" | "Purchase";

export function track(event: PixelEvent, params?: Record<string, unknown>) {
  const fbq = (window as unknown as { fbq?: Fbq }).fbq;
  if (typeof fbq === "function") fbq("track", event, params);
}
