// app/llms.txt/route.ts
// Serves the curated llms.txt index. Revalidates hourly; degrades to the
// static header + main pages if Supabase fetch returns no data.
import { getProjects, getPosts } from "@/lib/llms/data";
import { buildLlmsIndex } from "@/lib/llms/content";

export const revalidate = 3600;

export async function GET() {
  const [projects, posts] = await Promise.all([getProjects(), getPosts()]);
  const body = buildLlmsIndex(projects, posts);
  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
