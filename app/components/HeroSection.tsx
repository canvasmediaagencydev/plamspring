"use client";

import Image from "next/image";
import { useState } from "react";
import PalmTreeIcon from "./PalmTreeIcon";

const SLIDE_COUNT = 3;

export default function HeroSection() {
  const [activeSlide, setActiveSlide] = useState(0);

  return (
    <section
      className="relative mt-[80px] w-full overflow-hidden"
      style={{ height: "570px" }}
    >
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
      <div className="absolute bottom-[30%] right-[10%] flex flex-col items-end gap-3">
        {/* "PALM SPRINGS" + tree icon */}
        <div className="flex items-center gap-3">
          <div className="text-right leading-tight">
            <p className="text-5xl font-bold tracking-widest text-primary">PALM</p>
            <p className="text-5xl font-bold tracking-widest text-primary">SPRINGS</p>
          </div>
          <PalmTreeIcon size={90} />
        </div>

        {/* Thai tagline */}
        <p className="text-right text-2xl font-medium italic leading-snug text-primary">
          "เลือกปาล์มสปริงส์
          <br />
          เพื่อชีวิตที่ดีกว่า"
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
