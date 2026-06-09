import { NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb"
import { LandInquiry } from "@/lib/models"

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}))
  const { first_name, last_name, phone } = body
  if (!first_name || !last_name || !phone) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
  }
  await connectDB()
  await new LandInquiry(body).save()
  return NextResponse.json({ ok: true })
}
