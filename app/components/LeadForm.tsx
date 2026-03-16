"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

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

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSelect = (e: React.ChangeEvent<HTMLSelectElement>) =>
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: wire up actual submission logic here
    router.push("/contact/success");
  };

  return (
    <section className="w-full bg-white py-12 md:py-16">
      <div className="mx-auto max-w-xl px-6 md:px-12">

        {/* ── Social login ── */}
        <p className="mb-6 text-center text-base text-gray-500 md:text-lg">
          สะดวกกว่าเมื่อลงทะเบียนผ่าน
        </p>

        <div className="flex flex-col items-center gap-3">
          {/* Facebook + Google — same row */}
          <div className="flex w-full gap-3">
            <button className="flex flex-1 items-center justify-center gap-2 rounded-full bg-[#1877F2] px-4 py-3 text-sm font-semibold text-white transition hover:opacity-90 md:text-base whitespace-nowrap">
              <svg viewBox="0 0 24 24" fill="white" className="h-5 w-5 shrink-0" aria-hidden="true">
                <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.236 2.686.236v2.97h-1.513c-1.491 0-1.956.93-1.956 1.887v2.255h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z"/>
              </svg>
              Continue with facebook
            </button>

            <button className="flex flex-1 items-center justify-center gap-2 rounded-full border border-gray-300 bg-white px-4 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 md:text-base whitespace-nowrap">
              <svg viewBox="0 0 24 24" className="h-5 w-5 shrink-0" aria-hidden="true">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Continue with Google
            </button>
          </div>

          {/* LINE — centred below */}
          <button className="flex w-full max-w-xs items-center justify-center gap-3 rounded-full bg-[#06C755] px-6 py-3 text-base font-semibold text-white transition hover:opacity-90">
            <svg viewBox="0 0 24 24" fill="white" className="h-5 w-5 shrink-0" aria-hidden="true">
              <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.627-.63h2.386c.349 0 .63.285.63.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.627-.63.349 0 .631.285.631.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.281.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314"/>
            </svg>
            Add &nbsp;<strong>LINE</strong>&nbsp; สอบถามข้อมูล
          </button>
        </div>

        {/* ── Divider ── */}
        <div className="my-8 flex items-center gap-4">
          <div className="h-px flex-1 bg-gray-200" />
          <span className="text-base text-gray-400 md:text-lg">หรือ</span>
          <div className="h-px flex-1 bg-gray-200" />
        </div>

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

          <div className="flex justify-center pt-2">
            <button
              type="submit"
              className="rounded-full bg-primary px-16 py-3.5 text-base font-semibold text-white transition hover:opacity-90 md:text-lg"
            >
              ส่งข้อมูล
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
