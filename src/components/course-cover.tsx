import type { Course } from "@/lib/types";

const gradients = [
  "from-violet-500 to-indigo-600",
  "from-emerald-500 to-teal-600",
  "from-orange-500 to-rose-600",
  "from-sky-500 to-blue-600",
  "from-fuchsia-500 to-purple-600",
];

/** Course image, or a coloured placeholder with the course initial. */
export function CourseCover({
  course,
  className = "",
}: {
  course: Pick<Course, "name" | "image_url">;
  className?: string;
}) {
  if (course.image_url) {
    return (
      <img src={course.image_url} alt={course.name} className={`size-full object-cover ${className}`} />
    );
  }
  const g = gradients[course.name.length % gradients.length];
  return (
    <div className={`grid size-full place-items-center bg-gradient-to-br ${g} ${className}`}>
      <span className="text-5xl font-bold text-white/90">{course.name.charAt(0)}</span>
    </div>
  );
}
