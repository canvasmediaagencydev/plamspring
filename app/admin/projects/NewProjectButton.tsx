"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default function NewProjectButton() {
  const supabase = createClient();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleCreate = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("project_pages")
      .insert({ name: "โครงการใหม่", is_published: false })
      .select("id")
      .single();

    if (!error && data) {
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
