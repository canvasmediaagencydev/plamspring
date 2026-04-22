"use client";

import { useState, useEffect } from "react";
import {
  Waves,
  TreePine,
  Home,
  Shield,
  Camera,
  Dumbbell,
  Maximize2,
  X,
  type LucideIcon,
} from "lucide-react";

export interface Facility {
  icon: string;
  name?: string;
  label?: string;
}

const ICON_MAP: Record<string, LucideIcon> = {
  pool: Waves,
  park: TreePine,
  clubhouse: Home,
  security: Shield,
  cctv: Camera,
  fitness: Dumbbell,
};

const DEFAULT_LABELS: Record<string, string> = {
  pool: "สระว่ายน้ำส่วนกลาง",
  park: "สวนสาธารณะ",
  clubhouse: "คลับเฮาส์",
  security: "รักษาความปลอดภัย",
  cctv: "กล้องวงจรปิด",
  fitness: "ฟิตเนส",
};

interface ProjectFacilitiesProps {
  facilities: Facility[];
  image1?: string;
  image2?: string;
}

export default function ProjectFacilities({
  facilities,
  image1,
  image2,
}: ProjectFacilitiesProps) {
  const [previewImage, setPreviewImage] = useState<{ url: string; alt: string } | null>(null);

  useEffect(() => {
    if (!previewImage) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setPreviewImage(null);
    };
    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [previewImage]);

  if (facilities.length === 0 && !image1 && !image2) return null;

  return (
    <section className="bg-gray-50 py-16 md:py-24">
      <div className="mx-auto max-w-6xl px-4">
        <div className="flex flex-col gap-12 md:flex-row md:items-center md:gap-16">

          {/* Left — side by side floor plan images */}
          {(image1 || image2) && (
            <div className="flex w-full shrink-0 gap-4 md:w-[45%]">
              {image1 && (
                <button
                  type="button"
                  onClick={() => setPreviewImage({ url: image1, alt: "แปลนบ้าน 1" })}
                  className="group relative aspect-[3/4] w-1/2 overflow-hidden rounded-2xl shadow-md cursor-zoom-in text-left block"
                  aria-label="ดูแปลนบ้าน 1 แบบเต็มจอ"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={image1} alt="แปลนบ้าน 1" className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]" />
                  <span className="absolute bottom-4 right-4 flex h-10 w-10 items-center justify-center rounded-full bg-black/45 text-white opacity-0 shadow-md backdrop-blur-sm transition-opacity duration-200 group-hover:opacity-100 group-focus-visible:opacity-100">
                    <Maximize2 className="h-5 w-5" />
                  </span>
                </button>
              )}
              {image2 && (
                <button
                  type="button"
                  onClick={() => setPreviewImage({ url: image2, alt: "แปลนบ้าน 2" })}
                  className="group relative aspect-[3/4] w-1/2 overflow-hidden rounded-2xl shadow-md cursor-zoom-in text-left block"
                  aria-label="ดูแปลนบ้าน 2 แบบเต็มจอ"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={image2} alt="แปลนบ้าน 2" className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]" />
                  <span className="absolute bottom-4 right-4 flex h-10 w-10 items-center justify-center rounded-full bg-black/45 text-white opacity-0 shadow-md backdrop-blur-sm transition-opacity duration-200 group-hover:opacity-100 group-focus-visible:opacity-100">
                    <Maximize2 className="h-5 w-5" />
                  </span>
                </button>
              )}
            </div>
          )}

          {/* Right — heading + icon grid */}
          <div className="w-full">
            {/* Section label */}
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.3em] text-primary/60">
              Facilities
            </p>
            <h2 className="mb-8 text-2xl font-bold text-gray-900 md:text-3xl">
              สิ่งอำนวยความสะดวก
            </h2>

            {/* Icon grid with dividers */}
            {facilities.length > 0 && (
            <div className="grid grid-cols-3 divide-x divide-y divide-gray-200 rounded-2xl border border-gray-200 bg-white overflow-hidden shadow-sm">
              {facilities.map((fac, i) => {
                const Icon = ICON_MAP[fac.icon] ?? Home;
                const displayLabel =
                  fac.name ?? fac.label ?? DEFAULT_LABELS[fac.icon] ?? fac.icon;
                return (
                  <div
                    key={i}
                    className="flex flex-col items-center gap-3 px-4 py-6 text-center"
                  >
                    <Icon
                      className="h-9 w-9 text-gray-700"
                      strokeWidth={1.25}
                    />
                    <p className="text-xs font-medium leading-tight text-gray-600">
                      {displayLabel}
                    </p>
                  </div>
                );
              })}
            </div>
            )}
          </div>

        </div>
      </div>

      {previewImage && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 p-4 backdrop-blur-sm md:p-8"
          role="dialog"
          aria-modal="true"
          aria-label={previewImage.alt}
          onClick={() => setPreviewImage(null)}
        >
          <button
            type="button"
            onClick={() => setPreviewImage(null)}
            className="absolute right-4 top-4 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-white/90 text-gray-900 shadow-lg transition-colors hover:bg-white md:right-6 md:top-6"
            aria-label="ปิดรูปแปลนบ้าน"
          >
            <X className="h-6 w-6" />
          </button>

          <div
            className="relative flex max-h-[90vh] w-full max-w-6xl items-center justify-center"
            onClick={(event) => event.stopPropagation()}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={previewImage.url}
              alt={previewImage.alt}
              className="max-h-[90vh] w-auto max-w-full rounded-lg object-contain shadow-2xl"
            />
          </div>
        </div>
      )}
    </section>
  );
}
