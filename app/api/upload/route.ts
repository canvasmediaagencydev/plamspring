import { NextRequest, NextResponse } from "next/server"
import { uploadToR2 } from "@/lib/r2"

export async function POST(req: NextRequest) {
  try {
    const form = await req.formData()
    const file = form.get("file") as File | null
    const folder = (form.get("folder") as string) || "uploads"
    if (!file) return NextResponse.json({ error: "No file" }, { status: 400 })

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const ext = file.name.split(".").pop() || "bin"
    const key = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
    const url = await uploadToR2(key, buffer, file.type || "application/octet-stream")
    return NextResponse.json({ url })
  } catch (err) {
    console.error("[upload]", err)
    return NextResponse.json({ error: "Upload failed" }, { status: 500 })
  }
}
