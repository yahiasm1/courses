"use client";

import { useFormStatus } from "react-dom";

export function SubmitButton({
  children,
  pendingLabel = "Please wait…",
  className = "",
}: {
  children: React.ReactNode;
  pendingLabel?: string;
  className?: string;
}) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className={`btn btn-primary btn-lg w-full ${className}`}>
      {pending ? pendingLabel : children}
    </button>
  );
}
