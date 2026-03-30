"use client";

import { useState } from "react";
import { FiMap, FiImage } from "react-icons/fi";

interface ProjectMapProps {
  projectName: string;
  mapEmbedUrl: string;
  mapImageUrl?: string;
}

export default function ProjectMap({ projectName, mapEmbedUrl, mapImageUrl }: ProjectMapProps) {
  const [showMap, setShowMap] = useState(false);

  return (
    <section className="bg-primary/40 py-12 md:py-20">
      <div className="mx-auto max-w-6xl px-4">
        {/* Header with toggle */}
        <div className="mb-8 flex items-center justify-between md:mb-10">
          <h2 className="text-2xl font-bold text-white md:text-3xl">
          </h2>

          {/* Toggle buttons */}
          <div className="flex overflow-hidden rounded-full border border-white/30">
            <button
              onClick={() => setShowMap(false)}
              className={`flex items-center gap-2 px-4 py-2 text-sm font-medium transition-all duration-300 md:px-5 md:text-base ${
                !showMap
                  ? "bg-white text-primary"
                  : "bg-transparent text-white/80 hover:text-white"
              }`}
            >
              <FiImage className="h-4 w-4" />
              <span className="hidden sm:inline">แผนที่โครงการ</span>
            </button>
            <button
              onClick={() => setShowMap(true)}
              className={`flex items-center gap-2 px-4 py-2 text-sm font-medium transition-all duration-300 md:px-5 md:text-base ${
                showMap
                  ? "bg-white text-primary"
                  : "bg-transparent text-white/80 hover:text-white"
              }`}
            >
              <FiMap className="h-4 w-4" />
              <span className="hidden sm:inline">Google Maps</span>
            </button>
          </div>
        </div>

        {/* Content area */}
        <div className="relative overflow-hidden rounded-2xl shadow-xl">
          {/* Map image (custom or skeleton) */}
          <div
            className={`transition-opacity duration-500 ${
              showMap ? "pointer-events-none absolute inset-0 opacity-0" : "opacity-100"
            }`}
          >
            <div className="relative aspect-[16/7] w-full bg-[#0d3475]">
              {mapImageUrl && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={mapImageUrl}
                  alt={`แผนที่ ${projectName}`}
                  className="absolute inset-0 h-full w-full object-cover"
                />
              )}
              {/* Skeleton road grid — shown only when no custom map image */}
              {!mapImageUrl && <div className="absolute inset-0 p-6 md:p-10">
                {/* Horizontal roads */}
                <div className="absolute left-0 right-0 top-[25%] h-[2px] bg-white/20" />
                <div className="absolute left-0 right-0 top-[50%] h-[2px] bg-white/25" />
                <div className="absolute left-0 right-0 top-[75%] h-[2px] bg-white/20" />

                {/* Vertical roads */}
                <div className="absolute bottom-0 left-[20%] top-0 w-[2px] bg-white/20" />
                <div className="absolute bottom-0 left-[45%] top-0 w-[2px] bg-white/15" />
                <div className="absolute bottom-0 left-[70%] top-0 w-[2px] bg-white/20" />

                {/* Diagonal road */}
                <div
                  className="absolute left-[5%] top-[10%] h-[2px] w-[40%] bg-white/15"
                  style={{ transform: "rotate(25deg)", transformOrigin: "left center" }}
                />

                {/* Project marker */}
                <div className="absolute left-[55%] top-[40%] -translate-x-1/2 -translate-y-1/2">
                  <div className="rounded-lg border-2 border-white bg-primary px-3 py-1.5 text-xs font-bold tracking-wide text-white shadow-lg md:px-4 md:py-2 md:text-sm">
                    {projectName}
                  </div>
                  <div className="mx-auto mt-1 h-3 w-3 rounded-full border-2 border-white bg-white shadow" />
                </div>

                {/* Landmark labels */}
                <div className="absolute left-[12%] top-[18%] text-[10px] font-medium text-white/50 md:text-xs">
                  CENTRAL FESTIVAL
                </div>
                <div className="absolute left-[25%] top-[58%] text-[10px] font-medium text-white/50 md:text-xs">
                  BIG C EXTRA
                </div>
                <div className="absolute right-[15%] top-[20%] text-[10px] font-medium text-white/50 md:text-xs">
                  TUBE TREK WATERPARK
                </div>
                <div className="absolute bottom-[15%] left-[35%] text-[10px] font-medium text-white/50 md:text-xs">
                  TESCO LOTUS
                </div>
                <div className="absolute bottom-[20%] right-[10%] text-[10px] font-medium text-white/50 md:text-xs">
                  โรงพยาบาล
                </div>
                <div className="absolute left-[8%] bottom-[30%] text-[10px] font-medium text-white/50 md:text-xs">
                  MAKRO
                </div>

                {/* Road labels */}
                <div className="absolute left-[30%] top-[46%] text-[9px] font-medium tracking-wider text-yellow-300/60 md:text-[11px]">
                  ถนน สันกำแพงสายเก่า
                </div>
                <div
                  className="absolute left-[15%] top-[30%] text-[9px] font-medium tracking-wider text-yellow-300/50 md:text-[11px]"
                  style={{ transform: "rotate(-90deg)" }}
                >
                  ถ.วงแหวน
                </div>
              </div>}
            </div>
          </div>

          {/* Google Maps embed */}
          <div
            className={`transition-opacity duration-500 ${
              showMap ? "opacity-100" : "pointer-events-none absolute inset-0 opacity-0"
            }`}
          >
            <div className="aspect-[16/7] w-full">
              {showMap && (
                <iframe
                  src={mapEmbedUrl}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title={`แผนที่ ${projectName}`}
                  className="h-full w-full"
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
