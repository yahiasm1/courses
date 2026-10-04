"use client";

import { useFormStatus } from "react-dom";
import { useI18n } from "@/components/i18n-provider";

export function SubmitButton({
  children,
  pendingLabel,
  className = "",
  variant = "primary",
}: {
  children: React.ReactNode;
  pendingLabel?: string;
  className?: string;
  variant?: "primary" | "secondary";
}) {
  const { pending } = useFormStatus();
  const { t } = useI18n();
  return (
    <button type="submit" disabled={pending} className={`btn btn-${variant} btn-lg w-full ${className}`}>
      {pending ? (pendingLabel ?? t.wait) : children}
    </button>
  );
}
