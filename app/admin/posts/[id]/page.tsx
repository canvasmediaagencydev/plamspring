import { connectDB } from "@/lib/mongodb";
import { Post } from "@/lib/models";
import { notFound } from "next/navigation";
import { PostFormClient } from "./PostFormClient";

export default async function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await connectDB();
  const doc = await Post.findById(id).lean();
  if (!doc) notFound();
  return <PostFormClient initial={JSON.parse(JSON.stringify(doc))} />;
}
