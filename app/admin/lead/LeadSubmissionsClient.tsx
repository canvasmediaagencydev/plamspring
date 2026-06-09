"use client";

import { useState } from "react";
import { downloadExcelFile } from "@/lib/export-excel";
import {
  Mail,
  Phone,
  User,
  ChevronDown,
  ChevronUp,
  MessageSquare,
  Calendar,
  Clock,
  Wallet,
  AtSign,
  Download,
} from "lucide-react";

interface LeadSubmission {
  id: string;
  name: string;
  email: string;
  phone: string;
  line_id: string | null;
  budget: string | null;
  detail: string | null;
  visit_date: string | null;
  visit_time: string | null;
  status: string;
  created_at: string;
}

const STATUS_MAP: Record<string, { label: string; classes: string }> = {
  new: { label: "ใหม่", classes: "bg-blue-50 text-blue-700 border-blue-100" },
  contacted: { label: "ติดต่อแล้ว", classes: "bg-green-50 text-green-700 border-green-100" },
};

function StatusBadge({ status }: { status: string }) {
  const cfg = STATUS_MAP[status] ?? {
    label: status,
    classes: "bg-gray-50 text-gray-600 border-gray-200",
  };
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${cfg.classes}`}
    >
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

function DetailRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | null | undefined;
}) {
  if (!value) return null;
  return (
    <div className="flex items-center gap-2 text-sm text-gray-600">
      <span className="text-gray-400 shrink-0">{icon}</span>
      <span className="text-gray-400">{label}:</span>
      <span>{value}</span>
    </div>
  );
}

export default function LeadSubmissionsClient({
  submissions: initial,
}: {
  submissions: LeadSubmission[];
}) {
  const [submissions, setSubmissions] = useState(initial);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [updating, setUpdating] = useState<string | null>(null);

  const toggleExpanded = (id: string) =>
    setExpanded((prev) => (prev === id ? null : id));

  const toggleStatus = async (sub: LeadSubmission) => {
    const next = sub.status === "new" ? "contacted" : "new";
    setUpdating(sub.id);
    await fetch(`/api/admin/lead-submissions/${sub.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: next }),
    });
    setSubmissions((prev) =>
      prev.map((s) => (s.id === sub.id ? { ...s, status: next } : s))
    );
    setUpdating(null);
  };

  const exportAllToExcel = () => {
    downloadExcelFile({
      rows: submissions,
      title: "ข้อมูล Lead ทั้งหมด",
      filename: `lead-submissions-${formatFilenameDate()}.xls`,
      columns: [
        { header: "ลำดับ", getValue: (_sub, index) => index + 1 },
        { header: "วันที่ส่งข้อมูล", getValue: (sub) => formatDate(sub.created_at) },
        { header: "ชื่อ", getValue: (sub) => sub.name },
        { header: "อีเมล", getValue: (sub) => sub.email },
        { header: "เบอร์โทร", getValue: (sub) => sub.phone },
        { header: "LINE ID", getValue: (sub) => sub.line_id },
        { header: "งบประมาณ", getValue: (sub) => sub.budget },
        { header: "รายละเอียด", getValue: (sub) => sub.detail },
        { header: "วันนัดชม", getValue: (sub) => sub.visit_date },
        { header: "เวลา", getValue: (sub) => sub.visit_time },
        { header: "สถานะ", getValue: (sub) => STATUS_MAP[sub.status]?.label ?? sub.status },
      ],
    });
  };

  if (submissions.length === 0) {
    return (
      <div className="px-6 py-12 text-center text-sm text-gray-400">
        ยังไม่มีข้อมูล Lead
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
          <div
            key={sub.id}
            className="rounded-xl border border-gray-100 bg-white shadow-sm overflow-hidden"
          >
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
                  <span className="font-semibold text-sm text-gray-900">
                    {sub.name}
                  </span>
                  <StatusBadge status={sub.status} />
                </div>
                <p className="text-xs text-gray-400 mt-0.5 truncate">
                  {sub.email} · {sub.phone}
                  {sub.budget && ` · ${sub.budget}`}
                </p>
              </div>
              <div className="text-right shrink-0">
                <p className="text-xs text-gray-400">
                  {formatDate(sub.created_at)}
                </p>
              </div>
              <span className="text-gray-400 shrink-0">
                {isOpen ? (
                  <ChevronUp size={16} />
                ) : (
                  <ChevronDown size={16} />
                )}
              </span>
            </button>

            {/* Detail panel */}
            {isOpen && (
              <div className="border-t border-gray-100 px-5 py-4 space-y-3">
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  <DetailRow icon={<Mail size={14} />} label="อีเมล" value={sub.email} />
                  <DetailRow icon={<Phone size={14} />} label="โทร" value={sub.phone} />
                  <DetailRow icon={<AtSign size={14} />} label="LINE" value={sub.line_id} />
                  <DetailRow icon={<Wallet size={14} />} label="งบประมาณ" value={sub.budget} />
                  <DetailRow icon={<MessageSquare size={14} />} label="รายละเอียด" value={sub.detail} />
                  <DetailRow icon={<Calendar size={14} />} label="วันนัดชม" value={sub.visit_date} />
                  <DetailRow icon={<Clock size={14} />} label="เวลา" value={sub.visit_time} />
                </div>
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
