"use client";
import { PostForm } from "../PostForm";
import type { Tables } from "@/lib/types/database.types";
export function PostFormClient({ initial }: { initial: Tables<"posts"> }) {
  return <PostForm mode="edit" initial={initial} />;
}
