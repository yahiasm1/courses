"use server";

import { redirect } from "next/navigation";
import { siteOrigin } from "@/lib/site-origin";
import { getDict } from "@/lib/i18n/server";
import { createClient } from "@/lib/supabase/server";
import { sendWelcomeEmailOnce } from "@/lib/welcome-email";

function safeNext(value: FormDataEntryValue | null) {
  const next = String(value ?? "/");
  // Same-site paths only: reject "//host", "/\\host" and control characters.
  return /^\/(?![\/\\])[^\\\s]*$/.test(next) ? next : "/";
}

export type AuthState = { error?: string; message?: string } | undefined;

/** Supabase auth errors in the visitor's language (Supabase only speaks English). */
async function authError(error: { message: string; code?: string; status?: number }) {
  const e = (await getDict()).t.auth.errors;
  const m = `${error.code ?? ""} ${error.message}`.toLowerCase();
  if (m.includes("invalid login") || m.includes("invalid_credentials")) return e.invalidCredentials;
  if (m.includes("not confirmed") || m.includes("email_not_confirmed")) return e.emailNotConfirmed;
  if (m.includes("already registered") || m.includes("user_already_exists") || m.includes("already been registered"))
    return e.alreadyRegistered;
  if (m.includes("password") && (m.includes("6") || m.includes("weak"))) return e.weakPassword;
  if (error.status === 429 || m.includes("rate limit") || m.includes("too many")) return e.rateLimit;
  return e.generic;
}

export async function login(_: AuthState, formData: FormData): Promise<AuthState> {
  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({
    email: String(formData.get("email")),
    password: String(formData.get("password")),
  });
  if (error) return { error: await authError(error) };
  redirect(safeNext(formData.get("next")));
}

export async function signup(_: AuthState, formData: FormData): Promise<AuthState> {
  const supabase = await createClient();
  const site = await siteOrigin();
  const next = safeNext(formData.get("next"));

  const { data, error } = await supabase.auth.signUp({
    email: String(formData.get("email")),
    password: String(formData.get("password")),
    options: {
      emailRedirectTo: `${site}/auth/callback?next=${encodeURIComponent(next)}`,
      data: {
        first_name: String(formData.get("first_name") ?? ""),
        last_name: String(formData.get("last_name") ?? ""),
        phone: String(formData.get("phone") ?? ""),
        locale: (await getDict()).locale,
      },
    },
  });
  if (error) return { error: await authError(error) };

  // Email confirmation enabled → no session yet.
  if (!data.session) {
    return { message: (await getDict()).t.auth.checkInbox };
  }
  // Email confirmation disabled → the account is live now.
  await sendWelcomeEmailOnce(data.user);
  redirect(next);
}

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
}
