/**
 * Normalises an Algerian phone number to 0XXXXXXXXX (10 digits, mobiles 05/06/07,
 * or 9-digit landlines 0[2-4]...). Accepts spaces, dots, dashes and +213 / 00213.
 * Returns null when it isn't a plausible number (SlickPay needs a real one).
 */
export function normalizeDzPhone(input: string | null | undefined): string | null {
  let n = (input ?? "").replace(/[\s.\-()]/g, "");
  if (n.startsWith("+213")) n = "0" + n.slice(4);
  else if (n.startsWith("00213")) n = "0" + n.slice(5);
  else if (n.startsWith("213") && n.length === 12) n = "0" + n.slice(3);
  if (/^0[5-7]\d{8}$/.test(n) || /^0[2-4]\d{7}$/.test(n)) return n;
  return null;
}
