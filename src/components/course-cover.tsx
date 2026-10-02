import type { Course } from "@/lib/types";

/* Placeholder tones from the design's avatar palette. */
const tones = [
  "linear-gradient(150deg,#a78bfa,#6d3bf0)",
  "linear-gradient(150deg,#2e90fa,#175cd3)",
  "linear-gradient(150deg,#f472b6,#be185d)",
  "linear-gradient(150deg,#17b26a,#079455)",
  "linear-gradient(150deg,#4a4a44,#17170f)",
];

/**
 * Course image, or a coloured placeholder with the course initial.
 *
 * `fit="contain"` (default) always shows the whole image, whatever its shape:
 * the picture sits centred on a blurred, zoomed copy of itself, so a wide
 * banner or a square thumbnail both fill the frame without being cropped.
 * `fit="cover"` crops to fill, for tiny thumbnails where detail doesn't matter.
 */
export function CourseCover({
  course,
  className = "",
  fit = "contain",
}: {
  course: Pick<Course, "name" | "image_url">;
  className?: string;
  fit?: "contain" | "cover";
}) {
  if (course.image_url) {
    if (fit === "cover") {
      return (
        <img
          src={course.image_url}
          alt={course.name}
          loading="lazy"
          decoding="async"
          className={`size-full object-cover ${className}`}
        />
      );
    }
    return (
      <div className={`relative size-full overflow-hidden bg-[var(--surface-raised)] ${className}`}>
        <img
          src={course.image_url}
          alt=""
          aria-hidden="true"
          loading="lazy"
          decoding="async"
          className="absolute inset-0 size-full scale-125 object-cover opacity-60 blur-2xl"
        />
        <img
          src={course.image_url}
          alt={course.name}
          loading="lazy"
          decoding="async"
          className="relative size-full object-contain"
        />
      </div>
    );
  }
  const tone = tones[course.name.length % tones.length];
  return (
    <div className={`grid size-full place-items-center ${className}`} style={{ background: tone }}>
      <span className="text-5xl font-bold tracking-[-.03em] text-white/90">{course.name.charAt(0)}</span>
    </div>
  );
}
