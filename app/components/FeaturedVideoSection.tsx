"use client";

import Image from "next/image";

interface FeaturedVideo {
  youtubeId: string;
  title: string;
}

// เพิ่มข้อมูลเมื่อพร้อม
const featuredVideo: FeaturedVideo | null = null;
// const featuredVideo: FeaturedVideo = {
//   youtubeId: "YOUTUBE_ID",
//   title: "แต่งเติมบ้านในฝัน กับโครงการทำเลกลางเมือง...",
// };

function VideoSkeleton() {
  return (
    <div className="relative aspect-video w-full animate-pulse overflow-hidden rounded-2xl bg-gray-200">
      {/* Fake top bar */}
      <div className="absolute left-4 top-4 flex items-center gap-3">
        <div className="h-10 w-10 rounded-full bg-gray-300" />
        <div className="space-y-1.5">
          <div className="h-3 w-48 rounded bg-gray-300" />
          <div className="h-3 w-32 rounded bg-gray-300" />
        </div>
      </div>

      {/* Play button */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gray-400/60">
          <svg viewBox="0 0 24 24" className="ml-1.5 h-9 w-9 fill-white/80">
            <path d="M8 5v14l11-7z" />
          </svg>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="absolute bottom-0 left-0 right-0 flex items-center gap-2 bg-black/30 px-4 py-3">
        <div className="h-5 w-5 rounded bg-gray-400/60" />
        <div className="h-4 w-28 rounded bg-gray-400/60" />
      </div>
    </div>
  );
}

function FeaturedVideoPlayer({ video }: { video: FeaturedVideo }) {
  const thumbnail = `https://img.youtube.com/vi/${video.youtubeId}/maxresdefault.jpg`;

  return (
    <a
      href={`https://www.youtube.com/watch?v=${video.youtubeId}`}
      target="_blank"
      rel="noopener noreferrer"
      className="group relative block aspect-video w-full overflow-hidden rounded-2xl"
    >
      <Image src={thumbnail} alt={video.title} fill className="object-cover transition-transform duration-300 group-hover:scale-105" />
      <div className="absolute inset-0 bg-black/20 transition-colors group-hover:bg-black/30" />

      {/* Play button */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#FF0000] shadow-xl transition-transform duration-200 group-hover:scale-110">
          <svg viewBox="0 0 24 24" className="ml-1.5 h-9 w-9 fill-white">
            <path d="M8 5v14l11-7z" />
          </svg>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="absolute bottom-0 left-0 right-0 flex items-center gap-2 bg-black/50 px-4 py-3">
        <svg viewBox="0 0 24 24" className="h-5 w-5 fill-[#FF0000]">
          <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.6 12 3.6 12 3.6s-7.5 0-9.4.5A3 3 0 0 0 .5 6.2 31.6 31.6 0 0 0 0 12a31.6 31.6 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.5 9.4.5 9.4.5s7.5 0 9.4-.5a3 3 0 0 0 2.1-2.1A31.6 31.6 0 0 0 24 12a31.6 31.6 0 0 0-.5-5.8z" />
          <path d="M9.7 15.5V8.5l6.3 3.5-6.3 3.5z" className="fill-white" />
        </svg>
        <span className="text-sm font-medium text-white">ดูบน YouTube</span>
      </div>
    </a>
  );
}

export default function FeaturedVideoSection() {
  return (
    <>
      {/* Large video */}
      <section className="bg-gray-100 px-4 py-12">
        <div className="mx-auto max-w-6xl">
          {featuredVideo ? (
            <FeaturedVideoPlayer video={featuredVideo} />
          ) : (
            <VideoSkeleton />
          )}
        </div>
      </section>

      {/* Cover image */}
      <section className="w-full px-4 py-12 bg-gray-100 ">
        <Image
          src="/img/Home/Group 86.svg"
          alt="Welcome to Palm Springs"
          width={1330}
          height={470}
          className="w-full h-auto"
        />
      </section>
    </>
  );
}
