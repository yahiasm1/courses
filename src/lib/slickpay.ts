import "server-only";

/**
 * Minimal SlickPay client (Invoices API).
 * Docs: https://developers.slick-pay.com/authentication
 *       https://developers.slick-pay.com/invoices/create
 */

const SANDBOX_URL = "https://devapi.slick-pay.com/api/v2";
/** Public sandbox key published in SlickPay's docs; only valid against the sandbox. */
const SANDBOX_KEY = "54|BZ7F6N4KwSD46GEXToOv3ZBpJpf7WVxnBzK5cOE6";

const BASE_URL = (process.env.SLICKPAY_BASE_URL?.trim() || SANDBOX_URL).replace(/\/+$/, "");
const IS_SANDBOX = BASE_URL.includes("devapi.");

/** The PUBLIC_KEY from the SlickPay dashboard, tolerating quotes or a pasted "Bearer " prefix. */
function apiKey() {
  const key = (process.env.SLICKPAY_API_KEY ?? "")
    .trim()
    .replace(/^["']|["']$/g, "")
    .replace(/^Bearer\s+/i, "");
  if (key && key !== "your-slickpay-api-key") return key;
  if (IS_SANDBOX) return SANDBOX_KEY;
  throw new Error("SlickPay: SLICKPAY_API_KEY is not set (required for the live API).");
}

async function slickpay<T>(path: string, init: RequestInit = {}): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${apiKey()}`,
      ...init.headers,
    },
    cache: "no-store",
    signal: AbortSignal.timeout(20_000),
  });

  const body = (await res.json().catch(() => ({}))) as {
    message?: string;
    errors?: Record<string, string[]>;
  };
  if (!res.ok) {
    let message = body.message ?? res.statusText;
    if (body.errors) message += ` ${JSON.stringify(body.errors)}`;
    if (res.status === 401) {
      message += IS_SANDBOX
        ? " (check SLICKPAY_API_KEY: live keys don't work on the sandbox URL)"
        : " (check SLICKPAY_API_KEY: the sandbox test key doesn't work on the live URL)";
    }
    throw new Error(`SlickPay ${res.status} ${init.method ?? "GET"} ${path}: ${message}`);
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
