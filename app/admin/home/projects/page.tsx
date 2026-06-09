"use client"

import { useEffect, useState } from "react"
import { AdminHeader } from "@/app/components/admin/AdminHeader"
import { ImageUploader } from "@/app/components/admin/ImageUploader"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogFooter } from "@/components/ui/dialog"
import { Plus, Pencil, Trash2, Eye, EyeOff, ImageIcon, FolderOpen, Link2 } from "lucide-react"
import { revalidatePages, REVALIDATE_PATHS } from "@/lib/revalidate"
import type { Project, ProjectPage } from "@/lib/types"

type ProjectPageOption = Pick<ProjectPage, "id" | "name" | "slug">

interface FormState {
  name: string; subtitle: string; image_url: string; logo_url: string
  sort_order: number; is_published: boolean; linked_project_page_id: string
}
const EMPTY: FormState = { name: "", subtitle: "", image_url: "", logo_url: "", sort_order: 0, is_published: true, linked_project_page_id: "" }

function Toggle({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) {
  return (
    <button type="button" onClick={() => onChange(!value)}
      className={`relative h-5 w-9 rounded-full transition-colors ${value ? "bg-[#09418C]" : "bg-gray-200"}`}>
      <span className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform ${value ? "translate-x-4" : "translate-x-0.5"}`} />
    </button>
  )
}

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [projectPages, setProjectPages] = useState<ProjectPageOption[]>([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState<{ mode: "new" | "edit"; item?: Project } | null>(null)
  const [form, setForm] = useState<FormState>(EMPTY)
  const [saving, setSaving] = useState(false)

  const load = async () => {
    const [p, pp] = await Promise.all([
      fetch("/api/admin/projects").then((r) => r.json()),
      fetch("/api/admin/project-pages").then((r) => r.json()),
    ])
    setProjects(p); setProjectPages(pp); setLoading(false)
  }

  useEffect(() => { load() }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const openNew = () => { setForm(EMPTY); setModal({ mode: "new" }) }
  const openEdit = (item: Project) => {
    setForm({ name: item.name, subtitle: item.subtitle ?? "", image_url: item.image_url ?? "", logo_url: item.logo_url ?? "",
      sort_order: item.sort_order ?? 0, is_published: item.is_published ?? true, linked_project_page_id: item.linked_project_page_id ?? "" })
    setModal({ mode: "edit", item })
  }

  const handleSave = async () => {
    if (!form.name.trim()) return; setSaving(true)
    const payload = { name: form.name, subtitle: form.subtitle || null, image_url: form.image_url || undefined,
      logo_url: form.logo_url || null, sort_order: form.sort_order, is_published: form.is_published,
      linked_project_page_id: form.linked_project_page_id || null, updated_at: new Date().toISOString() }
    if (modal?.mode === "new") {
      await fetch("/api/admin/projects", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) })
    } else {
      await fetch(`/api/admin/projects/${modal!.item!.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) })
    }
    await revalidatePages([...REVALIDATE_PATHS.home]); await load(); setSaving(false); setModal(null)
  }

  const handleDelete = async (id: string) => {
    if (!confirm("ต้องการลบโครงการนี้?")) return
    await fetch(`/api/admin/projects/${id}`, { method: "DELETE" })
    setProjects((prev) => prev.filter((p) => p.id !== id))
  }

  const togglePublish = async (id: string, current: boolean) => {
    await fetch(`/api/admin/projects/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ is_published: !current }) })
    setProjects((prev) => prev.map((p) => (p.id === id ? { ...p, is_published: !current } : p)))
  }

  const set = <K extends keyof FormState>(k: K, v: FormState[K]) => setForm((prev) => ({ ...prev, [k]: v }))
  const getLinkedPageName = (pageId: string | null) => !pageId ? null : projectPages.find((p) => p.id === pageId)?.name ?? null

  return (
    <div>
      <AdminHeader title="โครงการของเรา" description="จัดการ Card โครงการในหน้าแรก"
        action={<Button onClick={openNew}><Plus size={16} />เพิ่มโครงการ</Button>} />
      {loading ? (
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
          {[1,2,3,4,5,6].map((i) => (
            <div key={i} className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
              <div className="aspect-video animate-pulse bg-gray-100" />
              <div className="space-y-2 p-4"><div className="h-4 w-3/4 animate-pulse rounded bg-gray-100" /><div className="h-3 w-1/2 animate-pulse rounded bg-gray-100" /></div>
            </div>
          ))}
        </div>
      ) : projects.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-200 bg-white py-20 text-center">
          <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-100"><FolderOpen size={24} className="text-gray-400" /></div>
          <p className="text-sm font-medium text-gray-600">ยังไม่มีโครงการ</p>
          <Button variant="outline" size="sm" className="mt-4" onClick={openNew}><Plus size={14} />เพิ่มโครงการแรก</Button>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
          {projects.map((project) => {
            const linkedName = getLinkedPageName(project.linked_project_page_id ?? null)
            return (
              <div key={project.id} className="group overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-shadow hover:shadow-md">
                <div className="relative aspect-video overflow-hidden bg-gray-50">
                  {project.image_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={project.image_url} alt={project.name} className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" />
                  ) : (<div className="flex h-full w-full items-center justify-center"><ImageIcon size={32} className="text-gray-200" /></div>)}
                  {project.logo_url && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={project.logo_url} alt="" className="absolute bottom-2 left-2 h-8 w-auto rounded bg-white/90 px-1.5 py-0.5 object-contain shadow-sm" />
                  )}
                  <span className={`absolute right-2 top-2 rounded-full px-2.5 py-0.5 text-[10px] font-semibold shadow-sm ${project.is_published ? "bg-green-500 text-white" : "bg-gray-400 text-white"}`}>
                    {project.is_published ? "เผยแพร่" : "ซ่อน"}
                  </span>
                </div>
                <div className="p-4">
                  <p className="truncate text-sm font-bold text-gray-900">{project.name}</p>
                  {project.subtitle && <p className="mt-0.5 truncate text-xs text-gray-400">{project.subtitle}</p>}
                  {linkedName ? (<p className="mt-1 flex items-center gap-1 truncate text-[10px] text-blue-500"><Link2 size={10} />{linkedName}</p>)
                    : (<p className="mt-1 text-[10px] text-amber-400">ยังไม่ได้ลิงก์หน้าโครงการ</p>)}
                </div>
                <div className="flex items-center justify-between border-t border-gray-50 px-4 py-2.5">
                  <span className="text-[10px] text-gray-300">ลำดับ {project.sort_order}</span>
                  <div className="flex items-center gap-1">
                    <button onClick={() => togglePublish(project.id, project.is_published)} title={project.is_published ? "ซ่อน" : "เผยแพร่"} className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600">
                      {project.is_published ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                    <button onClick={() => openEdit(project)} title="แก้ไข" className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-blue-50 hover:text-blue-600"><Pencil size={14} /></button>
                    <button onClick={() => handleDelete(project.id)} className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-500"><Trash2 size={14} /></button>
                  </div>
                </div>
              </div>
            )
          })}
          <button onClick={openNew} className="flex aspect-video flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-gray-200 bg-white text-gray-400 transition-colors hover:border-[#09418C]/40 hover:bg-blue-50/30 hover:text-[#09418C]">
            <Plus size={24} /><span className="text-xs font-medium">เพิ่มโครงการ</span>
          </button>
        </div>
      )}
      <Dialog open={!!modal} onClose={() => setModal(null)} title={modal?.mode === "new" ? "เพิ่มโครงการ" : "แก้ไขโครงการ"} size="lg">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5"><Label>ชื่อโครงการ <span className="text-red-500">*</span></Label><Input value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="Palm Springs Signature" /></div>
            <div className="space-y-1.5"><Label>Subtitle</Label><Input value={form.subtitle} onChange={(e) => set("subtitle", e.target.value)} placeholder="บ้านเดี่ยว" /></div>
          </div>
          <div className="space-y-1.5">
            <Label className="flex items-center gap-1.5"><Link2 size={13} />ลิงก์ไปหน้าโครงการ</Label>
            <select value={form.linked_project_page_id} onChange={(e) => set("linked_project_page_id", e.target.value)}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">
              <option value="">— ไม่ลิงก์ —</option>
              {projectPages.map((page) => (<option key={page.id} value={page.id}>{page.name}{page.slug ? ` (/projects/${page.slug})` : " (ยังไม่มี slug)"}</option>))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5"><Label>รูปโครงการ</Label><ImageUploader bucket="project-images" value={form.image_url} onChange={(url) => set("image_url", url)} onClear={() => set("image_url", "")} /></div>
            <div className="space-y-1.5"><Label>Logo โครงการ</Label><ImageUploader bucket="project-images" value={form.logo_url} onChange={(url) => set("logo_url", url)} onClear={() => set("logo_url", "")} /></div>
          </div>
          <div className="flex items-end gap-6">
            <div className="space-y-1.5"><Label>ลำดับการแสดง</Label><Input type="number" value={form.sort_order} onChange={(e) => set("sort_order", Number(e.target.value))} className="w-24" /></div>
            <label className="flex cursor-pointer items-center gap-2.5 pb-1"><Toggle value={form.is_published} onChange={(v) => set("is_published", v)} /><span className="text-sm text-gray-700">เผยแพร่</span></label>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setModal(null)}>ยกเลิก</Button>
          <Button onClick={handleSave} disabled={saving || !form.name.trim()}>{saving ? "กำลังบันทึก..." : "บันทึก"}</Button>
        </DialogFooter>
      </Dialog>
    </div>
  )
}
