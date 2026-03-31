"use client";

import { useState } from "react";
import { ReelModal } from "./ReelModal";

type Platform = "tiktok" | "youtube" | "instagram";

interface SocialReel {
  hashtag: string;
  label: string;
  video_url: string;
  thumbnail_url: string;
  platform: Platform;
}

function PlatformIcon({ platform }: { platform: Platform }) {
  if (platform === "tiktok") {
    return (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4" aria-hidden="true">
        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.75a4.85 4.85 0 0 1-1.01-.06z" />
      </svg>
    );
  }
  if (platform === "instagram") {
    return (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4" aria-hidden="true">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4" aria-hidden="true">
      <path d="M21.8 8s-.2-1.4-.8-2c-.8-.8-1.6-.8-2-.9C16.8 5 12 5 12 5s-4.8 0-7 .1c-.4.1-1.2.1-2 .9-.6.6-.8 2-.8 2S2 9.6 2 11.2v1.5c0 1.6.2 3.2.2 3.2s.2 1.4.8 2c.8.8 1.8.8 2.2.8C6.6 19 12 19 12 19s4.8 0 7-.2c.4-.1 1.2-.1 2-.9.6-.6.8-2 .8-2s.2-1.6.2-3.2v-1.5C22 9.6 21.8 8 21.8 8zM10 15V9l5.5 3-5.5 3z" />
    </svg>
  );
}

export default function HomeCommunityReels({ reels }: { reels: SocialReel[] }) {
  const [active, setActive] = useState<{ url: string; platform: Platform } | null>(null);

  return (
    <>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {reels.map((reel, i) => (
          <button
            key={i}
            onClick={() => reel.video_url && setActive({ url: reel.video_url, platform: reel.platform })}
            className="group overflow-hidden rounded-2xl bg-gray-100 text-left transition-shadow hover:shadow-md"
          >
            <div className="relative aspect-video w-full overflow-hidden bg-gray-200">
              {reel.thumbnail_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={reel.thumbnail_url}
                  alt={`${reel.hashtag} ${reel.label}`}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              ) : (
                <div className="absolute inset-0 animate-pulse bg-gradient-to-br from-gray-200 via-gray-300 to-gray-200" />
              )}

              {/* Platform badge */}
              <div className="absolute left-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-white/90 text-[#010101] shadow">
                <PlatformIcon platform={reel.platform} />
              </div>

              {/* Play overlay */}
              {reel.video_url && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-colors group-hover:bg-black/20">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/80 opacity-0 shadow transition-opacity group-hover:opacity-100">
                    <svg viewBox="0 0 24 24" fill="#09418C" className="ml-0.5 h-5 w-5" aria-hidden="true">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                </div>
              )}
            </div>

            <div className="bg-white px-3 py-2">
              <p className="text-[10px] font-semibold text-gray-400">{reel.hashtag}</p>
              <p className="text-xs font-bold text-gray-700">{reel.label}</p>
            </div>
          </button>
        ))}
      </div>

      <ReelModal
        videoUrl={active?.url ?? null}
        platform={active?.platform ?? null}
        onClose={() => setActive(null)}
      />
    </>
  );
}
