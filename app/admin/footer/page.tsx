"use client";

import { useEffect, useState } from "react";
import { createClient, toJson } from "@/lib/supabase/client";
import { AdminHeader } from "@/app/components/admin/AdminHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Save, MapPin, Phone, Share2, MessageCircle } from "lucide-react";
import { revalidatePages, REVALIDATE_PATHS } from "@/lib/revalidate";

interface FooterSettings {
  company_name: string;
  address: string;
  hours: string;
  phone: string;
  email: string;
  facebook_url: string;
  instagram_url: string;
  line_url: string;
  tiktok_url: string;
  youtube_url: string;
  map_url: string;
}

interface StickySettings {
  facebook_messenger_url: string;
  line_url: string;
}

const DEFAULT_FOOTER: FooterSettings = {
  company_name: "Palm Springs",
  address: "",
  hours: "",
  phone: "",
  email: "",
  facebook_url: "",
  instagram_url: "",
  line_url: "",
  tiktok_url: "",
  youtube_url: "",
  map_url: "",
};

const DEFAULT_STICKY: StickySettings = {
  facebook_messenger_url: "",
  line_url: "",
};

export default function AdminFooterPage() {
  const supabase = createClient();
  const [footer, setFooter] = useState<FooterSettings>(DEFAULT_FOOTER);
  const [sticky, setSticky] = useState<StickySettings>(DEFAULT_STICKY);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from("site_settings")
        .select("key, value")
        .in("key", ["footer", "sticky_contact"]);
      if (!data) return;
      const f = data.find((r) => r.key === "footer")?.value as FooterSettings | undefined;
      const s = data.find((r) => r.key === "sticky_contact")?.value as StickySettings | undefined;
      if (f) setFooter((prev) => ({ ...prev, ...f }));
      if (s) setSticky((prev) => ({ ...prev, ...s }));
    }
    load();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSave = async () => {
    setSaving(true);
    try {
      await Promise.all([
        supabase.from("site_settings").upsert({ key: "footer", value: toJson(footer) }),
        supabase.from("site_settings").upsert({ key: "sticky_contact", value: toJson(sticky) }),
      ]);
      await revalidatePages([...REVALIDATE_PATHS.footer]);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } finally {
      setSaving(false);
    }
  };

  const setF = (field: keyof FooterSettings, value: string) =>
    setFooter((prev) => ({ ...prev, [field]: value }));

  return (
    <div>
      <AdminHeader
        title="Footer & Contact"
        description="แก้ไขข้อมูล Footer และ Sticky Contact Button"
        action={
          <Button onClick={handleSave} disabled={saving}>
            <Save size={16} />
            {saved ? "บันทึกแล้ว!" : saving ? "กำลังบันทึก..." : "บันทึก"}
          </Button>
        }
      />

      <div className="space-y-6 max-w-2xl">
        {/* Address & Contact */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <MapPin size={18} />
              ที่อยู่ & เวลาทำการ
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>ที่อยู่</Label>
              <Textarea
                rows={3}
                placeholder="199/1-2 หมู่ 5 ถ.มหิดล ต.หนองหอย..."
                value={footer.address}
                onChange={(e) => setF("address", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>เวลาทำการ</Label>
              <Input
                placeholder="ทุกวัน เวลา 9:00 - 18:00"
                value={footer.hours}
                onChange={(e) => setF("hours", e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Phone & Email */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Phone size={18} />
              ข้อมูลติดต่อ
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>เบอร์โทรศัพท์</Label>
              <Input
                placeholder="053 105 000"
                value={footer.phone}
                onChange={(e) => setF("phone", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>อีเมล</Label>
              <Input
                type="email"
                placeholder="info@palmsprings.co.th"
                value={footer.email}
                onChange={(e) => setF("email", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Google Maps URL</Label>
              <Input
                placeholder="https://maps.google.com/..."
                value={footer.map_url}
                onChange={(e) => setF("map_url", e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Social Links */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Share2 size={18} />
              Social Media Links
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { key: "facebook_url" as const, label: "Facebook" },
              { key: "instagram_url" as const, label: "Instagram" },
              { key: "line_url" as const, label: "Line" },
              { key: "tiktok_url" as const, label: "TikTok" },
              { key: "youtube_url" as const, label: "YouTube" },
            ].map(({ key, label }) => (
              <div key={key} className="space-y-2">
                <Label>{label}</Label>
                <Input
                  placeholder={`https://...`}
                  value={footer[key]}
                  onChange={(e) => setF(key, e.target.value)}
                />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Sticky Contact Button */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <MessageCircle size={18} />
              Contact Sticker Button
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Facebook Messenger URL</Label>
              <Input
                placeholder="https://m.me/..."
                value={sticky.facebook_messenger_url}
                onChange={(e) => setSticky((prev) => ({ ...prev, facebook_messenger_url: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label>Line URL</Label>
              <Input
                placeholder="https://line.me/ti/p/..."
                value={sticky.line_url}
                onChange={(e) => setSticky((prev) => ({ ...prev, line_url: e.target.value }))}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
