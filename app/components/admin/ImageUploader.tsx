"use client"

import { useRef, useState } from "react"
import { Upload, X, Image as ImageIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface ImageUploaderProps {
  bucket: string
  value?: string
  onChange: (url: string) => void
  onClear?: () => void
  label?: string
  className?: string
}

export function ImageUploader({ bucket, value, onChange, onClear, label = "อัปโหลดรูปภาพ", className }: ImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [dragging, setDragging] = useState(false)

  const upload = async (file: File) => {
    if (!file.type.startsWith("image/")) { setError("กรุณาเลือกไฟล์รูปภาพ"); return }
    if (file.size > 50 * 1024 * 1024) { setError("ขนาดไฟล์ต้องไม่เกิน 50 MB"); return }
    setError(null); setUploading(true)
    try {
      const form = new FormData()
      form.append("file", file)
      form.append("folder", bucket)
      const res = await fetch("/api/upload", { method: "POST", body: form })
      if (!res.ok) throw new Error("Upload failed")
      const { url } = await res.json()
      onChange(url)
    } catch { setError("อัปโหลดไม่สำเร็จ กรุณาลองใหม่") }
    finally { setUploading(false) }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (file) upload(file); e.target.value = ""
  }
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault(); setDragging(false); const file = e.dataTransfer.files[0]; if (file) upload(file)
  }

  return (
    <div className={cn("space-y-2", className)}>
      {value ? (
        <div className="relative group w-full max-w-xs">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={value} alt="preview" className="w-full h-40 object-cover rounded-lg border border-gray-200" />
          <button type="button" onClick={() => onClear ? onClear() : onChange("")}
            className="absolute top-2 right-2 flex h-7 w-7 items-center justify-center rounded-full bg-white shadow-md border border-gray-200 opacity-0 group-hover:opacity-100 transition-opacity">
            <X size={14} />
          </button>
        </div>
      ) : (
        <div onClick={() => inputRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
          onDragLeave={() => setDragging(false)} onDrop={handleDrop}
          className={cn("flex flex-col items-center justify-center gap-2 w-full h-32 rounded-lg border-2 border-dashed cursor-pointer transition-colors",
            dragging ? "border-[#09418C] bg-blue-50" : "border-gray-300 bg-gray-50 hover:border-gray-400 hover:bg-gray-100")}>
          {uploading ? (
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-[#09418C]" />กำลังอัปโหลด...
            </div>
          ) : (
            <>
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-200">
                {dragging ? <Upload size={18} className="text-[#09418C]" /> : <ImageIcon size={18} className="text-gray-500" />}
              </div>
              <p className="text-sm text-gray-500"><span className="font-medium text-[#09418C]">{label}</span> หรือลากไฟล์มาวางที่นี่</p>
              <p className="text-xs text-gray-400">PNG, JPG, WEBP สูงสุด 50 MB</p>
            </>
          )}
        </div>
      )}
      <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  )
}
