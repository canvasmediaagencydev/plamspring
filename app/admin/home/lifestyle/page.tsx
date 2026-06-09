"use client";

import { useEffect, useState } from "react";
import { AdminHeader } from "@/app/components/admin/AdminHeader";
import { ImageUploader } from "@/app/components/admin/ImageUploader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogFooter } from "@/components/ui/dialog";
import { Plus, Pencil, Trash2, ImageIcon, X, Layers } from "lucide-react";
import { revalidatePages, REVALIDATE_PATHS } from "@/lib/revalidate";
import type { LifestyleSlide } from "@/lib/types";

interface FormState { lifestyle_image_url: string; tags: string[]; sort_order: number }
const EMPTY: FormState = { lifestyle_image_url: "", tags: [], sort_order: 0 };

export default function AdminLifestylePage() {
  const [slides, setSlides] = useState<LifestyleSlide[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<{ mode: "new" | "edit"; item?: LifestyleSlide } | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY);
  const [tagInput, setTagInput] = useState("");
  const [saving, setSaving] = useState(false);

  const load = async () => {
    const data = await fetch("/api/admin/lifestyle-slides").then((r) => r.json());
    setSlides(data); setLoading(false);
  };

  useEffect(() => { load() }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const openNew = () => { setForm(EMPTY); setTagInput(""); setModal({ mode: "new" }) };
  const openEdit = (item: LifestyleSlide) => {
    setForm({ lifestyle_image_url: item.lifestyle_image_url ?? "", tags: item.tags ?? [], sort_order: item.sort_order ?? 0 });
    setTagInput(""); setModal({ mode: "edit", item });
  };

  const addTag = () => { const t = tagInput.trim(); if (t && !form.tags.includes(t)) setForm((prev) => ({ ...prev, tags: [...prev.tags, t] })); setTagInput("") };

  const handleSave = async () => {
    setSaving(true);
    const payload = { lifestyle_image_url: form.lifestyle_image_url || "", tags: form.tags, sort_order: form.sort_order, updated_at: new Date().toISOString() };
    if (modal?.mode === "new") {
      const data = await fetch("/api/admin/lifestyle-slides", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...payload, house_image_url: "" }) }).then((r) => r.json());
      setSlides((prev) => [...prev, data]);
    } else {
      await fetch(`/api/admin/lifestyle-slides/${modal!.item!.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      setSlides((prev) => prev.map((s) => s.id === modal!.item!.id ? { ...s, ...payload } : s));
    }
    await revalidatePages([...REVALIDATE_PATHS.home]); setSaving(false); setModal(null);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("ต้องการลบ Slide นี้?")) return;
    await fetch(`/api/admin/lifestyle-slides/${id}`, { method: "DELETE" });
    setSlides((prev) => prev.filter((s) => s.id !== id));
  };

  return (
    <div>
      <AdminHeader title="ทำเลศักยภาพ" description="จัดการรูปภาพใน Lifestyle Slider หน้าแรก" action={<Button onClick={openNew}><Plus size={16} />เพิ่ม Slide</Button>} />
      {loading ? (
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">{[1,2,3,4].map((i) => (<div key={i} className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm"><div className="aspect-[4/3] animate-pulse bg-gray-100" /><div className="p-4 space-y-2"><div className="h-3 w-2/3 animate-pulse rounded bg-gray-100" /></div></div>))}</div>
      ) : slides.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-200 bg-white py-20 text-center">
          <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-100"><Layers size={24} className="text-gray-400" /></div>
          <p className="text-sm font-medium text-gray-600">ยังไม่มี Slide</p>
          <Button variant="outline" size="sm" className="mt-4" onClick={openNew}><Plus size={14} />เพิ่ม Slide แรก</Button>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
          {slides.map((slide, idx) => (
            <div key={slide.id} className="group overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-shadow hover:shadow-md">
              <div className="relative aspect-[4/3] overflow-hidden bg-gray-50">
                {slide.lifestyle_image_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={slide.lifestyle_image_url} alt="" className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" />
                ) : (<div className="flex h-full w-full items-center justify-center"><ImageIcon size={32} className="text-gray-200" /></div>)}
                <span className="absolute left-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-black/50 text-[10px] font-bold text-white">{idx + 1}</span>
              </div>
              <div className="p-4">
                {(slide.tags ?? []).length > 0 ? (
                  <div className="flex flex-wrap gap-1.5">{(slide.tags ?? []).map((t) => (<span key={t} className="rounded-full bg-blue-50 px-2.5 py-0.5 text-[10px] font-medium text-blue-700">{t}</span>))}</div>
                ) : (<p className="text-xs text-gray-300">ไม่มี Tags</p>)}
              </div>
              <div className="flex items-center justify-between border-t border-gray-50 px-4 py-2.5">
                <span className="text-[10px] text-gray-300">ลำดับ {slide.sort_order}</span>
                <div className="flex items-center gap-1">
                  <button onClick={() => openEdit(slide)} className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-blue-50 hover:text-blue-600"><Pencil size={14} /></button>
                  <button onClick={() => handleDelete(slide.id)} className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-500"><Trash2 size={14} /></button>
                </div>
              </div>
            </div>
          ))}
          <button onClick={openNew} className="flex aspect-[4/3] flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-gray-200 bg-white text-gray-400 transition-colors hover:border-[#09418C]/40 hover:bg-blue-50/30 hover:text-[#09418C]">
            <Plus size={24} /><span className="text-xs font-medium">เพิ่ม Slide</span>
          </button>
        </div>
      )}
      <Dialog open={!!modal} onClose={() => setModal(null)} title={modal?.mode === "new" ? "เพิ่ม Slide" : "แก้ไข Slide"}>
        <div className="space-y-4">
          <div className="space-y-1.5"><Label>รูป Lifestyle</Label><ImageUploader bucket="lifestyle-images" value={form.lifestyle_image_url} onChange={(url) => setForm((prev) => ({ ...prev, lifestyle_image_url: url }))} onClear={() => setForm((prev) => ({ ...prev, lifestyle_image_url: "" }))} /></div>
          <div className="space-y-1.5"><Label>Tags</Label>
            <div className="flex gap-2">
              <Input value={tagInput} onChange={(e) => setTagInput(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addTag() } }} placeholder="เช่น Lifestyle Hub" />
              <Button type="button" variant="outline" onClick={addTag}>เพิ่ม</Button>
            </div>
            {form.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-2">
                {form.tags.map((tag) => (<span key={tag} className="flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-1 text-xs text-blue-700">{tag}<button type="button" onClick={() => setForm((p) => ({ ...p, tags: p.tags.filter((t) => t !== tag) }))} className="hover:text-red-500"><X size={11} /></button></span>))}
              </div>
            )}
          </div>
          <div className="space-y-1.5"><Label>ลำดับการแสดง</Label><Input type="number" value={form.sort_order} onChange={(e) => setForm((prev) => ({ ...prev, sort_order: Number(e.target.value) }))} className="w-24" /></div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setModal(null)}>ยกเลิก</Button>
          <Button onClick={handleSave} disabled={saving}>{saving ? "กำลังบันทึก..." : "บันทึก"}</Button>
        </DialogFooter>
      </Dialog>
    </div>
  );
}
