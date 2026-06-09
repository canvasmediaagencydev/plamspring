import { connectDB } from "@/lib/mongodb";
import { Project } from "@/lib/models";
import { notFound } from "next/navigation";
import { ProjectFormClient } from "./ProjectFormClient";

export default async function EditProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await connectDB();
  const doc = await Project.findById(id).lean();
  if (!doc) notFound();
  return <ProjectFormClient initial={JSON.parse(JSON.stringify(doc))} />;
}
