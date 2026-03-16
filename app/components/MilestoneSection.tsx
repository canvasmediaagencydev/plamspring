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

// Card width must match the column width exactly
const CARD_W = "w-64 md:w-72";

function SkeletonCard({ label }: { label: string }) {
  return (
    <div className="relative h-48 w-full overflow-hidden rounded-lg bg-gray-200 md:h-56">
      <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200" />
      <div className="absolute bottom-0 w-full bg-black/30 px-3 py-2">
        <p className="text-[10px] font-semibold uppercase tracking-wide text-white">{label}</p>
      </div>
    </div>
  );
}

export default function MilestoneSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const colRefs = useRef<(HTMLDivElement | null)[]>([]);

  const goTo = useCallback((index: number) => {
    setActiveIndex(index);
    const col = colRefs.current[index];
    if (col && scrollRef.current) {
      const containerLeft = scrollRef.current.getBoundingClientRect().left;
      const colLeft = col.getBoundingClientRect().left;
      const offset = scrollRef.current.scrollLeft + (colLeft - containerLeft);
      scrollRef.current.scrollTo({ left: offset, behavior: "smooth" });
    }
  }, []);

  // IntersectionObserver on columns to sync activeIndex when scrolling
  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
            const index = colRefs.current.findIndex((c) => c === entry.target);
            if (index !== -1) setActiveIndex(index);
          }
        });
      },
      { root: container, threshold: 0.5 }
    );

    colRefs.current.forEach((col) => { if (col) observer.observe(col); });
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

      {/* ── Single scroll container: timeline + cards in the same columns ── */}
      <div
        ref={scrollRef}
        className="overflow-x-auto px-6 pb-2 md:px-12"
        style={{ scrollbarWidth: "none", scrollSnapType: "x mandatory" } as React.CSSProperties}
      >
        <div className="flex">
          {MILESTONES.map((m, i) => {
            const isActive = i === activeIndex;
            const isPast = i < activeIndex;

            return (
              <div
                key={m.year}
                ref={(el) => { colRefs.current[i] = el; }}
                className={`flex shrink-0 flex-col ${CARD_W}`}
                style={{ scrollSnapAlign: "start" }}
              >
                {/* ── Timeline row ── */}
                <button
                  onClick={() => goTo(i)}
                  className="flex flex-col items-center pb-3"
                >
                  {/* Year */}
                  <span
                    className={`mb-2 text-center text-sm font-bold transition-colors md:text-base ${
                      isActive ? "text-primary" : "text-primary/35"
                    }`}
                  >
                    {m.year}
                  </span>

                  {/* Left line + Dot + Right line — spans full column width */}
                  <div className="flex w-full items-center">
                    {/* Left half-line */}
                    <div
                      className={`h-0.5 flex-1 transition-colors ${
                        i === 0 ? "invisible" : isPast || isActive ? "bg-primary" : "bg-primary/25"
                      }`}
                    />
                    {/* Dot */}
                    <div
                      className={`z-10 shrink-0 rounded-full border-2 transition-all duration-300 ${
                        isActive
                          ? "h-4 w-4 border-primary bg-primary"
                          : "h-3 w-3 border-primary/40 bg-white"
                      }`}
                    />
                    {/* Right half-line */}
                    <div
                      className={`h-0.5 flex-1 transition-colors ${
                        i === MILESTONES.length - 1
                          ? "invisible"
                          : isPast
                          ? "bg-primary"
                          : "bg-primary/25"
                      }`}
                    />
                  </div>

                  {/* Project name */}
                  <span
                    className={`mt-2 px-1 text-center text-[9px] font-semibold uppercase leading-tight tracking-wide transition-colors md:text-[10px] ${
                      isActive ? "text-primary" : "text-primary/35"
                    }`}
                  >
                    {m.name}
                  </span>
                </button>

                {/* ── Image card — same column, perfectly aligned ── */}
                <div className="px-1.5">
                  <SkeletonCard label={`${m.year} — ${m.name}`} />
                </div>
              </div>
            );
          })}
        </div>
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
