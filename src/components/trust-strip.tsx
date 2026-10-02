const items = [
  { title: "Instant access", text: "Your download link appears right after payment." },
  { title: "Secure payment", text: "Pay with CIB or Edahabia through SlickPay." },
  { title: "Lifetime access", text: "Every purchase stays in My courses." },
  { title: "Support", text: "Questions? Reach out anytime." },
];

export function TrustStrip() {
  return (
    <section className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
      {items.map((i) => (
        <div key={i.title} className="rounded-2xl border border-line bg-surface p-5">
          <div className="mb-3 grid size-9 place-items-center rounded-lg bg-accent/15 text-accent">
            <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2.2">
              <path d="m5 12 4.5 4.5L19 7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <h3 className="font-semibold">{i.title}</h3>
          <p className="mt-1 text-sm text-muted">{i.text}</p>
        </div>
      ))}
    </section>
  );
}
