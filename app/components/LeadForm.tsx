"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

const BUDGET_OPTIONS = [
  "น้อยกว่า 1 ล้านบาท",
  "1 - 2 ล้านบาท",
  "2 - 3 ล้านบาท",
  "3 - 5 ล้านบาท",
  "5 ล้านบาทขึ้นไป",
];

const CONTACT_DETAIL_OPTIONS = [
  "สอบถามข้อมูลโครงการ",
  "นัดชมโครงการ",
  "สอบถามราคา",
  "สอบถามสินเชื่อ",
  "อื่นๆ",
];

const TIME_OPTIONS = [
  "09:00 - 10:00",
  "10:00 - 11:00",
  "11:00 - 12:00",
  "13:00 - 14:00",
  "14:00 - 15:00",
  "15:00 - 16:00",
  "16:00 - 17:00",
];

function UnderlineInput({
  placeholder,
  type = "text",
  name,
  value,
  onChange,
}: {
  placeholder: string;
  type?: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <div className="border-b border-gray-300 pb-2 focus-within:border-primary">
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full bg-transparent text-base text-gray-700 placeholder-gray-400 outline-none md:text-lg"
      />
    </div>
  );
}

function SelectInput({
  placeholder,
  options,
  name,
  value,
  onChange,
}: {
  placeholder: string;
  options: string[];
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}) {
  return (
    <div className="rounded-lg border border-gray-300 px-4 py-3">
      <select
        name={name}
        value={value}
        onChange={onChange}
        className="w-full bg-transparent text-base text-gray-500 outline-none md:text-lg"
      >
        <option value="" disabled>{placeholder}</option>
        {options.map((o) => (
          <option key={o} value={o}>{o}</option>
        ))}
      </select>
    </div>
  );
}

export default function LeadForm() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    lineId: "",
    budget: "",
    detail: "",
    date: "",
    time: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSelect = (e: React.ChangeEvent<HTMLSelectElement>) =>
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const supabase = createClient();
    const { error: dbError } = await supabase.from("lead_submissions").insert({
      name: form.name,
      email: form.email,
      phone: form.phone,
      line_id: form.lineId || null,
      budget: form.budget || null,
      detail: form.detail || null,
      visit_date: form.date || null,
      visit_time: form.time || null,
    });

    if (dbError) {
      setError("เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง");
      setLoading(false);
      return;
    }

    router.push("/contact/success");
  };

  return (
    <section className="w-full bg-white py-12 md:py-16">
      <div className="mx-auto max-w-xl px-6 md:px-12">

        {/* ── Social login ── */}


        {/* ── Form ── */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-7">
          <h2 className="text-2xl font-semibold text-primary md:text-3xl">ข้อมูลติดต่อ</h2>

          <UnderlineInput placeholder="*ชื่อ-นามสกุล" name="name" value={form.name} onChange={handleInput} />
          <UnderlineInput placeholder="*E*MAIL" type="email" name="email" value={form.email} onChange={handleInput} />
          <UnderlineInput placeholder="*เบอร์โทร" type="tel" name="phone" value={form.phone} onChange={handleInput} />
          <UnderlineInput placeholder="*LINE ID" name="lineId" value={form.lineId} onChange={handleInput} />

          <SelectInput
            placeholder="งบประมาณในการจัดซื้อ"
            options={BUDGET_OPTIONS}
            name="budget"
            value={form.budget}
            onChange={handleSelect}
          />

          <div className="flex flex-col gap-2">
            <label className="text-base text-gray-600 md:text-lg">
              กรุณาระบุวันและช่วงเวลาที่สะดวกให้เจ้าหน้าที่ติดต่อกลับ
            </label>
            <SelectInput
              placeholder="รายละเอียดเรื่องที่ต้องการติดต่อ"
              options={CONTACT_DETAIL_OPTIONS}
              name="detail"
              value={form.detail}
              onChange={handleSelect}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-base text-gray-600 md:text-lg">นัดหมายเข้าชมโครงการ</label>
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-lg border border-gray-300 px-4 py-3">
                <input
                  type="date"
                  name="date"
                  value={form.date}
                  onChange={handleInput}
                  className="w-full bg-transparent text-base text-gray-500 outline-none md:text-lg"
                />
              </div>
              <SelectInput
                placeholder="เวลา"
                options={TIME_OPTIONS}
                name="time"
                value={form.time}
                onChange={handleSelect}
              />
            </div>
          </div>

          {error && (
            <p className="text-sm text-red-500">{error}</p>
          )}

          <div className="flex justify-center pt-2">
            <button
              type="submit"
              disabled={loading}
              className="rounded-full bg-primary px-16 py-3.5 text-base font-semibold text-white transition hover:opacity-90 disabled:opacity-60 md:text-lg"
            >
              {loading ? "กำลังส่ง..." : "ส่งข้อมูล"}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
