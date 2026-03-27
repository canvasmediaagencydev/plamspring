"use client";

import { useState } from "react";
import { VideoModal } from "./VideoModal";

interface VideoConfig {
  youtube_url?: string;
  title?: string;
}

interface OurFamilyVideosProps {
  video1?: VideoConfig;
  video2?: VideoConfig;
}

function extractYouTubeId(input: string): string {
  const patterns = [
    /[?&]v=([^&#]+)/,
    /youtu\.be\/([^?&#]+)/,
    /youtube\.com\/embed\/([^?&#]+)/,
  ];
  for (const pattern of patterns) {
    const match = input.match(pattern);
    if (match) return match[1];
  }
  return input.trim();
}

function PlayButton() {
  return (
    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-600 shadow-lg md:h-20 md:w-20">
      <svg viewBox="0 0 24 24" fill="white" className="ml-1 h-7 w-7 md:h-9 md:w-9" aria-hidden="true">
        <path d="M8 5v14l11-7z" />
      </svg>
    </div>
  );
}

function SkeletonVideoCard() {
  return (
    <div className="relative w-full overflow-hidden rounded-2xl bg-gray-800 shadow-md">
      <div className="relative h-52 w-full bg-gray-300 md:h-72">
        <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-gray-300 via-gray-200 to-gray-300" />
      </div>
      <div className="absolute inset-0 flex items-center justify-center">
        <PlayButton />
      </div>
      <div className="flex items-center bg-gray-900/80 px-4 py-2">
        <span className="text-sm font-semibold text-white/50">Loading...</span>
      </div>
    </div>
  );
}

function RealVideoCard({
  video,
  onPlay,
}: {
  video: VideoConfig;
  onPlay: (id: string) => void;
}) {
  const youtubeId = video.youtube_url ? extractYouTubeId(video.youtube_url) : "";
  const thumbnail = `https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg`;

  return (
    <button
      onClick={() => onPlay(youtubeId)}
      className="group relative block w-full overflow-hidden rounded-2xl bg-gray-800 shadow-md"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={thumbnail}
        alt={video.title ?? ""}
        className="h-52 w-full object-cover transition-transform duration-300 group-hover:scale-105 md:h-72"
      />
      <div className="absolute inset-0 bg-black/20 transition-colors group-hover:bg-black/30" />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="transition-transform duration-200 group-hover:scale-110">
          <PlayButton />
        </div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 flex items-center gap-2 bg-gray-900/80 px-4 py-2">
        <svg viewBox="0 0 24 24" fill="white" className="h-5 w-5 shrink-0" aria-hidden="true">
          <path d="M21.8 8s-.2-1.4-.8-2c-.8-.8-1.6-.8-2-.9C16.8 5 12 5 12 5s-4.8 0-7 .1c-.4.1-1.2.1-2 .9-.6.6-.8 2-.8 2S2 9.6 2 11.2v1.5c0 1.6.2 3.2.2 3.2s.2 1.4.8 2c.8.8 1.8.8 2.2.8C6.6 19 12 19 12 19s4.8 0 7-.2c.4-.1 1.2-.1 2-.9.6-.6.8-2 .8-2s.2-1.6.2-3.2v-1.5C22 9.6 21.8 8 21.8 8zM10 15V9l5.5 3-5.5 3z" />
        </svg>
        <span className="text-sm font-semibold text-white">{video.title || "ดูวิดีโอ"}</span>
      </div>
    </button>
  );
}

export default function OurFamilyVideos({ video1, video2 }: OurFamilyVideosProps) {
  const [activeId, setActiveId] = useState<string | null>(null);

  return (
    <section className="w-full bg-white py-6 md:py-10">
      <div className="mx-auto flex max-w-4xl flex-col gap-6 px-6 md:px-12">
        {video1?.youtube_url ? (
          <RealVideoCard video={video1} onPlay={setActiveId} />
        ) : (
          <SkeletonVideoCard />
        )}
        {video2?.youtube_url ? (
          <RealVideoCard video={video2} onPlay={setActiveId} />
        ) : (
          <SkeletonVideoCard />
        )}
      </div>

      <VideoModal youtubeId={activeId} onClose={() => setActiveId(null)} />
    </section>
  );
}
