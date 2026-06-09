import { connectDB } from "@/lib/mongodb";
import { ProjectPage } from "@/lib/models";
import { notFound } from "next/navigation";
import { ProjectDetailClient } from "@/app/admin/home/projects/[id]/detail/ProjectDetailClient";

export default async function AdminProjectDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await connectDB();
  const doc = await ProjectPage.findById(id).lean();
  if (!doc) notFound();
  return <ProjectDetailClient project={JSON.parse(JSON.stringify(doc))} backHref="/admin/projects" />;
}
