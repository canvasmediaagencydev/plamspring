"use client";

import Image from "next/image";
import { useState } from "react";
import PalmTreeIcon from "./PalmTreeIcon";

const SLIDE_COUNT = 3;

export default function HeroSection() {
  const [activeSlide, setActiveSlide] = useState(0);

  return (
    <section className="relative mt-16 h-[280px] w-full overflow-hidden sm:h-[380px] md:mt-20 md:h-[480px] lg:h-[570px]">
      {/* Background Hero Image */}
      <Image
        src="/img/Home/Hero.svg"
        alt="Palm Springs family lifestyle"
        fill
        priority
        className="object-cover object-center"
      />

      {/* Right-side gradient for text legibility */}
      <div className="absolute inset-0 bg-gradient-to-l from-white/50 via-white/10 to-transparent" />

      {/* Branding overlay — bottom-right */}
      <div className="absolute bottom-[25%] right-[5%] flex flex-col items-end gap-2 md:bottom-[30%] md:right-[10%] md:gap-3">
        {/* "PALM SPRINGS" + tree icon */}
        <div className="flex items-center gap-2 md:gap-3">
          <div className="text-right leading-tight">
            <p className="text-2xl font-bold tracking-widest text-primary sm:text-3xl md:text-5xl">PALM</p>
            <p className="text-2xl font-bold tracking-widest text-primary sm:text-3xl md:text-5xl">SPRINGS</p>
          </div>
          <PalmTreeIcon size={50} />
        </div>

        {/* Thai tagline */}
        <p className="text-right text-sm font-medium italic leading-snug text-primary sm:text-base md:text-2xl">
          &ldquo;เลือกปาล์มสปริงส์
          <br />
          เพื่อชีวิตที่ดีกว่า&rdquo;
        </p>
      </div>

      {/* Carousel dots */}
      <div className="absolute bottom-5 left-1/2 flex -translate-x-1/2 items-center gap-2">
        {Array.from({ length: SLIDE_COUNT }).map((_, i) => (
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
    </section>
  );
}
