import { NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb"
import { ContactClick } from "@/lib/models"

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}))
  const type = body.type as string
  if (type !== "facebook" && type !== "line" && type !== "loan_contact") {
    return NextResponse.json({ error: "Invalid type" }, { status: 400 })
  }
  await connectDB()
  await new ContactClick({ type }).save()
  return NextResponse.json({ ok: true })
}
