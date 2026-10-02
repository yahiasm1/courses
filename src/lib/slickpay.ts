import "server-only";

/**
 * Minimal SlickPay client (Invoices API).
 * Docs: https://developers.slick-pay.com/invoices/create
 */

const BASE_URL = process.env.SLICKPAY_BASE_URL ?? "https://devapi.slick-pay.com/api/v2";

async function slickpay<T>(path: string, init: RequestInit = {}): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${process.env.SLICKPAY_API_KEY}`,
      ...init.headers,
    },
    cache: "no-store",
  });

  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    const message = (body as { message?: string }).message ?? res.statusText;
    throw new Error(`SlickPay ${res.status}: ${message}`);
  }
  return body as T;
}

export type CreateInvoiceInput = {
  amount: number;
  returnUrl: string;
  webhookUrl: string;
  firstname: string;
  lastname: string;
  email: string;
  phone: string;
  address: string;
  itemName: string;
  metadata: Record<string, string>;
};

export async function createInvoice(input: CreateInvoiceInput) {
  const payload: Record<string, unknown> = {
    amount: input.amount,
    url: input.returnUrl,
    firstname: input.firstname,
    lastname: input.lastname,
    email: input.email,
    phone: input.phone,
    address: input.address,
    items: [{ name: input.itemName, price: input.amount, quantity: 1 }],
    webhook_url: input.webhookUrl,
    webhook_signature: process.env.SLICKPAY_WEBHOOK_SECRET,
    webhook_meta_data: input.metadata,
  };
  if (process.env.SLICKPAY_ACCOUNT_UUID) {
    payload.account = process.env.SLICKPAY_ACCOUNT_UUID;
  }

  return slickpay<{ success: number; id: number | string; url: string }>("/users/invoices", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

/** Asks SlickPay directly whether an invoice has been paid. */
export async function isInvoicePaid(invoiceId: string) {
  const res = await slickpay<{ success: number; completed: number }>(
    `/users/invoices/${encodeURIComponent(invoiceId)}`,
  );
  return Number(res.completed) === 1;
}
