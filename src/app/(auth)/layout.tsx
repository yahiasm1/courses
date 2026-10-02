import { AuthTabs } from "@/components/auth-tabs";
import { Logo } from "@/components/logo";

/** Full-page layout for sign in / sign up / checkout return. */
export default function AuthLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="authwrap">
      <div className="mb-7 flex w-full max-w-[1060px] items-center justify-between gap-4">
        <Logo size={32} />
        <AuthTabs />
      </div>
      {children}
    </div>
  );
}
