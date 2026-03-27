"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { AdminHeader } from "@/app/components/admin/AdminHeader";
import { ImageUploader } from "@/app/components/admin/ImageUploader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
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
    const payload = { image_url: form.image_url || null, description: form.description || null,
      sort_order: form.sort_order, is_published: form.is_published };
    if (modal?.mode === "new") {
      const { data } = await supabase.from("awards").insert(payload).select().single();
      if (data) setAwards((prev) => [...prev, data]);
    } else {
      await supabase.from("awards").update(payload).eq("id", modal!.item!.id);
      setAwards((prev) => prev.map((a) => a.id === modal!.item!.id ? { ...a, ...payload } : a));
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
        <Card><CardContent className="pt-6 space-y-3">
          {[1,2].map((i) => <div key={i} className="h-14 animate-pulse rounded-lg bg-gray-100" />)}
        </CardContent></Card>
      ) : awards.length === 0 ? (
        <Card><CardContent className="flex flex-col items-center justify-center py-16 text-center">
          <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
            <Award size={22} className="text-gray-400" />
          </div>
          <p className="text-sm font-medium text-gray-600">ยังไม่มีรางวัล</p>
          <Button variant="outline" size="sm" className="mt-4" onClick={openNew}><Plus size={14} />เพิ่มแรก</Button>
        </CardContent></Card>
      ) : (
        <Card><CardContent className="p-0">
          <div className="divide-y divide-gray-100">
            {awards.map((award) => (
              <div key={award.id} className="flex items-center gap-4 px-5 py-3.5 transition-colors hover:bg-gray-50/70">
                {award.image_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={award.image_url} alt="" className="h-10 w-10 shrink-0 rounded-lg object-contain bg-gray-50 p-1" />
                ) : (
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gray-100">
                    <ImageIcon size={16} className="text-gray-300" />
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm text-gray-700">{award.description || "—"}</p>
                </div>
                <Badge variant={award.is_published ? "success" : "secondary"}>
                  {award.is_published ? "เผยแพร่" : "ซ่อน"}
                </Badge>
                <div className="flex items-center">
                  <button onClick={() => togglePublish(award.id, award.is_published)}
                    className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors">
                    {award.is_published ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                  <button onClick={() => openEdit(award)}
                    className="rounded-lg p-1.5 text-gray-400 hover:bg-blue-50 hover:text-blue-600 transition-colors">
                    <Pencil size={15} />
                  </button>
                  <button onClick={() => handleDelete(award.id)}
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
