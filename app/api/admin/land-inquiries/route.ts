import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { connectDB } from "@/lib/mongodb"
import { LandInquiry } from "@/lib/models"

export async function GET() {
  const session = await auth()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  await connectDB()
  const data = await LandInquiry.find().sort({ created_at: -1 })
  return NextResponse.json(data)
}
