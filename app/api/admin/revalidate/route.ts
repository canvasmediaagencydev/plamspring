import { revalidatePath } from "next/cache"
import { auth } from "@/auth"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const body = await request.json().catch(() => ({}))
  const paths: string[] = body.paths ?? ["/"]
  paths.forEach((path) => revalidatePath(path))
  return NextResponse.json({ revalidated: paths })
}
