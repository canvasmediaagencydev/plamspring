import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { connectDB } from "@/lib/mongodb"
import { LeadSubmission } from "@/lib/models"

export async function GET() {
  const session = await auth()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  await connectDB()
  const data = await LeadSubmission.find().sort({ created_at: -1 })
  return NextResponse.json(data)
}
