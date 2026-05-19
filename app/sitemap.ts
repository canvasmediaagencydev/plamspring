import type { MetadataRoute } from "next";
import { createStaticClient } from "@/lib/supabase/server";

const SITE_URL = "https://palmspringscm.com";

type Route = MetadataRoute.Sitemap[number];

const staticRoutes: Array<{
  path: string;
  changeFrequency: Route["changeFrequency"];
  priority: number;
}> = [
  { path: "/", changeFrequency: "weekly", priority: 1.0 },
  { path: "/about", changeFrequency: "monthly", priority: 0.7 },
  { path: "/our-family", changeFrequency: "monthly", priority: 0.7 },
  { path: "/projects", changeFrequency: "weekly", priority: 0.9 },
  { path: "/blog", changeFrequency: "weekly", priority: 0.8 },
  { path: "/sell-land", changeFrequency: "monthly", priority: 0.7 },
  { path: "/contact", changeFrequency: "yearly", priority: 0.5 },
  { path: "/contact/form", changeFrequency: "yearly", priority: 0.4 },
  { path: "/contact/land", changeFrequency: "yearly", priority: 0.4 },
];

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = createStaticClient();
  const now = new Date();

  const [projectsRes, postsRes] = await Promise.all([
    supabase
      .from("project_pages")
      .select("slug, updated_at")
      .eq("is_published", true)
      .not("slug", "is", null),
    supabase
      .from("posts")
      .select("slug, updated_at, published_at")
      .eq("is_published", true),
  ]);

  const projectEntries: MetadataRoute.Sitemap = (projectsRes.data ?? []).map(
    (p) => ({
      url: `${SITE_URL}/projects/${p.slug}`,
      lastModified: p.updated_at ? new Date(p.updated_at) : now,
      changeFrequency: "weekly",
      priority: 0.8,
    }),
  );

  const blogEntries: MetadataRoute.Sitemap = (postsRes.data ?? []).map((p) => ({
    url: `${SITE_URL}/blog/${p.slug}`,
    lastModified: new Date(p.updated_at ?? p.published_at ?? now),
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  const staticEntries: MetadataRoute.Sitemap = staticRoutes.map((r) => ({
    url: `${SITE_URL}${r.path}`,
    lastModified: now,
    changeFrequency: r.changeFrequency,
    priority: r.priority,
  }));

  return [...staticEntries, ...projectEntries, ...blogEntries];
}
