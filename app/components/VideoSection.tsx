"use client";

import Image from "next/image";

interface Video {
  id: string;
  title: string;
  youtubeId: string;
  thumbnail?: string;
}

interface VideoCardProps {
  video?: Video;
}

function VideoCardSkeleton() {
  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-gray-200 animate-pulse">
      {/* Thumbnail placeholder */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300" />

      {/* Play button skeleton */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="h-14 w-14 rounded-full bg-gray-400/60" />
      </div>

      {/* Bottom bar skeleton */}
      <div className="absolute bottom-0 left-0 right-0 flex items-center gap-2 bg-black/40 px-3 py-2">
        <div className="h-4 w-4 rounded bg-gray-400/60" />
        <div className="h-3 w-20 rounded bg-gray-400/60" />
      </div>

      {/* Title skeleton */}
      <div className="absolute left-3 top-3 space-y-1.5">
        <div className="h-3 w-40 rounded bg-gray-400/50" />
        <div className="h-3 w-32 rounded bg-gray-400/50" />
      </div>
    </div>
  );
}

function VideoCard({ video }: VideoCardProps) {
  if (!video) return <VideoCardSkeleton />;

  const thumbnailUrl =
    video.thumbnail ??
    `https://img.youtube.com/vi/${video.youtubeId}/maxresdefault.jpg`;

  return (
    <a
      href={`https://www.youtube.com/watch?v=${video.youtubeId}`}
      target="_blank"
      rel="noopener noreferrer"
      className="group relative block aspect-video w-full overflow-hidden rounded-xl"
    >
      {/* Thumbnail */}
      <Image
        src={thumbnailUrl}
        alt={video.title}
        fill
        className="object-cover transition-transform duration-300 group-hover:scale-105"
      />

      {/* Dark overlay on hover */}
      <div className="absolute inset-0 bg-black/20 transition-colors duration-300 group-hover:bg-black/30" />

      {/* YouTube play button */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#FF0000] shadow-lg transition-transform duration-200 group-hover:scale-110">
          {/* Triangle play icon */}
          <svg viewBox="0 0 24 24" className="ml-1 h-6 w-6 fill-white">
            <path d="M8 5v14l11-7z" />
          </svg>
        </div>
      </div>

      {/* Bottom bar — "ดูบน YouTube" */}
      <div className="absolute bottom-0 left-0 right-0 flex items-center gap-1.5 bg-black/50 px-3 py-2">
        {/* YouTube logo mark */}
        <svg viewBox="0 0 24 24" className="h-4 w-4 fill-[#FF0000]">
          <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.6 12 3.6 12 3.6s-7.5 0-9.4.5A3 3 0 0 0 .5 6.2 31.6 31.6 0 0 0 0 12a31.6 31.6 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.5 9.4.5 9.4.5s7.5 0 9.4-.5a3 3 0 0 0 2.1-2.1A31.6 31.6 0 0 0 24 12a31.6 31.6 0 0 0-.5-5.8z" />
          <path d="M9.7 15.5V8.5l6.3 3.5-6.3 3.5z" className="fill-white" />
        </svg>
        <span className="text-xs font-medium text-white">ดูบน YouTube</span>
      </div>
    </a>
  );
}

// ── Data ──────────────────────────────────────────────────────────────────────
// เพิ่มวิดีโอได้ที่นี่เมื่อมีข้อมูล
const videos: Video[] = [
  // { id: "1", title: "เปิดใจ CEO Palmsprings", youtubeId: "YOUTUBE_ID_1" },
  // { id: "2", title: "แต่งบ้านให้ปัง", youtubeId: "YOUTUBE_ID_2" },
];

const SKELETON_COUNT = 2;

export default function VideoSection() {
  const displayItems = videos.length > 0 ? videos : Array(SKELETON_COUNT).fill(undefined);

  return (
    <section className="mx-auto max-w-6xl px-4 py-16">
      {/* Section heading */}
      <div className="mb-10 text-center">
        <h2 className="text-3xl font-bold text-primary">วิดีโอแนะนำ</h2>
        <p className="mt-2 text-gray-500">ชมวิดีโอแนะนำโครงการและไลฟ์สไตล์จาก Palm Springs</p>
      </div>

      {/* Video grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        {displayItems.map((video, i) => (
          <VideoCard key={video?.id ?? i} video={video} />
        ))}
      </div>
    </section>
  );
}
