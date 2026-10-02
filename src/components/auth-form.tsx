"use client";

import Link from "next/link";
import { useActionState } from "react";
import { login, signup, type AuthState } from "@/app/actions/auth";
import { Icon } from "@/components/icons";
import { SubmitButton } from "@/components/submit-button";

export function AuthForm({ mode, next }: { mode: "login" | "signup"; next?: string }) {
  const [state, action] = useActionState<AuthState, FormData>(
    mode === "login" ? login : signup,
    undefined,
  );
  const isSignup = mode === "signup";
  const nextQuery = next ? `?next=${encodeURIComponent(next)}` : "";

  return (
    <div className={`authcard ${isSignup ? "max-w-[460px]" : ""}`}>
      <h1 className="mb-1.5 text-[26px] font-bold tracking-[-.025em]">
        {isSignup ? "Create your account" : "Welcome back"}
      </h1>
      <p className="mb-6 text-[15px] text-muted">
        {isSignup ? "Sign up to buy and download courses." : "Sign in to access your courses."}
      </p>

      <form action={action} className="flex flex-col gap-3.5">
        <input type="hidden" name="next" value={next ?? "/"} />
        {isSignup && (
          <>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="label" htmlFor="first_name">
                  First name
                </label>
                <input id="first_name" name="first_name" required className="input" />
              </div>
              <div>
                <label className="label" htmlFor="last_name">
                  Last name
                </label>
                <input id="last_name" name="last_name" required className="input" />
              </div>
            </div>
            <div>
              <label className="label" htmlFor="phone">
                Phone
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                placeholder="0555 12 34 56"
                required
                className="input"
              />
            </div>
          </>
        )}
        <div>
          <label className="label" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            placeholder="you@email.com"
            required
            autoComplete="email"
            className="input"
          />
        </div>
        <div>
          <label className="label" htmlFor="password">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            placeholder={isSignup ? "At least 6 characters" : "••••••••"}
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

        <SubmitButton>{isSignup ? "Create account" : "Sign in"}</SubmitButton>
      </form>

      <p className="mt-[22px] text-center text-[14px] text-muted">
        {isSignup ? "Already have an account? " : "New here? "}
        <Link href={`${isSignup ? "/login" : "/signup"}${nextQuery}`} className="link">
          {isSignup ? "Sign in" : "Create an account"}
        </Link>
      </p>
      <p className="mt-3.5 flex items-center justify-center gap-1.5 font-mono text-[11px] text-faint">
        <Icon name="lock" size={12} />
        Secure checkout · CIB · Edahabia
      </p>
    </div>
  );
}
