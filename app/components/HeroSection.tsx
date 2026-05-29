"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

const AUTO_SLIDE_INTERVAL = 5000;
const FALLBACK_IMAGE = "/img/Home/Hero.svg";

interface HeroSectionProps {
  /** Desktop hero images (wide banner, 1920×570). */
  images?: string[];
  /** Mobile hero images (4:3, 1080×810). Falls back to desktop images when empty. */
  mobileImages?: string[];
}

/**
 * Self-contained fading slideshow. Owns its own active-slide state and
 * auto-rotation so multiple instances (desktop / mobile) run independently.
 */
function Slideshow({ slides, aspectClassName }: { slides: string[]; aspectClassName: string }) {
  const count = slides.length;
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    if (count <= 1) return;
    const id = setInterval(() => setActiveSlide((prev) => (prev + 1) % count), AUTO_SLIDE_INTERVAL);
    return () => clearInterval(id);
  }, [count]);

  return (
    <section className={`relative mt-16 w-full overflow-hidden md:mt-20 ${aspectClassName}`}>
      {/* Slides */}
      {slides.map((src, i) => (
        <div
          key={i}
          className={`absolute inset-0 transition-opacity duration-700 ${
            i === activeSlide ? "opacity-100" : "opacity-0"
          }`}
        >
          {src.startsWith("/") ? (
            <Image src={src} alt="Palm Springs" fill priority={i === 0} className="object-cover object-center" />
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={src} alt="Palm Springs" className="h-full w-full object-cover object-center" />
          )}
        </div>
      ))}

      {/* Dots — only show if more than 1 slide */}
      {count > 1 && (
        <div className="absolute bottom-5 left-1/2 flex -translate-x-1/2 items-center gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setActiveSlide(i)}
              aria-label={`Go to slide ${i + 1}`}
              className={`h-2.5 rounded-full transition-all duration-300 ${
                activeSlide === i ? "w-8 bg-primary" : "w-2.5 bg-white/80"
              }`}
            />
          ))}
        </div>
      )}
    </section>
  );
}

export default function HeroSection({ images = [], mobileImages = [] }: HeroSectionProps) {
  const desktopSlides = images.length > 0 ? images : [FALLBACK_IMAGE];
  // Mobile falls back to the desktop images when no mobile-specific images are set.
  const mobileSlides = mobileImages.length > 0 ? mobileImages : desktopSlides;

  return (
    <>
      {/* Mobile — 4:3 (1080×810) */}
      <div className="md:hidden">
        <Slideshow slides={mobileSlides} aspectClassName="aspect-4/3" />
      </div>

      {/* Desktop — wide banner (1920×570) */}
      <div className="hidden md:block">
        <Slideshow slides={desktopSlides} aspectClassName="aspect-1920/570 max-h-142.5" />
      </div>
    </>
  );
}
