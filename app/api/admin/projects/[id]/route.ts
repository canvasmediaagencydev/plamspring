import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { connectDB } from "@/lib/mongodb"
import { Project } from "@/lib/models"

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  await connectDB()
  const { id } = await params
  const doc = await Project.findOne({ _id: id })
  if (!doc) return NextResponse.json({ error: "Not found" }, { status: 404 })
  return NextResponse.json(doc.toJSON())
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  await connectDB()
  const { id } = await params
  const body = await req.json()
  const doc = await Project.findOneAndUpdate({ _id: id }, body, { new: true })
  return NextResponse.json(doc?.toJSON() ?? {})
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  await connectDB()
  const { id } = await params
  await Project.findOneAndDelete({ _id: id })
  return NextResponse.json({ ok: true })
}
