import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { ProjectFormClient } from "./ProjectFormClient";

export default async function EditProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { data } = await supabase.from("projects").select("*").eq("id", id).single();
  if (!data) notFound();
  return <ProjectFormClient initial={data} />;
}
