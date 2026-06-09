import { connectDB } from "@/lib/mongodb";
import { Award } from "@/lib/models";
import { notFound } from "next/navigation";
import { AwardFormClient } from "./AwardFormClient";

export default async function EditAwardPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await connectDB();
  const doc = await Award.findById(id).lean();
  if (!doc) notFound();
  return <AwardFormClient initial={JSON.parse(JSON.stringify(doc))} />;
}
