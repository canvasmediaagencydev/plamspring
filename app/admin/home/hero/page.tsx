"use client"

import { useEffect, useState } from "react"
import { AdminHeader } from "@/app/components/admin/AdminHeader"
import { ImageUploader } from "@/app/components/admin/ImageUploader"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Save, Trash2, GripVertical } from "lucide-react"
import { revalidatePages } from "@/lib/revalidate"
import {
  DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, type DragEndEvent,
} from "@dnd-kit/core"
import {
  arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, useSortable,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"

function SortableHeroRow({ id, url, index, onRemove }: { id: string; url: string; index: number; onRemove: () => void }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id })
  return (
    <div ref={setNodeRef} style={{ transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.4 : 1 }}
      className="flex items-center gap-3 rounded-lg border border-gray-200 bg-white p-2">
      <button type="button" {...attributes} {...listeners} aria-label="ลากเพื่อจัดลำดับ"
        className="flex h-8 w-6 shrink-0 cursor-grab items-center justify-center rounded text-gray-400 hover:bg-gray-100 hover:text-gray-700 active:cursor-grabbing">
        <GripVertical size={16} />
      </button>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={url} alt={`Hero ${index + 1}`} className="h-16 w-28 shrink-0 rounded object-cover" />
      <span className="flex-1 truncate text-xs text-gray-500">{url}</span>
      <button onClick={onRemove} className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full hover:bg-red-50">
        <Trash2 size={14} className="text-red-500" />
      </button>
    </div>
  )
}

function HeroImageList({ title, images, setImages, uploaderLabel, note }: {
  title: string; images: string[]
  setImages: React.Dispatch<React.SetStateAction<string[]>>; uploaderLabel: string; note: string
}) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  )
  const items = images.map((url, i) => ({ id: `${i}-${url}`, url }))
  const removeImage = (index: number) => setImages((prev) => prev.filter((_, i) => i !== index))
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (!over || active.id === over.id) return
    const oldIndex = items.findIndex((it) => it.id === active.id)
    const newIndex = items.findIndex((it) => it.id === over.id)
    if (oldIndex === -1 || newIndex === -1) return
    setImages((prev) => arrayMove(prev, oldIndex, newIndex))
  }
  return (
    <Card>
      <CardHeader><CardTitle className="text-base">{title} ({images.length} รูป)</CardTitle></CardHeader>
      <CardContent className="space-y-4">
        {images.length > 0 && (
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={items.map((it) => it.id)} strategy={verticalListSortingStrategy}>
              <div className="space-y-3">
                {items.map((it, i) => <SortableHeroRow key={it.id} id={it.id} url={it.url} index={i} onRemove={() => removeImage(i)} />)}
              </div>
            </SortableContext>
          </DndContext>
        )}
        <ImageUploader bucket="hero-images" onChange={(url) => setImages((prev) => [...prev, url])} label={uploaderLabel} />
        <p className="text-xs text-gray-400">{note}</p>
      </CardContent>
    </Card>
  )
}

export default function AdminHeroPage() {
  const [images, setImages] = useState<string[]>([])
  const [mobileImages, setMobileImages] = useState<string[]>([])
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    fetch("/api/admin/site-settings").then((r) => r.json()).then((data: { key: string; value: unknown }[]) => {
      const read = (key: string) => { const v = data.find((r) => r.key === key)?.value; return Array.isArray(v) ? (v as string[]) : [] }
      setImages(read("hero_images")); setMobileImages(read("hero_images_mobile"))
    })
  }, [])

  const handleSave = async () => {
    setSaving(true)
    try {
      await fetch("/api/admin/site-settings", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify([{ key: "hero_images", value: images }, { key: "hero_images_mobile", value: mobileImages }]),
      })
      await revalidatePages(["/"]);  setSaved(true); setTimeout(() => setSaved(false), 2000)
    } finally { setSaving(false) }
  }

  return (
    <div>
      <AdminHeader title="Hero Section" description="จัดการรูปภาพ Hero Slideshow (แสดงบนสุดของทุกหน้า)"
        action={<Button onClick={handleSave} disabled={saving}><Save size={16} />{saved ? "บันทึกแล้ว!" : saving ? "กำลังบันทึก..." : "บันทึก"}</Button>} />
      <div className="max-w-2xl space-y-6">
        <HeroImageList title="รูป Desktop" images={images} setImages={setImages} uploaderLabel="เพิ่มรูป Hero (Desktop)"
          note="แนะนำขนาดรูป: 1920×570px (อัตราส่วน 1920:570) • ไฟล์ JPG/PNG ไม่เกิน 50MB • รองรับหลายรูป (auto slideshow) • ลากเพื่อจัดลำดับ" />
        <HeroImageList title="รูป Mobile" images={mobileImages} setImages={setMobileImages} uploaderLabel="เพิ่มรูป Hero (Mobile)"
          note="แนะนำขนาดรูป: 1080×810px (อัตราส่วน 4:3) • ไฟล์ JPG/PNG ไม่เกิน 50MB • ถ้าไม่ใส่รูป Mobile ระบบจะใช้รูป Desktop แทนโดยอัตโนมัติ • ลากเพื่อจัดลำดับ" />
      </div>
    </div>
  )
}
