"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { AdminHeader } from "@/app/components/admin/AdminHeader";
import { ImageUploader } from "@/app/components/admin/ImageUploader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Save, ArrowLeft, X } from "lucide-react";
import Link from "next/link";
import type { Tables } from "@/lib/types/database.types";

type Slide = Tables<"lifestyle_slides">;

interface LifestyleFormProps {
  initial?: Partial<Slide>;
  mode: "new" | "edit";
}

export function LifestyleForm({ initial = {}, mode }: LifestyleFormProps) {
  const supabase = createClient();
  const router = useRouter();

  const [lifestyleImageUrl, setLifestyleImageUrl] = useState(initial.lifestyle_image_url ?? "");
  const [tags, setTags] = useState<string[]>(initial.tags ?? []);
  const [tagInput, setTagInput] = useState("");
  const [sortOrder, setSortOrder] = useState(initial.sort_order ?? 0);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const addTag = () => {
    const t = tagInput.trim();
    if (t && !tags.includes(t)) setTags((prev) => [...prev, t]);
    setTagInput("");
  };

  const removeTag = (tag: string) => setTags((prev) => prev.filter((t) => t !== tag));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      const payload = {
        lifestyle_image_url: lifestyleImageUrl,
        tags,
        sort_order: sortOrder,
        updated_at: new Date().toISOString(),
      };

      if (mode === "new") {
        const { error: err } = await supabase.from("lifestyle_slides").insert(payload);
        if (err) throw err;
      } else {
        const { error: err } = await supabase.from("lifestyle_slides").update(payload).eq("id", initial.id!);
        if (err) throw err;
      }
      router.push("/admin/home/lifestyle");
      router.refresh();
    } catch {
      setError("บันทึกไม่สำเร็จ กรุณาลองใหม่");
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <AdminHeader
        title={mode === "new" ? "เพิ่ม Lifestyle Slide" : "แก้ไข Lifestyle Slide"}
        action={
          <div className="flex gap-2">
            <Link href="/admin/home/lifestyle">
              <Button type="button" variant="outline"><ArrowLeft size={16} />กลับ</Button>
            </Link>
            <Button type="submit" disabled={saving}>
              <Save size={16} />
              {saving ? "กำลังบันทึก..." : "บันทึก"}
            </Button>
          </div>
        }
      />

      <div className="space-y-6 max-w-2xl">
        <Card>
          <CardContent className="pt-6 space-y-6">
            <div className="space-y-2">
              <Label>รูป Lifestyle</Label>
              <ImageUploader
                bucket="lifestyle-images"
                value={lifestyleImageUrl}
                onChange={setLifestyleImageUrl}
                onClear={() => setLifestyleImageUrl("")}
                label="อัปโหลดรูป Lifestyle"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6 space-y-4">
            <div className="space-y-2">
              <Label>Tags</Label>
              <div className="flex gap-2">
                <Input
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addTag(); } }}
                  placeholder="เช่น Lifestyle Hub"
                />
                <Button type="button" variant="outline" onClick={addTag}>เพิ่ม</Button>
              </div>
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {tags.map((tag) => (
                    <span key={tag} className="flex items-center gap-1 bg-blue-100 text-[#09418C] text-xs px-2.5 py-1 rounded-full">
                      {tag}
                      <button type="button" onClick={() => removeTag(tag)} className="hover:text-red-500">
                        <X size={12} />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
            <div className="space-y-2">
              <Label>ลำดับการแสดง</Label>
              <Input type="number" value={sortOrder} onChange={(e) => setSortOrder(Number(e.target.value))} className="w-24" />
            </div>
          </CardContent>
        </Card>

        {error && <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-md">{error}</p>}
      </div>
    </form>
  );
}
