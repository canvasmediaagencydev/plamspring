"use client";

import Link from "next/link";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

interface HomeTypeCard {
  id: string;
  name: string;
  image: string;
  logo: string;
  slug: string | null;
}

const SKELETON_COUNT = 4;

function HomeCardSkeleton() {
  return (
    <div className="flex flex-col overflow-hidden rounded-3xl bg-white shadow-md">
      <div className="aspect-[4/3] w-full animate-pulse bg-gray-200" />
      <div className="flex items-center justify-center px-4 py-5">
        <div className="h-8 w-3/4 animate-pulse rounded bg-gray-200" />
      </div>
    </div>
  );
}

function HomeCardContent({ card }: { card: HomeTypeCard }) {
  return (
    <div className="group flex cursor-pointer flex-col overflow-hidden rounded-3xl bg-white shadow-md transition-shadow duration-300 hover:shadow-xl">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={card.image}
        alt={card.name}
        className="aspect-[4/3] w-full object-cover transition-transform duration-300 group-hover:scale-105"
      />
      {/* Logo area */}
      <div className="flex items-center justify-center px-4 py-5">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={card.logo} alt={card.name} className="h-10 max-w-full object-contain" />
      </div>
    </div>
  );
}

function HomeCard({ card }: { card: HomeTypeCard }) {
  if (card.slug) {
    return (
      <Link href={`/projects/${card.slug}`}>
        <HomeCardContent card={card} />
      </Link>
    );
  }
  return <HomeCardContent card={card} />;
}

interface DbProject {
  id: string;
  name: string;
  subtitle: string | null;
  image_url: string;
  logo_url?: string | null;
  sort_order: number;
  is_published: boolean;
  project_pages?: { slug: string | null } | null;
}

interface HomeTypeSectionProps {
  projects?: DbProject[];
}

export default function HomeTypeSection({ projects = [] }: HomeTypeSectionProps) {
  const homeTypes: HomeTypeCard[] = projects.map((p) => ({
    id: p.id,
    name: p.name,
    image: p.image_url,
    logo: p.logo_url ?? "",
    slug: p.project_pages?.slug ?? null,
  }));
  const displayItems = homeTypes.length > 0 ? homeTypes : Array(SKELETON_COUNT).fill(undefined);

  return (
    <section className="mx-auto max-w-6xl px-4 py-10 md:py-16 md:pb-30">
      {/* Section header */}
      <div className="mb-8 flex items-center justify-between md:mb-10">
        <div>
          <p className="text-sm font-semibold uppercase tracking-widest text-gray-400 md:text-base">
            Home Type
          </p>
          <h2 className="text-3xl font-bold text-primary md:text-5xl">โครงการของเรา</h2>
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
          card ? <HomeCard key={card.id} card={card} /> : <HomeCardSkeleton key={i} />,
        )}
      </div>
    </section>
  );
}
