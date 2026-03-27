"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { AdminHeader } from "@/app/components/admin/AdminHeader";
import { ImageUploader } from "@/app/components/admin/ImageUploader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogFooter } from "@/components/ui/dialog";
import { Plus, Pencil, Trash2, ImageIcon, X, Layers } from "lucide-react";
import { revalidatePages, REVALIDATE_PATHS } from "@/lib/revalidate";
import type { Tables } from "@/lib/types/database.types";

type Slide = Tables<"lifestyle_slides">;

interface FormState {
  lifestyle_image_url: string;
  tags: string[];
  sort_order: number;
}

const EMPTY: FormState = { lifestyle_image_url: "", tags: [], sort_order: 0 };

export default function AdminLifestylePage() {
  const supabase = createClient();
  const [slides, setSlides] = useState<Slide[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<{ mode: "new" | "edit"; item?: Slide } | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY);
  const [tagInput, setTagInput] = useState("");
  const [saving, setSaving] = useState(false);

  const load = async () => {
    const { data } = await supabase.from("lifestyle_slides").select("*").order("sort_order");
    setSlides(data ?? []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const openNew = () => { setForm(EMPTY); setTagInput(""); setModal({ mode: "new" }); };
  const openEdit = (item: Slide) => {
    setForm({ lifestyle_image_url: item.lifestyle_image_url ?? "", tags: item.tags ?? [], sort_order: item.sort_order ?? 0 });
    setTagInput("");
    setModal({ mode: "edit", item });
  };

  const addTag = () => {
    const t = tagInput.trim();
    if (t && !form.tags.includes(t)) setForm((prev) => ({ ...prev, tags: [...prev.tags, t] }));
    setTagInput("");
  };

  const handleSave = async () => {
    setSaving(true);
    const payload = { lifestyle_image_url: form.lifestyle_image_url || "", tags: form.tags,
      sort_order: form.sort_order, updated_at: new Date().toISOString() };
    if (modal?.mode === "new") {
      const { data } = await supabase.from("lifestyle_slides").insert({ ...payload, house_image_url: "" }).select().single();
      if (data) setSlides((prev) => [...prev, data]);
    } else {
      await supabase.from("lifestyle_slides").update(payload).eq("id", modal!.item!.id);
      setSlides((prev) => prev.map((s) => s.id === modal!.item!.id ? { ...s, ...payload } : s));
    }
    await revalidatePages([...REVALIDATE_PATHS.home]);
    setSaving(false);
    setModal(null);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("ต้องการลบ Slide นี้?")) return;
    await supabase.from("lifestyle_slides").delete().eq("id", id);
    setSlides((prev) => prev.filter((s) => s.id !== id));
  };

  return (
    <div>
      <AdminHeader title="ทำเลศักยภาพ" description="จัดการรูปภาพใน Lifestyle Slider หน้าแรก"
        action={<Button onClick={openNew}><Plus size={16} />เพิ่ม Slide</Button>} />

      {loading ? (
        <Card><CardContent className="pt-6 space-y-3">
          {[1,2].map((i) => <div key={i} className="h-16 animate-pulse rounded-lg bg-gray-100" />)}
        </CardContent></Card>
      ) : slides.length === 0 ? (
        <Card><CardContent className="flex flex-col items-center justify-center py-16 text-center">
          <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
            <Layers size={22} className="text-gray-400" />
          </div>
          <p className="text-sm font-medium text-gray-600">ยังไม่มี Slide</p>
          <Button variant="outline" size="sm" className="mt-4" onClick={openNew}><Plus size={14} />เพิ่ม Slide แรก</Button>
        </CardContent></Card>
      ) : (
        <Card><CardContent className="p-0">
          <div className="divide-y divide-gray-100">
            {slides.map((slide) => (
              <div key={slide.id} className="flex items-center gap-4 px-5 py-3.5 transition-colors hover:bg-gray-50/70">
                {slide.lifestyle_image_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={slide.lifestyle_image_url} alt="" className="h-11 w-16 shrink-0 rounded-lg object-cover" />
                ) : (
                  <div className="flex h-11 w-16 shrink-0 items-center justify-center rounded-lg bg-gray-100">
                    <ImageIcon size={16} className="text-gray-300" />
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  {slide.tags.length > 0 ? (
                    <div className="flex flex-wrap gap-1">
                      {slide.tags.map((t) => (
                        <span key={t} className="rounded-full bg-blue-50 px-2 py-0.5 text-xs text-blue-700">{t}</span>
                      ))}
                    </div>
                  ) : <p className="text-xs text-gray-400">ไม่มี Tags</p>}
                  <p className="mt-0.5 text-xs text-gray-400">ลำดับ: {slide.sort_order}</p>
                </div>
                <div className="flex items-center">
                  <button onClick={() => openEdit(slide)}
                    className="rounded-lg p-1.5 text-gray-400 hover:bg-blue-50 hover:text-blue-600 transition-colors">
                    <Pencil size={15} />
                  </button>
                  <button onClick={() => handleDelete(slide.id)}
                    className="rounded-lg p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-500 transition-colors">
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </CardContent></Card>
      )}

      <Dialog open={!!modal} onClose={() => setModal(null)}
        title={modal?.mode === "new" ? "เพิ่ม Slide" : "แก้ไข Slide"}>
        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label>รูป Lifestyle</Label>
            <ImageUploader bucket="lifestyle-images" value={form.lifestyle_image_url}
              onChange={(url) => setForm((prev) => ({ ...prev, lifestyle_image_url: url }))}
              onClear={() => setForm((prev) => ({ ...prev, lifestyle_image_url: "" }))} />
          </div>
          <div className="space-y-1.5">
            <Label>Tags</Label>
            <div className="flex gap-2">
              <Input value={tagInput} onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addTag(); } }}
                placeholder="เช่น Lifestyle Hub" />
              <Button type="button" variant="outline" onClick={addTag}>เพิ่ม</Button>
            </div>
            {form.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-2">
                {form.tags.map((tag) => (
                  <span key={tag} className="flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-1 text-xs text-blue-700">
                    {tag}
                    <button type="button" onClick={() => setForm((p) => ({ ...p, tags: p.tags.filter((t) => t !== tag) }))}
                      className="hover:text-red-500"><X size={11} /></button>
                  </span>
                ))}
              </div>
            )}
          </div>
          <div className="space-y-1.5">
            <Label>ลำดับการแสดง</Label>
            <Input type="number" value={form.sort_order}
              onChange={(e) => setForm((prev) => ({ ...prev, sort_order: Number(e.target.value) }))} className="w-24" />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setModal(null)}>ยกเลิก</Button>
          <Button onClick={handleSave} disabled={saving}>{saving ? "กำลังบันทึก..." : "บันทึก"}</Button>
        </DialogFooter>
      </Dialog>
    </div>
  );
}
