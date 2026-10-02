import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { CourseCover } from "@/components/course-cover";

export const metadata: Metadata = { title: "My courses" };
export const dynamic = "force-dynamic";

type Row = {
  id: string;
  paid_at: string | null;
  course: { id: string; name: string; slug: string; image_url: string | null } | null;
};

export default async function LibraryPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/library");

  const { data } = await supabase
    .from("purchases")
    .select("id, paid_at, course:courses(id, name, slug, image_url)")
    .eq("user_id", user.id)
    .eq("status", "paid")
    .order("paid_at", { ascending: false });
  const rows = ((data ?? []) as unknown as Row[]).filter((r) => r.course);

  return (
    <div className="pt-6 sm:pt-8">
      <h1 className="text-3xl font-bold tracking-tight">My courses</h1>
      <p className="mb-6 mt-1 text-muted">{user.email}</p>

      {rows.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-line bg-surface p-12 text-center">
          <p className="text-muted">You haven&apos;t bought any course yet.</p>
          <Link
            href="/"
            className="mt-4 inline-block rounded-xl bg-accent px-5 py-2.5 font-semibold text-accent-ink"
          >
            Browse courses
          </Link>
        </div>
      ) : (
        <ul className="grid gap-3 sm:grid-cols-2">
          {rows.map(({ id, paid_at, course }) => (
            <li key={id} className="flex items-center gap-4 rounded-2xl border border-line bg-surface p-3">
              <Link href={`/courses/${course!.slug}`} className="size-20 shrink-0 overflow-hidden rounded-xl">
                <CourseCover course={course!} />
              </Link>
              <div className="min-w-0 flex-1">
                <Link href={`/courses/${course!.slug}`} className="line-clamp-2 font-semibold hover:underline">
                  {course!.name}
                </Link>
                {paid_at && (
                  <p className="text-xs text-muted">
                    Purchased {new Date(paid_at).toLocaleDateString("en-GB")}
                  </p>
                )}
              </div>
              <a
                href={`/api/download/${course!.id}`}
                className="shrink-0 rounded-xl bg-accent px-4 py-2 text-sm font-semibold text-accent-ink hover:brightness-95"
              >
                Download
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
