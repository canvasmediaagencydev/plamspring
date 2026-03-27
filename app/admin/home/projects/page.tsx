"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { AdminHeader } from "@/app/components/admin/AdminHeader";
import { ImageUploader } from "@/app/components/admin/ImageUploader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogFooter } from "@/components/ui/dialog";
import { Plus, Pencil, Trash2, Eye, EyeOff, ImageIcon, FolderOpen } from "lucide-react";
import { revalidatePages, REVALIDATE_PATHS } from "@/lib/revalidate";
import type { Tables } from "@/lib/types/database.types";

type Project = Tables<"projects">;

interface FormState {
  name: string;
  subtitle: string;
  image_url: string;
  logo_url: string;
  sort_order: number;
  is_published: boolean;
}

const EMPTY: FormState = { name: "", subtitle: "", image_url: "", logo_url: "", sort_order: 0, is_published: true };

function Toggle({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) {
  return (
    <button type="button" onClick={() => onChange(!value)}
      className={`relative h-5 w-9 rounded-full transition-colors ${value ? "bg-[#09418C]" : "bg-gray-200"}`}>
      <span className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform ${value ? "translate-x-4" : "translate-x-0.5"}`} />
    </button>
  );
}

export default function AdminProjectsPage() {
  const supabase = createClient();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<{ mode: "new" | "edit"; item?: Project } | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    const { data } = await supabase.from("projects").select("*").order("sort_order");
    setProjects(data ?? []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const openNew = () => { setForm(EMPTY); setModal({ mode: "new" }); };
  const openEdit = (item: Project) => {
    setForm({ name: item.name, subtitle: item.subtitle ?? "", image_url: item.image_url ?? "",
      logo_url: item.logo_url ?? "", sort_order: item.sort_order ?? 0, is_published: item.is_published ?? true });
    setModal({ mode: "edit", item });
  };

  const handleSave = async () => {
    if (!form.name.trim()) return;
    setSaving(true);
    const payload = { name: form.name, subtitle: form.subtitle || null, image_url: form.image_url || null,
      logo_url: form.logo_url || null, sort_order: form.sort_order, is_published: form.is_published,
      updated_at: new Date().toISOString() };
    if (modal?.mode === "new") {
      const { data } = await supabase.from("projects").insert(payload).select().single();
      if (data) setProjects((prev) => [...prev, data]);
    } else {
      await supabase.from("projects").update(payload).eq("id", modal!.item!.id);
      setProjects((prev) => prev.map((p) => p.id === modal!.item!.id ? { ...p, ...payload } : p));
    }
    await revalidatePages([...REVALIDATE_PATHS.home]);
    setSaving(false);
    setModal(null);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("ต้องการลบโครงการนี้?")) return;
    await supabase.from("projects").delete().eq("id", id);
    setProjects((prev) => prev.filter((p) => p.id !== id));
  };

  const togglePublish = async (id: string, current: boolean) => {
    await supabase.from("projects").update({ is_published: !current }).eq("id", id);
    setProjects((prev) => prev.map((p) => p.id === id ? { ...p, is_published: !current } : p));
  };

  const set = <K extends keyof FormState>(k: K, v: FormState[K]) => setForm((prev) => ({ ...prev, [k]: v }));

  return (
    <div>
      <AdminHeader title="โครงการของเรา" description="จัดการ Card โครงการในหน้าแรก"
        action={<Button onClick={openNew}><Plus size={16} />เพิ่มโครงการ</Button>} />

      {loading ? (
        <Card><CardContent className="pt-6 space-y-3">
          {[1,2,3].map((i) => <div key={i} className="h-16 animate-pulse rounded-lg bg-gray-100" />)}
        </CardContent></Card>
      ) : projects.length === 0 ? (
        <Card><CardContent className="flex flex-col items-center justify-center py-16 text-center">
          <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
            <FolderOpen size={22} className="text-gray-400" />
          </div>
          <p className="text-sm font-medium text-gray-600">ยังไม่มีโครงการ</p>
          <Button variant="outline" size="sm" className="mt-4" onClick={openNew}><Plus size={14} />เพิ่มโครงการแรก</Button>
        </CardContent></Card>
      ) : (
        <Card><CardContent className="p-0">
          <div className="divide-y divide-gray-100">
            {projects.map((project) => (
              <div key={project.id} className="flex items-center gap-4 px-5 py-3.5 transition-colors hover:bg-gray-50/70">
                {project.image_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={project.image_url} alt={project.name} className="h-11 w-16 shrink-0 rounded-lg object-cover" />
                ) : (
                  <div className="flex h-11 w-16 shrink-0 items-center justify-center rounded-lg bg-gray-100">
                    <ImageIcon size={16} className="text-gray-300" />
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-gray-900">{project.name}</p>
                  {project.subtitle && <p className="truncate text-xs text-gray-500">{project.subtitle}</p>}
                </div>
                <Badge variant={project.is_published ? "success" : "secondary"}>
                  {project.is_published ? "เผยแพร่" : "ซ่อน"}
                </Badge>
                <div className="flex items-center">
                  <button onClick={() => togglePublish(project.id, project.is_published)}
                    className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors" title={project.is_published ? "ซ่อน" : "เผยแพร่"}>
                    {project.is_published ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                  <button onClick={() => openEdit(project)}
                    className="rounded-lg p-1.5 text-gray-400 hover:bg-blue-50 hover:text-blue-600 transition-colors">
                    <Pencil size={15} />
                  </button>
                  <button onClick={() => handleDelete(project.id)}
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
        title={modal?.mode === "new" ? "เพิ่มโครงการ" : "แก้ไขโครงการ"} size="lg">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>ชื่อโครงการ <span className="text-red-500">*</span></Label>
              <Input value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="Palm Springs Signature" />
            </div>
            <div className="space-y-1.5">
              <Label>Subtitle</Label>
              <Input value={form.subtitle} onChange={(e) => set("subtitle", e.target.value)} placeholder="บ้านเดี่ยว" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>รูปโครงการ</Label>
              <ImageUploader bucket="project-images" value={form.image_url}
                onChange={(url) => set("image_url", url)} onClear={() => set("image_url", "")} />
            </div>
            <div className="space-y-1.5">
              <Label>Logo โครงการ</Label>
              <ImageUploader bucket="project-images" value={form.logo_url}
                onChange={(url) => set("logo_url", url)} onClear={() => set("logo_url", "")} />
            </div>
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
          <Button onClick={handleSave} disabled={saving || !form.name.trim()}>
            {saving ? "กำลังบันทึก..." : "บันทึก"}
          </Button>
        </DialogFooter>
      </Dialog>
    </div>
  );
}
