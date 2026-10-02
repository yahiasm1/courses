"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Icon } from "@/components/icons";

export type HeroTone = {
  dot: string;
  label: string;
  chipBorder: string;
  chipBg: string;
  chipText: string;
  grad: string;
  shadow: string;
  btnText: string;
  aura: string;
  auraLg: string;
  art: string;
};

export type HeroSlide = {
  id: string;
  eyebrow: string;
  titleTop: string;
  titleBottom: string;
  textShort: string;
  textLong: string;
  chips: string[];
  highlightChip: number;
  cta: string;
  href: string;
  meta: string;
  image: string | null;
  /** Course covers fanned out as the art when there is no category image. */
  covers?: string[];
  initial: string;
  pickerTitle: string;
  pickerSub: string;
  tone: HeroTone;
};

const DURATION_MS = 6500;

/** Fan layouts for 1–3 covers; the last cover is drawn on top. */
const COVER_FAN = [
  ["rotate(-4deg)"],
  ["translateX(-24%) rotate(-8deg) scale(.9)", "translateX(20%) rotate(5deg)"],
  ["translateX(-40%) rotate(-10deg) scale(.84)", "translateX(40%) rotate(10deg) scale(.84)", "rotate(-2deg)"],
];

export function HeroCarousel({ slides }: { slides: HeroSlide[] }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const count = slides.length;

  useEffect(() => {
    if (paused || count < 2) return;
    const t = setTimeout(() => setIndex((i) => (i + 1) % count), DURATION_MS);
    return () => clearTimeout(t);
  }, [index, paused, count]);

  if (count === 0) return null;
  const current = slides[index];
  const multi = count > 1;

  return (
    <section
      className="hero-stage relative isolate overflow-hidden border-y border-white/[0.06]"
      aria-roledescription="carousel"
      aria-label="Popular niches"
      data-paused={paused ? "" : undefined}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <div className={`relative ${multi ? "h-[620px] lg:h-[560px]" : "h-[560px] lg:h-[480px]"}`}>
        {slides.map((s, i) => {
          const active = i === index;
          return (
            <div
              key={s.id}
              role="group"
              aria-roledescription="slide"
              aria-label={`${i + 1} of ${count}: ${s.pickerTitle}`}
              aria-hidden={!active}
              className={`absolute inset-0 h-full w-full select-none overflow-hidden transition-opacity duration-700 ${
                active ? "opacity-100" : "pointer-events-none opacity-0"
              }`}
            >
              {/* Auras */}
              <div
                className="hero-aura pointer-events-none absolute -inset-x-16 -top-16 h-[420px] lg:inset-0 lg:h-auto"
                style={{ background: s.tone.aura }}
                aria-hidden
              />
              <div
                className="hero-aura pointer-events-none absolute inset-0 hidden lg:block"
                style={{ background: s.tone.auraLg }}
                aria-hidden
              />

              {/* Art */}
              <div
                className="hero-art-float pointer-events-none absolute start-[-8%] top-[14px] h-[300px] w-[116%] lg:start-auto lg:end-[-2.8%] lg:top-0 lg:h-full lg:w-[62.5%]"
                style={{ "--hero-float": `${8 + (i % 3) * 0.4}s` } as React.CSSProperties}
                aria-hidden
              >
                {s.image ? (
                  <img
                    src={s.image}
                    alt=""
                    className="hero-art absolute inset-0 h-full w-full object-contain"
                  />
                ) : s.covers?.length ? (
                  <div className="hero-art absolute inset-0 flex items-center justify-center">
                    <div className="relative aspect-[4/3] h-[56%]">
                      {s.covers.slice(0, 3).map((src, ci, arr) => (
                        <img
                          key={src}
                          src={src}
                          alt=""
                          className="absolute inset-0 h-full w-full rounded-2xl border border-white/10 object-cover shadow-[0_30px_60px_rgba(0,0,0,.5)]"
                          style={{ transform: COVER_FAN[arr.length - 1][ci] }}
                        />
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="hero-art absolute inset-0 flex items-center justify-center">
                    <div
                      className="flex aspect-square h-[72%] -rotate-6 items-center justify-center rounded-[28%] shadow-[0_40px_80px_rgba(0,0,0,.45)]"
                      style={{ background: s.tone.art }}
                    >
                      <span className="display text-[clamp(6rem,18vw,15rem)] text-white/90">
                        {s.initial}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Scrims */}
              <div
                className="pointer-events-none absolute inset-x-0 bottom-0 top-[250px] lg:inset-0 lg:hidden"
                style={{
                  background:
                    "linear-gradient(180deg, rgba(7,6,13,0) 0%, rgba(7,6,13,.88) 26%, #07060d 46%)",
                }}
                aria-hidden
              />
              <div
                className="pointer-events-none absolute inset-0 hidden lg:block"
                style={{
                  background:
                    "linear-gradient(var(--hero-scrim-angle), #07060d 0%, rgba(7,6,13,.92) 34%, rgba(7,6,13,0) 62%)",
                }}
                aria-hidden
              />

              {/* Copy */}
              <div className="relative mx-auto h-full w-full max-w-[1360px] px-4 sm:px-6 lg:px-10">
                <div
                  className={`flex h-full flex-col justify-end gap-3.5 pb-[88px] lg:max-w-[620px] lg:justify-center lg:gap-5 ${
                    multi ? "lg:pb-24" : "lg:pb-0"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span
                      className="size-1.5 shrink-0 rounded-full lg:size-[7px]"
                      style={{ background: s.tone.dot, boxShadow: `0 0 12px ${s.tone.dot}` }}
                    />
                    <span
                      className="bidi-auto text-[0.66rem] font-semibold uppercase tracking-[0.2em] lg:text-[0.72rem] lg:tracking-[0.22em]"
                      style={{ color: s.tone.label }}
                    >
                      {s.eyebrow}
                    </span>
                  </div>
                  {i === 0 ? (
                    <h1 className="bidi-auto display hero-title m-0 text-pretty font-bold tracking-[-0.025em]">
                      {s.titleTop} <br className="hidden lg:inline" />
                      {s.titleBottom}
                    </h1>
                  ) : (
                    <h2 className="bidi-auto display hero-title m-0 text-pretty font-bold tracking-[-0.025em]">
                      {s.titleTop} <br className="hidden lg:inline" />
                      {s.titleBottom}
                    </h2>
                  )}
                  <p className="bidi-auto m-0 text-[0.88rem] leading-[1.55] text-[var(--hero-fg-soft)] lg:hidden">
                    {s.textShort}
                  </p>
                  <p className="bidi-auto m-0 hidden max-w-[400px] text-base leading-relaxed text-[var(--hero-fg-soft)] lg:block">
                    {s.textLong}
                  </p>
                  {s.chips.length > 0 && (
                    <div className="hidden flex-wrap gap-2 lg:flex">
                      {s.chips.map((c, ci) => (
                        <span
                          key={c}
                          title={c}
                          className={`max-w-[290px] truncate rounded-[5px] border px-[13px] py-[7px] text-[0.78rem] ${
                            ci === s.highlightChip ? "font-semibold" : "font-medium"
                          }`}
                          style={
                            ci === s.highlightChip
                              ? {
                                  borderColor: s.tone.chipBorder,
                                  background: s.tone.chipBg,
                                  color: s.tone.chipText,
                                }
                              : {
                                  borderColor: "rgba(255,255,255,.14)",
                                  background: "rgba(255,255,255,.05)",
                                  color: "inherit",
                                }
                          }
                        >
                          {c}
                        </span>
                      ))}
                    </div>
                  )}
                  <div className="mt-1 flex flex-col items-stretch gap-3 lg:flex-row lg:items-center">
                    <Link
                      href={s.href}
                      className="flex h-[52px] items-center justify-center gap-2 rounded-lg text-[0.92rem] font-medium transition-transform duration-200 hover:scale-[1.015] active:scale-[0.99] lg:h-auto lg:justify-start lg:rounded-md lg:px-6 lg:py-3.5 lg:text-[0.9rem]"
                      style={{
                        background: s.tone.grad,
                        color: s.tone.btnText,
                        boxShadow: `0 14px 34px ${s.tone.shadow}`,
                      }}
                      tabIndex={active ? 0 : -1}
                    >
                      {s.cta}
                      <Icon name="chevronRight" size={15} strokeWidth={2.2} className="rtl:-scale-x-100" />
                    </Link>
                    <span className="hidden items-center gap-2 text-[0.78rem] text-[var(--hero-fg-muted)] lg:flex">
                      <Icon name="flash" size={14} strokeWidth={2} />
                      {s.meta}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Desktop picker + progress */}
      {multi && (
        <div className="pointer-events-none absolute inset-x-0 bottom-7 z-10 mx-auto hidden w-full max-w-[1360px] items-end justify-between px-4 sm:px-6 lg:flex lg:px-10">
          <div className="pointer-events-auto flex flex-wrap items-center gap-2">
            {slides.map((s, i) => (
              <button
                key={s.id}
                type="button"
                aria-current={i === index}
                onClick={() => setIndex(i)}
                className="flex min-w-[112px] cursor-pointer flex-col items-start gap-[3px] rounded-md border px-[13px] py-[9px] text-start transition-colors duration-300"
                style={
                  i === index
                    ? { borderColor: "rgba(124,92,255,.55)", background: "rgba(124,92,255,.16)" }
                    : { borderColor: "rgba(255,255,255,.1)", background: "rgba(255,255,255,.04)" }
                }
              >
                <span className="text-[0.75rem] font-semibold text-white">{s.pickerTitle}</span>
                <span className="text-[0.62rem] text-[var(--hero-fg-muted)]">{s.pickerSub}</span>
              </button>
            ))}
          </div>
          <div className="pointer-events-auto mb-1.5 flex items-center gap-2.5 text-[0.72rem] text-[var(--hero-fg-muted)]">
            <span dir="ltr" className="tabular font-semibold text-[var(--hero-fg)]">
              {String(index + 1).padStart(2, "0")} / {String(count).padStart(2, "0")}
            </span>
            <span className="block h-0.5 w-16 overflow-hidden rounded-sm bg-white/15">
              <span
                key={`${current.id}-${index}`}
                className="hero-progress block h-full w-full rounded-sm bg-[var(--color-brand-500)]"
                style={{ "--hero-duration": `${DURATION_MS}ms` } as React.CSSProperties}
              />
            </span>
          </div>
        </div>
      )}

      {/* Mobile dots */}
      <div className="absolute inset-x-0 bottom-0 z-10 mx-auto flex w-full max-w-[1360px] items-center justify-between px-4 pb-[26px] sm:px-6 lg:hidden lg:px-10">
        <div className="flex items-center gap-1.5">
          {multi &&
            slides.map((s, i) => (
              <button
                key={s.id}
                type="button"
                aria-label={s.pickerTitle}
                aria-current={i === index}
                onClick={() => setIndex(i)}
                className="h-1.5 cursor-pointer rounded-sm p-0 transition-[width,background-color] duration-300"
                style={{
                  width: i === index ? 28 : 10,
                  background: i === index ? "var(--color-brand-500)" : "rgba(255,255,255,.24)",
                }}
              />
            ))}
        </div>
        <span className="flex items-center gap-[7px] text-[0.68rem] text-[var(--hero-fg-muted)]">
          <Icon name="flash" size={12} strokeWidth={2} />
          {current.meta}
        </span>
      </div>
    </section>
  );
}
