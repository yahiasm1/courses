import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { createAdminClient, createClient } from "@/lib/supabase/server";
import { Container } from "@/components/container";
import { CourseCover } from "@/components/course-cover";
import { Icon } from "@/components/icons";

export const metadata: Metadata = { title: "My courses", robots: { index: false } };
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

  // Admin client (scoped to this user): courses bought before being unpublished must stay
  // visible, which the public "published courses only" policy would hide.
  const { data, error } = await createAdminClient()
    .from("purchases")
    .select("id, paid_at, course:courses(id, name, slug, image_url)")
    .eq("user_id", user.id)
    .eq("status", "paid")
    .order("paid_at", { ascending: false });
  if (error) throw error;
  // One row per course, even if it was paid twice.
  const seen = new Set<string>();
  const rows = ((data ?? []) as unknown as Row[]).filter(
    (r) => r.course && !seen.has(r.course.id) && seen.add(r.course.id),
  );

  return (
    <Container className="flex flex-col gap-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="h1 display">My courses</h1>
          <p className="mt-1 text-[14.5px] text-muted">
            {rows.length} {rows.length === 1 ? "course" : "courses"} · {user.email}
          </p>
        </div>
        <Link href="/shop" className="btn btn-secondary self-start sm:self-auto">
          <Icon name="bag" size={17} />
          Browse courses
        </Link>
      </div>

      {rows.length === 0 ? (
        <div className="rounded-[16px] border border-dashed border-line bg-surface p-12 text-center">
          <div className="icon-tile icon-tile-lg mx-auto mb-4">
            <Icon name="book" size={24} />
          </div>
          <p className="text-[15px] font-semibold">Nothing here yet</p>
          <p className="mt-1 text-[14px] text-muted">Courses you buy will show up here with their download link.</p>
          <Link href="/" className="btn btn-primary mt-5">
            Browse courses
          </Link>
        </div>
      ) : (
        <section className="card">
          <div className="card-head">
            <span className="eyebrow">Purchased</span>
            <span className="tag tag-green">Lifetime access</span>
          </div>
          <ul>
            {rows.map(({ id, paid_at, course }) => (
              <li
                key={id}
                className="flex items-center gap-3.5 border-b border-line-3 px-4 py-3 last:border-b-0 sm:px-[18px]"
              >
                <Link
                  href={`/courses/${course!.slug}`}
                  className="size-12 shrink-0 overflow-hidden rounded-[10px] border border-line-3"
                >
                  <CourseCover course={course!} fit="cover" />
                </Link>
                <div className="min-w-0 flex-1">
                  <Link
                    href={`/courses/${course!.slug}`}
                    className="line-clamp-1 text-[14.5px] font-medium hover:underline"
                  >
                    {course!.name}
                  </Link>
                  {paid_at && (
                    <span className="mono-chip mt-1">
                      Purchased {new Date(paid_at).toLocaleDateString("en-GB")}
                    </span>
                  )}
                </div>
                <a href={`/api/download/${course!.id}`} className="btn btn-primary btn-sm shrink-0">
                  <Icon name="download" size={16} />
                  <span className="hidden sm:inline">Download</span>
                </a>
              </li>
            ))}
          </ul>
        </section>
      )}
    </Container>
  );
}
