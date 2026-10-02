import Link from "next/link";
import { formatPrice, type Course } from "@/lib/types";
import { CourseCover } from "@/components/course-cover";

export function CourseCard({ course }: { course: Course }) {
  return (
    <Link
      href={`/courses/${course.slug}`}
      className="card card-hover group flex flex-col"
    >
      <div className="relative aspect-[4/3] overflow-hidden border-b border-line-3">
        <CourseCover course={course} className="transition duration-300 group-hover:scale-[1.03]" />
        {course.is_featured && (
          <span className="tag tag-amber absolute left-3 top-3 backdrop-blur">
            Featured
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-1.5 p-3.5 sm:p-4">
        {course.category && <span className="eyebrow truncate">{course.category.name}</span>}
        <h3 className="line-clamp-2 text-[15px] font-semibold leading-snug tracking-[-.01em]">
          {course.name}
        </h3>
      </div>
      <div className="card-foot flex items-center justify-between gap-2 !px-3.5 sm:!px-4">
        <span className="price-sm display whitespace-nowrap">
          {formatPrice(course.price)}
        </span>
        <span className="tag tag-green hidden sm:inline-flex">Instant access</span>
      </div>
    </Link>
  );
}

export function CourseGrid({ courses }: { courses: Course[] }) {
  if (courses.length === 0) {
    return (
      <div className="rounded-[16px] border border-dashed border-line bg-surface p-12 text-center text-[14.5px] text-muted">
        No courses here yet.
      </div>
    );
  }
  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 xl:grid-cols-4">
      {courses.map((c) => (
        <CourseCard key={c.id} course={c} />
      ))}
    </div>
  );
}
