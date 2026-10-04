import { Icon, type IconName } from "@/components/icons";
import { getDict } from "@/lib/i18n/server";

const icons: IconName[] = ["flash", "shield", "book", "help"];

export async function TrustStrip() {
  const { t } = await getDict();
  const items = t.trust.map((item, i) => ({ ...item, icon: icons[i] }));
  return (
    <section className="card">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((i, idx) => (
          <div
            key={i.icon}
            className={`flex gap-3 p-[18px] ${
              idx < items.length - 1 ? "border-b border-line-3 lg:border-b-0 lg:border-e" : ""
            } ${idx === 0 ? "sm:border-e" : ""} ${idx === 2 ? "sm:border-e" : ""}`}
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
