"use client";

import { useEffect, useState } from "react";
import { createClient, toJson } from "@/lib/supabase/client";
import { AdminHeader } from "@/app/components/admin/AdminHeader";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Save } from "lucide-react";
import { revalidatePages, REVALIDATE_PATHS } from "@/lib/revalidate";

interface AboutContentData {
  history: string;
  vision: string;
  mission: string;
}

const DEFAULTS: AboutContentData = {
  history: "",
  vision: "",
  mission: "",
};

export default function AdminAboutContentPage() {
  const supabase = createClient();
  const [data, setData] = useState<AboutContentData>(DEFAULTS);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    supabase
      .from("site_settings")
      .select("value")
      .eq("key", "about_content")
      .single()
      .then(({ data: row }) => {
        if (row?.value) setData({ ...DEFAULTS, ...(row.value as Partial<AboutContentData>) });
      });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSave = async () => {
    setSaving(true);
    try {
      await supabase
        .from("site_settings")
        .upsert({ key: "about_content", value: toJson(data) });
      await revalidatePages([...REVALIDATE_PATHS.about]);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } finally {
      setSaving(false);
    }
  };

  const set = (field: keyof AboutContentData, value: string) =>
    setData((prev) => ({ ...prev, [field]: value }));

  const fields: { key: keyof AboutContentData; label: string; rows: number }[] = [
    { key: "history", label: "HISTORY", rows: 6 },
    { key: "vision", label: "VISION", rows: 4 },
    { key: "mission", label: "MISSION", rows: 5 },
  ];

  return (
    <div>
      <AdminHeader
        title="About Us — เนื้อหา"
        description="แก้ไขข้อความ History, Vision และ Mission"
        action={
          <Button onClick={handleSave} disabled={saving}>
            <Save size={16} />
            {saved ? "บันทึกแล้ว!" : saving ? "กำลังบันทึก..." : "บันทึก"}
          </Button>
        }
      />

      <div className="max-w-2xl space-y-5">
        {fields.map(({ key, label, rows }) => (
          <Card key={key}>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">{label}</CardTitle>
            </CardHeader>
            <CardContent>
              <Label className="sr-only">{label}</Label>
              <Textarea
                rows={rows}
                value={data[key]}
                onChange={(e) => set(key, e.target.value)}
                placeholder={`เนื้อหา ${label}...`}
              />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
