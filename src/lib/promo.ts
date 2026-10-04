/** Promo codes. Codes are matched case-insensitively. */
type PromoRule = { percent: number; firstOrderOnly: boolean; label: string };

const PROMOS: Record<string, PromoRule> = {
  WELCOME10: { percent: 10, firstOrderOnly: true, label: "10% off your first order" },
};

export type Promo = PromoRule & { code: string };

export function findPromo(code: string | null | undefined): Promo | null {
  const key = (code ?? "").trim().toUpperCase();
  const rule = PROMOS[key];
  return rule ? { code: key, ...rule } : null;
}

/** Price after the promo, in whole dinars. */
export function discounted(price: number, promo: Promo | null) {
  return promo ? Math.round((Number(price) * (100 - promo.percent)) / 100) : Number(price);
}
