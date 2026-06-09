"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";

export function DeleteProjectButton({ id, name }: { id: string; name: string }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    if (!confirm(`ลบโครงการ "${name}" ใช่ไหม? ไม่สามารถกู้คืนได้`)) return;
    setLoading(true);
    await fetch(`/api/admin/project-pages/${id}`, { method: "DELETE" });
    router.refresh();
  };

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className="flex items-center gap-1.5 rounded-xl border border-red-100 bg-red-50 px-3 py-2 text-xs font-semibold text-red-400 transition-all hover:bg-red-100 hover:text-red-600 disabled:opacity-50"
      title="ลบโครงการ"
    >
      <Trash2 size={11} />
      ลบ
    </button>
  );
}
