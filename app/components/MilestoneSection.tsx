"use client";

import { useRef, useState, useCallback, useEffect } from "react";

interface Milestone {
  year: string;
  name: string;
}

const MILESTONES: Milestone[] = [
  { year: "1989", name: "PALMSPRINGS PLACE" },
  { year: "1994", name: "PALMSPRINGS GARDEN HOME" },
  { year: "1996", name: "PALMSPRINGS VILLA" },
  { year: "1999", name: "PALMSPRINGS TOWNHOME" },
  { year: "2006", name: "PALMSPRINGS PLAZA" },
  { year: "2007", name: "PALMSPRINGS COUNTRY HOME" },
];

function SkeletonCard({ label }: { label: string }) {
  return (
    <div className="relative h-full w-full overflow-hidden rounded-lg bg-gray-200">
      <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200" />
      <div className="absolute bottom-0 w-full bg-black/30 px-3 py-2">
        <p className="text-xs font-semibold uppercase tracking-wide text-white">{label}</p>
      </div>
    </div>
  );
}

export default function MilestoneSection() {
  const [activeIndex, setActiveIndex] = useState(0);

  const sliderRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  const dotRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  // When activeIndex changes via dot click → scroll the image strip to that card
  const isUserScrolling = useRef(false);

  const goTo = useCallback((index: number) => {
    setActiveIndex(index);

    // Scroll image to matching card
    const card = cardRefs.current[index];
    if (card && sliderRef.current) {
      const sliderLeft = sliderRef.current.getBoundingClientRect().left;
      const cardLeft = card.getBoundingClientRect().left;
      const offset = sliderRef.current.scrollLeft + (cardLeft - sliderLeft);
      sliderRef.current.scrollTo({ left: offset, behavior: "smooth" });
    }

    // Scroll timeline so active dot is centred
    const dot = dotRefs.current[index];
    if (dot && timelineRef.current) {
      const tlLeft = timelineRef.current.getBoundingClientRect().left;
      const dotLeft = dot.getBoundingClientRect().left;
      const dotCenter = dot.offsetWidth / 2;
      const tlCenter = timelineRef.current.offsetWidth / 2;
      const offset =
        timelineRef.current.scrollLeft + (dotLeft - tlLeft) - tlCenter + dotCenter;
      timelineRef.current.scrollTo({ left: offset, behavior: "smooth" });
    }
  }, []);

  // IntersectionObserver: when a card becomes >50% visible, update active dot
  useEffect(() => {
    const slider = sliderRef.current;
    if (!slider) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
            const index = cardRefs.current.findIndex((c) => c === entry.target);
            if (index !== -1) {
              setActiveIndex(index);

              // Keep timeline dot centred without triggering goTo's image scroll
              const dot = dotRefs.current[index];
              if (dot && timelineRef.current) {
                const tlLeft = timelineRef.current.getBoundingClientRect().left;
                const dotLeft = dot.getBoundingClientRect().left;
                const dotCenter = dot.offsetWidth / 2;
                const tlCenter = timelineRef.current.offsetWidth / 2;
                const offset =
                  timelineRef.current.scrollLeft + (dotLeft - tlLeft) - tlCenter + dotCenter;
                timelineRef.current.scrollTo({ left: offset, behavior: "smooth" });
              }
            }
          }
        });
      },
      { root: slider, threshold: 0.5 }
    );

    cardRefs.current.forEach((card) => {
      if (card) observer.observe(card);
    });

    return () => observer.disconnect();
  }, []);

  const scrubberValue = Math.round((activeIndex / (MILESTONES.length - 1)) * 100);

  const handleScrubber = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const index = Math.round((Number(e.target.value) / 100) * (MILESTONES.length - 1));
      goTo(index);
    },
    [goTo]
  );

  return (
    <section className="w-full bg-white py-12 md:py-16">
      {/* Title */}
      <h2 className="mb-10 text-center text-2xl font-bold tracking-widest text-primary md:text-3xl">
        MILESTONE
      </h2>

      {/* ── Timeline ── */}
      <div
        ref={timelineRef}
        className="mb-6 overflow-x-auto px-6 md:px-12"
        style={{ scrollbarWidth: "none" }}
      >
        <div className="flex min-w-max items-start">
          {MILESTONES.map((m, i) => {
            const isActive = i === activeIndex;
            const isPast = i < activeIndex;

            return (
              <button
                key={m.year}
                ref={(el) => { dotRefs.current[i] = el; }}
                onClick={() => goTo(i)}
                className="flex flex-col items-center"
              >
                {/* Year */}
                <span
                  className={`mb-2 w-36 text-center text-base font-bold transition-colors md:w-44 md:text-lg ${
                    isActive ? "text-primary" : "text-primary/35"
                  }`}
                >
                  {m.year}
                </span>

                {/* Line + Dot + Line */}
                <div className="flex w-36 items-center md:w-44">
                  <div
                    className={`h-0.5 flex-1 ${
                      i === 0 ? "invisible" : isPast || isActive ? "bg-primary" : "bg-primary/25"
                    }`}
                  />
                  <div
                    className={`z-10 rounded-full border-2 transition-all duration-300 ${
                      isActive
                        ? "h-4 w-4 border-primary bg-primary"
                        : "h-3 w-3 border-primary/40 bg-white"
                    }`}
                  />
                  <div
                    className={`h-0.5 flex-1 ${
                      i === MILESTONES.length - 1
                        ? "invisible"
                        : isPast
                        ? "bg-primary"
                        : "bg-primary/25"
                    }`}
                  />
                </div>

                {/* Name */}
                <span
                  className={`mt-2 w-36 px-1 text-center text-[10px] font-semibold uppercase leading-tight tracking-wide transition-colors md:w-44 md:text-xs ${
                    isActive ? "text-primary" : "text-primary/35"
                  }`}
                >
                  {m.name}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Image strip ── */}
      <div
        ref={sliderRef}
        className="flex gap-3 overflow-x-auto px-6 pb-2 md:px-12"
        style={{ scrollbarWidth: "none", scrollSnapType: "x mandatory" } as React.CSSProperties}
      >
        {MILESTONES.map((m, i) => (
          <div
            key={m.year}
            ref={(el) => { cardRefs.current[i] = el; }}
            className="h-48 w-72 shrink-0 md:h-56 md:w-80"
            style={{ scrollSnapAlign: "start" }}
          >
            <SkeletonCard label={`${m.year} — ${m.name}`} />
          </div>
        ))}
      </div>

      {/* ── Scrubber ── */}
      <div className="mx-auto mt-5 max-w-xs px-6 md:max-w-sm">
        <input
          type="range"
          min={0}
          max={100}
          value={scrubberValue}
          onChange={handleScrubber}
          className="w-full cursor-pointer accent-primary"
        />
      </div>
    </section>
  );
}
