import type { MetadataRoute } from "next";
import { connectDB } from "@/lib/mongodb";
import { ProjectPage, Post } from "@/lib/models";

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
  await connectDB();
  const now = new Date();

  const [projectPages, posts] = await Promise.all([
    ProjectPage.find({ is_published: true, slug: { $ne: null } })
      .select("slug updated_at")
      .lean(),
    Post.find({ is_published: true })
      .select("slug updated_at published_at")
      .lean(),
  ]);

  const projectEntries: MetadataRoute.Sitemap = projectPages.map((p) => ({
    url: `${SITE_URL}/projects/${p.slug}`,
    lastModified: p.updated_at ? new Date(p.updated_at as string) : now,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const blogEntries: MetadataRoute.Sitemap = posts.map((p) => ({
    url: `${SITE_URL}/blog/${p.slug}`,
    lastModified: new Date((p.updated_at ?? p.published_at ?? now.toISOString()) as string),
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
