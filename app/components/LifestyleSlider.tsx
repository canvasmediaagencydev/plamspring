"use client";

import { useState } from "react";

interface SlideCard {
  id: string;
  lifestyleImage: string;
  houseImage: string;
  tags: string[];
}

// เพิ่มข้อมูลที่นี่เมื่อพร้อม
const slides: SlideCard[] = [
  // {
  //   id: "1",
  //   lifestyleImage: "/img/lifestyle/1-lifestyle.jpg",
  //   houseImage: "/img/lifestyle/1-house.jpg",
  //   tags: ["Lifestyle Hub", "Urban Living"],
  // },
];

const SKELETON_COUNT = 5;

// ── Skeleton Card ─────────────────────────────────────────────────────────────
function SkeletonCard({ active }: { active: boolean }) {
  return (
    <div
      className={`flex flex-col overflow-hidden rounded-3xl transition-all duration-500 ${
        active ? "shadow-2xl" : "shadow-md"
      }`}
    >
      {/* Top image */}
      <div
        className={`w-full animate-pulse bg-gray-300 ${
          active ? "h-72" : "h-52"
        }`}
      />
      {/* Bottom image */}
      <div
        className={`w-full animate-pulse bg-gray-200 ${
          active ? "h-80" : "h-60"
        }`}
      />
      {/* Tags row */}
      <div className="flex gap-2 bg-white px-3 py-3">
        <div className="h-6 w-24 animate-pulse rounded-full bg-gray-200" />
        <div className="h-6 w-24 animate-pulse rounded-full bg-gray-200" />
      </div>
    </div>
  );
}

// ── Real Card ─────────────────────────────────────────────────────────────────
function SlideCardItem({
  card,
  active,
}: {
  card: SlideCard;
  active: boolean;
}) {
  return (
    <div
      className={`flex flex-col overflow-hidden rounded-3xl transition-all duration-500 ${
        active ? "shadow-2xl" : "shadow-md"
      }`}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={card.lifestyleImage}
        alt="lifestyle"
        className={`w-full object-cover transition-all duration-500 ${
          active ? "h-72" : "h-52"
        }`}
      />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={card.houseImage}
        alt="house"
        className={`w-full object-cover transition-all duration-500 ${
          active ? "h-80" : "h-60"
        }`}
      />
      {/* Tags */}
      <div className="flex flex-wrap gap-2 bg-white px-3 py-3">
        {card.tags.map((tag) => (
          <span
            key={tag}
            className="flex items-center gap-1 rounded-full bg-primary px-3 py-1 text-xs font-medium text-white"
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}

export default function LifestyleSlider() {
  const items = slides.length > 0 ? slides : Array(SKELETON_COUNT).fill(undefined);
  const count = items.length;
  const [active, setActive] = useState(Math.floor(count / 2));

  const prev = () => setActive((a) => (a - 1 + count) % count);
  const next = () => setActive((a) => (a + 1) % count);

  // Which indices to show: active-1, active, active+1 (wrapped)
  const visibleIndices = [
    (active - 1 + count) % count,
    active,
    (active + 1) % count,
  ];

  return (
    <section className="overflow-hidden py-16">
      {/* Heading */}
      <h2 className="mb-30 text-center text-2xl font-bold text-primary">
        ทำเลศักยภาพ ตอบโจทย์ทุกไลฟ์สไตล์
      </h2>

      {/* Slider */}
      <div className="relative flex items-center justify-center gap-4 px-4">
        {/* Prev arrow */}
        <button
          onClick={prev}
          aria-label="Previous"
          className="absolute left-2 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white shadow-md transition hover:bg-gray-100 sm:left-6"
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5 fill-primary">
            <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
          </svg>
        </button>

        {/* 3 visible cards */}
        <div className="flex w-full max-w-6xl items-end justify-center gap-6">
          {visibleIndices.map((itemIdx, pos) => {
            const isActive = pos === 1;
            const card = items[itemIdx];

            return (
              <div
                key={itemIdx}
                onClick={() => setActive(itemIdx)}
                className={`cursor-pointer transition-all duration-500 ${
                  isActive
                    ? "z-10 w-[42%] -translate-y-8 scale-105"
                    : "z-0 w-[29%] opacity-70"
                }`}
              >
                {card ? (
                  <SlideCardItem card={card} active={isActive} />
                ) : (
                  <SkeletonCard active={isActive} />
                )}

                {/* Dot indicator — only on active card */}
                {isActive && (
                  <div className="mt-3 flex justify-center gap-1.5">
                    {items.map((_, i) => (
                      <button
                        key={i}
                        onClick={(e) => {
                          e.stopPropagation();
                          setActive(i);
                        }}
                        aria-label={`Go to slide ${i + 1}`}
                        className={`h-2 rounded-full transition-all duration-300 ${
                          i === active
                            ? "w-5 bg-primary"
                            : "w-2 bg-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Next arrow */}
        <button
          onClick={next}
          aria-label="Next"
          className="absolute right-2 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white shadow-md transition hover:bg-gray-100 sm:right-6"
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5 fill-primary">
            <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
          </svg>
        </button>
      </div>
    </section>
  );
}
