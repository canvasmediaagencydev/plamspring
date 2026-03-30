import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { ProjectDetailClient } from "@/app/admin/home/projects/[id]/detail/ProjectDetailClient";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function AdminProjectDetailPage({ params }: PageProps) {
  const { id } = await params;
  const supabase = await createClient();

  const { data } = await supabase
    .from("project_pages")
    .select("*")
    .eq("id", id)
    .single();

  if (!data) notFound();

  return <ProjectDetailClient project={data} backHref="/admin/projects" />;
}
