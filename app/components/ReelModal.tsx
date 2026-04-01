"use client";

import { useEffect, useRef } from "react";
import { X } from "lucide-react";

type Platform = "tiktok" | "youtube" | "instagram";

interface ReelModalProps {
  videoUrl: string | null;
  platform: Platform | null;
  onClose: () => void;
}

function getYouTubeEmbedUrl(url: string): string | null {
  const patterns = [
    /[?&]v=([^&#]+)/,
    /youtu\.be\/([^?&#]+)/,
    /youtube\.com\/shorts\/([^?&#]+)/,
    /youtube\.com\/embed\/([^?&#]+)/,
  ];
  for (const p of patterns) {
    const m = url.match(p);
    if (m) return `https://www.youtube.com/embed/${m[1]}?autoplay=1&rel=0`;
  }
  return null;
}

/** Extract TikTok video ID from URL */
function getTikTokVideoId(url: string): string | null {
  const m = url.match(/video\/(\d+)/);
  return m ? m[1] : null;
}

/** Strip query params from URL */
function cleanUrl(url: string): string {
  try {
    const u = new URL(url);
    return `${u.origin}${u.pathname}`;
  } catch {
    return url.split("?")[0];
  }
}

/** Extract Instagram shortcode from /reel/, /reels/, or /p/ URL */
function getInstagramShortcode(url: string): string | null {
  const m = url.match(/\/(?:p|reel|reels)\/([^/?]+)/);
  return m ? m[1] : null;
}

/** Renders TikTok video via direct iframe embed (no embed.js required) */
function TikTokEmbed({ videoId }: { videoId: string }) {
  return (
    <iframe
      src={`https://www.tiktok.com/embed/v2/${videoId}`}
      title="TikTok video"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowFullScreen
      style={{ width: 325, height: "min(740px, 85vh)", border: 0 }}
      className="rounded-2xl block"
    />
  );
}

/** Renders Instagram's official blockquote embed and loads their embed.js */
function InstagramEmbed({ videoUrl, shortcode }: { videoUrl: string; shortcode: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const permalink = cleanUrl(videoUrl);

  useEffect(() => {
    if (!containerRef.current) return;
    const existing = document.getElementById("instagram-embed-script");
    if (existing) existing.remove();
    const script = document.createElement("script");
    script.id = "instagram-embed-script";
    script.src = "https://www.instagram.com/embed.js";
    script.async = true;
    document.body.appendChild(script);
    // Trigger Instagram to re-process embeds if already loaded
    if (typeof window !== "undefined" && (window as Window & { instgrm?: { Embeds?: { process?: () => void } } }).instgrm?.Embeds?.process) {
      (window as Window & { instgrm?: { Embeds?: { process?: () => void } } }).instgrm!.Embeds!.process!();
    }
    return () => { script.remove(); };
  }, [shortcode]);

  return (
    <div ref={containerRef} className="flex justify-center overflow-y-auto max-h-[90vh]">
      <blockquote
        className="instagram-media"
        data-instgrm-permalink={permalink}
        data-instgrm-version="14"
        style={{ maxWidth: 540, minWidth: 326, width: "100%" }}
      />
    </div>
  );
}

export function ReelModal({ videoUrl, platform, onClose }: ReelModalProps) {
  useEffect(() => {
    if (!videoUrl) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [videoUrl, onClose]);

  if (!videoUrl || !platform) return null;

  const youtubeEmbedUrl = platform === "youtube" ? getYouTubeEmbedUrl(videoUrl) : null;
  const tiktokVideoId = platform === "tiktok" ? getTikTokVideoId(videoUrl) : null;
  const instagramShortcode = platform === "instagram" ? getInstagramShortcode(videoUrl) : null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <button
        onClick={onClose}
        className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
        aria-label="ปิด"
      >
        <X size={20} />
      </button>

      {youtubeEmbedUrl ? (
        /* ── YouTube: iframe embed ── */
        <div className="w-full max-w-4xl" onClick={(e) => e.stopPropagation()}>
          <div className="relative aspect-video w-full overflow-hidden rounded-2xl shadow-2xl">
            <iframe
              key={youtubeEmbedUrl}
              src={youtubeEmbedUrl}
              title="YouTube video"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="absolute inset-0 h-full w-full border-0"
            />
          </div>
        </div>
      ) : tiktokVideoId ? (
        /* ── TikTok: direct iframe embed ── */
        <div
          className="rounded-2xl overflow-hidden shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          <TikTokEmbed videoId={tiktokVideoId} />
        </div>
      ) : instagramShortcode ? (
        /* ── Instagram: official blockquote embed ── */
        <div
          className="rounded-2xl bg-white shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          <InstagramEmbed videoUrl={videoUrl} shortcode={instagramShortcode} />
        </div>
      ) : (
        /* ── Fallback ── */
        <div
          className="flex flex-col items-center gap-5 rounded-2xl bg-white p-8 shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          <p className="text-sm text-gray-500">ไม่สามารถโหลดวิดีโอได้</p>
          <a
            href={videoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full bg-[#09418C] px-6 py-3 text-sm font-semibold text-white transition hover:opacity-90"
          >
            เปิดในแอป →
          </a>
        </div>
      )}
    </div>
  );
}
