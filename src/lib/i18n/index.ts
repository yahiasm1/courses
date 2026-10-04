import { ar } from "./ar";
import { en, type Dict } from "./en";

export type Locale = "en" | "ar";
export type { Dict };

export const LOCALES: Locale[] = ["en", "ar"];
export const DEFAULT_LOCALE: Locale = "en";
export const LOCALE_COOKIE = "lang";

export const dictionaries: Record<Locale, Dict> = { en, ar };

export function isLocale(v: unknown): v is Locale {
  return v === "en" || v === "ar";
}

/** "2,500 DA" / "2,500 دج" (Latin digits, as used in Algeria). */
export function formatPrice(price: number, locale: Locale = "en") {
  return `${new Intl.NumberFormat("en-US").format(Number(price))} ${dictionaries[locale].currency}`;
}

/** Dates like 04/10/2026 in both languages. */
export function formatDate(date: string | Date, locale: Locale = "en") {
  return new Date(date).toLocaleDateString(locale === "ar" ? "ar-DZ-u-nu-latn" : "en-GB");
}
