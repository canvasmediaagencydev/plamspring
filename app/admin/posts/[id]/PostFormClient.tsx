"use client";
import { PostForm } from "../PostForm";
import type { Post } from "@/lib/types";
export function PostFormClient({ initial }: { initial: Post }) {
  return <PostForm mode="edit" initial={initial} />;
}
