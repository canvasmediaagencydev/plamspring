import { connectDB } from "@/lib/mongodb";
import { Milestone } from "@/lib/models";
import { notFound } from "next/navigation";
import { MilestoneFormClient } from "./MilestoneFormClient";

export default async function EditMilestonePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await connectDB();
  const doc = await Milestone.findById(id).lean();
  if (!doc) notFound();
  return <MilestoneFormClient initial={JSON.parse(JSON.stringify(doc))} />;
}
