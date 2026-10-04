"use client";

import Link from "next/link";
import { useActionState } from "react";
import { login, signup, type AuthState } from "@/app/actions/auth";
import { Icon } from "@/components/icons";
import { SubmitButton } from "@/components/submit-button";
import { useI18n } from "@/components/i18n-provider";

export function AuthForm({
  mode,
  next,
  confirmed = false,
}: {
  mode: "login" | "signup";
  next?: string;
  /** Arrived from an email-confirmation link that couldn't sign them in directly. */
  confirmed?: boolean;
}) {
  const [state, action] = useActionState<AuthState, FormData>(
    mode === "login" ? login : signup,
    undefined,
  );
  const isSignup = mode === "signup";
  const { t } = useI18n();
  const a = t.auth;
  const nextQuery = next ? `?next=${encodeURIComponent(next)}` : "";

  return (
    <div className={`authcard ${isSignup ? "max-w-[460px]" : ""}`}>
      <h1 className="h2 display mb-1.5">
        {isSignup ? a.createTitle : a.welcomeBack}
      </h1>
      <p className="mb-6 text-[15px] text-muted">
        {isSignup ? a.createText : a.signInText}
      </p>

      {confirmed && !state && (
        <div className="notice notice-green mb-4">
          <Icon name="checkCircle" size={18} className="shrink-0" />
          <span>{a.emailConfirmed}</span>
        </div>
      )}

      <form action={action} className="flex flex-col gap-3.5">
        <input type="hidden" name="next" value={next ?? "/"} />
        {isSignup && (
          <>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="label" htmlFor="first_name">
                  {a.firstName}
                </label>
                <input id="first_name" name="first_name" required className="input" />
              </div>
              <div>
                <label className="label" htmlFor="last_name">
                  {a.lastName}
                </label>
                <input id="last_name" name="last_name" required className="input" />
              </div>
            </div>
            <div>
              <label className="label" htmlFor="phone">
                {a.phone}
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                placeholder="0555 12 34 56"
                dir="ltr"
                required
                className="input"
              />
            </div>
          </>
        )}
        <div>
          <label className="label" htmlFor="email">
            {a.email}
          </label>
          <input
            id="email"
            name="email"
            type="email"
            placeholder="you@email.com"
            dir="ltr"
            required
            autoComplete="email"
            className="input"
          />
        </div>
        <div>
          <label className="label" htmlFor="password">
            {a.password}
          </label>
          <input
            id="password"
            name="password"
            type="password"
            placeholder={isSignup ? a.passwordHint : "••••••••"}
            required
            minLength={6}
            autoComplete={isSignup ? "new-password" : "current-password"}
            className="input"
          />
        </div>

        {state?.error && (
          <div className="notice notice-red">
            <Icon name="alert" size={18} className="shrink-0 text-red-ink" />
            <span>{state.error}</span>
          </div>
        )}
        {state?.message && (
          <div className="notice notice-green">
            <Icon name="checkCircle" size={18} className="shrink-0" />
            <span>{state.message}</span>
          </div>
        )}

        <SubmitButton>{isSignup ? a.createAccount : a.signIn}</SubmitButton>
      </form>

      <p className="mt-[22px] text-center text-[14px] text-muted">
        {isSignup ? a.haveAccount : a.newHere}
        <Link href={`${isSignup ? "/login" : "/signup"}${nextQuery}`} className="link">
          {isSignup ? a.signIn : a.createLink}
        </Link>
      </p>
      <p className="mt-3.5 flex items-center justify-center gap-1.5 font-mono text-[11px] text-faint">
        <Icon name="lock" size={12} />
        {a.secure}
      </p>
    </div>
  );
}
