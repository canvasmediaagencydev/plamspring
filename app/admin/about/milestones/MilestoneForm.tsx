"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AdminHeader } from "@/app/components/admin/AdminHeader";
import { ImageUploader } from "@/app/components/admin/ImageUploader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Save, ArrowLeft } from "lucide-react";
import Link from "next/link";
import type { Milestone } from "@/lib/types";

interface MilestoneFormProps { initial?: Partial<Milestone>; mode: "new" | "edit" }

export function MilestoneForm({ initial = {}, mode }: MilestoneFormProps) {
  const router = useRouter();
  const [year, setYear] = useState(initial.year ?? "");
  const [title, setTitle] = useState(initial.title ?? "");
  const [description, setDescription] = useState(initial.description ?? "");
  const [imageUrl, setImageUrl] = useState(initial.image_url ?? "");
  const [sortOrder, setSortOrder] = useState(initial.sort_order ?? 0);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!year.trim() || !title.trim()) { setError("กรุณาใส่ปีและชื่อ"); return; }
    setSaving(true); setError("");
    try {
      const payload = { year: year.trim(), title: title.trim(), description: description.trim() || null, image_url: imageUrl || null, sort_order: sortOrder, updated_at: new Date().toISOString() };
      if (mode === "new") {
        const res = await fetch("/api/admin/milestones", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
        if (!res.ok) throw new Error();
      } else {
        const res = await fetch(`/api/admin/milestones/${initial.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
        if (!res.ok) throw new Error();
      }
      router.push("/admin/about/milestones"); router.refresh();
    } catch {
      setError("บันทึกไม่สำเร็จ"); setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <AdminHeader title={mode === "new" ? "เพิ่ม Milestone" : "แก้ไข Milestone"}
        action={
          <div className="flex gap-2">
            <Link href="/admin/about/milestones"><Button type="button" variant="outline"><ArrowLeft size={16} />กลับ</Button></Link>
            <Button type="submit" disabled={saving}><Save size={16} />{saving ? "กำลังบันทึก..." : "บันทึก"}</Button>
          </div>
        }
      />
      <div className="space-y-6 max-w-2xl">
        <Card>
          <CardContent className="pt-6 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2"><Label>ปี (Year) *</Label><Input value={year} onChange={(e) => setYear(e.target.value)} placeholder="1989" required /></div>
              <div className="space-y-2"><Label>ลำดับ</Label><Input type="number" value={sortOrder} onChange={(e) => setSortOrder(Number(e.target.value))} /></div>
            </div>
            <div className="space-y-2"><Label>ชื่อโครงการ *</Label><Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="PALMSPRINGS PLACE" required /></div>
            <div className="space-y-2"><Label>คำอธิบาย</Label><Textarea rows={3} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="รายละเอียดเพิ่มเติม..." /></div>
          </CardContent>
        </Card>
        <Card><CardContent className="pt-6"><Label>รูปภาพ Milestone</Label><div className="mt-2"><ImageUploader bucket="milestone-images" value={imageUrl} onChange={setImageUrl} onClear={() => setImageUrl("")} /></div></CardContent></Card>
        {error && <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-md">{error}</p>}
      </div>
    </form>
  );
}
