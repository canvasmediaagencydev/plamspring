"use client"

import { useEditor, EditorContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import Image from "@tiptap/extension-image"
import Link from "@tiptap/extension-link"
import Placeholder from "@tiptap/extension-placeholder"
import { useEffect, useRef, useState } from "react"
import {
  Bold, Italic, List, ListOrdered, Quote, Undo, Redo,
  Heading2, Heading3, Link as LinkIcon, ImageUp, Loader2,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface TiptapEditorProps {
  value: string
  onChange: (html: string) => void
  placeholder?: string
  bucket?: string
}

function ToolbarButton({ onClick, active, title, disabled, children }: {
  onClick: () => void; active?: boolean; title: string; disabled?: boolean; children: React.ReactNode
}) {
  return (
    <button type="button" onMouseDown={(e) => { e.preventDefault(); onClick() }} title={title} disabled={disabled}
      className={cn("flex h-8 w-8 items-center justify-center rounded text-sm transition-colors disabled:opacity-40 disabled:cursor-not-allowed",
        active ? "bg-[#09418C] text-white" : "text-gray-600 hover:bg-gray-100")}>
      {children}
    </button>
  )
}

export function TiptapEditor({ value, onChange, placeholder = "เริ่มเขียนเนื้อหา...", bucket = "post-images" }: TiptapEditorProps) {
  const imageInputRef = useRef<HTMLInputElement>(null)
  const [uploadingImage, setUploadingImage] = useState(false)

  const editor = useEditor({
    extensions: [
      StarterKit, Image.configure({ inline: false }),
      Link.configure({ openOnClick: false }),
      Placeholder.configure({ placeholder }),
    ],
    immediatelyRender: false,
    content: value,
    onUpdate: ({ editor }) => { onChange(editor.getHTML()) },
    editorProps: { attributes: { class: "prose prose-sm max-w-none min-h-[200px] px-4 py-3 focus:outline-none" } },
  })

  useEffect(() => {
    if (editor && value !== editor.getHTML()) editor.commands.setContent(value)
  }, [editor, value])

  if (!editor) return null

  const addLink = () => {
    const url = prompt("ใส่ URL:"); if (url) editor.chain().focus().setLink({ href: url }).run()
  }

  const handleImageFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; e.target.value = ""; if (!file) return
    setUploadingImage(true)
    try {
      const form = new FormData()
      form.append("file", file)
      form.append("folder", bucket)
      const res = await fetch("/api/upload", { method: "POST", body: form })
      if (!res.ok) throw new Error()
      const { url } = await res.json()
      editor.chain().focus().setImage({ src: url }).run()
    } catch { alert("อัปโหลดรูปไม่สำเร็จ กรุณาลองใหม่") }
    finally { setUploadingImage(false) }
  }

  return (
    <div className="rounded-lg border border-gray-300 overflow-hidden">
      <div className="flex flex-wrap items-center gap-1 border-b border-gray-200 bg-gray-50 px-2 py-1.5">
        <ToolbarButton onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive("bold")} title="Bold"><Bold size={14} /></ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive("italic")} title="Italic"><Italic size={14} /></ToolbarButton>
        <div className="w-px h-5 bg-gray-300 mx-1" />
        <ToolbarButton onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} active={editor.isActive("heading", { level: 2 })} title="Heading 2"><Heading2 size={14} /></ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} active={editor.isActive("heading", { level: 3 })} title="Heading 3"><Heading3 size={14} /></ToolbarButton>
        <div className="w-px h-5 bg-gray-300 mx-1" />
        <ToolbarButton onClick={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive("bulletList")} title="Bullet List"><List size={14} /></ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive("orderedList")} title="Ordered List"><ListOrdered size={14} /></ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleBlockquote().run()} active={editor.isActive("blockquote")} title="Blockquote"><Quote size={14} /></ToolbarButton>
        <div className="w-px h-5 bg-gray-300 mx-1" />
        <ToolbarButton onClick={addLink} active={editor.isActive("link")} title="เพิ่ม Link"><LinkIcon size={14} /></ToolbarButton>
        <ToolbarButton onClick={() => imageInputRef.current?.click()} title="แทรกรูปภาพ" disabled={uploadingImage}>
          {uploadingImage ? <Loader2 size={14} className="animate-spin" /> : <ImageUp size={14} />}
        </ToolbarButton>
        <div className="w-px h-5 bg-gray-300 mx-1" />
        <ToolbarButton onClick={() => editor.chain().focus().undo().run()} title="Undo"><Undo size={14} /></ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().redo().run()} title="Redo"><Redo size={14} /></ToolbarButton>
      </div>
      <div className="bg-white min-h-[200px]"><EditorContent editor={editor} /></div>
      <input ref={imageInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageFile} />
    </div>
  )
}
