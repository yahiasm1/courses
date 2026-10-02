import { NextResponse, type NextRequest } from "next/server";
import { createAdminClient, createClient } from "@/lib/supabase/server";
import { hasPurchased } from "@/lib/purchases";

/** Redirects a buyer to the course download link. Everyone else is refused. */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ courseId: string }> },
) {
  const { courseId } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.redirect(new URL("/login?next=/library", request.url));
  }
  if (!(await hasPurchased(user.id, courseId))) {
    return NextResponse.json({ error: "You haven't purchased this course." }, { status: 403 });
  }

  const { data: course } = await createAdminClient()
    .from("courses")
    .select("download_url")
    .eq("id", courseId)
    .maybeSingle();
  if (!course?.download_url) {
    return NextResponse.json({ error: "Download not available yet." }, { status: 404 });
  }
  return NextResponse.redirect(course.download_url);
}
