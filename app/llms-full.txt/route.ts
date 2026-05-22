// app/llms-full.txt/route.ts
// Serves llms-full.txt: full inline content of projects and posts, with blog
// HTML converted to Markdown. Revalidates hourly; degrades to header-only.
import { getProjects, getPosts } from "@/lib/llms/data";
import { buildLlmsFull } from "@/lib/llms/content";

export const revalidate = 3600;

export async function GET() {
  const [projects, posts] = await Promise.all([getProjects(), getPosts()]);
  const body = buildLlmsFull(projects, posts);
  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
