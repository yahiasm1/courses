"use client";

import Link from "next/link";
import { useState } from "react";
import { Icon } from "@/components/icons";

export type Niche = { id: string; name: string; slug: string; image: string | null; count: number };

const tileTones = [
  "linear-gradient(150deg,#a78bfa,#6d3bf0)",
  "linear-gradient(150deg,#2e90fa,#175cd3)",
  "linear-gradient(150deg,#17b26a,#079455)",
  "linear-gradient(150deg,#4a4a44,#17170f)",
];

const VISIBLE = 8;

export function NicheGrid({ niches }: { niches: Niche[] }) {
  const [expanded, setExpanded] = useState(false);
  const shown = expanded ? niches : niches.slice(0, VISIBLE);
  const hidden = niches.length - VISIBLE;

  return (
    <>
      <div id="niche-grid" className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
        {shown.map((c, i) => (
          <Link
            key={c.id}
            href={`/shop?category=${c.slug}`}
            className="group relative flex aspect-[5/3] flex-col justify-end overflow-hidden rounded-[var(--radius-lg)] border border-[var(--border)] p-3.5 text-white lift"
          >
            {c.image ? (
              <img
                src={c.image}
                alt=""
                loading={i < VISIBLE ? "eager" : "lazy"}
                className="absolute inset-0 size-full object-cover transition duration-300 group-hover:scale-105"
              />
            ) : (
              <div className="absolute inset-0" style={{ background: tileTones[i % 4] }} />
            )}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black/80" />
            <span className="relative text-[15px] font-semibold tracking-[-.01em]">{c.name}</span>
            <span className="relative mt-0.5 flex items-center gap-1 text-[12.5px] text-white/80">
              {c.count} {c.count === 1 ? "course" : "courses"}
              <Icon name="arrowRight" size={13} />
            </span>
          </Link>
        ))}
      </div>
      {hidden > 0 && (
        <button
          type="button"
          aria-expanded={expanded}
          aria-controls="niche-grid"
          onClick={() => setExpanded((v) => !v)}
          className="btn btn-secondary btn-sm self-center"
        >
          {expanded ? "Show fewer categories" : `Show all categories (${niches.length})`}
          <Icon
            name="chevronDown"
            size={15}
            className={`transition-transform duration-200 ${expanded ? "rotate-180" : ""}`}
          />
        </button>
      )}
    </>
  );
}
