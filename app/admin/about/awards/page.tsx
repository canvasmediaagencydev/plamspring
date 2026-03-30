"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { AdminHeader } from "@/app/components/admin/AdminHeader";
import { ImageUploader } from "@/app/components/admin/ImageUploader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogFooter } from "@/components/ui/dialog";
import { Plus, Pencil, Trash2, Eye, EyeOff, Award, ImageIcon } from "lucide-react";
import { revalidatePages, REVALIDATE_PATHS } from "@/lib/revalidate";
import type { Tables } from "@/lib/types/database.types";

type AwardItem = Tables<"awards">;

interface FormState {
  image_url: string;
  description: string;
  sort_order: number;
  is_published: boolean;
}

const EMPTY: FormState = { image_url: "", description: "", sort_order: 0, is_published: true };

function Toggle({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) {
  return (
    <button type="button" onClick={() => onChange(!value)}
      className={`relative h-5 w-9 rounded-full transition-colors ${value ? "bg-[#09418C]" : "bg-gray-200"}`}>
      <span className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform ${value ? "translate-x-4" : "translate-x-0.5"}`} />
    </button>
  );
}

export default function AdminAwardsPage() {
  const supabase = createClient();
  const [awards, setAwards] = useState<AwardItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<{ mode: "new" | "edit"; item?: AwardItem } | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    const { data } = await supabase.from("awards").select("*").order("sort_order");
    setAwards(data ?? []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const openNew = () => { setForm(EMPTY); setModal({ mode: "new" }); };
  const openEdit = (item: AwardItem) => {
    setForm({ image_url: item.image_url ?? "", description: item.description ?? "",
      sort_order: item.sort_order ?? 0, is_published: item.is_published ?? true });
    setModal({ mode: "edit", item });
  };

  const handleSave = async () => {
    setSaving(true);
    const payload = { image_url: form.image_url || undefined, description: form.description || undefined,
      sort_order: form.sort_order, is_published: form.is_published };
    if (modal?.mode === "new") {
      const { data } = await supabase.from("awards").insert(payload).select().single();
      if (data) setAwards((prev) => [...prev, data]);
    } else {
      await supabase.from("awards").update(payload).eq("id", modal!.item!.id);
      setAwards((prev) => prev.map((a) => a.id === modal!.item!.id ? {
        ...a,
        image_url: payload.image_url ?? a.image_url,
        description: payload.description ?? a.description,
        sort_order: payload.sort_order,
        is_published: payload.is_published,
      } : a));
    }
    await revalidatePages([...REVALIDATE_PATHS.about]);
    setSaving(false);
    setModal(null);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("ต้องการลบรางวัลนี้?")) return;
    await supabase.from("awards").delete().eq("id", id);
    setAwards((prev) => prev.filter((a) => a.id !== id));
  };

  const togglePublish = async (id: string, current: boolean) => {
    await supabase.from("awards").update({ is_published: !current }).eq("id", id);
    setAwards((prev) => prev.map((a) => a.id === id ? { ...a, is_published: !current } : a));
  };

  const set = <K extends keyof FormState>(k: K, v: FormState[K]) => setForm((prev) => ({ ...prev, [k]: v }));

  return (
    <div>
      <AdminHeader title="Awards & Recognition" description="จัดการรางวัลใน About Us"
        action={<Button onClick={openNew}><Plus size={16} />เพิ่ม Award</Button>} />

      {loading ? (
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {[1,2,3,4].map((i) => (
            <div key={i} className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
              <div className="aspect-square animate-pulse bg-gray-100" />
              <div className="p-4 space-y-2">
                <div className="h-3 w-full animate-pulse rounded bg-gray-100" />
                <div className="h-3 w-2/3 animate-pulse rounded bg-gray-100" />
              </div>
            </div>
          ))}
        </div>
      ) : awards.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-200 bg-white py-20 text-center">
          <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-50">
            <Award size={24} className="text-amber-400" />
          </div>
          <p className="text-sm font-medium text-gray-600">ยังไม่มีรางวัล</p>
          <Button variant="outline" size="sm" className="mt-4" onClick={openNew}><Plus size={14} />เพิ่มแรก</Button>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {awards.map((award) => (
            <div key={award.id}
              className="group overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-shadow hover:shadow-md">
              {/* Image */}
              <div className="relative flex aspect-square items-center justify-center overflow-hidden bg-gray-50 p-4">
                {award.image_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={award.image_url} alt=""
                    className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-105" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center">
                    <ImageIcon size={32} className="text-gray-200" />
                  </div>
                )}
                {/* Status dot */}
                <span className={`absolute right-2 top-2 h-2.5 w-2.5 rounded-full shadow-sm ${
                  award.is_published ? "bg-green-400" : "bg-gray-300"
                }`} title={award.is_published ? "เผยแพร่" : "ซ่อน"} />
              </div>

              {/* Description */}
              <div className="px-3 pb-2 pt-3">
                <p className="line-clamp-2 text-xs leading-relaxed text-gray-600">
                  {award.description || <span className="text-gray-300">ไม่มีคำอธิบาย</span>}
                </p>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between border-t border-gray-50 px-3 py-2">
                <span className="text-[10px] text-gray-300">#{award.sort_order}</span>
                <div className="flex items-center gap-0.5">
                  <button onClick={() => togglePublish(award.id, award.is_published)}
                    title={award.is_published ? "ซ่อน" : "เผยแพร่"}
                    className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600">
                    {award.is_published ? <EyeOff size={13} /> : <Eye size={13} />}
                  </button>
                  <button onClick={() => openEdit(award)}
                    className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-blue-50 hover:text-blue-600">
                    <Pencil size={13} />
                  </button>
                  <button onClick={() => handleDelete(award.id)}
                    className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-500">
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            </div>
          ))}

          {/* Add card */}
          <button onClick={openNew}
            className="flex aspect-square flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-gray-200 bg-white text-gray-400 transition-colors hover:border-amber-300 hover:bg-amber-50/30 hover:text-amber-500">
            <Plus size={22} />
            <span className="text-xs font-medium">เพิ่ม Award</span>
          </button>
        </div>
      )}

      <Dialog open={!!modal} onClose={() => setModal(null)}
        title={modal?.mode === "new" ? "เพิ่ม Award" : "แก้ไข Award"}>
        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label>รูปรางวัล</Label>
            <ImageUploader bucket="award-images" value={form.image_url}
              onChange={(url) => set("image_url", url)} onClear={() => set("image_url", "")} />
          </div>
          <div className="space-y-1.5">
            <Label>คำอธิบาย</Label>
            <Textarea rows={3} value={form.description} onChange={(e) => set("description", e.target.value)}
              placeholder="ชื่อรางวัลและรายละเอียด..." />
          </div>
          <div className="flex items-end gap-6">
            <div className="space-y-1.5">
              <Label>ลำดับการแสดง</Label>
              <Input type="number" value={form.sort_order} onChange={(e) => set("sort_order", Number(e.target.value))} className="w-24" />
            </div>
            <label className="flex cursor-pointer items-center gap-2.5 pb-1">
              <Toggle value={form.is_published} onChange={(v) => set("is_published", v)} />
              <span className="text-sm text-gray-700">เผยแพร่</span>
            </label>
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
