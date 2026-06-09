import { connectDB } from "@/lib/mongodb";
import { LifestyleSlide } from "@/lib/models";
import { notFound } from "next/navigation";
import { LifestyleFormClient } from "./LifestyleFormClient";

export default async function EditLifestyleslidePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await connectDB();
  const doc = await LifestyleSlide.findById(id).lean();
  if (!doc) notFound();
  return <LifestyleFormClient initial={JSON.parse(JSON.stringify(doc))} />;
}
