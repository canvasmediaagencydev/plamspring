"use client";
import { MilestoneForm } from "../MilestoneForm";
import type { Tables } from "@/lib/types/database.types";
export function MilestoneFormClient({ initial }: { initial: Tables<"milestones"> }) {
  return <MilestoneForm mode="edit" initial={initial} />;
}
