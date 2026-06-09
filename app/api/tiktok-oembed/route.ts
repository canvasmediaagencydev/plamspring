import { NextRequest, NextResponse } from "next/server"
import { uploadToR2 } from "@/lib/r2"

export async function GET(req: NextRequest) {
  const rawUrl = req.nextUrl.searchParams.get("url")
  if (!rawUrl) return NextResponse.json({ error: "Missing url" }, { status: 400 })

  const oembed = await fetch(
    `https://www.tiktok.com/oembed?url=${encodeURIComponent(rawUrl)}`,
    { headers: { "User-Agent": "Mozilla/5.0" } }
  ).catch(() => null)

  if (!oembed?.ok) return NextResponse.json({ error: "TikTok fetch failed" }, { status: 502 })

  const json = await oembed.json()
  const cdnUrl: string | undefined = json.thumbnail_url
  if (!cdnUrl) return NextResponse.json({ error: "No thumbnail from TikTok" }, { status: 404 })

  const imgRes = await fetch(cdnUrl, { headers: { "User-Agent": "Mozilla/5.0" } }).catch(() => null)
  if (!imgRes?.ok) return NextResponse.json({ error: "Failed to download thumbnail" }, { status: 502 })

  const imgBuffer = await imgRes.arrayBuffer()
  const contentType = imgRes.headers.get("content-type") ?? "image/jpeg"
  const ext = contentType.includes("png") ? "png" : contentType.includes("webp") ? "webp" : "jpg"

  const key = `social-reels/tiktok-${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
  const url = await uploadToR2(key, Buffer.from(imgBuffer), contentType)
  return NextResponse.json({ thumbnail_url: url })
}
