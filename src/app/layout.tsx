import type { Metadata } from "next";
import { Alexandria, Geist_Mono, Rubik } from "next/font/google";
import { I18nProvider } from "@/components/i18n-provider";
import { getDict } from "@/lib/i18n/server";
import { SITE_NAME, SITE_URL } from "@/lib/site";
import "./globals.css";

const rubik = Rubik({ subsets: ["latin", "arabic"], variable: "--font-rubik" });
const alexandria = Alexandria({ subsets: ["arabic", "latin"], variable: "--font-arabic" });
const geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-geist-mono" });

export async function generateMetadata(): Promise<Metadata> {
  const { locale, t } = await getDict();
  return {
    metadataBase: new URL(SITE_URL),
    title: { default: `${SITE_NAME} — ${t.meta.title}`, template: `%s · ${SITE_NAME}` },
    description: t.meta.description,
    openGraph: {
      siteName: SITE_NAME,
      type: "website",
      locale: locale === "ar" ? "ar_DZ" : "en_US",
      images: ["/brand/icon-512.png"],
    },
    twitter: { card: "summary" },
  };
}

/* Applies a remembered theme before first paint so there is no flash. */
const themeScript = `(function(){try{var t=localStorage.getItem("theme");if(t==="light"||t==="dark")document.documentElement.setAttribute("data-theme",t)}catch(e){}})();`;

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const { locale, t } = await getDict();
  return (
    <html
      lang={locale}
      dir={t.dir}
      suppressHydrationWarning
      className={`${rubik.variable} ${alexandria.variable} ${geistMono.variable}`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="font-sans antialiased">
        <I18nProvider locale={locale}>{children}</I18nProvider>
      </body>
    </html>
  );
}
