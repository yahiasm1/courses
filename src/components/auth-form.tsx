"use client";

import Link from "next/link";
import { useActionState } from "react";
import { login, signup, type AuthState } from "@/app/actions/auth";
import { SubmitButton } from "@/components/submit-button";

const input =
  "w-full rounded-xl border border-line bg-surface px-4 py-3 text-sm outline-none focus:border-accent";

export function AuthForm({ mode, next }: { mode: "login" | "signup"; next?: string }) {
  const [state, action] = useActionState<AuthState, FormData>(
    mode === "login" ? login : signup,
    undefined,
  );
  const isSignup = mode === "signup";
  const nextQuery = next ? `?next=${encodeURIComponent(next)}` : "";

  return (
    <div className="mx-auto max-w-md pt-10 sm:pt-16">
      <div className="rounded-3xl border border-line bg-surface p-6 sm:p-8">
        <h1 className="text-2xl font-bold tracking-tight">
          {isSignup ? "Create your account" : "Welcome back"}
        </h1>
        <p className="mb-6 mt-1 text-sm text-muted">
          {isSignup ? "Sign up to buy and download courses." : "Sign in to access your courses."}
        </p>

        <form action={action} className="space-y-3">
          <input type="hidden" name="next" value={next ?? "/"} />
          {isSignup && (
            <>
              <div className="grid grid-cols-2 gap-3">
                <input name="first_name" placeholder="First name" required className={input} />
                <input name="last_name" placeholder="Last name" required className={input} />
              </div>
              <input name="phone" type="tel" placeholder="Phone (e.g. 0555 12 34 56)" required className={input} />
            </>
          )}
          <input name="email" type="email" placeholder="Email" required autoComplete="email" className={input} />
          <input
            name="password"
            type="password"
            placeholder="Password"
            required
            minLength={6}
            autoComplete={isSignup ? "new-password" : "current-password"}
            className={input}
          />

          {state?.error && (
            <p className="rounded-xl bg-red-50 px-4 py-2.5 text-sm text-red-700">{state.error}</p>
          )}
          {state?.message && (
            <p className="rounded-xl bg-accent/15 px-4 py-2.5 text-sm">{state.message}</p>
          )}

          <SubmitButton>{isSignup ? "Sign up" : "Sign in"}</SubmitButton>
        </form>

        <p className="mt-6 text-center text-sm text-muted">
          {isSignup ? "Already have an account? " : "New here? "}
          <Link
            href={`${isSignup ? "/login" : "/signup"}${nextQuery}`}
            className="font-medium text-ink underline underline-offset-4"
          >
            {isSignup ? "Sign in" : "Create an account"}
          </Link>
        </p>
      </div>
    </div>
  );
}
