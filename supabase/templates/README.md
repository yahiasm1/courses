# Auth email templates

Paste each file into **Supabase → Authentication → Emails → Templates**.

| Template in Supabase | File | Subject |
|---|---|---|
| Confirm sign up | `confirm-signup.html` | Confirm your email |
| Change email address | `change-email.html` | Confirm your new email address |
| Reset password | `reset-password.html` | Reset your password |

They use Supabase's template variables (`{{ .ConfirmationURL }}`, `{{ .Email }}`,
`{{ .NewEmail }}`, `{{ .SiteURL }}`). Replace "Courses" with your brand name if
you change `SITE_NAME` in `src/lib/site.ts`.
