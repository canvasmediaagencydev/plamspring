"use client";

import { useEffect, useState } from "react";
import { AdminHeader } from "@/app/components/admin/AdminHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Save, Video } from "lucide-react";
import { revalidatePages, REVALIDATE_PATHS } from "@/lib/revalidate";

interface VideoConfig { youtube_url: string; title: string }
interface HomeVideos { video1: VideoConfig; video2: VideoConfig }
interface FeaturedVideo { youtube_url: string; title: string }

export default function AdminVideosPage() {
  const [homeVideos, setHomeVideos] = useState<HomeVideos>({ video1: { youtube_url: "", title: "" }, video2: { youtube_url: "", title: "" } });
  const [featuredVideo, setFeaturedVideo] = useState<FeaturedVideo>({ youtube_url: "", title: "" });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch("/api/admin/site-settings").then((r) => r.json()).then((data: { key: string; value: unknown }[]) => {
      const hv = data.find((r) => r.key === "home_videos")?.value as HomeVideos | undefined;
      const fv = data.find((r) => r.key === "featured_video")?.value as FeaturedVideo | undefined;
      if (hv) setHomeVideos(hv);
      if (fv) setFeaturedVideo(fv);
    });
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await fetch("/api/admin/site-settings", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify([{ key: "home_videos", value: homeVideos }, { key: "featured_video", value: featuredVideo }]) });
      await revalidatePages([...REVALIDATE_PATHS.home]);
      setSaved(true); setTimeout(() => setSaved(false), 2000);
    } finally { setSaving(false) }
  };

  const updateHomeVideo = (key: "video1" | "video2", field: keyof VideoConfig, value: string) => setHomeVideos((prev) => ({ ...prev, [key]: { ...prev[key], [field]: value } }));

  return (
    <div>
      <AdminHeader title="จัดการวิดีโอ" description="แก้ไข YouTube link สำหรับหน้าแรก"
        action={<Button onClick={handleSave} disabled={saving}><Save size={16} />{saved ? "บันทึกแล้ว!" : saving ? "กำลังบันทึก..." : "บันทึก"}</Button>} />
      <div className="space-y-6 max-w-2xl">
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2 text-base"><Video size={18} className="text-red-500" />วิดีโอแนะนำ (2 วิดีโอ)</CardTitle></CardHeader>
          <CardContent className="space-y-6">
            {(["video1", "video2"] as const).map((key, i) => (
              <div key={key} className="space-y-3 pb-4 border-b border-gray-100 last:border-0 last:pb-0">
                <p className="text-sm font-medium text-gray-600">วิดีโอที่ {i + 1}</p>
                <div className="space-y-2"><Label htmlFor={`${key}-url`}>YouTube URL หรือ Video ID</Label><Input id={`${key}-url`} placeholder="https://www.youtube.com/watch?v=..." value={homeVideos[key].youtube_url} onChange={(e) => updateHomeVideo(key, "youtube_url", e.target.value)} /></div>
                <div className="space-y-2"><Label htmlFor={`${key}-title`}>ชื่อวิดีโอ</Label><Input id={`${key}-title`} placeholder="ชื่อวิดีโอ" value={homeVideos[key].title} onChange={(e) => updateHomeVideo(key, "title", e.target.value)} /></div>
              </div>
            ))}
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2 text-base"><Video size={18} className="text-red-500" />Featured Video (1 วิดีโอ)</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-2"><Label htmlFor="featured-url">YouTube URL หรือ Video ID</Label><Input id="featured-url" placeholder="https://www.youtube.com/watch?v=..." value={featuredVideo.youtube_url} onChange={(e) => setFeaturedVideo((prev) => ({ ...prev, youtube_url: e.target.value }))} /></div>
            <div className="space-y-2"><Label htmlFor="featured-title">ชื่อวิดีโอ</Label><Input id="featured-title" placeholder="ชื่อวิดีโอ" value={featuredVideo.title} onChange={(e) => setFeaturedVideo((prev) => ({ ...prev, title: e.target.value }))} /></div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
