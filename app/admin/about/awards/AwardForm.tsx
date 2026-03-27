"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { AdminHeader } from "@/app/components/admin/AdminHeader";
import { ImageUploader } from "@/app/components/admin/ImageUploader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Save, ArrowLeft } from "lucide-react";
import Link from "next/link";
import type { Tables } from "@/lib/types/database.types";

type Award = Tables<"awards">;

interface AwardFormProps {
  initial?: Partial<Award>;
  mode: "new" | "edit";
}

export function AwardForm({ initial = {}, mode }: AwardFormProps) {
  const supabase = createClient();
  const router = useRouter();

  const [imageUrl, setImageUrl] = useState(initial.image_url ?? "");
  const [description, setDescription] = useState(initial.description ?? "");
  const [sortOrder, setSortOrder] = useState(initial.sort_order ?? 0);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const payload = { image_url: imageUrl, description: description.trim(), sort_order: sortOrder, updated_at: new Date().toISOString() };
      if (mode === "new") {
        const { error: err } = await supabase.from("awards").insert(payload);
        if (err) throw err;
      } else {
        const { error: err } = await supabase.from("awards").update(payload).eq("id", initial.id!);
        if (err) throw err;
      }
      router.push("/admin/about/awards");
      router.refresh();
    } catch {
      setError("บันทึกไม่สำเร็จ");
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <AdminHeader
        title={mode === "new" ? "เพิ่ม Award" : "แก้ไข Award"}
        action={
          <div className="flex gap-2">
            <Link href="/admin/about/awards"><Button type="button" variant="outline"><ArrowLeft size={16} />กลับ</Button></Link>
            <Button type="submit" disabled={saving}><Save size={16} />{saving ? "กำลังบันทึก..." : "บันทึก"}</Button>
          </div>
        }
      />
      <div className="space-y-6 max-w-2xl">
        <Card>
          <CardContent className="pt-6 space-y-4">
            <div className="space-y-2">
              <Label>รูปภาพ Award</Label>
              <ImageUploader bucket="award-images" value={imageUrl} onChange={setImageUrl} onClear={() => setImageUrl("")} />
            </div>
            <div className="space-y-2">
              <Label>คำอธิบาย</Label>
              <Textarea rows={3} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="รายละเอียด Award..." />
            </div>
            <div className="space-y-2">
              <Label>ลำดับ</Label>
              <Input type="number" value={sortOrder} onChange={(e) => setSortOrder(Number(e.target.value))} className="w-24" />
            </div>
          </CardContent>
        </Card>
        {error && <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-md">{error}</p>}
      </div>
    </form>
  );
}
