"use client";

import { useFormStatus } from "react-dom";

export function SubmitButton({
  children,
  pendingLabel = "Please wait…",
}: {
  children: React.ReactNode;
  pendingLabel?: string;
}) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full rounded-xl bg-accent px-5 py-3.5 font-semibold text-accent-ink transition hover:brightness-95 disabled:opacity-60"
    >
      {pending ? pendingLabel : children}
    </button>
  );
}
