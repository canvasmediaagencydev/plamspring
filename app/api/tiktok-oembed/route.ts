import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const BUCKET = "social-reels";

/**
 * Server-side TikTok oEmbed proxy.
 * 1. Fetches TikTok oembed to get the CDN thumbnail URL
 * 2. Downloads the image from TikTok CDN
 * 3. Re-uploads it to Supabase Storage (permanent URL, no expiry)
 * 4. Returns the permanent Supabase public URL
 *
 * GET /api/tiktok-oembed?url=<encoded-tiktok-url>
 */
export async function GET(req: NextRequest) {
  const rawUrl = req.nextUrl.searchParams.get("url");
  if (!rawUrl) return NextResponse.json({ error: "Missing url" }, { status: 400 });

  // 1. Get thumbnail URL from TikTok oEmbed
  const oembed = await fetch(
    `https://www.tiktok.com/oembed?url=${encodeURIComponent(rawUrl)}`,
    { headers: { "User-Agent": "Mozilla/5.0" } }
  ).catch(() => null);

  if (!oembed?.ok) return NextResponse.json({ error: "TikTok fetch failed" }, { status: 502 });

  const json = await oembed.json();
  const cdnUrl: string | undefined = json.thumbnail_url;
  if (!cdnUrl) return NextResponse.json({ error: "No thumbnail from TikTok" }, { status: 404 });

  // 2. Download image from TikTok CDN
  const imgRes = await fetch(cdnUrl, { headers: { "User-Agent": "Mozilla/5.0" } }).catch(() => null);
  if (!imgRes?.ok) return NextResponse.json({ error: "Failed to download thumbnail" }, { status: 502 });

  const imgBuffer = await imgRes.arrayBuffer();
  const contentType = imgRes.headers.get("content-type") ?? "image/jpeg";
  const ext = contentType.includes("png") ? "png" : contentType.includes("webp") ? "webp" : "jpg";

  // 3. Upload to Supabase Storage with service role (bypasses RLS)
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const path = `tiktok-${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
  const { error: uploadError } = await supabase.storage
    .from(BUCKET)
    .upload(path, imgBuffer, { contentType, upsert: false });

  if (uploadError) return NextResponse.json({ error: uploadError.message }, { status: 500 });

  // 4. Return permanent public URL
  const { data: urlData } = supabase.storage.from(BUCKET).getPublicUrl(path);
  return NextResponse.json({ thumbnail_url: urlData.publicUrl });
}
