"use client";

import { ProjectForm } from "../ProjectForm";
import type { Project } from "@/lib/types";

export function ProjectFormClient({ initial }: { initial: Project }) {
  return <ProjectForm mode="edit" initial={initial} />;
}
