"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AdminHeader } from "@/app/components/admin/AdminHeader";
import { ImageUploader } from "@/app/components/admin/ImageUploader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Save, ArrowLeft } from "lucide-react";
import Link from "next/link";
import type { Project } from "@/lib/types";

interface ProjectFormProps { initial?: Partial<Project>; mode: "new" | "edit" }

export function ProjectForm({ initial = {}, mode }: ProjectFormProps) {
  const router = useRouter();
  const [name, setName] = useState(initial.name ?? "");
  const [subtitle, setSubtitle] = useState(initial.subtitle ?? "");
  const [imageUrl, setImageUrl] = useState(initial.image_url ?? "");
  const [logoUrl, setLogoUrl] = useState(initial.logo_url ?? "");
  const [sortOrder, setSortOrder] = useState(initial.sort_order ?? 0);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) { setError("กรุณาใส่ชื่อโครงการ"); return; }
    setSaving(true); setError("");
    try {
      const payload = { name: name.trim(), subtitle: subtitle.trim() || null, image_url: imageUrl, logo_url: logoUrl || null, sort_order: sortOrder, updated_at: new Date().toISOString() };
      if (mode === "new") {
        const res = await fetch("/api/admin/projects", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
        if (!res.ok) throw new Error();
      } else {
        const res = await fetch(`/api/admin/projects/${initial.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
        if (!res.ok) throw new Error();
      }
      router.push("/admin/home/projects"); router.refresh();
    } catch {
      setError("บันทึกไม่สำเร็จ กรุณาลองใหม่"); setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <AdminHeader title={mode === "new" ? "เพิ่มโครงการ" : "แก้ไขโครงการ"}
        action={
          <div className="flex gap-2">
            <Link href="/admin/home/projects"><Button type="button" variant="outline"><ArrowLeft size={16} />กลับ</Button></Link>
            <Button type="submit" disabled={saving}><Save size={16} />{saving ? "กำลังบันทึก..." : "บันทึก"}</Button>
          </div>
        }
      />
      <div className="space-y-6 max-w-2xl">
        <Card>
          <CardContent className="pt-6 space-y-4">
            <div className="space-y-2"><Label htmlFor="name">ชื่อโครงการ *</Label><Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="THE URBANA+ 6" required /></div>
            <div className="space-y-2"><Label htmlFor="subtitle">คำบรรยาย</Label><Input id="subtitle" value={subtitle} onChange={(e) => setSubtitle(e.target.value)} placeholder="by Palm Springs" /></div>
            <div className="space-y-2"><Label htmlFor="sort">ลำดับการแสดง</Label><Input id="sort" type="number" value={sortOrder} onChange={(e) => setSortOrder(Number(e.target.value))} className="w-24" /></div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 space-y-6">
            <div className="space-y-2"><Label>รูปภาพโครงการ</Label><ImageUploader bucket="project-images" value={imageUrl} onChange={setImageUrl} onClear={() => setImageUrl("")} label="อัปโหลดรูปโครงการ" /></div>
            <div className="space-y-2"><Label>Logo โครงการ</Label><ImageUploader bucket="project-images" value={logoUrl} onChange={setLogoUrl} onClear={() => setLogoUrl("")} label="อัปโหลด Logo" /></div>
          </CardContent>
        </Card>
        {error && <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-md">{error}</p>}
      </div>
    </form>
  );
}
