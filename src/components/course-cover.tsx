import type { Course } from "@/lib/types";

/* Placeholder tones from the design's avatar palette. */
const tones = [
  "linear-gradient(150deg,#a78bfa,#6d3bf0)",
  "linear-gradient(150deg,#2e90fa,#175cd3)",
  "linear-gradient(150deg,#f472b6,#be185d)",
  "linear-gradient(150deg,#17b26a,#079455)",
  "linear-gradient(150deg,#4a4a44,#17170f)",
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
  const tone = tones[course.name.length % tones.length];
  return (
    <div
      className={`grid size-full place-items-center ${className}`}
      style={{ background: tone }}
    >
      <span className="text-5xl font-bold tracking-[-.03em] text-white/90">
        {course.name.charAt(0)}
      </span>
    </div>
  );
}
