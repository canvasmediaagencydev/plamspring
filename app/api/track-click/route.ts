import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

/**
 * POST /api/track-click
 * Body: { type: "facebook" | "line" }
 *
 * Public endpoint — no authentication required.
 * Records a contact button click from the public website.
 */
export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const type = body.type as string;

  if (type !== "facebook" && type !== "line" && type !== "loan_contact") {
    return NextResponse.json({ error: "Invalid type" }, { status: 400 });
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("contact_clicks")
    .insert({ type });

  if (error) {
    console.error("[track-click]", error.message);
    return NextResponse.json({ error: "Failed to track" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
