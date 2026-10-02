import { TELEGRAM_URL } from "@/lib/site";

/** Telegram group banner, shown above the site header. */
export function CommunityBanner() {
  if (!TELEGRAM_URL) return null;
  return (
    <div className="px-3 pt-2 sm:px-6 lg:px-10">
      <div className="whatsapp-banner telegram" lang="ar" dir="rtl">
        <div className="whatsapp-banner-content">
          <span className="whatsapp-icon" aria-hidden="true">
            ✈️
          </span>
          <div className="whatsapp-text">
            <strong>انضم إلى مجموعتنا على تيليجرام</strong>
            <span>آخر الأخبار، العروض والتحديثات ❤️</span>
          </div>
          <a href={TELEGRAM_URL} target="_blank" rel="noopener noreferrer" className="whatsapp-btn">
            انضم الآن
            <span aria-hidden="true">←</span>
          </a>
        </div>
      </div>
    </div>
  );
}
