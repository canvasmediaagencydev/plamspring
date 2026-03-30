"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Trash2 } from "lucide-react";

export function DeleteProjectButton({ id, name }: { id: string; name: string }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    if (!confirm(`ลบโครงการ "${name}" ใช่ไหม? ไม่สามารถกู้คืนได้`)) return;
    setLoading(true);
    const supabase = createClient();
    await supabase.from("project_pages").delete().eq("id", id);
    router.refresh();
  };

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className="flex h-7 w-7 items-center justify-center rounded-lg border border-red-100 bg-red-50 text-red-400 transition-colors hover:bg-red-100 hover:text-red-600 disabled:opacity-50"
      title="ลบโครงการ"
    >
      <Trash2 size={13} />
    </button>
  );
}
