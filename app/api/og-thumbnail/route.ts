import { NextRequest, NextResponse } from "next/server";

const META_IMAGE_KEYS = [
  "og:image",
  "og:image:url",
  "og:image:secure_url",
  "twitter:image",
  "twitter:image:src",
];

function decodeHtmlEntities(value: string) {
  return value
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
}

function extractMetaImage(html: string) {
  const metaTags = html.match(/<meta\b[^>]*>/gi) ?? [];

  for (const tag of metaTags) {
    const attrs = Object.fromEntries(
      Array.from(tag.matchAll(/([^\s=]+)\s*=\s*(["'])(.*?)\2/gi)).map((match) => [
        match[1].toLowerCase(),
        match[3],
      ])
    );

    const key = attrs.property?.toLowerCase() ?? attrs.name?.toLowerCase();
    const content = attrs.content;

    if (key && content && META_IMAGE_KEYS.includes(key)) {
      return decodeHtmlEntities(content);
    }
  }

  const displayUrlMatch = html.match(/"display_url":"(https:[^"]+)"/);
  if (displayUrlMatch) {
    return decodeHtmlEntities(displayUrlMatch[1].replace(/\\u0026/g, "&").replace(/\\\//g, "/"));
  }

  return null;
}

function normalizeTargetUrl(rawUrl: string) {
  const parsed = new URL(rawUrl);

  if (parsed.hostname === "instagram.com") {
    parsed.hostname = "www.instagram.com";
  }

  if (parsed.hostname.endsWith("instagram.com")) {
    parsed.search = "";
    parsed.hash = "";
  }

  return parsed.toString();
}

/**
 * Server-side og:image fetcher — bypasses CORS restrictions.
 * GET /api/og-thumbnail?url=<encoded-url>
 */
export async function GET(req: NextRequest) {
  const rawUrl = req.nextUrl.searchParams.get("url");
  if (!rawUrl) return NextResponse.json({ error: "Missing url" }, { status: 400 });

  try {
    const targetUrl = normalizeTargetUrl(rawUrl);
    const res = await fetch(targetUrl, {
      headers: {
        // Mimic a browser request so Instagram/TikTok returns the HTML
        "User-Agent":
          "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)",
        Accept: "text/html",
        "Accept-Language": "en-US,en;q=0.9",
      },
      next: { revalidate: 3600 }, // cache 1 hour
    });

    if (!res.ok) return NextResponse.json({ error: "Fetch failed" }, { status: 502 });

    const html = await res.text();
    const thumbnailUrl = extractMetaImage(html);

    if (!thumbnailUrl) return NextResponse.json({ error: "No thumbnail found" }, { status: 404 });

    return NextResponse.json({ thumbnail_url: thumbnailUrl });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Internal error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
