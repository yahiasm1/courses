import type { Metadata } from "next";
import { Rubik } from "next/font/google";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { MobileNav } from "@/components/mobile-nav";
import { SITE_NAME } from "@/lib/site";
import "./globals.css";

const rubik = Rubik({ variable: "--font-rubik", subsets: ["latin", "arabic"] });

export const metadata: Metadata = {
  title: { default: `${SITE_NAME} — Online courses`, template: `%s · ${SITE_NAME}` },
  description: "Browse all courses, pay securely with CIB or Edahabia, download instantly.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${rubik.variable} font-sans antialiased`}>
        <Header />
        <main className="mx-auto min-h-[70vh] w-full max-w-7xl px-4 pb-24 sm:px-6 md:pb-12">
          {children}
        </main>
        <Footer />
        <MobileNav />
      </body>
    </html>
  );
}
