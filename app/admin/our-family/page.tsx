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
      <div className="flex gap-1 mb-8 rounded-[14px] bg-gray-100/60 p-1.5 w-max">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex items-center gap-2 px-5 py-2 text-[13px] font-bold transition-all duration-300 rounded-[10px] ${
              activeTab === tab.key
                ? "bg-white text-gray-900 shadow-[0_2px_10px_rgba(0,0,0,0.04)] scale-100"
                : "text-gray-500 hover:text-gray-800 hover:bg-gray-200/50 scale-[0.98]"
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Slider Images */}
      {activeTab === "slider" && (
        <div className="max-w-3xl">
          <Card className="rounded-[1.5rem] border-gray-100/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-white/80 backdrop-blur-sm overflow-hidden">
            <CardHeader className="border-b border-gray-100/60 bg-gray-50/30 pb-4">
              <CardTitle className="text-[15px] font-black text-gray-800">รูปภาพ Slider</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              <div className="grid grid-cols-3 gap-4">
                {sliderImages.map((img) => (
                  <div key={img.id} className="relative group rounded-xl overflow-hidden shadow-sm border border-gray-100/50">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={img.image_url} alt="" className="w-full aspect-video object-cover transition-transform duration-500 group-hover:scale-105" />
                    <div className="absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/10" />
                    <button
                      onClick={() => deleteImage(img.id, "slider")}
                      className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm rounded-full p-1.5 shadow-sm opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-red-50 hover:scale-110"
                    >
                      <Trash2 size={16} className="text-red-500" />
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
          <Card className="rounded-[1.5rem] border-gray-100/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-white/80 backdrop-blur-sm overflow-hidden">
            <CardHeader className="border-b border-gray-100/60 bg-gray-50/30 pb-4">
              <CardTitle className="flex items-center justify-between text-[15px] font-black text-gray-800">
                <span className="flex items-center gap-2.5"><Video size={18} className="text-red-500" />วิดีโอ Our Family (2 วิดีโอ)</span>
                <Button size="sm" onClick={saveVideos} disabled={savingVideos} className="rounded-lg shadow-sm">
                  <Save size={14} className="mr-1.5" />
                  {videosSaved ? "บันทึกแล้ว!" : "บันทึกข้อมูล"}
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
        <div className="max-w-3xl">
          <Card className="rounded-[1.5rem] border-gray-100/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-white/80 backdrop-blur-sm overflow-hidden">
            <CardHeader className="border-b border-gray-100/60 bg-gray-50/30 pb-4">
              <CardTitle className="text-[15px] font-black text-gray-800">รูปภาพ Grid</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              <div className="grid grid-cols-4 gap-4">
                {gridImages.map((img) => (
                  <div key={img.id} className="relative group rounded-xl overflow-hidden shadow-sm border border-gray-100/50">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={img.image_url} alt="" className="w-full aspect-square object-cover transition-transform duration-500 group-hover:scale-105" />
                    <div className="absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/10" />
                    <button
                      onClick={() => deleteImage(img.id, "grid")}
                      className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm rounded-full p-1.5 shadow-sm opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-red-50 hover:scale-110"
                    >
                      <Trash2 size={16} className="text-red-500" />
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
