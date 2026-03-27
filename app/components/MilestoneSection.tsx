"use client";

import { useRef, useState, useCallback, useEffect } from "react";

interface DbMilestone {
  id: string;
  year: string;
  title: string;
  description: string | null;
  image_url: string | null;
}

interface MilestoneSectionProps {
  milestones?: DbMilestone[];
}

// Hardcoded fallback shown when no DB data yet
const FALLBACK_MILESTONES: DbMilestone[] = [
  { id: "1", year: "1989", title: "PALMSPRINGS PLACE", description: null, image_url: null },
  { id: "2", year: "1994", title: "PALMSPRINGS GARDEN HOME", description: null, image_url: null },
  { id: "3", year: "1996", title: "PALMSPRINGS VILLA", description: null, image_url: null },
  { id: "4", year: "1999", title: "PALMSPRINGS TOWNHOME", description: null, image_url: null },
  { id: "5", year: "2006", title: "PALMSPRINGS PLAZA", description: null, image_url: null },
  { id: "6", year: "2007", title: "PALMSPRINGS COUNTRY HOME", description: null, image_url: null },
];

const CARD_W = "w-64 md:w-72";

function MilestoneCard({ milestone, label }: { milestone: DbMilestone; label: string }) {
  if (milestone.image_url) {
    return (
      <div className="relative h-48 w-full overflow-hidden rounded-lg md:h-56">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={milestone.image_url} alt={milestone.title} className="h-full w-full object-cover" />
        <div className="absolute bottom-0 w-full bg-black/30 px-3 py-2">
          <p className="text-[10px] font-semibold uppercase tracking-wide text-white">{label}</p>
        </div>
      </div>
    );
  }
  return (
    <div className="relative h-48 w-full overflow-hidden rounded-lg bg-gray-200 md:h-56">
      <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200" />
      <div className="absolute bottom-0 w-full bg-black/30 px-3 py-2">
        <p className="text-[10px] font-semibold uppercase tracking-wide text-white">{label}</p>
      </div>
    </div>
  );
}

export default function MilestoneSection({ milestones }: MilestoneSectionProps) {
  const items = milestones && milestones.length > 0 ? milestones : FALLBACK_MILESTONES;

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
  }, [items]);

  const scrubberValue = Math.round((activeIndex / (items.length - 1)) * 100);

  const handleScrubber = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const index = Math.round((Number(e.target.value) / 100) * (items.length - 1));
      goTo(index);
    },
    [goTo, items.length]
  );

  return (
    <section className="w-full bg-white py-12 md:py-16">
      <h2 className="mb-10 text-center text-2xl font-bold tracking-widest text-primary md:text-4xl">
        MILESTONE
      </h2>

      <div
        ref={scrollRef}
        className="overflow-x-auto px-6 pb-2 md:px-12"
        style={{ scrollbarWidth: "none", scrollSnapType: "x mandatory" } as React.CSSProperties}
      >
        <div className="flex">
          {items.map((m, i) => {
            const isActive = i === activeIndex;
            const isPast = i < activeIndex;

            return (
              <div
                key={m.id}
                ref={(el) => { colRefs.current[i] = el; }}
                className={`flex shrink-0 flex-col ${CARD_W}`}
                style={{ scrollSnapAlign: "start" }}
              >
                <button onClick={() => goTo(i)} className="flex flex-col items-center pb-3">
                  <span className={`mb-2 text-center text-base font-bold transition-colors md:text-lg ${isActive ? "text-primary" : "text-primary/35"}`}>
                    {m.year}
                  </span>
                  <div className="flex w-full items-center">
                    <div className={`h-0.5 flex-1 transition-colors ${i === 0 ? "invisible" : isPast || isActive ? "bg-primary" : "bg-primary/25"}`} />
                    <div className={`z-10 shrink-0 rounded-full border-2 transition-all duration-300 ${isActive ? "h-4 w-4 border-primary bg-primary" : "h-3 w-3 border-primary/40 bg-white"}`} />
                    <div className={`h-0.5 flex-1 transition-colors ${i === items.length - 1 ? "invisible" : isPast ? "bg-primary" : "bg-primary/25"}`} />
                  </div>
                  <span className={`mt-2 px-1 text-center text-xs font-semibold uppercase leading-tight tracking-wide transition-colors md:text-sm ${isActive ? "text-primary" : "text-primary/35"}`}>
                    {m.title}
                  </span>
                </button>

                <div className="px-1.5">
                  <MilestoneCard milestone={m} label={`${m.year} — ${m.title}`} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

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
