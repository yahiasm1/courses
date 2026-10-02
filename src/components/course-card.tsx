import Link from "next/link";
import { formatPrice, type Course } from "@/lib/types";
import { CourseCover } from "@/components/course-cover";

export function CourseCard({ course }: { course: Course }) {
  return (
    <Link
      href={`/courses/${course.slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-line bg-surface transition hover:-translate-y-0.5 hover:shadow-lg"
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <CourseCover course={course} className="transition duration-300 group-hover:scale-105" />
        {course.category && (
          <span className="absolute left-3 top-3 hidden rounded-full sm:inline bg-surface/90 px-2.5 py-1 text-[11px] font-medium text-ink backdrop-blur">
            {course.category.name}
          </span>
        )}
        {course.is_featured && (
          <span className="absolute right-3 top-3 rounded-full bg-accent px-2.5 py-1 text-[11px] font-semibold text-accent-ink">
            Featured
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-2 p-3 sm:p-4">
        <h3 className="line-clamp-2 text-sm font-semibold leading-snug sm:text-base">{course.name}</h3>
        {course.description && (
          <p className="line-clamp-2 hidden text-sm text-muted sm:block">{course.description}</p>
        )}
        <div className="mt-auto flex items-center justify-between pt-2">
          <span className="whitespace-nowrap font-bold sm:text-lg">{formatPrice(course.price)}</span>
          <span className="hidden items-center gap-1 text-xs font-medium text-muted sm:flex">
            <span className="size-1.5 rounded-full bg-accent" /> Instant access
          </span>
        </div>
      </div>
    </Link>
  );
}

export function CourseGrid({ courses }: { courses: Course[] }) {
  if (courses.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-line bg-surface p-12 text-center text-muted">
        No courses here yet.
      </div>
    );
  }
  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 lg:grid-cols-4">
      {courses.map((c) => (
        <CourseCard key={c.id} course={c} />
      ))}
    </div>
  );
}
