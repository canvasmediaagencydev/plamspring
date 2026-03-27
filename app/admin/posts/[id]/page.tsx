import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { PostFormClient } from "./PostFormClient";
export default async function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data } = await supabase.from("posts").select("*").eq("id", id).single();
  if (!data) notFound();
  return <PostFormClient initial={data} />;
}
