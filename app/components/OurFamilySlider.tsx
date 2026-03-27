"use client";

import { useRef, useState, useCallback, useEffect } from "react";

const SLIDE_COUNT = 4;
const AUTO_SLIDE_INTERVAL = 4000;

interface FamilyImage {
  id: string;
  image_url: string;
  alt_text: string | null;
}

interface OurFamilySliderProps {
  images?: FamilyImage[];
}

function SkeletonSlide() {
  return (
    <div className="relative h-64 w-full shrink-0 overflow-hidden bg-gray-200 md:h-80">
      <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200" />
    </div>
  );
}

export default function OurFamilySlider({ images = [] }: OurFamilySliderProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const sliderRef = useRef<HTMLDivElement>(null);
  const slideCount = images.length > 0 ? images.length : SLIDE_COUNT;

  const goTo = useCallback((index: number) => {
    const slider = sliderRef.current;
    if (!slider) return;
    const slide = slider.children[index] as HTMLElement;
    slider.scrollTo({ left: slide.offsetLeft, behavior: "smooth" });
    setActiveIndex(index);
  }, []);

  // Auto-slide
  useEffect(() => {
    if (images.length === 0) return;
    const id = setInterval(() => {
      setActiveIndex((prev) => {
        const next = (prev + 1) % slideCount;
        const slider = sliderRef.current;
        if (slider) {
          const slide = slider.children[next] as HTMLElement;
          slider.scrollTo({ left: slide.offsetLeft, behavior: "smooth" });
        }
        return next;
      });
    }, AUTO_SLIDE_INTERVAL);
    return () => clearInterval(id);
  }, [images.length, slideCount]);

  // IntersectionObserver to sync dot with manual swipe
  useEffect(() => {
    const slider = sliderRef.current;
    if (!slider) return;
    const slides = Array.from(slider.children) as HTMLElement[];
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio >= 0.6) {
            const index = slides.indexOf(entry.target as HTMLElement);
            if (index !== -1) setActiveIndex(index);
          }
        });
      },
      { root: slider, threshold: 0.6 }
    );
    slides.forEach((slide) => observer.observe(slide));
    return () => observer.disconnect();
  }, [images]);

  return (
    <section className="w-full overflow-hidden bg-white">
      <div
        ref={sliderRef}
        className="flex overflow-x-auto"
        style={{ scrollbarWidth: "none", scrollSnapType: "x mandatory" } as React.CSSProperties}
      >
        {images.length > 0
          ? images.map((img) => (
              <div key={img.id} className="w-full shrink-0" style={{ scrollSnapAlign: "start" }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={img.image_url} alt={img.alt_text ?? ""} className="h-64 w-full object-cover md:h-80" />
              </div>
            ))
          : Array.from({ length: slideCount }).map((_, i) => (
              <div key={i} className="w-full shrink-0" style={{ scrollSnapAlign: "start" }}>
                <SkeletonSlide />
              </div>
            ))}
      </div>

      {/* Dots */}
      <div className="flex justify-center gap-2 py-4">
        {Array.from({ length: slideCount }).map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            aria-label={`Go to slide ${i + 1}`}
            className={`rounded-full transition-all duration-300 ${
              activeIndex === i ? "h-2.5 w-8 bg-primary" : "h-2.5 w-2.5 bg-gray-300"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
