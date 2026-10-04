import type { SVGProps } from "react";

/** Rounded stroke icons in the style of the design's icon set. */
const paths = {
  menu: "M4 7h16M4 12h16M4 17h16",
  close: "M6 6l12 12M18 6 6 18",
  search: "M11 19a8 8 0 1 1 0-16 8 8 0 0 1 0 16Zm9 2-4.3-4.3",
  home: "M4 10.5 12 4l8 6.5V19a1 1 0 0 1-1 1h-4.5v-5h-5v5H5a1 1 0 0 1-1-1v-8.5Z",
  bag: "M5 8h14l-.8 10.2a2 2 0 0 1-2 1.8H7.8a2 2 0 0 1-2-1.8L5 8Zm3.5 0V7a3.5 3.5 0 0 1 7 0v1",
  book: "M4 5.5A1.5 1.5 0 0 1 5.5 4H10a2 2 0 0 1 2 2v14a2 2 0 0 0-2-2H4V5.5Zm16 0A1.5 1.5 0 0 0 18.5 4H14a2 2 0 0 0-2 2v14a2 2 0 0 1 2-2h6V5.5Z",
  grid: "M4 5a1 1 0 0 1 1-1h4.5a1 1 0 0 1 1 1v4.5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V5Zm9.5 0a1 1 0 0 1 1-1H19a1 1 0 0 1 1 1v4.5a1 1 0 0 1-1 1h-4.5a1 1 0 0 1-1-1V5ZM4 14.5a1 1 0 0 1 1-1h4.5a1 1 0 0 1 1 1V19a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-4.5Zm9.5 0a1 1 0 0 1 1-1H19a1 1 0 0 1 1 1V19a1 1 0 0 1-1 1h-4.5a1 1 0 0 1-1-1v-4.5Z",
  tag: "M3.5 12.2V5a1.5 1.5 0 0 1 1.5-1.5h7.2a2 2 0 0 1 1.4.6l6.8 6.8a2 2 0 0 1 0 2.8l-5.6 5.6a2 2 0 0 1-2.8 0l-6.9-6.9a2 2 0 0 1-.6-1.2ZM8 8h.01",
  user: "M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm-7 8a7 7 0 0 1 14 0",
  logout: "M14 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2v-2m-4-4h10m0 0-3-3m3 3-3 3",
  login: "M10 8V6a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-6a2 2 0 0 1-2-2v-2m4-4H4m0 0 3-3m-3 3 3 3",
  arrowRight: "M5 12h14m0 0-5-5m5 5-5 5",
  arrowUpRight: "M7 17 17 7m0 0H9m8 0v8",
  chevronRight: "m9 6 6 6-6 6",
  chevronDown: "m6 9 6 6 6-6",
  check: "m5 12 4.5 4.5L19 7",
  checkCircle: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm-3.5-9 2.5 2.5 4.5-5",
  plus: "M12 5v14M5 12h14",
  lock: "M7 10V8a5 5 0 0 1 10 0v2m-11 0h12a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1v-8a1 1 0 0 1 1-1Zm6 4v2",
  mailOpen: "M3 10.5 12 4l9 6.5V19a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-8.5Zm0 0 9 6 9-6",
  clock: "M12 7v5l3 2m6-2a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z",
  download: "M12 4v11m0 0-4-4m4 4 4-4M5 19h14",
  external: "M14 5h5v5m0-5-9 9M19 14v4a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h4",
  flash: "M13 3 5 13.5h6L11 21l8-10.5h-6L13 3Z",
  shield: "M12 3 5 6v5c0 4.5 3 8.5 7 10 4-1.5 7-5.5 7-10V6l-7-3Zm-3 9 2 2 4-4",
  card: "M3 8a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8Zm0 3h18M7 15h3",
  alert: "M12 8v5m0 3h.01M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z",
  eye: "M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Zm9.5 2.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z",
  cap: "M3 8.5 12 4l9 4.5-9 4.5L3 8.5Zm3.5 2.5v5c0 1.6 2.5 3 5.5 3s5.5-1.4 5.5-3v-5",
  sun: "M12 3v1.5M12 19.5V21M4.2 4.2l1.1 1.1M18.7 18.7l1.1 1.1M3 12h1.5M19.5 12H21M4.2 19.8l1.1-1.1M18.7 5.3l1.1-1.1M12 16.5a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9Z",
  moon: "M20.985 12.486a9 9 0 1 1-9.473-9.472c.405-.022.617.46.402.803a6 6 0 0 0 8.268 8.268c.344-.215.825-.004.803.401",
  cart: "M3 4h2l2.2 10.2a2 2 0 0 0 2 1.6h7.6a2 2 0 0 0 2-1.5L20.5 8H6.2M10 20h.01M17 20h.01",
  trash: "M4 7h16M10 11v6m4-6v6M5.5 7l.9 11.2a2 2 0 0 0 2 1.8h7.2a2 2 0 0 0 2-1.8L18.5 7M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2",
  help: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm-2.5-10.5A2.5 2.5 0 1 1 12 13v1m0 3h.01",
};

export type IconName = keyof typeof paths;

export function Icon({
  name,
  size = 18,
  strokeWidth = 1.8,
  ...rest
}: { name: IconName; size?: number; strokeWidth?: number } & SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="shrink-0"
      {...rest}
    >
      <path d={paths[name]} />
    </svg>
  );
}
