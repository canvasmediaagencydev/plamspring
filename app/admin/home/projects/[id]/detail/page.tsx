import { connectDB } from "@/lib/mongodb";
import { ProjectPage } from "@/lib/models";
import { notFound } from "next/navigation";
import { ProjectDetailClient } from "./ProjectDetailClient";

export default async function ProjectDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await connectDB();
  const doc = await ProjectPage.findById(id).lean();
  if (!doc) notFound();
  return <ProjectDetailClient project={JSON.parse(JSON.stringify(doc))} />;
}
