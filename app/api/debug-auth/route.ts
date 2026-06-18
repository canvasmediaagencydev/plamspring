import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"

export async function GET() {
  const hash = process.env.ADMIN_PASSWORD_HASH ?? ""
  const email = process.env.ADMIN_EMAIL ?? ""
  const valid = await bcrypt.compare("canvassuppotercs01", hash)
  return NextResponse.json({
    email,
    hashLength: hash.length,
    hashPreview: hash.slice(0, 10),
    valid,
  })
}
