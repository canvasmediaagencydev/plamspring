"use client";

import { useState } from "react";
import type { Tables } from "@/lib/types/database.types";
import { Button } from "@/components/ui/button";
import { Download, ChevronDown, ChevronUp, MapPin, Phone, Mail, FileText, DollarSign, StickyNote } from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

type LandInquiry = Tables<"land_inquiries">;

interface LandInquiriesClientProps {
  inquiries: LandInquiry[];
}

/** Format a Thai date string (short) */
function formatDate(iso: string | null): string {
  if (!iso) return "-";
  return new Date(iso).toLocaleDateString("th-TH", {
    day: "numeric",
    month: "short",
    year: "2-digit",
  });
}

/** Format area into readable string */
function formatArea(inquiry: LandInquiry): string {
  const parts: string[] = [];
  if (inquiry.area_rai) parts.push(`${inquiry.area_rai} ไร่`);
  if (inquiry.area_ngan) parts.push(`${inquiry.area_ngan} งาน`);
  if (inquiry.area_wa) parts.push(`${inquiry.area_wa} ตร.วา`);
  return parts.length > 0 ? parts.join(" ") : "-";
}

/** Format price with comma separator */
function formatPrice(price: number | null): string {
  if (price === null) return "-";
  return price.toLocaleString("th-TH") + " บาท";
}

const STATUS_MAP: Record<string, { label: string; classes: string }> = {
  new: { label: "ใหม่", classes: "bg-blue-50 text-blue-700 border-blue-100" },
  contacted: { label: "ติดต่อแล้ว", classes: "bg-green-50 text-green-700 border-green-100" },
};

function StatusBadge({ status }: { status: string }) {
  const config = STATUS_MAP[status] ?? { label: status, classes: "bg-gray-50 text-gray-600 border-gray-200" };
  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${config.classes}`}>
      {config.label}
    </span>
  );
}

/** Individual expandable inquiry card */
function InquiryCard({ inquiry }: { inquiry: LandInquiry }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-shadow hover:shadow-md">
      {/* Summary row — always visible */}
      <button
        onClick={() => setExpanded((prev) => !prev)}
        className="flex w-full items-start justify-between gap-4 px-6 py-4 text-left"
        aria-expanded={expanded}
      >
        <div className="flex-1 min-w-0 grid grid-cols-2 gap-x-6 gap-y-1 sm:grid-cols-4">
          {/* Name */}
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wide text-gray-400">ชื่อ-นามสกุล</p>
            <p className="mt-0.5 truncate text-sm font-bold text-gray-900">
              {inquiry.first_name} {inquiry.last_name}
            </p>
          </div>
          {/* Phone */}
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wide text-gray-400">โทรศัพท์</p>
            <p className="mt-0.5 text-sm font-medium text-gray-700">{inquiry.phone}</p>
          </div>
          {/* Province */}
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wide text-gray-400">จังหวัด</p>
            <p className="mt-0.5 text-sm font-medium text-gray-700">{inquiry.province ?? "-"}</p>
          </div>
          {/* Area + date */}
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wide text-gray-400">เนื้อที่</p>
            <p className="mt-0.5 text-sm font-medium text-gray-700">{formatArea(inquiry)}</p>
          </div>
        </div>
        <div className="flex shrink-0 flex-col items-end gap-2">
          <StatusBadge status={inquiry.status} />
          <span className="text-[11px] text-gray-400">{formatDate(inquiry.created_at)}</span>
          {expanded ? (
            <ChevronUp size={16} className="text-gray-400" />
          ) : (
            <ChevronDown size={16} className="text-gray-400" />
          )}
        </div>
      </button>

      {/* Expanded detail panel */}
      {expanded && (
        <div className="border-t border-gray-100 bg-gray-50/60 px-6 py-5">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {inquiry.email && (
              <Detail icon={<Mail size={14} />} label="อีเมล" value={inquiry.email} />
            )}
            {inquiry.district && (
              <Detail icon={<MapPin size={14} />} label="อำเภอ/เขต" value={inquiry.district} />
            )}
            {inquiry.land_address && (
              <Detail icon={<MapPin size={14} />} label="ที่อยู่ที่ดิน" value={inquiry.land_address} className="sm:col-span-2 lg:col-span-3" />
            )}
            <Detail icon={<DollarSign size={14} />} label="ราคาที่ต้องการขาย" value={formatPrice(inquiry.asking_price)} />
            {inquiry.title_deed_type && (
              <Detail icon={<FileText size={14} />} label="ประเภทเอกสารสิทธิ์" value={inquiry.title_deed_type} />
            )}
            <Detail icon={<Phone size={14} />} label="เนื้อที่รวม" value={formatArea(inquiry)} />
            {inquiry.notes && (
              <Detail icon={<StickyNote size={14} />} label="หมายเหตุ" value={inquiry.notes} className="sm:col-span-2 lg:col-span-3" />
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function Detail({
  icon,
  label,
  value,
  className,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  className?: string;
}) {
  return (
    <div className={className}>
      <div className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-gray-400">
        <span className="text-gray-300">{icon}</span>
        {label}
      </div>
      <p className="mt-1 text-sm font-medium text-gray-800 whitespace-pre-line">{value}</p>
    </div>
  );
}

export default function LandInquiriesClient({ inquiries }: LandInquiriesClientProps) {
  const handleExportPDF = () => {
    const doc = new jsPDF({ orientation: "landscape" });

    // Title
    doc.setFontSize(16);
    doc.text("Land Inquiry Form - Palm Springs", 14, 18);
    doc.setFontSize(10);
    doc.text(`Generated: ${new Date().toLocaleDateString("en-GB")}`, 14, 26);

    const rows = inquiries.map((inq) => [
      formatDate(inq.created_at),
      `${inq.first_name} ${inq.last_name}`,
      inq.phone,
      inq.province ?? "-",
      formatArea(inq),
      inq.asking_price ? inq.asking_price.toLocaleString() : "-",
      inq.notes ?? "-",
    ]);

    autoTable(doc, {
      startY: 32,
      head: [["Date", "Name", "Phone", "Province", "Area", "Price (THB)", "Notes"]],
      body: rows,
      styles: { fontSize: 9, cellPadding: 3 },
      headStyles: { fillColor: [9, 65, 140], textColor: 255, fontStyle: "bold" },
      alternateRowStyles: { fillColor: [245, 247, 250] },
    });

    doc.save(`land-inquiries-${new Date().toISOString().slice(0, 10)}.pdf`);
  };

  return (
    <div>
      {/* Toolbar */}
      <div className="mb-6 flex items-center justify-between">
        <p className="text-sm font-medium text-gray-500">
          ทั้งหมด <span className="font-bold text-gray-900">{inquiries.length}</span> รายการ
        </p>
        <Button
          onClick={handleExportPDF}
          variant="outline"
          className="gap-2 rounded-xl border-gray-200 text-sm font-semibold shadow-sm hover:bg-gray-50"
        >
          <Download size={15} />
          Export PDF
        </Button>
      </div>

      {/* Cards */}
      {inquiries.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-200 bg-white/50 py-24 text-center">
          <FileText size={32} className="mb-3 text-gray-300" />
          <p className="text-sm font-bold text-gray-500">ยังไม่มีข้อมูล</p>
          <p className="mt-1 text-xs text-gray-400">แบบฟอร์มที่ดินที่ถูกส่งเข้ามาจะปรากฏที่นี่</p>
        </div>
      ) : (
        <div className="space-y-3">
          {inquiries.map((inq) => (
            <InquiryCard key={inq.id} inquiry={inq} />
          ))}
        </div>
      )}
    </div>
  );
}
