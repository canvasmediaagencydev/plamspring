import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { MilestoneFormClient } from "./MilestoneFormClient";
export default async function EditMilestonePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data } = await supabase.from("milestones").select("*").eq("id", id).single();
  if (!data) notFound();
  return <MilestoneFormClient initial={data} />;
}
