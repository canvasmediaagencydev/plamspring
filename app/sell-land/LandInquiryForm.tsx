"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { CheckCircle2 } from "lucide-react";

const TITLE_DEED_OPTIONS = [
  { value: "โฉนดที่ดิน", label: "โฉนดที่ดิน" },
  { value: "น.ส.3", label: "น.ส.3" },
  { value: "น.ส.3ก", label: "น.ส.3ก" },
  { value: "ส.ป.ก.", label: "ส.ป.ก." },
  { value: "อื่นๆ", label: "อื่นๆ" },
];

interface FormValues {
  first_name: string;
  last_name: string;
  phone: string;
  email: string;
  province: string;
  district: string;
  land_address: string;
  area_rai: string;
  area_ngan: string;
  area_wa: string;
  asking_price: string;
  title_deed_type: string;
  notes: string;
}

const INITIAL_VALUES: FormValues = {
  first_name: "",
  last_name: "",
  phone: "",
  email: "",
  province: "",
  district: "",
  land_address: "",
  area_rai: "",
  area_ngan: "",
  area_wa: "",
  asking_price: "",
  title_deed_type: "",
  notes: "",
};

export default function LandInquiryForm() {
  const [values, setValues] = useState<FormValues>(INITIAL_VALUES);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const supabase = createClient();
    const { error: insertError } = await supabase
      .from("land_inquiries")
      .insert({
        first_name: values.first_name.trim(),
        last_name: values.last_name.trim(),
        phone: values.phone.trim(),
        email: values.email.trim() || null,
        province: values.province.trim() || null,
        district: values.district.trim() || null,
        land_address: values.land_address.trim() || null,
        area_rai: values.area_rai ? Number(values.area_rai) : null,
        area_ngan: values.area_ngan ? Number(values.area_ngan) : null,
        area_wa: values.area_wa ? Number(values.area_wa) : null,
        asking_price: values.asking_price ? Number(values.asking_price) : null,
        title_deed_type: values.title_deed_type || null,
        notes: values.notes.trim() || null,
        status: "new",
      });

    setLoading(false);

    if (insertError) {
      setError("เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง");
      return;
    }

    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 rounded-2xl bg-white px-8 py-16 text-center shadow-md">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-50">
          <CheckCircle2 size={36} className="text-green-500" />
        </div>
        <h2 className="text-xl font-bold text-gray-900">ส่งข้อมูลเรียบร้อยแล้ว</h2>
        <p className="text-sm text-gray-500 max-w-sm">
          ขอบคุณที่สนใจขายที่ดินกับเรา ทีมงาน Palm Springs จะติดต่อกลับหาคุณโดยเร็วที่สุด
        </p>
        <Button
          variant="outline"
          className="mt-2"
          onClick={() => {
            setValues(INITIAL_VALUES);
            setSubmitted(false);
          }}
        >
          ส่งแบบฟอร์มอีกครั้ง
        </Button>
      </div>
    );
  }

  return (
    <div className="rounded-2xl bg-white px-8 py-10 shadow-md">
      <h2 className="mb-1 text-xl font-bold text-gray-900">แบบฟอร์มเสนอขายที่ดิน</h2>
      <p className="mb-8 text-sm text-gray-500">
        กรอกข้อมูลด้านล่าง ทีมงานของเราจะติดต่อกลับโดยเร็วที่สุด
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Name row */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="first_name">
              ชื่อ <span className="text-red-500">*</span>
            </Label>
            <Input
              id="first_name"
              name="first_name"
              value={values.first_name}
              onChange={handleChange}
              placeholder="กรอกชื่อ"
              required
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="last_name">
              นามสกุล <span className="text-red-500">*</span>
            </Label>
            <Input
              id="last_name"
              name="last_name"
              value={values.last_name}
              onChange={handleChange}
              placeholder="กรอกนามสกุล"
              required
            />
          </div>
        </div>

        {/* Contact row */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="phone">
              เบอร์โทรศัพท์ <span className="text-red-500">*</span>
            </Label>
            <Input
              id="phone"
              name="phone"
              type="tel"
              value={values.phone}
              onChange={handleChange}
              placeholder="0xx-xxx-xxxx"
              required
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="email">อีเมล</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={values.email}
              onChange={handleChange}
              placeholder="example@email.com"
            />
          </div>
        </div>

        {/* Location row */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="province">จังหวัด</Label>
            <Input
              id="province"
              name="province"
              value={values.province}
              onChange={handleChange}
              placeholder="เช่น เชียงใหม่"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="district">อำเภอ/เขต</Label>
            <Input
              id="district"
              name="district"
              value={values.district}
              onChange={handleChange}
              placeholder="เช่น เมืองเชียงใหม่"
            />
          </div>
        </div>

        {/* Land address */}
        <div className="space-y-1.5">
          <Label htmlFor="land_address">ที่อยู่ที่ดิน</Label>
          <Textarea
            id="land_address"
            name="land_address"
            value={values.land_address}
            onChange={handleChange}
            placeholder="ระบุที่ตั้งของที่ดิน เช่น หมู่ที่ ถนน ตำบล"
            rows={3}
          />
        </div>

        {/* Area */}
        <div className="space-y-1.5">
          <Label>เนื้อที่</Label>
          <div className="grid grid-cols-3 gap-3">
            <div className="relative">
              <Input
                id="area_rai"
                name="area_rai"
                type="number"
                min="0"
                step="1"
                value={values.area_rai}
                onChange={handleChange}
                placeholder="0"
              />
              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">
                ไร่
              </span>
            </div>
            <div className="relative">
              <Input
                id="area_ngan"
                name="area_ngan"
                type="number"
                min="0"
                max="3"
                step="1"
                value={values.area_ngan}
                onChange={handleChange}
                placeholder="0"
              />
              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">
                งาน
              </span>
            </div>
            <div className="relative">
              <Input
                id="area_wa"
                name="area_wa"
                type="number"
                min="0"
                step="0.1"
                value={values.area_wa}
                onChange={handleChange}
                placeholder="0"
              />
              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">
                ตร.วา
              </span>
            </div>
          </div>
        </div>

        {/* Asking price */}
        <div className="space-y-1.5">
          <Label htmlFor="asking_price">ราคาที่ต้องการขาย</Label>
          <div className="relative">
            <Input
              id="asking_price"
              name="asking_price"
              type="number"
              min="0"
              step="1"
              value={values.asking_price}
              onChange={handleChange}
              placeholder="0"
              className="pr-12"
            />
            <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-400">
              บาท
            </span>
          </div>
        </div>

        {/* Title deed type */}
        <div className="space-y-1.5">
          <Label htmlFor="title_deed_type">ประเภทเอกสารสิทธิ์</Label>
          <Select
            id="title_deed_type"
            name="title_deed_type"
            value={values.title_deed_type}
            onChange={(e) =>
              setValues((prev) => ({ ...prev, title_deed_type: e.target.value }))
            }
          >
            <option value="">เลือกประเภทเอกสาร</option>
            {TITLE_DEED_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </Select>
        </div>

        {/* Notes */}
        <div className="space-y-1.5">
          <Label htmlFor="notes">รายละเอียดเพิ่มเติม</Label>
          <Textarea
            id="notes"
            name="notes"
            value={values.notes}
            onChange={handleChange}
            placeholder="ข้อมูลอื่นๆ ที่ต้องการแจ้ง"
            rows={4}
          />
        </div>

        {error && (
          <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </p>
        )}

        <Button
          type="submit"
          disabled={loading}
          className="w-full bg-[#09418C] hover:bg-[#072f66] text-white py-3 text-base font-semibold"
        >
          {loading ? "กำลังส่งข้อมูล..." : "ส่งแบบฟอร์ม"}
        </Button>
      </form>
    </div>
  );
}
