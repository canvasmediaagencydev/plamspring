import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

/**
 * POST /api/admin/revalidate
 * Body: { paths: string[] }
 *
 * Called by admin forms after saving data to invalidate the Next.js
 * page cache so the public site reflects changes immediately.
 * Requires an authenticated Supabase session.
 */
export async function POST(request: Request) {
  // Verify the caller is authenticated
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => ({}));
  const paths: string[] = body.paths ?? ["/"];

  paths.forEach((path) => revalidatePath(path));

  return NextResponse.json({ revalidated: paths });
}
