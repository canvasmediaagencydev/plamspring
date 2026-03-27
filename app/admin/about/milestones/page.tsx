"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { AdminHeader } from "@/app/components/admin/AdminHeader";
import { ImageUploader } from "@/app/components/admin/ImageUploader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogFooter } from "@/components/ui/dialog";
import { Plus, Pencil, Trash2, Flag } from "lucide-react";
import { revalidatePages, REVALIDATE_PATHS } from "@/lib/revalidate";
import type { Tables } from "@/lib/types/database.types";

type Milestone = Tables<"milestones">;

interface FormState {
  year: string;
  title: string;
  description: string;
  image_url: string;
  sort_order: number;
}

const EMPTY: FormState = { year: "", title: "", description: "", image_url: "", sort_order: 0 };

export default function AdminMilestonesPage() {
  const supabase = createClient();
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<{ mode: "new" | "edit"; item?: Milestone } | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    const { data } = await supabase.from("milestones").select("*").order("sort_order");
    setMilestones(data ?? []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const openNew = () => { setForm(EMPTY); setModal({ mode: "new" }); };
  const openEdit = (item: Milestone) => {
    setForm({ year: item.year, title: item.title, description: item.description ?? "",
      image_url: item.image_url ?? "", sort_order: item.sort_order ?? 0 });
    setModal({ mode: "edit", item });
  };

  const handleSave = async () => {
    if (!form.year.trim() || !form.title.trim()) return;
    setSaving(true);
    const payload = { year: form.year, title: form.title, description: form.description || null,
      image_url: form.image_url || null, sort_order: form.sort_order };
    if (modal?.mode === "new") {
      const { data } = await supabase.from("milestones").insert(payload).select().single();
      if (data) setMilestones((prev) => [...prev, data]);
    } else {
      await supabase.from("milestones").update(payload).eq("id", modal!.item!.id);
      setMilestones((prev) => prev.map((m) => m.id === modal!.item!.id ? { ...m, ...payload } : m));
    }
    await revalidatePages([...REVALIDATE_PATHS.about]);
    setSaving(false);
    setModal(null);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("ต้องการลบ Milestone นี้?")) return;
    await supabase.from("milestones").delete().eq("id", id);
    setMilestones((prev) => prev.filter((m) => m.id !== id));
  };

  const set = <K extends keyof FormState>(k: K, v: FormState[K]) => setForm((prev) => ({ ...prev, [k]: v }));

  return (
    <div>
      <AdminHeader title="Milestones" description="จัดการข้อมูล Milestone ใน About Us"
        action={<Button onClick={openNew}><Plus size={16} />เพิ่ม Milestone</Button>} />

      {loading ? (
        <Card><CardContent className="pt-6 space-y-3">
          {[1,2,3].map((i) => <div key={i} className="h-14 animate-pulse rounded-lg bg-gray-100" />)}
        </CardContent></Card>
      ) : milestones.length === 0 ? (
        <Card><CardContent className="flex flex-col items-center justify-center py-16 text-center">
          <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
            <Flag size={22} className="text-gray-400" />
          </div>
          <p className="text-sm font-medium text-gray-600">ยังไม่มี Milestone</p>
          <Button variant="outline" size="sm" className="mt-4" onClick={openNew}><Plus size={14} />เพิ่มแรก</Button>
        </CardContent></Card>
      ) : (
        <Card><CardContent className="p-0">
          <div className="divide-y divide-gray-100">
            {milestones.map((m) => (
              <div key={m.id} className="flex items-center gap-4 px-5 py-3.5 transition-colors hover:bg-gray-50/70">
                <div className="flex h-10 w-14 shrink-0 items-center justify-center rounded-lg bg-[#09418C]/8">
                  <span className="text-sm font-bold text-[#09418C]">{m.year}</span>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-gray-900">{m.title}</p>
                  {m.description && <p className="truncate text-xs text-gray-500">{m.description}</p>}
                </div>
                <div className="flex items-center">
                  <button onClick={() => openEdit(m)}
                    className="rounded-lg p-1.5 text-gray-400 hover:bg-blue-50 hover:text-blue-600 transition-colors">
                    <Pencil size={15} />
                  </button>
                  <button onClick={() => handleDelete(m.id)}
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
        title={modal?.mode === "new" ? "เพิ่ม Milestone" : "แก้ไข Milestone"}>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>ปี <span className="text-red-500">*</span></Label>
              <Input value={form.year} onChange={(e) => set("year", e.target.value)} placeholder="2024" />
            </div>
            <div className="space-y-1.5">
              <Label>ลำดับการแสดง</Label>
              <Input type="number" value={form.sort_order} onChange={(e) => set("sort_order", Number(e.target.value))} />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label>หัวข้อ <span className="text-red-500">*</span></Label>
            <Input value={form.title} onChange={(e) => set("title", e.target.value)} placeholder="ก้าวสำคัญ..." />
          </div>
          <div className="space-y-1.5">
            <Label>รายละเอียด</Label>
            <Textarea rows={3} value={form.description} onChange={(e) => set("description", e.target.value)} placeholder="อธิบายเหตุการณ์..." />
          </div>
          <div className="space-y-1.5">
            <Label>รูปภาพ (ถ้ามี)</Label>
            <ImageUploader bucket="milestone-images" value={form.image_url}
              onChange={(url) => set("image_url", url)} onClear={() => set("image_url", "")} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setModal(null)}>ยกเลิก</Button>
          <Button onClick={handleSave} disabled={saving || !form.year.trim() || !form.title.trim()}>
            {saving ? "กำลังบันทึก..." : "บันทึก"}
          </Button>
        </DialogFooter>
      </Dialog>
    </div>
  );
}
