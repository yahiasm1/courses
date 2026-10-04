import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { sendWelcomeEmailOnce } from "@/lib/welcome-email";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = request.nextUrl;
  const code = searchParams.get("code");
  const nextParam = searchParams.get("next") ?? "/";
  const next = nextParam.startsWith("/") && !nextParam.startsWith("//") ? nextParam : "/";

  if (code) {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);
    if (error) {
      // The email is already confirmed by Supabase at this point; the code just can't be
      // used here (e.g. link opened in another browser or device). Ask them to sign in.
      console.warn("[auth/callback] code exchange failed:", error.message);
      return NextResponse.redirect(`${origin}/login?confirmed=1&next=${encodeURIComponent(next)}`);
    }
    // First visit after confirming the sign-up email → send the welcome email.
    await sendWelcomeEmailOnce(data.user);
  }
  return NextResponse.redirect(`${origin}${next}`);
}
