"use client";

import { LifestyleForm } from "../LifestyleForm";
import type { LifestyleSlide } from "@/lib/types";

export function LifestyleFormClient({ initial }: { initial: LifestyleSlide }) {
  return <LifestyleForm mode="edit" initial={initial} />;
}
