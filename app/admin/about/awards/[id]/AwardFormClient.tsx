"use client";
import { AwardForm } from "../AwardForm";
import type { Award } from "@/lib/types";
export function AwardFormClient({ initial }: { initial: Award }) {
  return <AwardForm mode="edit" initial={initial} />;
}
