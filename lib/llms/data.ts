// lib/llms/data.ts
// Published-only MongoDB fetch for the llms.txt files. Mirrors the filters
// used by app/sitemap.ts. Errors degrade to empty arrays so the routes never 500.
import { connectDB } from "@/lib/mongodb";
import { ProjectPage, Post } from "@/lib/models";

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
  try {
    await connectDB();
    const data = await ProjectPage.find({ is_published: true, slug: { $ne: null } })
      .select("name subtitle description slug highlights house_types nearby_places")
      .lean();

    return data.map((p) => ({
      name: p.name,
      subtitle: p.subtitle ?? null,
      description: p.description ?? null,
      slug: p.slug as string,
      highlights: Array.isArray(p.highlights)
        ? (p.highlights as unknown[]).filter((h): h is string => typeof h === "string")
        : [],
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
  } catch (error) {
    console.error("[llms/data] getProjects error:", error);
    return [];
  }
}

export async function getPosts(): Promise<LlmsPost[]> {
  try {
    await connectDB();
    const data = await Post.find({ is_published: true, slug: { $ne: null } })
      .select("title excerpt content slug type published_at")
      .lean();

    return data.map((p) => ({
      title: p.title,
      excerpt: p.excerpt ?? null,
      content: p.content ?? null,
      slug: p.slug as string,
      type: p.type ?? null,
      publishedAt: p.published_at ?? null,
    }));
  } catch (error) {
    console.error("[llms/data] getPosts error:", error);
    return [];
  }
}
