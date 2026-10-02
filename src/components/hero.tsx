import { HeroCarousel, type HeroSlide, type HeroTone } from "@/components/hero-carousel";
import { formatPrice, type Category, type Course } from "@/lib/types";

const tones: HeroTone[] = [
  {
    dot: "#ff3a9e",
    label: "#ff86c4",
    chipBorder: "rgba(255,58,158,.5)",
    chipBg: "rgba(255,58,158,.14)",
    chipText: "#ffa8d3",
    grad: "linear-gradient(140deg,#ff3a9e,#7c5cff)",
    shadow: "rgba(255,58,158,.28)",
    btnText: "#fff",
    aura: "radial-gradient(60% 60% at 50% 45%, rgba(255,58,158,.34) 0%, rgba(124,92,255,.18) 45%, rgba(7,6,13,0) 75%)",
    auraLg:
      "radial-gradient(70% 90% at 72% 45%, rgba(255,58,158,.30) 0%, rgba(124,92,255,.20) 42%, rgba(7,6,13,0) 72%)",
    art: "linear-gradient(150deg,#ff3a9e,#7c5cff)",
  },
  {
    dot: "#3ea6ff",
    label: "#8ec9ff",
    chipBorder: "rgba(62,166,255,.5)",
    chipBg: "rgba(62,166,255,.14)",
    chipText: "#a8d6ff",
    grad: "linear-gradient(140deg,#3ea6ff,#2a4bd8)",
    shadow: "rgba(42,90,216,.34)",
    btnText: "#fff",
    aura: "radial-gradient(60% 60% at 50% 45%, rgba(32,120,255,.36) 0%, rgba(20,60,180,.18) 45%, rgba(7,6,13,0) 75%)",
    auraLg:
      "radial-gradient(70% 90% at 70% 45%, rgba(32,120,255,.34) 0%, rgba(20,60,180,.18) 45%, rgba(7,6,13,0) 74%)",
    art: "linear-gradient(150deg,#3ea6ff,#2a4bd8)",
  },
  {
    dot: "#5ee06a",
    label: "#9df0a5",
    chipBorder: "rgba(94,224,106,.5)",
    chipBg: "rgba(94,224,106,.14)",
    chipText: "#a9f0b0",
    grad: "linear-gradient(140deg,#4ed85c,#10893e)",
    shadow: "rgba(16,137,62,.34)",
    btnText: "#04180a",
    aura: "radial-gradient(60% 60% at 50% 45%, rgba(64,220,90,.30) 0%, rgba(16,137,62,.16) 45%, rgba(7,6,13,0) 75%)",
    auraLg:
      "radial-gradient(70% 90% at 70% 48%, rgba(64,220,90,.26) 0%, rgba(16,137,62,.16) 45%, rgba(7,6,13,0) 74%)",
    art: "linear-gradient(150deg,#4ed85c,#10893e)",
  },
  {
    dot: "#a98bff",
    label: "#c3b0ff",
    chipBorder: "rgba(169,139,255,.5)",
    chipBg: "rgba(169,139,255,.14)",
    chipText: "#cbbcff",
    grad: "linear-gradient(140deg,#a98bff,#5a47fb)",
    shadow: "rgba(90,71,251,.34)",
    btnText: "#fff",
    aura: "radial-gradient(60% 60% at 50% 45%, rgba(140,80,255,.34) 0%, rgba(70,40,190,.18) 45%, rgba(7,6,13,0) 75%)",
    auraLg:
      "radial-gradient(70% 90% at 68% 46%, rgba(140,80,255,.30) 0%, rgba(70,40,190,.18) 45%, rgba(7,6,13,0) 74%)",
    art: "linear-gradient(150deg,#a98bff,#5a47fb)",
  },
];

const MAX_SLIDES = 5;

/** One slide per popular niche (category), ordered by course count. */
export function Hero({ categories, courses }: { categories: Category[]; courses: Course[] }) {
  const byCategory = new Map<string, Course[]>();
  courses.forEach((c) => {
    if (!c.category_id) return;
    byCategory.set(c.category_id, [...(byCategory.get(c.category_id) ?? []), c]);
  });

  const ranked = categories
    .filter((c) => (byCategory.get(c.id)?.length ?? 0) > 0)
    .sort((a, b) => (byCategory.get(b.id)?.length ?? 0) - (byCategory.get(a.id)?.length ?? 0))
    .slice(0, MAX_SLIDES);

  const slides: HeroSlide[] = ranked.map((cat, i) => {
    const list = byCategory.get(cat.id) ?? [];
    const n = list.length;
    const cheapest = Math.min(...list.map((c) => Number(c.price)));
    const featured = list.find((c) => c.is_featured) ?? list[0];
    const chips = list.slice(0, 4).map((c) => c.name);
    return {
      id: cat.id,
      eyebrow: `${cat.name} · ${n} ${n === 1 ? "course" : "courses"}`,
      titleTop: "Master",
      titleBottom: `${cat.name}.`,
      textShort: `${n} ${n === 1 ? "course" : "courses"} from ${formatPrice(cheapest)}. Pay once, download right away.`,
      textLong: `${n} ${n === 1 ? "course" : "courses"} in ${cat.name}, from ${formatPrice(cheapest)}. Pay with CIB or Edahabia and the download link is yours right after checkout.`,
      chips,
      highlightChip: Math.max(0, chips.indexOf(featured.name)),
      cta: `Browse ${cat.name}`,
      href: `/shop?category=${cat.slug}`,
      meta: "Instant download",
      image: cat.image_url,
      initial: cat.name.charAt(0),
      pickerTitle: cat.name,
      pickerSub: `${n} ${n === 1 ? "course" : "courses"}`,
      tone: tones[i % tones.length],
    };
  });

  if (slides.length === 0) {
    const n = courses.length;
    slides.push({
      id: "all",
      eyebrow: "All courses",
      titleTop: "Learn something",
      titleBottom: "new today.",
      textShort: `${n} ${n === 1 ? "course" : "courses"} ready to download after payment.`,
      textLong: `${n} ${n === 1 ? "course" : "courses"} ready to download the moment your payment is confirmed. Pay with CIB or Edahabia.`,
      chips: courses.slice(0, 4).map((c) => c.name),
      highlightChip: 0,
      cta: "Browse all courses",
      href: "/shop",
      meta: "Instant download",
      image: null,
      covers: [
        ...courses.filter((c) => c.is_featured && c.image_url),
        ...courses.filter((c) => !c.is_featured && c.image_url),
      ]
        .slice(0, 3)
        .map((c) => c.image_url as string),
      initial: "C",
      pickerTitle: "All courses",
      pickerSub: `${n} ${n === 1 ? "course" : "courses"}`,
      tone: tones[3],
    });
  }

  return <HeroCarousel slides={slides} />;
}
