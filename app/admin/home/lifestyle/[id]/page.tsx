import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { LifestyleFormClient } from "./LifestyleFormClient";

export default async function EditLifestyleslidePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { data } = await supabase.from("lifestyle_slides").select("*").eq("id", id).single();
  if (!data) notFound();
  return <LifestyleFormClient initial={data} />;
}
