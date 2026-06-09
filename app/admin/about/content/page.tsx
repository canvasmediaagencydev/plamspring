"use client";

import { useEffect, useState } from "react";
import { AdminHeader } from "@/app/components/admin/AdminHeader";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Save } from "lucide-react";
import { revalidatePages, REVALIDATE_PATHS } from "@/lib/revalidate";

interface AboutContentData { history: string; vision: string; mission: string }
const DEFAULTS: AboutContentData = { history: "", vision: "", mission: "" };

export default function AdminAboutContentPage() {
  const [data, setData] = useState<AboutContentData>(DEFAULTS);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch("/api/admin/site-settings").then((r) => r.json()).then((rows: { key: string; value: unknown }[]) => {
      const row = rows.find((r) => r.key === "about_content");
      if (row?.value) setData({ ...DEFAULTS, ...(row.value as Partial<AboutContentData>) });
    });
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await fetch("/api/admin/site-settings", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify([{ key: "about_content", value: data }]) });
      await revalidatePages([...REVALIDATE_PATHS.about]);
      setSaved(true); setTimeout(() => setSaved(false), 2000);
    } finally { setSaving(false) }
  };

  const set = (field: keyof AboutContentData, value: string) => setData((prev) => ({ ...prev, [field]: value }));
  const fields: { key: keyof AboutContentData; label: string; rows: number }[] = [
    { key: "history", label: "HISTORY", rows: 6 },
    { key: "vision", label: "VISION", rows: 4 },
    { key: "mission", label: "MISSION", rows: 5 },
  ];

  return (
    <div>
      <AdminHeader title="About Us — เนื้อหา" description="แก้ไขข้อความ History, Vision และ Mission"
        action={<Button onClick={handleSave} disabled={saving} className="rounded-xl shadow-sm font-bold px-5"><Save size={16} className="mr-2" />{saved ? "บันทึกข้อมูลเรียบร้อย!" : saving ? "กำลังบันทึก..." : "บันทึกข้อมูล"}</Button>} />
      <div className="max-w-2xl space-y-6">
        {fields.map(({ key, label, rows }) => (
          <Card key={key} className="rounded-[1.5rem] border-gray-100/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-white/80 backdrop-blur-sm overflow-hidden">
            <CardHeader className="border-b border-gray-100/60 bg-gray-50/30 pb-4"><CardTitle className="text-[15px] font-black text-gray-800">{label}</CardTitle></CardHeader>
            <CardContent className="pt-6">
              <Label className="sr-only">{label}</Label>
              <Textarea rows={rows} value={data[key]} onChange={(e) => set(key, e.target.value)} placeholder={`เนื้อหา ${label}...`} />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
