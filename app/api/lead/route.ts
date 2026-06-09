import { NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb"
import { LeadSubmission } from "@/lib/models"

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}))
  const { name, email, phone, line_id, budget, detail, visit_date, visit_time } = body
  if (!name || !email || !phone) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
  }
  await connectDB()
  await new LeadSubmission({ name, email, phone, line_id: line_id || null, budget: budget || null, detail: detail || null, visit_date: visit_date || null, visit_time: visit_time || null }).save()
  return NextResponse.json({ ok: true })
}
