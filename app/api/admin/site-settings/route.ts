import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { connectDB } from "@/lib/mongodb"
import { SiteSetting } from "@/lib/models"

export async function GET() {
  const session = await auth()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  await connectDB()
  const rows = await SiteSetting.find()
  return NextResponse.json(rows.map((r) => ({ key: r.key, value: r.value })))
}

export async function POST(req: Request) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  await connectDB()
  const body = await req.json()
  const items: { key: string; value: unknown }[] = Array.isArray(body) ? body : [body]
  for (const { key, value } of items) {
    await SiteSetting.findOneAndUpdate(
      { key },
      { key, value, updated_at: new Date().toISOString() },
      { upsert: true, new: true }
    )
  }
  return NextResponse.json({ ok: true })
}
