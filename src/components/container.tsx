/** Page-width container used by every page under the header. */
export function Container({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`mx-auto w-full max-w-[1360px] px-4 py-6 sm:px-6 md:py-8 lg:px-10 ${className}`}>
      {children}
    </div>
  );
}
