# Courses store

A simple storefront for selling your courses — a warm off-white desk with a white app shell, a violet accent and Inter Tight type.

- **Landing page = course list**, filterable by category, plus a category grid
- **Sign up / Sign in** (Supabase Auth, email + password)
- **Course page** — name, description, price, link to the external sales page, Buy button
- **SlickPay checkout** (CIB / Edahabia) → the course appears in **My courses** with its download link
- Download links are **never sent to the browser** unless the user has paid

Stack: Next.js 15 (App Router) · Tailwind CSS 4 · Supabase · SlickPay Invoices API.

## 1. Supabase

1. Create a project at [supabase.com](https://supabase.com).
2. Open **SQL Editor** and run [`supabase/schema.sql`](supabase/schema.sql). It creates:

| Table | Columns |
| --- | --- |
| `categories` | `id`, `name`, `slug`, `image_url`, `sort_order` |
| `courses` | `id`, `name`, `slug`, `description`, `image_url`, `price` (DA), `sales_page_url`, `download_url`, `category_id`, `is_featured`, `is_published` |
| `profiles` | `id`, `first_name`, `last_name`, `phone` (filled at sign-up) |
| `purchases` | `id`, `user_id`, `course_id`, `amount`, `status` (`pending`/`paid`/`failed`), `slickpay_invoice_id`, `paid_at` |

   It also enables Row Level Security and hides the `download_url` column from public roles.
3. **Authentication → URL Configuration**: set *Site URL* to your domain and add
   `https://your-domain.com/auth/callback` to *Redirect URLs*.

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

Deploy to Vercel (or any Node host) with the same environment variables, and set
`NEXT_PUBLIC_SITE_URL` to your public URL so SlickPay can reach the webhook.

## Customize

- Brand name, tagline, contact email: `src/lib/site.ts`
- Colours, radii and shadows: design tokens at the top of `src/app/globals.css` (component classes such as `.card`, `.btn-primary`, `.pill` live further down)
