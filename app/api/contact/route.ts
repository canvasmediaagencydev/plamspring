import { NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb"
import { ContactSubmission } from "@/lib/models"

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}))
  const { name, email, phone, message } = body
  if (!name || !email || !phone) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
  }
  await connectDB()
  await new ContactSubmission({ name, email, phone, message: message || null }).save()
  return NextResponse.json({ ok: true })
}
