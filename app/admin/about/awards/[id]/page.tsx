import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { AwardFormClient } from "./AwardFormClient";
export default async function EditAwardPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data } = await supabase.from("awards").select("*").eq("id", id).single();
  if (!data) notFound();
  return <AwardFormClient initial={data} />;
}
