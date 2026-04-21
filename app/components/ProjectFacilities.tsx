"use client";

import {
  Waves,
  TreePine,
  Home,
  Shield,
  Camera,
  Dumbbell,
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
  if (facilities.length === 0 && !image1 && !image2) return null;

  return (
    <section className="bg-gray-50 py-16 md:py-24">
      <div className="mx-auto max-w-6xl px-4">
        <div className="flex flex-col gap-12 md:flex-row md:items-center md:gap-16">

          {/* Left — side by side floor plan images */}
          {(image1 || image2) && (
            <div className="flex w-full shrink-0 gap-4 md:w-[45%]">
              {image1 && (
                <div className="relative aspect-[3/4] w-1/2 overflow-hidden rounded-2xl shadow-md">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={image1} alt="แปลนบ้าน 1" className="absolute inset-0 h-full w-full object-cover" />
                </div>
              )}
              {image2 && (
                <div className="relative aspect-[3/4] w-1/2 overflow-hidden rounded-2xl shadow-md">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={image2} alt="แปลนบ้าน 2" className="absolute inset-0 h-full w-full object-cover" />
                </div>
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
    </section>
  );
}
