// lib/llms/data.ts
// Published-only Supabase fetch for the llms.txt files. Mirrors the filters
// used by app/sitemap.ts. Errors degrade to empty arrays so the routes never 500.
import { createStaticClient } from "@/lib/supabase/server";

export interface LlmsProject {
  name: string;
  subtitle: string | null;
  description: string | null;
  slug: string;
  highlights: string[];
  houseTypes: string[];
  nearbyPlaces: string[];
}

export interface LlmsPost {
  title: string;
  excerpt: string | null;
  content: string | null;
  slug: string;
  type: string | null;
  publishedAt: string | null;
}

export async function getProjects(): Promise<LlmsProject[]> {
  const supabase = createStaticClient();
  const { data, error } = await supabase
    .from("project_pages")
    .select("name, subtitle, description, slug, highlights, house_types, nearby_places")
    .eq("is_published", true)
    .not("slug", "is", null);

  if (error || !data) return [];

  return data.map((p) => ({
    name: p.name,
    subtitle: p.subtitle ?? null,
    description: p.description ?? null,
    slug: p.slug as string,
    highlights: Array.isArray(p.highlights) ? (p.highlights as string[]) : [],
    houseTypes: Array.isArray(p.house_types)
      ? (p.house_types as Array<{ name?: string }>)
          .map((h) => h?.name)
          .filter((n): n is string => !!n)
      : [],
    nearbyPlaces: Array.isArray(p.nearby_places)
      ? (p.nearby_places as Array<{ name?: string; distance?: number | string; unit?: string }>)
          .map((pl) => {
            if (!pl?.name) return "";
            const dist =
              pl.distance != null
                ? ` — ${pl.distance}${pl.unit ? ` ${pl.unit}` : ""}`
                : "";
            return `${pl.name}${dist}`;
          })
          .filter((s) => s.length > 0)
      : [],
  }));
}

export async function getPosts(): Promise<LlmsPost[]> {
  const supabase = createStaticClient();
  const { data, error } = await supabase
    .from("posts")
    .select("title, excerpt, content, slug, type, published_at")
    .eq("is_published", true)
    .not("slug", "is", null);

  if (error || !data) return [];

  return data.map((p) => ({
    title: p.title,
    excerpt: p.excerpt ?? null,
    content: p.content ?? null,
    slug: p.slug as string,
    type: p.type ?? null,
    publishedAt: p.published_at ?? null,
  }));
}
