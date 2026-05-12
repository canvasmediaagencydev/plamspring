"use client";

import { FaFacebookF, FaLine, FaYoutube, FaGlobe } from "react-icons/fa";

interface ProjectHeroProps {
  name: string;
  subtitle: string;
  heroImageUrl?: string;
  socialLinks?: {
    facebook?: string;
    line?: string;
    youtube?: string;
    website?: string;
  };
}

export default function ProjectHero({
  name,
  subtitle,
  heroImageUrl,
  socialLinks = {},
}: ProjectHeroProps) {
  const socials = [
    { icon: FaGlobe, href: socialLinks.website, label: "Website", bg: "bg-gray-600" },
    { icon: FaFacebookF, href: socialLinks.facebook, label: "Facebook", bg: "bg-[#1877F2]" },
    { icon: FaLine, href: socialLinks.line, label: "Line", bg: "bg-[#06C755]" },
    { icon: FaYoutube, href: socialLinks.youtube, label: "YouTube", bg: "bg-[#FF0000]" },
  ].filter((s) => s.href);

  return (
    <section className="relative mt-16 w-full overflow-hidden md:mt-20">
      {/* Hero image */}
      <div className="relative h-[380px] w-full sm:h-[480px] md:h-[580px] lg:h-[750px]">
        {heroImageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={heroImageUrl}
            alt={name}
            className="absolute inset-0 h-full w-full object-cover object-[center_85%]"
          />
        ) : (
          <>
            <div className="absolute inset-0 animate-pulse bg-gradient-to-br from-gray-200 via-gray-300 to-gray-200" />
            {/* Decorative skeleton pattern overlay */}
            <div className="absolute inset-0 opacity-30">
              <div className="absolute left-[10%] top-[20%] h-40 w-60 rounded-2xl bg-gray-300/50 sm:h-52 sm:w-80" />
              <div className="absolute bottom-[15%] right-[8%] h-32 w-44 rounded-2xl bg-gray-300/50 sm:h-44 sm:w-56" />
              <div className="absolute bottom-[30%] left-[30%] h-24 w-36 rounded-xl bg-gray-300/50" />
            </div>
          </>
        )}

        {/* Gradient overlays */}
        {/* <div className="absolute inset-0 bg-gradient-to-r from-white/5 via-transparent to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-white/30 via-transparent to-transparent" /> */}

      </div>
    </section>
  );
}
