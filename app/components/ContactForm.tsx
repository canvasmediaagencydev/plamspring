"use client";

import { useState } from "react";

export default function ContactForm() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: wire up form submission
  };

  return (
    <section className="w-full bg-white py-14 md:py-20">
      <div className="mx-auto max-w-xl px-6 md:px-12">
        <h2 className="mb-8 text-2xl font-semibold text-primary md:text-3xl">ข้อมูลติดต่อ</h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-8">
          {/* Name */}
          <div className="border-b border-gray-300 pb-1">
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="*ชื่อ-นามสกุล"
              required
              className="w-full bg-transparent text-base text-gray-700 placeholder-gray-400 outline-none md:text-lg"
            />
          </div>

          {/* Email */}
          <div className="border-b border-gray-300 pb-1">
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="*E*MAIL"
              required
              className="w-full bg-transparent text-base text-gray-700 placeholder-gray-400 outline-none md:text-lg"
            />
          </div>

          {/* Phone */}
          <div className="border-b border-gray-300 pb-1">
            <input
              type="tel"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder="*เบอร์โทร"
              required
              className="w-full bg-transparent text-base text-gray-700 placeholder-gray-400 outline-none md:text-lg"
            />
          </div>

          {/* Message */}
          <div className="rounded-lg border border-gray-300 p-4">
            <textarea
              name="message"
              value={form.message}
              onChange={handleChange}
              placeholder="รายละเอียดเรื่องที่ต้องการติดต่อ"
              rows={5}
              className="w-full resize-none bg-transparent text-base text-gray-700 placeholder-gray-400 outline-none md:text-lg"
            />
          </div>

          {/* Submit */}
          <div className="flex justify-end">
            <button
              type="submit"
              className="rounded-full bg-primary px-12 py-3 text-base font-semibold text-white transition-opacity hover:opacity-90 md:text-lg"
            >
              ส่งข้อมูล
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
