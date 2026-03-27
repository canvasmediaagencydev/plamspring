"use client";

import { useEffect, useState } from "react";
import { createClient, toJson } from "@/lib/supabase/client";
import { AdminHeader } from "@/app/components/admin/AdminHeader";
import { ImageUploader } from "@/app/components/admin/ImageUploader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Save, Trash2, GripVertical } from "lucide-react";
import { revalidatePages } from "@/lib/revalidate";

export default function AdminHeroPage() {
  const supabase = createClient();
  const [images, setImages] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    supabase
      .from("site_settings")
      .select("value")
      .eq("key", "hero_images")
      .single()
      .then(({ data }) => {
        if (Array.isArray(data?.value)) setImages(data.value as string[]);
      });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const addImage = (url: string) => setImages((prev) => [...prev, url]);

  const removeImage = (index: number) =>
    setImages((prev) => prev.filter((_, i) => i !== index));

  const handleSave = async () => {
    setSaving(true);
    try {
      await supabase
        .from("site_settings")
        .upsert({ key: "hero_images", value: toJson(images) });
      await revalidatePages(["/"]);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <AdminHeader
        title="Hero Section"
        description="จัดการรูปภาพ Hero Slideshow (แสดงบนสุดของทุกหน้า)"
        action={
          <Button onClick={handleSave} disabled={saving}>
            <Save size={16} />
            {saved ? "บันทึกแล้ว!" : saving ? "กำลังบันทึก..." : "บันทึก"}
          </Button>
        }
      />

      <div className="max-w-2xl space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">
              รูปภาพ Slideshow ({images.length} รูป)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Image list */}
            {images.length > 0 && (
              <div className="space-y-3">
                {images.map((url, i) => (
                  <div key={i} className="flex items-center gap-3 rounded-lg border border-gray-200 p-2">
                    <GripVertical size={16} className="shrink-0 text-gray-400" />
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={url}
                      alt={`Hero ${i + 1}`}
                      className="h-16 w-28 rounded object-cover shrink-0"
                    />
                    <span className="flex-1 truncate text-xs text-gray-500">{url}</span>
                    <button
                      onClick={() => removeImage(i)}
                      className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full hover:bg-red-50"
                    >
                      <Trash2 size={14} className="text-red-500" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Upload new */}
            <ImageUploader
              bucket="hero-images"
              onChange={addImage}
              label="เพิ่มรูป Hero"
            />

            <p className="text-xs text-gray-400">
              แนะนำขนาดรูป: 1920×570px • รองรับหลายรูป (auto slideshow)
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
