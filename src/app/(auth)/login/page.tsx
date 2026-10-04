import type { Metadata } from "next";
import { getDict } from "@/lib/i18n/server";
import { AuthForm } from "@/components/auth-form";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getDict();
  return { title: t.nav.signIn, robots: { index: false } };
}

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; confirmed?: string }>;
}) {
  const { next, confirmed } = await searchParams;
  return <AuthForm mode="login" next={next} confirmed={confirmed === "1"} />;
}
