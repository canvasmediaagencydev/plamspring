"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default function NewProjectButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleCreate = async () => {
    setLoading(true);
    const res = await fetch("/api/admin/project-pages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: "โครงการใหม่", is_published: false }),
    });

    if (res.ok) {
      const data = await res.json();
      router.push(`/admin/projects/${data.id}`);
    } else {
      alert("สร้างโครงการไม่สำเร็จ");
      setLoading(false);
    }
  };

  return (
    <Button onClick={handleCreate} disabled={loading}>
      <Plus size={16} />
      {loading ? "กำลังสร้าง..." : "เพิ่มโครงการ"}
    </Button>
  );
}
