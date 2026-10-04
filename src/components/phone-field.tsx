import { getDict } from "@/lib/i18n/server";

/** Phone input shown in checkout forms when the buyer's profile has no valid number. */
export async function PhoneField() {
  const { t } = await getDict();
  return (
    <div className="flex flex-col gap-1.5 text-start">
      <label htmlFor="checkout-phone" className="text-[13px] font-medium text-muted">
        {t.course.phoneLabel}
      </label>
      <input
        id="checkout-phone"
        name="phone"
        type="tel"
        inputMode="tel"
        autoComplete="tel"
        dir="ltr"
        required
        pattern="[0-9+ .\-]{9,16}"
        placeholder="0555 12 34 56"
        className="input"
      />
      <span className="text-[12px] text-muted">{t.course.phoneHint}</span>
    </div>
  );
}
