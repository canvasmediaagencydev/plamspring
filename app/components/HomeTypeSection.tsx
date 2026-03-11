"use client";

import { DotLottieReact } from "@lottiefiles/dotlottie-react";

interface HomeTypeCard {
  id: string;
  name: string;
  subtitle: string;
  image: string;
}

// เพิ่มข้อมูลที่นี่เมื่อพร้อม
const homeTypes: HomeTypeCard[] = [
  // {
  //   id: "1",
  //   name: "THE URBANA+ 6",
  //   subtitle: "by Palm Springs",
  //   image: "/img/homes/urbana6.jpg",
  // },
  // {
  //   id: "2",
  //   name: "PALM VILLE",
  //   subtitle: "แยกช่วงสิงห์ - ก.โฉนา",
  //   image: "/img/homes/palmville1.jpg",
  // },
  // {
  //   id: "3",
  //   name: "PALM VILLE",
  //   subtitle: "ก.สันล้านช้างสารใหม่",
  //   image: "/img/homes/palmville2.jpg",
  // },
  // {
  //   id: "4",
  //   name: "PALM SPRINGS PRIVATO",
  //   subtitle: "",
  //   image: "/img/homes/privato.jpg",
  // },
];

const SKELETON_COUNT = 4;

function HomeCardSkeleton() {
  return (
    <div className="flex flex-col overflow-hidden rounded-3xl bg-white shadow-md">
      {/* Image area skeleton */}
      <div className="aspect-[4/3] w-full animate-pulse bg-gray-200" />

      {/* Logo / name area skeleton */}
      <div className="flex flex-col items-center gap-2 px-4 py-5">
        <div className="h-4 w-3/4 animate-pulse rounded bg-gray-200" />
        <div className="h-3 w-1/2 animate-pulse rounded bg-gray-200" />
      </div>
    </div>
  );
}

function HomeCard({ card }: { card: HomeTypeCard }) {
  return (
    <div className="group flex cursor-pointer flex-col overflow-hidden rounded-3xl bg-white shadow-md transition-shadow duration-300 hover:shadow-xl">
      {/* House image */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={card.image}
        alt={card.name}
        className="aspect-[4/3] w-full object-cover transition-transform duration-300 group-hover:scale-105"
      />

      {/* Name / logo area */}
      <div className="flex flex-col items-center gap-1 px-4 py-5 text-center">
        <p className="text-sm font-bold tracking-widest text-primary">{card.name}</p>
        {card.subtitle && (
          <p className="text-xs text-gray-500">{card.subtitle}</p>
        )}
      </div>
    </div>
  );
}

export default function HomeTypeSection() {
  const displayItems =
    homeTypes.length > 0 ? homeTypes : Array(SKELETON_COUNT).fill(undefined);

  return (
    <section className="mx-auto max-w-6xl px-4 py-10 md:py-16 md:pb-30">
      {/* Section header */}
      <div className="mb-8 flex items-center justify-between md:mb-10">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 md:text-sm">
            Home Type
          </p>
          <h2 className="text-2xl font-bold text-primary md:text-4xl">โครงการของเรา</h2>
        </div>

        {/* Lottie icons — hidden on mobile */}
        <div className="relative hidden h-32 w-56 shrink-0 md:block">
          {/* Left animation */}
          <div className="absolute -bottom-10 -left-30 h-59 w-59">
            <DotLottieReact
              src="https://lottie.host/a01bf9c9-be42-446d-8838-c013066bff97/jXBBBuCOpS.lottie"
              loop
              autoplay
            />
          </div>
          {/* House animation */}
          <div className="absolute -bottom-10 right-0 h-60 w-60">
            <DotLottieReact
              src="https://lottie.host/8f23d53b-69e8-41e5-8b50-776b5520178b/beTZAPmn09.lottie"
              loop
              autoplay
            />
          </div>
        </div>
      </div>

      {/* Cards grid */}
      <div className="grid grid-cols-2 gap-5 sm:grid-cols-4">
        {displayItems.map((card, i) =>
          card ? (
            <HomeCard key={card.id} card={card} />
          ) : (
            <HomeCardSkeleton key={i} />
          )
        )}
      </div>
    </section>
  );
}
