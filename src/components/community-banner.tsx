import { getDict } from "@/lib/i18n/server";
import { TELEGRAM_URL } from "@/lib/site";

/** Telegram channel banner, shown above the site header. */
export async function CommunityBanner() {
  if (!TELEGRAM_URL) return null;
  const { locale, t } = await getDict();
  return (
    <div className="px-3 pt-2 sm:px-6 lg:px-10">
      <div className="whatsapp-banner telegram" lang={locale} dir={t.dir}>
        <div className="whatsapp-banner-content">
          <span className="whatsapp-icon" aria-hidden="true">
            ✈️
          </span>
          <div className="whatsapp-text">
            <strong>{t.banner.title}</strong>
            <span>{t.banner.text}</span>
          </div>
          <a href={TELEGRAM_URL} target="_blank" rel="noopener noreferrer" className="whatsapp-btn">
            {t.banner.cta}
            <span aria-hidden="true">{t.dir === "rtl" ? "←" : "→"}</span>
          </a>
        </div>
      </div>
    </div>
  );
}
