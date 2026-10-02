import { Icon, type IconName } from "@/components/icons";

const items: { icon: IconName; title: string; text: string }[] = [
  { icon: "flash", title: "Instant access", text: "Your download link appears right after payment." },
  { icon: "shield", title: "Secure payment", text: "Pay with CIB or Edahabia through SlickPay." },
  { icon: "book", title: "Lifetime access", text: "Every purchase stays in My courses." },
  { icon: "help", title: "Support", text: "Questions? Reach out anytime." },
];

export function TrustStrip() {
  return (
    <section className="card">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((i, idx) => (
          <div
            key={i.title}
            className={`flex gap-3 p-[18px] ${
              idx < items.length - 1 ? "border-b border-line-3 lg:border-b-0 lg:border-r" : ""
            } ${idx === 0 ? "sm:border-r" : ""} ${idx === 2 ? "sm:border-r" : ""}`}
          >
            <div className="icon-tile">
              <Icon name={i.icon} size={17} />
            </div>
            <div className="min-w-0">
              <h3 className="text-[14.5px] font-semibold">{i.title}</h3>
              <p className="mt-0.5 text-[13px] leading-[1.5] text-muted">{i.text}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
