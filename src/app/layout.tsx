import type { Metadata } from "next";
import { Alexandria, Geist_Mono, Rubik } from "next/font/google";
import { SITE_NAME, SITE_URL } from "@/lib/site";
import "./globals.css";

const rubik = Rubik({ subsets: ["latin", "arabic"], variable: "--font-rubik" });
const alexandria = Alexandria({ subsets: ["arabic", "latin"], variable: "--font-arabic" });
const geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-geist-mono" });

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: `${SITE_NAME} — Online courses`, template: `%s · ${SITE_NAME}` },
  description: "Browse all courses, pay securely with CIB or Edahabia, download instantly.",
};

/* Applies a remembered theme before first paint so there is no flash. */
const themeScript = `(function(){try{var t=localStorage.getItem("theme");if(t==="light"||t==="dark")document.documentElement.setAttribute("data-theme",t)}catch(e){}})();`;

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${rubik.variable} ${alexandria.variable} ${geistMono.variable}`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
