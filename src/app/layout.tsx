import type { Metadata } from "next";
import { Alexandria, Geist_Mono, Rubik } from "next/font/google";
import { SITE_NAME } from "@/lib/site";
import "./globals.css";

const rubik = Rubik({ subsets: ["latin", "arabic"], variable: "--font-rubik" });
const alexandria = Alexandria({ subsets: ["arabic", "latin"], variable: "--font-arabic" });
const geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-geist-mono" });

export const metadata: Metadata = {
  title: { default: `${SITE_NAME} — Online courses`, template: `%s · ${SITE_NAME}` },
  description: "Browse all courses, pay securely with CIB or Edahabia, download instantly.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${rubik.variable} ${alexandria.variable} ${geistMono.variable}`}>
      <body className="font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
