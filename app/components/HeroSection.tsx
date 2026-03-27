"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import PalmTreeIcon from "./PalmTreeIcon";

const AUTO_SLIDE_INTERVAL = 5000;
const FALLBACK_IMAGE = "/img/Home/Hero.svg";

interface HeroSectionProps {
  images?: string[];
}

export default function HeroSection({ images = [] }: HeroSectionProps) {
  const slides = images.length > 0 ? images : [FALLBACK_IMAGE];
  const count = slides.length;
  const [activeSlide, setActiveSlide] = useState(0);

  // Auto-slide
  useEffect(() => {
    if (count <= 1) return;
    const id = setInterval(() => setActiveSlide((prev) => (prev + 1) % count), AUTO_SLIDE_INTERVAL);
    return () => clearInterval(id);
  }, [count]);

  return (
    <section className="relative mt-16 h-[280px] w-full overflow-hidden sm:h-[380px] md:mt-20 md:h-[480px] lg:h-[570px]">
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

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-l from-white/50 via-white/10 to-transparent" />

      {/* Branding overlay */}
      <div className="absolute bottom-[25%] right-[5%] flex flex-col items-end gap-2 md:bottom-[30%] md:right-[10%] md:gap-3">
        <div className="flex items-center gap-2 md:gap-3">
          <div className="text-right leading-tight">
            <p className="text-2xl font-bold tracking-widest text-primary sm:text-3xl md:text-5xl">PALM</p>
            <p className="text-2xl font-bold tracking-widest text-primary sm:text-3xl md:text-5xl">SPRINGS</p>
          </div>
          <PalmTreeIcon size={50} />
        </div>
        <p className="text-right text-sm font-medium italic leading-snug text-primary sm:text-base md:text-2xl">
          &ldquo;เลือกปาล์มสปริงส์
          <br />
          เพื่อชีวิตที่ดีกว่า&rdquo;
        </p>
      </div>

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
