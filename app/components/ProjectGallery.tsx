"use client";

import { useState } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

interface ProjectGalleryProps {
  /** Real image URLs from Supabase. Falls back to skeleton when empty or not provided. */
  images?: string[];
  /** Number of skeleton slots to show when no images provided */
  count?: number;
}

export default function ProjectGallery({ images, count = 8 }: ProjectGalleryProps) {
  const hasImages = images && images.length > 0;
  const total = hasImages ? images.length : count;
  const [active, setActive] = useState(0);

  const prev = () => setActive((c) => (c - 1 + total) % total);
  const next = () => setActive((c) => (c + 1) % total);

  const thumbStartIndex = Math.floor(active / 4) * 4;

  return (
    <section className="mx-auto max-w-6xl px-4 py-12 md:py-20">
      {/* Main image area */}
      <div className="relative overflow-hidden rounded-2xl shadow-lg">
        <div className="aspect-[16/9] w-full">
          {hasImages ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={images[active]}
              alt={`รูปภาพโครงการ ${active + 1}`}
              className="h-full w-full object-cover"
            />
          ) : (
            /* Skeleton main image */
            <div className="relative h-full w-full bg-gradient-to-br from-gray-200 via-gray-300 to-gray-250">
              <div className="absolute inset-0 flex items-end justify-center pb-[15%]">
                <div className="relative w-[50%] max-w-md">
                  <div className="h-32 rounded-t-lg bg-gray-300/50 md:h-48" />
                  <div
                    className="absolute -top-6 left-1/2 h-12 w-[110%] -translate-x-1/2 bg-gray-300/40 md:-top-10 md:h-16"
                    style={{ clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)" }}
                  />
                  <div className="absolute left-[15%] top-[30%] flex gap-3 md:gap-5">
                    <div className="h-8 w-6 rounded-sm bg-gray-300/60 md:h-12 md:w-10" />
                    <div className="h-8 w-6 rounded-sm bg-gray-300/60 md:h-12 md:w-10" />
                  </div>
                  <div className="absolute right-[15%] top-[30%] flex gap-3 md:gap-5">
                    <div className="h-8 w-6 rounded-sm bg-gray-300/60 md:h-12 md:w-10" />
                    <div className="h-8 w-6 rounded-sm bg-gray-300/60 md:h-12 md:w-10" />
                  </div>
                  <div className="absolute bottom-0 left-1/2 h-10 w-7 -translate-x-1/2 rounded-t-md bg-gray-300/60 md:h-16 md:w-12" />
                </div>
              </div>
            </div>
          )}

          {/* Image counter badge */}
          <div className="absolute bottom-4 right-4 rounded-full bg-black/40 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm md:bottom-5 md:right-5 md:text-sm">
            {active + 1} / {total}
          </div>
        </div>

        {/* Navigation arrows */}
        {total > 1 && (
          <>
            <button
              onClick={prev}
              aria-label="Previous image"
              className="absolute left-3 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-md bg-white/80 text-gray-700 shadow-md backdrop-blur-sm transition-all duration-200 hover:bg-white md:left-4 md:h-12 md:w-12"
            >
              <FiChevronLeft className="h-5 w-5 md:h-6 md:w-6" />
            </button>
            <button
              onClick={next}
              aria-label="Next image"
              className="absolute right-3 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-md bg-white/80 text-gray-700 shadow-md backdrop-blur-sm transition-all duration-200 hover:bg-white md:right-4 md:h-12 md:w-12"
            >
              <FiChevronRight className="h-5 w-5 md:h-6 md:w-6" />
            </button>
          </>
        )}
      </div>

      {/* Thumbnail strip */}
      <div className="mt-3 grid grid-cols-4 gap-2 md:mt-4 md:gap-3">
        {[0, 1, 2, 3].map((offset) => {
          const thumbIndex = thumbStartIndex + offset;
          if (thumbIndex >= total) return null;
          const isActive = thumbIndex === active;
          return (
            <button
              key={offset}
              onClick={() => setActive(thumbIndex)}
              className={`group relative aspect-[16/10] overflow-hidden rounded-lg transition-all duration-200 ${
                isActive
                  ? "ring-2 ring-primary ring-offset-2"
                  : "opacity-70 hover:opacity-100"
              }`}
            >
              {hasImages && images[thumbIndex] ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={images[thumbIndex]}
                  alt={`thumbnail ${thumbIndex + 1}`}
                  className="absolute inset-0 h-full w-full object-cover"
                />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-gray-200 via-gray-300 to-gray-250" />
              )}
            </button>
          );
        })}
      </div>
    </section>
  );
}
