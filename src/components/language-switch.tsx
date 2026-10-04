import { setLocale } from "@/app/actions/locale";
import { getDict } from "@/lib/i18n/server";

/** Toggles between English and Arabic (saved in a cookie). */
export async function LanguageSwitch({ className = "" }: { className?: string }) {
  const { locale, t } = await getDict();
  return (
    <form action={setLocale} className={className}>
      <input type="hidden" name="locale" value={locale === "ar" ? "en" : "ar"} />
      <button
        type="submit"
        lang={locale === "ar" ? "en" : "ar"}
        aria-label={t.switchLabel}
        title={t.switchLabel}
        className="hdr-link shell-focus px-2 text-[0.8rem] font-semibold sm:px-2.5"
      >
        <span className="sm:hidden">{t.switchShort}</span>
        <span className="hidden sm:inline">{t.switchTo}</span>
      </button>
    </form>
  );
}
