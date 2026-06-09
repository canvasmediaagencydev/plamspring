"use client";
import { MilestoneForm } from "../MilestoneForm";
import type { Milestone } from "@/lib/types";
export function MilestoneFormClient({ initial }: { initial: Milestone }) {
  return <MilestoneForm mode="edit" initial={initial} />;
}
