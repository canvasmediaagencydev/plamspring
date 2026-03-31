"use client";

import { useEffect, useRef, useState } from "react";
import { createClient, toJson } from "@/lib/supabase/client";
import { AdminHeader } from "@/app/components/admin/AdminHeader";
import { ImageUploader } from "@/app/components/admin/ImageUploader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Save, Wand2 } from "lucide-react";
import { revalidatePages, REVALIDATE_PATHS } from "@/lib/revalidate";

type Platform = "tiktok" | "youtube" | "instagram";

interface SocialReel {
  hashtag: string;
  label: string;
  video_url: string;
  thumbnail_url: string;
  platform: Platform;
}

const PLATFORM_OPTIONS: { value: Platform; label: string }[] = [
  { value: "tiktok", label: "TikTok" },
  { value: "youtube", label: "YouTube Shorts" },
  { value: "instagram", label: "Instagram Reels" },
];

const DEFAULT_REELS: SocialReel[] = [
  { hashtag: "#PALMSPRINGS", label: "STORY", video_url: "", thumbnail_url: "", platform: "tiktok" },
  { hashtag: "#PALMSPRINGS", label: "LIFESTYLE", video_url: "", thumbnail_url: "", platform: "tiktok" },
  { hashtag: "#PALMSPRINGS", label: "COMMUNITY", video_url: "", thumbnail_url: "", platform: "youtube" },
  { hashtag: "#PALMSPRINGS", label: "PET FRIENDLY", video_url: "", thumbnail_url: "", platform: "instagram" },
];

export default function AdminSocialReelsPage() {
  const supabase = createClient();
  const [reels, setReels] = useState<SocialReel[]>(DEFAULT_REELS);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    async function load() {
      const { data } = await supabase
      .from("site_settings")
      .select("value")
      .eq("key", "social_reels")
      .single();
      if (data?.value) {
        const loaded = data.value as unknown as SocialReel[];
        setReels(loaded);
        reelsRef.current = loaded;
      }
    }
    load();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const debounceTimers = useRef<(ReturnType<typeof setTimeout> | null)[]>([null, null, null, null]);
  const reelsRef = useRef<SocialReel[]>(DEFAULT_REELS);

  const update = (index: number, field: keyof SocialReel, value: string) => {
    setReels((prev) => {
      const next = prev.map((r, i) => (i === index ? { ...r, [field]: value } : r));
      reelsRef.current = next;
      return next;
    });
  };

  const fetchThumbnail = async (url: string, platform: Platform, index: number) => {
    if (!url) return;

    if (platform === "youtube") {
      const patterns = [/[?&]v=([^&#]+)/, /youtu\.be\/([^?&#]+)/, /youtube\.com\/shorts\/([^?&#]+)/];
      for (const p of patterns) {
        const m = url.match(p);
        if (m) {
          update(index, "thumbnail_url", `https://img.youtube.com/vi/${m[1]}/maxresdefault.jpg`);
          return;
        }
      }
    }

    if (platform === "tiktok") {
      try {
        const res = await fetch(`https://www.tiktok.com/oembed?url=${encodeURIComponent(url)}`);
        const json = await res.json();
        if (json.thumbnail_url) update(index, "thumbnail_url", json.thumbnail_url);
      } catch { /* user uploads manually */ }
    }

    if (platform === "instagram") {
      try {
        const res = await fetch(`/api/og-thumbnail?url=${encodeURIComponent(url)}`);
        const json = await res.json();
        if (json.thumbnail_url) update(index, "thumbnail_url", json.thumbnail_url);
      } catch { /* user uploads manually */ }
    }
  };

  const onVideoUrlChange = (index: number, value: string) => {
    update(index, "video_url", value);
    const prev = debounceTimers.current[index];
    if (prev) clearTimeout(prev);
    debounceTimers.current[index] = setTimeout(() => {
      const reel = reelsRef.current[index];
      if (!reel.thumbnail_url) {
        fetchThumbnail(value, reel.platform, index);
      }
    }, 800);
  };

  const autoThumbnail = (index: number) => {
    update(index, "thumbnail_url", "");
    setTimeout(() => {
      const reel = reelsRef.current[index];
      fetchThumbnail(reel.video_url, reel.platform, index);
    }, 0);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await supabase
        .from("site_settings")
        .upsert({ key: "social_reels", value: toJson(reels) });
      await revalidatePages([...REVALIDATE_PATHS.home]);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <AdminHeader
        title="Social Reels"
        description="จัดการวิดีโอ TikTok / YouTube Shorts / Instagram Reels บนหน้าแรก"
        action={
          <Button onClick={handleSave} disabled={saving}>
            <Save size={16} />
            {saved ? "บันทึกแล้ว!" : saving ? "กำลังบันทึก..." : "บันทึก"}
          </Button>
        }
      />

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 max-w-4xl">
        {reels.map((reel, i) => (
          <Card key={i}>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold text-gray-700">
                การ์ดที่ {i + 1} — {reel.hashtag} {reel.label}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Platform */}
              <div className="space-y-1.5">
                <Label>Platform</Label>
                <select
                  value={reel.platform}
                  onChange={(e) => update(i, "platform", e.target.value)}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                >
                  {PLATFORM_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>

              {/* Hashtag */}
              <div className="space-y-1.5">
                <Label>Hashtag</Label>
                <Input
                  value={reel.hashtag}
                  onChange={(e) => update(i, "hashtag", e.target.value)}
                  placeholder="#PALMSPRINGS"
                />
              </div>

              {/* Label */}
              <div className="space-y-1.5">
                <Label>Label</Label>
                <Input
                  value={reel.label}
                  onChange={(e) => update(i, "label", e.target.value)}
                  placeholder="STORY"
                />
              </div>

              {/* Video URL */}
              <div className="space-y-1.5">
                <Label>Video URL</Label>
                <div className="flex gap-2">
                  <Input
                    value={reel.video_url}
                    onChange={(e) => onVideoUrlChange(i, e.target.value)}
                    placeholder="https://www.tiktok.com/@..."
                    className="flex-1"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => autoThumbnail(i)}
                    title="ดึง Thumbnail อัตโนมัติ"
                    disabled={!reel.video_url}
                  >
                    <Wand2 size={14} />
                  </Button>
                </div>
                <p className="text-[11px] text-gray-400">
                  Thumbnail ดึงอัตโนมัติเมื่อ paste URL — กด <Wand2 size={10} className="inline" /> เพื่อดึงใหม่
                </p>
              </div>

              {/* Thumbnail */}
              <div className="space-y-1.5">
                <Label>Thumbnail</Label>
                <ImageUploader
                  bucket="social-reels"
                  value={reel.thumbnail_url}
                  onChange={(url) => update(i, "thumbnail_url", url)}
                  onClear={() => update(i, "thumbnail_url", "")}
                />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
