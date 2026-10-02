import Link from "next/link";

export default function NotFound() {
  return (
    <div className="pt-20 text-center">
      <h1 className="text-3xl font-bold">Page not found</h1>
      <Link href="/" className="mt-6 inline-block rounded-xl bg-accent px-5 py-2.5 font-semibold text-accent-ink">
        Back to courses
      </Link>
    </div>
  );
}
