import { BottomTabBar } from "@/components/bottom-tab-bar";
import { CommunityBanner } from "@/components/community-banner";
import { Footer } from "@/components/footer";
import { SiteHeader } from "@/components/site-header";
import { getUser } from "@/lib/data";

export async function AppShell({ children }: { children: React.ReactNode }) {
  const user = await getUser();

  return (
    <div className="flex min-h-dvh flex-col pb-[calc(var(--tabbar-h)+env(safe-area-inset-bottom,0px))] lg:pb-0">
      <CommunityBanner />
      <SiteHeader />
      <main className="mx-auto w-full max-w-[1360px] flex-1 px-4 py-6 sm:px-6 md:py-8 lg:px-10">
        {children}
      </main>
      <Footer />
      <BottomTabBar signedIn={Boolean(user)} />
    </div>
  );
}
