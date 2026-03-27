"use client";
import { AwardForm } from "../AwardForm";
import type { Tables } from "@/lib/types/database.types";
export function AwardFormClient({ initial }: { initial: Tables<"awards"> }) {
  return <AwardForm mode="edit" initial={initial} />;
}
