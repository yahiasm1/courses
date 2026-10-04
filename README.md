# Courses DZ

Storefront for [coursesdz.com](https://coursesdz.com): a dark-first theme (light when the system prefers it) with a violet accent, Rubik and Alexandria type.

- **Landing page** — niche hero carousel, popular niches, then every course with pagination
- **All courses** (`/shop`) — search, filter by niche and price range, sort, pagination
- **Sign up / Sign in** (Supabase Auth, email + password)
- **Course page** — name, description, price, link to the external sales page, Buy now and Add to cart
- **Cart** (`/cart`) — several courses in one SlickPay payment, with promo codes (`WELCOME10`: 10% off the first order; codes live in `src/lib/promo.ts`)
- **SlickPay checkout** (CIB / Edahabia) → the courses appear in **My courses** with their download links
- **Emails** via Resend — welcome email with the promo code, purchase receipt, new-sale notice
- Download links are **never sent to the browser** unless the user has paid

Stack: Next.js 15 (App Router) · Tailwind CSS 4 · Supabase · SlickPay Invoices API.

## 1. Supabase

1. Create a project at [supabase.com](https://supabase.com).
2. Open **SQL Editor** and run [`supabase/schema.sql`](supabase/schema.sql) (structure and security only;
   [`supabase/seed.sql`](supabase/seed.sql) holds demo courses for a test database — never run it on production). It creates:

| Table | Columns |
| --- | --- |
| `categories` | `id`, `name`, `slug`, `image_url`, `sort_order` |
| `courses` | `id`, `name`, `slug`, `description`, `image_url`, `price` (DA), `sales_page_url`, `download_url`, `category_id`, `is_featured`, `is_published` |
| `profiles` | `id`, `first_name`, `last_name`, `phone` (filled at sign-up) |
| `purchases` | `id`, `user_id`, `course_id`, `amount`, `status` (`pending`/`paid`/`failed`), `slickpay_invoice_id`, `paid_at` |

   It also enables Row Level Security and hides the `download_url` column from public roles.
3. **Authentication → URL Configuration**: set *Site URL* to `https://coursesdz.com` and add
   `https://coursesdz.com/auth/callback` to *Redirect URLs*.

Add and edit courses/categories directly in the Supabase **Table Editor**.

## 2. SlickPay

Get your API key from your SlickPay dashboard ([docs](https://developers.slick-pay.com/authentication)).
Use the sandbox URL while testing, then switch `SLICKPAY_BASE_URL` to `https://prodapi.slick-pay.com/api/v2`.

How a purchase works:

1. User clicks **Buy** → a `pending` purchase is created and a SlickPay invoice is opened.
2. User pays on SlickPay and is sent back to `/checkout/return`.
3. The return page **and** the webhook (`/api/slickpay/webhook`) ask SlickPay whether the invoice
   is completed and, if so, mark the purchase `paid`. The webhook body is never trusted on its own.
4. `/api/download/[courseId]` checks the purchase and redirects to the course's `download_url`.

## 3. Run it

```bash
cp .env.example .env.local   # fill in the values
npm install
npm run dev                  # http://localhost:3000
```

Deploy to Vercel (or any Node host) with the same environment variables. The site lives at
`https://coursesdz.com` (`SITE_URL` in `src/lib/site.ts`, overridable with `NEXT_PUBLIC_SITE_URL`).

## Customize

- Brand name, tagline, contact email, site URL, Telegram link: `src/lib/site.ts`
- Promo codes: `src/lib/promo.ts`
- Emails: `src/lib/welcome-email.ts`, `src/lib/purchase-emails.ts`; Supabase auth emails: paste [`supabase/templates`](supabase/templates)
- Colours, radii and shadows: design tokens at the top of `src/app/globals.css` (component classes such as `.card`, `.btn-primary`, `.pill` live further down)

## Launch checklist

- **Vercel → Environment Variables** (Production): `SLICKPAY_BASE_URL=https://prodapi.slick-pay.com/api/v2`
  and your live `SLICKPAY_API_KEY` (production refuses to start payments without `SLICKPAY_BASE_URL`);
  a long random `SLICKPAY_WEBHOOK_SECRET`; `NEXT_PUBLIC_SITE_URL=https://coursesdz.com`;
  `RESEND_API_KEY`, `EMAIL_FROM`, `NOTIFY_EMAIL`.
- **Vercel → Domains**: `coursesdz.com` primary; `www` and `*.vercel.app` redirect to it.
- **Supabase → Auth → URL Configuration**: Site URL `https://coursesdz.com`; Redirect URLs only
  `https://coursesdz.com/auth/callback`. Paste the templates from `supabase/templates`.
- **Resend**: verify the `coursesdz.com` domain.
- Set real prices (0 DA courses can't be bought) and run `supabase/categorize_courses.sql` once
  (it targets this project's course and category ids).
- Place a real order end-to-end and check the receipt email and My courses.
