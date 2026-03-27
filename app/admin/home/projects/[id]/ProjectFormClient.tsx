"use client";

import { ProjectForm } from "../ProjectForm";
import type { Tables } from "@/lib/types/database.types";

export function ProjectFormClient({ initial }: { initial: Tables<"projects"> }) {
  return <ProjectForm mode="edit" initial={initial} />;
}
