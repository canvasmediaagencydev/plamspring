import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { connectDB } from "@/lib/mongodb"
import { Milestone } from "@/lib/models"

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  await connectDB()
  const { id } = await params
  const body = await req.json()
  const doc = await Milestone.findOneAndUpdate({ _id: id }, body, { new: true })
  return NextResponse.json(doc?.toJSON() ?? {})
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  await connectDB()
  const { id } = await params
  await Milestone.findOneAndDelete({ _id: id })
  return NextResponse.json({ ok: true })
}
