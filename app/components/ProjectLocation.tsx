"use client";

export interface NearbyPlace {
  name: string;
  distance?: number | string;
  unit?: string;
  category?: string;
  details?: string[];
}

interface ProjectLocationProps {
  places: NearbyPlace[];
}

export default function ProjectLocation({ places }: ProjectLocationProps) {
  if (places.length === 0) return null;

  return (
    <section className="bg-primary py-14 md:py-24">
      <div className="mx-auto max-w-6xl px-4">
        {/* Section heading */}
        <h2 className="mb-12 text-center text-2xl font-bold text-white md:mb-16 md:text-3xl">
          ทำเลที่ตั้งโครงการ
        </h2>

        {/* Places grid */}
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4 md:gap-6">
          {places.map((place, i) => (
            <div key={i} className="flex flex-col items-center text-center">

              {/* Distance circle */}
              <div className="mb-5 flex h-28 w-28 flex-col items-center justify-center rounded-full bg-white shadow-xl md:h-32 md:w-32">
                <span className="text-3xl font-bold leading-none text-gray-900 md:text-4xl">
                  {place.distance}
                </span>
                {place.unit && (
                  <span className="mt-1 text-sm font-medium text-gray-500">
                    {place.unit}
                  </span>
                )}
              </div>

              {/* Place name */}
              <p className="mb-3 text-sm font-bold uppercase leading-snug tracking-wide text-white md:text-base">
                {place.name}
              </p>

              {/* Category badge */}
              {place.category && (
                <span className="mb-4 inline-block rounded-full border border-white/50 px-4 py-1 text-xs font-medium text-white">
                  {place.category}
                </span>
              )}

              {/* Detail bullet list */}
              {place.details && place.details.length > 0 && (
                <ul className="w-full space-y-1.5 text-left">
                  {place.details.map((detail, j) => (
                    <li
                      key={j}
                      className="flex items-start gap-2 text-xs text-white/80 md:text-sm"
                    >
                      <span className="mt-[5px] h-1.5 w-1.5 shrink-0 rounded-full bg-white/60" />
                      <span>{detail}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
