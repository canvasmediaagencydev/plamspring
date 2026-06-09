import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { connectDB } from "@/lib/mongodb"
import { OurFamilyImage } from "@/lib/models"

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  await connectDB()
  const { id } = await params
  await OurFamilyImage.findOneAndDelete({ _id: id })
  return NextResponse.json({ ok: true })
}
