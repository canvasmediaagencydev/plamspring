"use client";

import { useState, useEffect } from "react";

const AUTO_SLIDE_INTERVAL = 4000;

interface SlideCard {
  id: string;
  image: string;
  tags: string[];
}

const SKELETON_COUNT = 5;

// ── Skeleton Card ─────────────────────────────────────────────────────────────
function SkeletonCard({ active }: { active: boolean }) {
  return (
    <div
      className={`overflow-hidden rounded-3xl  transition-all duration-500 ${
        active ? "shadow-2xl" : "shadow-md"
      }`}
    >
      <div className="h-96 w-full animate-pulse bg-gray-300 md:h-[480px]" />
    </div>
  );
}

// ── Real Card ─────────────────────────────────────────────────────────────────
function SlideCardItem({ card, active }: { card: SlideCard; active: boolean }) {
  return (
    <div
      className={`overflow-hidden rounded-3xl  transition-all duration-500 
        
      }`}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={card.image}
        alt="lifestyle"
        className="h-96 w-full object-cover transition-all duration-500 md:h-[520px]"
      />
    </div>
  );
}

interface DbSlide {
  id: string;
  lifestyle_image_url: string;
  house_image_url: string;
  tags: string[];
}

interface LifestyleSliderProps {
  slides?: DbSlide[];
}

export default function LifestyleSlider({ slides = [] }: LifestyleSliderProps) {
  const mappedSlides: SlideCard[] = slides.map((s) => ({
    id: s.id,
    image: s.lifestyle_image_url,
    tags: s.tags,
  }));
  const items = mappedSlides.length > 0 ? mappedSlides : Array(SKELETON_COUNT).fill(undefined);
  const count = items.length;
  const [active, setActive] = useState(Math.floor(count / 2));

  const prev = () => setActive((a) => (a - 1 + count) % count);
  const next = () => setActive((a) => (a + 1) % count);

  // Auto-slide
  useEffect(() => {
    if (mappedSlides.length === 0) return;
    const id = setInterval(() => setActive((a) => (a + 1) % count), AUTO_SLIDE_INTERVAL);
    return () => clearInterval(id);
  }, [mappedSlides.length, count]);

  const visibleIndices = [
    (active - 1 + count) % count,
    active,
    (active + 1) % count,
  ];

  return (
    <section className="overflow-hidden py-16">
      <h2 className="mb-0 md:mb-12 text-center text-2xl font-bold text-primary md:text-4xl">
        ทำเลศักยภาพ <br className="block md:hidden"></br> ตอบโจทย์ทุกไลฟ์สไตล์
      </h2>

      <div className="relative px-4">
        {/* Prev arrow */}
        <button
          onClick={prev}
          aria-label="Previous"
          className="absolute top-[42%] left-2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full sm:left-6"
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5 fill-primary">
            <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
          </svg>
        </button>

        {/* 3 visible cards */}
        <div className="mx-auto max-w-6xl">
          <div className="flex min-h-[470px] items-end justify-center gap-4 md:min-h-[590px] md:gap-6">
            {visibleIndices.map((itemIdx, pos) => {
              const isActive = pos === 1;
              const card = items[itemIdx];

              return (
                <div
                  key={itemIdx}
                  onClick={() => setActive(itemIdx)}
                  className={`cursor-pointer transition-all duration-500 ${
                    isActive
                      ? "z-10 w-[80%] -translate-y-4 scale-105 sm:w-[60%] md:w-[42%] md:-translate-y-8"
                      : "z-0 hidden w-[20%] opacity-70 md:block md:w-[29%]"
                  }`}
                >
                  {card ? (
                    <SlideCardItem card={card} active={isActive} />
                  ) : (
                    <SkeletonCard active={isActive} />
                  )}
                </div>
              );
            })}
          </div>

          <div className="mt-6 flex min-h-2 justify-center gap-1.5">
            {items.map((_, i) => (
              <button
                key={i}
                onClick={() => setActive(i)}
                aria-label={`Go to slide ${i + 1}`}
                className={`h-2 rounded-full transition-all duration-300 ${
                  i === active ? "w-5 bg-primary" : "w-2 bg-gray-300"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Next arrow */}
        <button
          onClick={next}
          aria-label="Next"
          className="absolute top-[42%] right-2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white shadow-md transition hover:bg-gray-100 sm:right-6"
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5 fill-primary">
            <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
          </svg>
        </button>
      </div>
    </section>
  );
}
