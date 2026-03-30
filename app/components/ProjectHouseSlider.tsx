"use client";

import { useState } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

export interface HouseType {
  name: string;
  imageUrl?: string;
  specs: { label: string; value: string }[];
}

interface ProjectHouseSliderProps {
  houses: HouseType[];
}

export default function ProjectHouseSlider({ houses }: ProjectHouseSliderProps) {
  const [current, setCurrent] = useState(0);
  const total = houses.length;

  if (total === 0) return null;

  const house = houses[current];

  const prev = () => setCurrent((c) => (c - 1 + total) % total);
  const next = () => setCurrent((c) => (c + 1) % total);

  return (
    <section className="bg-gradient-to-br from-[#e8eef6] to-[#dce5f0] py-12 md:py-20">
      <div className="mx-auto max-w-6xl px-4">
        {/* Slider container */}
        <div className="relative flex flex-col items-stretch overflow-hidden rounded-3xl bg-white shadow-lg md:flex-row md:min-h-[380px]">
          {/* Left — Image */}
          <div className="relative w-full md:w-1/2">
            <div className="aspect-[4/3] w-full md:aspect-auto md:h-full">
              {house.imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={house.imageUrl}
                  alt={house.name}
                  className="absolute inset-0 h-full w-full object-cover"
                />
              ) : (
                <>
                  <div className="absolute inset-0 animate-pulse bg-gradient-to-br from-gray-200 via-gray-250 to-gray-300" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="relative h-3/4 w-4/5">
                      <div className="absolute bottom-0 left-1/2 h-[70%] w-[80%] -translate-x-1/2 rounded-t-xl bg-gray-300/60" />
                      <div className="absolute bottom-0 left-[8%] h-[45%] w-[30%] rounded-t-lg bg-gray-300/40" />
                      <div className="absolute bottom-0 right-[5%] h-[60%] w-[12%]">
                        <div className="absolute top-0 left-1/2 h-[60%] w-[200%] -translate-x-1/2 rounded-full bg-gray-300/50" />
                        <div className="absolute bottom-0 left-1/2 h-[50%] w-[30%] -translate-x-1/2 bg-gray-300/40" />
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Right — Details */}
          <div className="flex w-full flex-col justify-center px-6 py-8 md:w-1/2 md:px-10 md:py-10">
            <h3 className="mb-6 text-2xl font-bold tracking-wide text-primary md:text-3xl">
              {house.name}
            </h3>

            <ul className="space-y-3">
              {house.specs.map((spec, i) => (
                <li
                  key={i}
                  className="flex items-start gap-3 text-sm text-gray-600 md:text-base"
                >
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                  <span>
                    <span className="font-medium text-gray-800">{spec.label}</span>{" "}
                    {spec.value}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Navigation arrows */}
          {total > 1 && (
            <>
              <button
                onClick={prev}
                aria-label="Previous house type"
                className="absolute left-2 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/80 text-primary shadow-md backdrop-blur-sm transition-all duration-200 hover:bg-white hover:shadow-lg md:left-4 md:h-12 md:w-12"
              >
                <FiChevronLeft className="h-5 w-5 md:h-6 md:w-6" />
              </button>
              <button
                onClick={next}
                aria-label="Next house type"
                className="absolute right-2 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/80 text-primary shadow-md backdrop-blur-sm transition-all duration-200 hover:bg-white hover:shadow-lg md:right-4 md:h-12 md:w-12"
              >
                <FiChevronRight className="h-5 w-5 md:h-6 md:w-6" />
              </button>
            </>
          )}
        </div>

        {/* Dots indicator */}
        {total > 1 && (
          <div className="mt-6 flex items-center justify-center gap-2">
            {houses.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                aria-label={`Go to house type ${i + 1}`}
                className={`h-2.5 rounded-full transition-all duration-300 ${
                  current === i
                    ? "w-8 bg-primary"
                    : "w-2.5 bg-primary/30 hover:bg-primary/50"
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
