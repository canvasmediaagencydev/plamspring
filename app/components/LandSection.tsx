"use client";

import { useState, useRef, type FormEvent, type ChangeEvent } from "react";
import { createClient } from "@/lib/supabase/client";

const IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

export default function LandSection() {
  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    email: "",
    rai: "",
    ngan: "",
    sqWa: "",
    saleType: "" as "" | "split" | "whole",
    location: "",
    price: "",
  });
  const [files, setFiles] = useState<FileList | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const set = (key: keyof typeof form) => (
    e: ChangeEvent<HTMLInputElement>
  ) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const supabase = createClient();

    // Upload files
    const imageUrls: string[] = [];
    let pdfUrl: string | null = null;

    if (files && files.length > 0) {
      for (const file of Array.from(files)) {
        const ext = file.name.split(".").pop();
        const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
        const { error: upErr } = await supabase.storage
          .from("land-inquiry-images")
          .upload(path, file, { cacheControl: "3600", upsert: false });

        if (upErr) {
          setError("อัปโหลดไฟล์ไม่สำเร็จ กรุณาลองใหม่");
          setSubmitting(false);
          return;
        }

        const { data } = supabase.storage.from("land-inquiry-images").getPublicUrl(path);
        if (IMAGE_TYPES.includes(file.type)) {
          imageUrls.push(data.publicUrl);
        } else if (!pdfUrl) {
          // First non-image file (PDF, zip, rar) stored as pdf_url
          pdfUrl = data.publicUrl;
        }
      }
    }

    // Split fullName into first/last
    const nameParts = form.fullName.trim().split(/\s+/);
    const firstName = nameParts[0] ?? form.fullName.trim();
    const lastName = nameParts.slice(1).join(" ") || "-";

    const saleLabel = form.saleType === "split" ? "แบ่งขาย" : form.saleType === "whole" ? "ขายเหมา" : "";
    const notes = saleLabel ? `ประเภทการขาย: ${saleLabel}` : null;

    const { error: insertError } = await supabase.from("land_inquiries").insert({
      first_name: firstName,
      last_name: lastName,
      phone: form.phone.trim(),
      email: form.email.trim() || null,
      land_address: form.location.trim() || null,
      area_rai: form.rai ? Number(form.rai) : null,
      area_ngan: form.ngan ? Number(form.ngan) : null,
      area_wa: form.sqWa ? Number(form.sqWa) : null,
      asking_price: form.price ? Number(form.price.replace(/[^0-9]/g, "")) : null,
      images: imageUrls,
      pdf_url: pdfUrl,
      notes,
      status: "new",
    });

    setSubmitting(false);

    if (insertError) {
      setError("เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง");
      return;
    }

    setSubmitted(true);
  };

  if (submitted) {
    return (
      <section className="mx-auto max-w-3xl px-4 py-16 text-center">
        <div className="rounded-2xl bg-green-50 px-6 py-12">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
            <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800">ส่งข้อมูลเรียบร้อยแล้ว</h2>
          <p className="mt-2 text-gray-500">ทีมงานจะติดต่อกลับโดยเร็วที่สุด</p>
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-3xl px-4 py-12 md:py-16">
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-3xl font-extrabold text-gray-800 md:text-5xl">
          ฟอร์ม <span className="font-bold">รายละเอียดที่ดิน</span>
        </h1>
        <p className="mt-2 text-sm text-gray-500 md:text-base">
          ติดต่อเสนอขายที่ดินให้กับอรสิรินได้โดยการกรอกแบบฟอร์มออนไลน์
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* ชื่อ - นามสกุล */}
        <div>
          <label className="mb-2 block text-sm font-bold text-gray-700">
            ชื่อ - นามสกุล <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            required
            value={form.fullName}
            onChange={set("fullName")}
            placeholder="ชื่อ - นามสกุล"
            className="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-3 text-gray-700 outline-none transition focus:border-primary focus:ring-1 focus:ring-primary"
          />
        </div>

        {/* เบอร์โทร + อีเมล */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-bold text-gray-700">
              เบอร์โทรศัพท์ที่ติดต่อได้ <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              required
              value={form.phone}
              onChange={set("phone")}
              placeholder="เบอร์โทรศัพท์ที่ติดต่อได้"
              className="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-3 text-gray-700 outline-none transition focus:border-primary focus:ring-1 focus:ring-primary"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-bold text-gray-700">
              อีเมล์ติดต่อ
            </label>
            <input
              type="email"
              value={form.email}
              onChange={set("email")}
              placeholder="อีเมล์ติดต่อ"
              className="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-3 text-gray-700 outline-none transition focus:border-primary focus:ring-1 focus:ring-primary"
            />
          </div>
        </div>

        {/* ไร่ / งาน / ตารางวา */}
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="mb-2 block text-sm font-bold text-gray-700">
              ไร่ <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              required
              min={0}
              value={form.rai}
              onChange={set("rai")}
              placeholder="ไร่"
              className="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-3 text-gray-700 outline-none transition focus:border-primary focus:ring-1 focus:ring-primary [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-bold text-gray-700">
              งาน <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              required
              min={0}
              value={form.ngan}
              onChange={set("ngan")}
              placeholder="งาน"
              className="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-3 text-gray-700 outline-none transition focus:border-primary focus:ring-1 focus:ring-primary [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-bold text-gray-700">
              ตารางวา <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              required
              min={0}
              value={form.sqWa}
              onChange={set("sqWa")}
              placeholder="ตารางวา"
              className="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-3 text-gray-700 outline-none transition focus:border-primary focus:ring-1 focus:ring-primary [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
            />
          </div>
        </div>

        {/* ไฟล์โฉนด / ระวาง */}
        <div>
          <label className="mb-2 block text-sm font-bold text-gray-700">
            ไฟล์โฉนด / ระวาง <span className="text-red-500">*</span>
          </label>
          <input
            type="file"
            required
            multiple
            accept=".jpg,.jpeg,.png,.pdf,.zip,.rar"
            onChange={(e) => setFiles(e.target.files)}
            className="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-3 text-sm text-gray-500 file:mr-4 file:rounded-md file:border file:border-gray-300 file:bg-white file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-gray-700"
          />
          <p className="mt-1.5 text-xs text-gray-400">
            กรุณาอัพโหลดไฟล์ รูปภาพที่ดิน, แผนที่, โฉนด ขนาดไฟล์ละไม่เกิน 3 MB (ไฟล์ประเภท jpg, jpeg, png, pdf, zip, rar)
          </p>
        </div>

        {/* ประเภทการขาย */}
        <div>
          <label className="mb-3 block text-sm font-bold text-gray-700">
            ประเภทการขาย <span className="text-red-500">*</span>
          </label>
          <div className="flex items-center gap-8">
            <label className="flex cursor-pointer items-center gap-2 text-sm text-gray-700">
              <input
                type="radio"
                name="saleType"
                required
                value="split"
                checked={form.saleType === "split"}
                onChange={() => setForm((f) => ({ ...f, saleType: "split" }))}
                className="h-4 w-4 border-gray-300 text-primary focus:ring-primary"
              />
              แบ่งขาย
            </label>
            <label className="flex cursor-pointer items-center gap-2 text-sm text-gray-700">
              <input
                type="radio"
                name="saleType"
                value="whole"
                checked={form.saleType === "whole"}
                onChange={() => setForm((f) => ({ ...f, saleType: "whole" }))}
                className="h-4 w-4 border-gray-300 text-primary focus:ring-primary"
              />
              ขายเหมา
            </label>
          </div>
        </div>

        {/* ที่ตั้งของที่ดิน */}
        <div>
          <label className="mb-2 block text-sm font-bold text-gray-700">
            ที่ตั้งของที่ดิน <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            required
            value={form.location}
            onChange={set("location")}
            placeholder="ที่ตั้งของที่ดิน"
            className="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-3 text-gray-700 outline-none transition focus:border-primary focus:ring-1 focus:ring-primary"
          />
        </div>

        {/* ราคาที่ต้องการเสนอขาย */}
        <div>
          <label className="mb-2 block text-sm font-bold text-gray-700">
            ราคาที่ต้องการเสนอขาย <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            required
            value={form.price}
            onChange={set("price")}
            placeholder="ราคาที่ต้องการเสนอขาย"
            className="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-3 text-gray-700 outline-none transition focus:border-primary focus:ring-1 focus:ring-primary"
          />
        </div>

        {error && (
          <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">{error}</p>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-lg bg-gray-900 py-4 text-base font-bold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting ? "กำลังส่ง..." : "ส่งข้อมูล"}
        </button>
      </form>
    </section>
  );
}
