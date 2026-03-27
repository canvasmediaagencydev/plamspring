"use client";

import { useEffect } from "react";
import { X } from "lucide-react";

interface VideoModalProps {
  youtubeId: string | null;
  onClose: () => void;
}

/**
 * Full-screen modal that embeds a YouTube player.
 * Opens when youtubeId is non-null; closes on backdrop click, X button, or Escape.
 */
export function VideoModal({ youtubeId, onClose }: VideoModalProps) {
  useEffect(() => {
    if (!youtubeId) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [youtubeId, onClose]);

  if (!youtubeId) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
        aria-label="ปิด"
      >
        <X size={20} />
      </button>

      {/* Video container */}
      <div
        className="w-full max-w-4xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative aspect-video w-full overflow-hidden rounded-2xl shadow-2xl">
          <iframe
            src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1&rel=0`}
            title="YouTube video"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="absolute inset-0 h-full w-full border-0"
          />
        </div>
      </div>
    </div>
  );
}
