"use client";

import { useEffect, useState } from "react";
import { createClient, toJson } from "@/lib/supabase/client";
import { AdminHeader } from "@/app/components/admin/AdminHeader";
import { ImageUploader } from "@/app/components/admin/ImageUploader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Save, Trash2, Plus, Video, Images } from "lucide-react";
import type { Tables } from "@/lib/types/database.types";

type FamilyImage = Tables<"our_family_images">;

interface VideoConfig {
  youtube_url: string;
  title: string;
}

interface FamilyVideos {
  video1: VideoConfig;
  video2: VideoConfig;
}

export default function AdminOurFamilyPage() {
  const supabase = createClient();

  const [sliderImages, setSliderImages] = useState<FamilyImage[]>([]);
  const [gridImages, setGridImages] = useState<FamilyImage[]>([]);
  const [videos, setVideos] = useState<FamilyVideos>({
    video1: { youtube_url: "", title: "" },
    video2: { youtube_url: "", title: "" },
  });
  const [savingVideos, setSavingVideos] = useState(false);
  const [videosSaved, setVideosSaved] = useState(false);
  const [activeTab, setActiveTab] = useState<"slider" | "videos" | "grid">("slider");

  const load = async () => {
    const [imagesRes, settingsRes] = await Promise.all([
      supabase.from("our_family_images").select("*").order("sort_order"),
      supabase.from("site_settings").select("value").eq("key", "our_family_videos").single(),
    ]);
    setSliderImages((imagesRes.data ?? []).filter((i) => i.section === "slider"));
    setGridImages((imagesRes.data ?? []).filter((i) => i.section === "grid"));
    if (settingsRes.data?.value) setVideos(settingsRes.data.value as unknown as FamilyVideos);
  };

  useEffect(() => { load(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const addImage = async (section: "slider" | "grid", imageUrl: string) => {
    const images = section === "slider" ? sliderImages : gridImages;
    const { data } = await supabase.from("our_family_images").insert({
      section,
      image_url: imageUrl,
      sort_order: images.length,
    }).select().single();
    if (data) {
      if (section === "slider") setSliderImages((prev) => [...prev, data]);
      else setGridImages((prev) => [...prev, data]);
    }
  };

  const deleteImage = async (id: string, section: "slider" | "grid") => {
    await supabase.from("our_family_images").delete().eq("id", id);
    if (section === "slider") setSliderImages((prev) => prev.filter((i) => i.id !== id));
    else setGridImages((prev) => prev.filter((i) => i.id !== id));
  };

  const saveVideos = async () => {
    setSavingVideos(true);
    await supabase.from("site_settings").upsert({ key: "our_family_videos", value: toJson(videos) });
    setVideosSaved(true);
    setTimeout(() => setVideosSaved(false), 2000);
    setSavingVideos(false);
  };

  const tabs = [
    { key: "slider" as const, label: "Slider รูปภาพ", icon: <Images size={16} /> },
    { key: "videos" as const, label: "วิดีโอ", icon: <Video size={16} /> },
    { key: "grid" as const, label: "Grid รูปภาพ", icon: <Images size={16} /> },
  ];

  return (
    <div>
      <AdminHeader title="Our Family" description="จัดการรูปภาพและวิดีโอในหน้า Our Family" />

      {/* Tabs */}
      <div className="flex gap-1 mb-6 border-b border-gray-200">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
              activeTab === tab.key
                ? "border-[#09418C] text-[#09418C]"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Slider Images */}
      {activeTab === "slider" && (
        <div className="max-w-2xl">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">รูปภาพ Slider</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-3">
                {sliderImages.map((img) => (
                  <div key={img.id} className="relative group">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={img.image_url} alt="" className="w-full aspect-video object-cover rounded-lg" />
                    <button
                      onClick={() => deleteImage(img.id, "slider")}
                      className="absolute top-1 right-1 bg-white rounded-full p-1 shadow opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50"
                    >
                      <Trash2 size={14} className="text-red-500" />
                    </button>
                  </div>
                ))}
              </div>
              <ImageUploader
                bucket="family-images"
                onChange={(url) => addImage("slider", url)}
                label="เพิ่มรูป Slider"
              />
            </CardContent>
          </Card>
        </div>
      )}

      {/* Videos */}
      {activeTab === "videos" && (
        <div className="max-w-2xl space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between text-base">
                <span className="flex items-center gap-2"><Video size={18} className="text-red-500" />วิดีโอ Our Family (2 วิดีโอ)</span>
                <Button size="sm" onClick={saveVideos} disabled={savingVideos}>
                  <Save size={14} />
                  {videosSaved ? "บันทึกแล้ว!" : "บันทึก"}
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {(["video1", "video2"] as const).map((key, i) => (
                <div key={key} className="space-y-3 pb-4 border-b border-gray-100 last:border-0 last:pb-0">
                  <p className="text-sm font-medium text-gray-600">วิดีโอที่ {i + 1}</p>
                  <div className="space-y-2">
                    <Label>YouTube URL</Label>
                    <Input
                      placeholder="https://www.youtube.com/watch?v=..."
                      value={videos[key].youtube_url}
                      onChange={(e) => setVideos((prev) => ({ ...prev, [key]: { ...prev[key], youtube_url: e.target.value } }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>ชื่อวิดีโอ</Label>
                    <Input
                      placeholder="ชื่อวิดีโอ"
                      value={videos[key].title}
                      onChange={(e) => setVideos((prev) => ({ ...prev, [key]: { ...prev[key], title: e.target.value } }))}
                    />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Grid Images */}
      {activeTab === "grid" && (
        <div className="max-w-2xl">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">รูปภาพ Grid</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-3">
                {gridImages.map((img) => (
                  <div key={img.id} className="relative group">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={img.image_url} alt="" className="w-full aspect-square object-cover rounded-lg" />
                    <button
                      onClick={() => deleteImage(img.id, "grid")}
                      className="absolute top-1 right-1 bg-white rounded-full p-1 shadow opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50"
                    >
                      <Trash2 size={14} className="text-red-500" />
                    </button>
                  </div>
                ))}
              </div>
              <ImageUploader
                bucket="family-images"
                onChange={(url) => addImage("grid", url)}
                label="เพิ่มรูป Grid"
              />
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
