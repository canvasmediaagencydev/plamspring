"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { downloadExcelFile } from "@/lib/export-excel";
import { Mail, Phone, MessageSquare, User, ChevronDown, ChevronUp, Download } from "lucide-react";

interface Submission {
  id: string;
  name: string;
  email: string;
  phone: string;
  message: string | null;
  status: string;
  created_at: string;
}

const STATUS_MAP: Record<string, { label: string; classes: string }> = {
  new: { label: "ใหม่", classes: "bg-blue-50 text-blue-700 border-blue-100" },
  contacted: { label: "ติดต่อแล้ว", classes: "bg-green-50 text-green-700 border-green-100" },
};

function StatusBadge({ status }: { status: string }) {
  const cfg = STATUS_MAP[status] ?? { label: status, classes: "bg-gray-50 text-gray-600 border-gray-200" };
  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${cfg.classes}`}>
      {cfg.label}
    </span>
  );
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("th-TH", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatFilenameDate(): string {
  return new Date().toISOString().slice(0, 10);
}

export default function ContactSubmissionsClient({ submissions: initial }: { submissions: Submission[] }) {
  const [submissions, setSubmissions] = useState(initial);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [updating, setUpdating] = useState<string | null>(null);

  const toggleExpanded = (id: string) => setExpanded((prev) => (prev === id ? null : id));

  const toggleStatus = async (sub: Submission) => {
    const next = sub.status === "new" ? "contacted" : "new";
    setUpdating(sub.id);
    const supabase = createClient();
    await supabase.from("contact_submissions").update({ status: next }).eq("id", sub.id);
    setSubmissions((prev) => prev.map((s) => (s.id === sub.id ? { ...s, status: next } : s)));
    setUpdating(null);
  };

  const exportAllToExcel = () => {
    downloadExcelFile({
      rows: submissions,
      title: "ข้อมูลติดต่อทั้งหมด",
      filename: `contact-submissions-${formatFilenameDate()}.xls`,
      columns: [
        { header: "ลำดับ", getValue: (_sub, index) => index + 1 },
        { header: "วันที่ส่งข้อมูล", getValue: (sub) => formatDate(sub.created_at) },
        { header: "ชื่อ", getValue: (sub) => sub.name },
        { header: "อีเมล", getValue: (sub) => sub.email },
        { header: "เบอร์โทร", getValue: (sub) => sub.phone },
        { header: "ข้อความ", getValue: (sub) => sub.message },
        { header: "สถานะ", getValue: (sub) => STATUS_MAP[sub.status]?.label ?? sub.status },
      ],
    });
  };

  if (submissions.length === 0) {
    return (
      <div className="px-6 py-12 text-center text-sm text-gray-400">
        ยังไม่มีข้อมูลติดต่อ
      </div>
    );
  }

  return (
    <div className="px-6 py-6 space-y-3">
      <div className="flex justify-end">
        <button
          onClick={exportAllToExcel}
          className="inline-flex items-center gap-2 rounded-lg bg-[#09418C] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#07346f]"
        >
          <Download size={16} />
          Export Excel ทั้งหมด
        </button>
      </div>
      {submissions.map((sub) => {
        const isOpen = expanded === sub.id;
        return (
          <div key={sub.id} className="rounded-xl border border-gray-100 bg-white shadow-sm overflow-hidden">
            {/* Header row */}
            <button
              onClick={() => toggleExpanded(sub.id)}
              className="flex w-full items-center gap-4 px-5 py-4 text-left hover:bg-gray-50 transition-colors"
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#09418C]/10 text-[#09418C]">
                <User size={16} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-semibold text-sm text-gray-900">{sub.name}</span>
                  <StatusBadge status={sub.status} />
                </div>
                <p className="text-xs text-gray-400 mt-0.5 truncate">{sub.email} · {sub.phone}</p>
              </div>
              <div className="text-right shrink-0">
                <p className="text-xs text-gray-400">{formatDate(sub.created_at)}</p>
              </div>
              <span className="text-gray-400 shrink-0">
                {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </span>
            </button>

            {/* Detail panel */}
            {isOpen && (
              <div className="border-t border-gray-100 px-5 py-4 space-y-3">
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Mail size={14} className="text-gray-400 shrink-0" />
                    <span>{sub.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Phone size={14} className="text-gray-400 shrink-0" />
                    <span>{sub.phone}</span>
                  </div>
                </div>
                {sub.message && (
                  <div className="flex gap-2 text-sm text-gray-600">
                    <MessageSquare size={14} className="text-gray-400 shrink-0 mt-0.5" />
                    <p className="whitespace-pre-wrap">{sub.message}</p>
                  </div>
                )}
                <div className="flex justify-end pt-1">
                  <button
                    onClick={() => toggleStatus(sub)}
                    disabled={updating === sub.id}
                    className="rounded-lg border border-gray-200 px-4 py-1.5 text-xs font-medium text-gray-600 transition-colors hover:bg-gray-50 disabled:opacity-50"
                  >
                    {updating === sub.id
                      ? "กำลังอัปเดต..."
                      : sub.status === "new"
                      ? "ทำเครื่องหมายว่าติดต่อแล้ว"
                      : "ทำเครื่องหมายว่ายังไม่ได้ติดต่อ"}
                  </button>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
