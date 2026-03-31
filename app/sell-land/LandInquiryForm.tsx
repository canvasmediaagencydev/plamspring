"use client";

import { useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle2, ImagePlus, X, Loader2, FileText } from "lucide-react";

const TITLE_DEED_OPTIONS = ["โฉนดที่ดิน", "น.ส.3", "น.ส.3ก", "ส.ป.ก.", "อื่นๆ"];
const MAX_IMAGES = 5;

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

const INITIAL: FormValues = {
  first_name: "", last_name: "", phone: "", email: "",
  province: "", district: "", land_address: "",
  area_rai: "", area_ngan: "", area_wa: "",
  asking_price: "", title_deed_type: "", notes: "",
};

// ── Image uploader (anonymous, public bucket) ─────────────────────────────────

function ImageUploadField({
  images,
  uploading,
  onAdd,
  onRemove,
}: {
  images: string[];
  uploading: boolean;
  onAdd: (file: File) => void;
  onRemove: (url: string) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="space-y-1.5">
      <Label>รูปภาพที่ดิน <span className="text-gray-400 font-normal">(สูงสุด {MAX_IMAGES} รูป)</span></Label>
      <div className="flex flex-wrap gap-3">
        {images.map((url) => (
          <div key={url} className="relative h-24 w-24 overflow-hidden rounded-xl border border-gray-200">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={url} alt="ที่ดิน" className="h-full w-full object-cover" />
            <button
              type="button"
              onClick={() => onRemove(url)}
              className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-black/60 text-white hover:bg-black/80"
            >
              <X size={10} />
            </button>
          </div>
        ))}

        {images.length < MAX_IMAGES && (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className="flex h-24 w-24 flex-col items-center justify-center gap-1.5 rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 text-gray-400 transition hover:border-primary hover:text-primary disabled:opacity-50"
          >
            {uploading ? (
              <Loader2 size={20} className="animate-spin" />
            ) : (
              <>
                <ImagePlus size={20} />
                <span className="text-[10px] font-medium">เพิ่มรูป</span>
              </>
            )}
          </button>
        )}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) onAdd(file);
          e.target.value = "";
        }}
      />
    </div>
  );
}

// ── Main form ─────────────────────────────────────────────────────────────────

export default function LandInquiryForm() {
  const [values, setValues] = useState<FormValues>(INITIAL);
  const [images, setImages] = useState<string[]>([]);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [pdfName, setPdfName] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadingPdf, setUploadingPdf] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const supabase = createClient();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddImage = async (file: File) => {
    setUploading(true);
    const ext = file.name.split(".").pop();
    const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const { error: upErr } = await supabase.storage
      .from("land-inquiry-images")
      .upload(path, file, { cacheControl: "3600", upsert: false });

    if (upErr) {
      setError("อัปโหลดรูปไม่สำเร็จ กรุณาลองใหม่");
      setUploading(false);
      return;
    }

    const { data } = supabase.storage.from("land-inquiry-images").getPublicUrl(path);
    setImages((prev) => [...prev, data.publicUrl]);
    setUploading(false);
  };

  const handleRemoveImage = (url: string) => setImages((prev) => prev.filter((u) => u !== url));

  const handleAddPdf = async (file: File) => {
    setUploadingPdf(true);
    const path = `pdf/${Date.now()}-${Math.random().toString(36).slice(2)}.pdf`;
    const { error: upErr } = await supabase.storage
      .from("land-inquiry-images")
      .upload(path, file, { cacheControl: "3600", upsert: false });

    if (upErr) {
      setError("อัปโหลด PDF ไม่สำเร็จ กรุณาลองใหม่");
      setUploadingPdf(false);
      return;
    }

    const { data } = supabase.storage.from("land-inquiry-images").getPublicUrl(path);
    setPdfUrl(data.publicUrl);
    setPdfName(file.name);
    setUploadingPdf(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error: insertError } = await supabase.from("land_inquiries").insert({
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
      images: images,
      pdf_url: pdfUrl,
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
        <p className="max-w-sm text-sm text-gray-500">
          ขอบคุณที่สนใจขายที่ดินกับเรา ทีมงาน Palm Springs จะติดต่อกลับหาคุณโดยเร็วที่สุด
        </p>
        <Button variant="outline" className="mt-2" onClick={() => { setValues(INITIAL); setImages([]); setPdfUrl(null); setPdfName(null); setSubmitted(false); }}>
          ส่งแบบฟอร์มอีกครั้ง
        </Button>
      </div>
    );
  }

  return (
    <div className="rounded-2xl bg-white px-8 py-10 shadow-md">
      <h2 className="mb-1 text-xl font-bold text-gray-900">แบบฟอร์มเสนอขายที่ดิน</h2>
      <p className="mb-8 text-sm text-gray-500">กรอกข้อมูลด้านล่าง ทีมงานของเราจะติดต่อกลับโดยเร็วที่สุด</p>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Name */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="first_name">ชื่อ <span className="text-red-500">*</span></Label>
            <Input id="first_name" name="first_name" value={values.first_name} onChange={handleChange} placeholder="กรอกชื่อ" required />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="last_name">นามสกุล <span className="text-red-500">*</span></Label>
            <Input id="last_name" name="last_name" value={values.last_name} onChange={handleChange} placeholder="กรอกนามสกุล" required />
          </div>
        </div>

        {/* Contact */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="phone">เบอร์โทรศัพท์ <span className="text-red-500">*</span></Label>
            <Input id="phone" name="phone" type="tel" value={values.phone} onChange={handleChange} placeholder="0xx-xxx-xxxx" required />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="email">อีเมล</Label>
            <Input id="email" name="email" type="email" value={values.email} onChange={handleChange} placeholder="example@email.com" />
          </div>
        </div>

        {/* Location */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="province">จังหวัด</Label>
            <Input id="province" name="province" value={values.province} onChange={handleChange} placeholder="เช่น เชียงใหม่" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="district">อำเภอ/เขต</Label>
            <Input id="district" name="district" value={values.district} onChange={handleChange} placeholder="เช่น เมืองเชียงใหม่" />
          </div>
        </div>

        {/* Land address */}
        <div className="space-y-1.5">
          <Label htmlFor="land_address">ที่อยู่ที่ดิน</Label>
          <Textarea id="land_address" name="land_address" value={values.land_address} onChange={handleChange} placeholder="ระบุที่ตั้งของที่ดิน เช่น หมู่ที่ ถนน ตำบล" rows={3} />
        </div>

        {/* Area */}
        <div className="space-y-1.5">
          <Label>เนื้อที่</Label>
          <div className="grid grid-cols-3 gap-3">
            {[
              { name: "area_rai", label: "ไร่" },
              { name: "area_ngan", label: "งาน", max: "3" },
              { name: "area_wa", label: "ตร.วา" },
            ].map(({ name, label, max }) => (
              <div key={name} className="relative">
                <Input
                  name={name}
                  type="number"
                  min="0"
                  max={max}
                  step="1"
                  value={values[name as keyof FormValues]}
                  onChange={handleChange}
                  placeholder="0"
                  className="pr-10"
                />
                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">{label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Price */}
        <div className="space-y-1.5">
          <Label htmlFor="asking_price">ราคาที่ต้องการขาย</Label>
          <div className="relative">
            <Input id="asking_price" name="asking_price" type="number" min="0" value={values.asking_price} onChange={handleChange} placeholder="0" className="pr-12" />
            <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-400">บาท</span>
          </div>
        </div>

        {/* Title deed */}
        <div className="space-y-1.5">
          <Label htmlFor="title_deed_type">ประเภทเอกสารสิทธิ์</Label>
          <select
            id="title_deed_type"
            name="title_deed_type"
            value={values.title_deed_type}
            onChange={handleChange}
            className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm text-gray-700 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
          >
            <option value="">เลือกประเภทเอกสาร</option>
            {TITLE_DEED_OPTIONS.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
          </select>
        </div>

        {/* Images */}
        <ImageUploadField
          images={images}
          uploading={uploading}
          onAdd={handleAddImage}
          onRemove={handleRemoveImage}
        />

        {/* PDF Upload */}
        <div className="space-y-1.5">
          <Label>เอกสารประกอบ <span className="text-gray-400 font-normal">(PDF ไม่เกิน 10 MB)</span></Label>
          {pdfUrl && pdfName ? (
            <div className="flex items-center gap-3 rounded-xl border border-gray-200 bg-gray-50 px-4 py-3">
              <FileText size={18} className="shrink-0 text-red-500" />
              <span className="flex-1 truncate text-sm text-gray-700">{pdfName}</span>
              <button
                type="button"
                onClick={() => { setPdfUrl(null); setPdfName(null); }}
                className="flex h-5 w-5 items-center justify-center rounded-full bg-gray-200 text-gray-500 hover:bg-gray-300"
              >
                <X size={10} />
              </button>
            </div>
          ) : (
            <label className="flex cursor-pointer items-center gap-3 rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 px-4 py-4 text-gray-400 transition hover:border-primary hover:text-primary">
              {uploadingPdf ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <FileText size={18} />
              )}
              <span className="text-sm">{uploadingPdf ? "กำลังอัปโหลด..." : "คลิกเพื่อเลือกไฟล์ PDF"}</span>
              <input
                type="file"
                accept="application/pdf"
                className="hidden"
                disabled={uploadingPdf}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleAddPdf(file);
                  e.target.value = "";
                }}
              />
            </label>
          )}
        </div>

        {/* Notes */}
        <div className="space-y-1.5">
          <Label htmlFor="notes">รายละเอียดเพิ่มเติม</Label>
          <Textarea id="notes" name="notes" value={values.notes} onChange={handleChange} placeholder="ข้อมูลอื่นๆ ที่ต้องการแจ้ง" rows={4} />
        </div>

        {error && (
          <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">{error}</p>
        )}

        <Button type="submit" disabled={loading || uploading} className="w-full bg-primary py-3 text-base font-semibold text-white hover:bg-primary/90">
          {loading ? "กำลังส่งข้อมูล..." : "ส่งแบบฟอร์ม"}
        </Button>
      </form>
    </div>
  );
}
