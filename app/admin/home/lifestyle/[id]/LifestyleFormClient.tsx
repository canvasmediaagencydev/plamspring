"use client";

import { LifestyleForm } from "../LifestyleForm";
import type { Tables } from "@/lib/types/database.types";

export function LifestyleFormClient({ initial }: { initial: Tables<"lifestyle_slides"> }) {
  return <LifestyleForm mode="edit" initial={initial} />;
}
