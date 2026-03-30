"use client";

import { useRef, useState } from "react";
import type { Tables } from "@/lib/types/database.types";
import { Button } from "@/components/ui/button";
import {
  Download,
  ChevronDown,
  ChevronUp,
  MapPin,
  Phone,
  Mail,
  FileText,
  DollarSign,
  StickyNote,
  Loader2,
} from "lucide-react";

type LandInquiry = Tables<"land_inquiries">;

// ── Formatters ────────────────────────────────────────────────────────────────

function formatDate(iso: string | null, long = false): string {
  if (!iso) return "-";
  return new Date(iso).toLocaleDateString("th-TH", {
    day: "numeric",
    month: long ? "long" : "short",
    year: "numeric",
  });
}

function formatArea(inq: LandInquiry): string {
  const parts: string[] = [];
  if (inq.area_rai) parts.push(`${inq.area_rai} ไร่`);
  if (inq.area_ngan) parts.push(`${inq.area_ngan} งาน`);
  if (inq.area_wa) parts.push(`${inq.area_wa} ตร.วา`);
  return parts.length ? parts.join(" ") : "-";
}

function formatPrice(price: number | null): string {
  if (price === null) return "-";
  return price.toLocaleString("th-TH") + " บาท";
}

// ── Status badge ──────────────────────────────────────────────────────────────

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

// ── PDF export (html2canvas + jspdf) ─────────────────────────────────────────

async function exportInquiryPDF(inq: LandInquiry, templateEl: HTMLElement) {
  const [{ default: html2canvas }, { default: jsPDF }] = await Promise.all([
    import("html2canvas"),
    import("jspdf"),
  ]);

  // Temporarily show the hidden template
  templateEl.style.display = "block";
  const canvas = await html2canvas(templateEl, {
    scale: 2,
    useCORS: true,
    backgroundColor: "#ffffff",
  });
  templateEl.style.display = "none";

  const imgData = canvas.toDataURL("image/png");
  const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const pageW = pdf.internal.pageSize.getWidth();
  const pageH = pdf.internal.pageSize.getHeight();
  const imgW = pageW - 20;
  const imgH = (canvas.height * imgW) / canvas.width;

  pdf.addImage(imgData, "PNG", 10, 10, imgW, Math.min(imgH, pageH - 20));
  pdf.save(`land-inquiry-${inq.first_name}-${inq.last_name}.pdf`);
}

// ── Hidden PDF template ───────────────────────────────────────────────────────

function PdfTemplate({ inq, templateRef }: { inq: LandInquiry; templateRef: React.RefObject<HTMLDivElement | null> }) {
  return (
    <div
      ref={templateRef}
      style={{
        display: "none",
        width: "794px",
        padding: "48px",
        fontFamily: "'Noto Sans Thai', 'Sarabun', sans-serif",
        background: "#fff",
        color: "#111",
      }}
    >
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 32, borderBottom: "3px solid #09418C", paddingBottom: 20 }}>
        <div>
          <div style={{ fontSize: 22, fontWeight: 700, color: "#09418C" }}>Palm Springs</div>
          <div style={{ fontSize: 13, color: "#666", marginTop: 4 }}>แบบฟอร์มรายละเอียดที่ดิน</div>
        </div>
        <div style={{ textAlign: "right", fontSize: 12, color: "#888" }}>
          <div>วันที่รับแบบฟอร์ม</div>
          <div style={{ fontWeight: 600, color: "#333", marginTop: 2 }}>{formatDate(inq.created_at, true)}</div>
        </div>
      </div>

      {/* Contact section */}
      <div style={{ marginBottom: 28 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: "#09418C", marginBottom: 14, textTransform: "uppercase", letterSpacing: 1 }}>ข้อมูลผู้ติดต่อ</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
          <Field label="ชื่อ-นามสกุล" value={`${inq.first_name} ${inq.last_name}`} />
          <Field label="เบอร์โทรศัพท์" value={inq.phone} />
          <Field label="อีเมล" value={inq.email ?? "-"} />
        </div>
      </div>

      {/* Location section */}
      <div style={{ marginBottom: 28 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: "#09418C", marginBottom: 14, textTransform: "uppercase", letterSpacing: 1 }}>ที่ตั้งที่ดิน</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          <Field label="จังหวัด" value={inq.province ?? "-"} />
          <Field label="อำเภอ/เขต" value={inq.district ?? "-"} />
          <Field label="ที่อยู่ที่ดิน" value={inq.land_address ?? "-"} full />
        </div>
      </div>

      {/* Land details */}
      <div style={{ marginBottom: 28 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: "#09418C", marginBottom: 14, textTransform: "uppercase", letterSpacing: 1 }}>รายละเอียดที่ดิน</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 16 }}>
          <Field label="เนื้อที่ (ไร่)" value={String(inq.area_rai ?? 0)} />
          <Field label="เนื้อที่ (งาน)" value={String(inq.area_ngan ?? 0)} />
          <Field label="เนื้อที่ (ตร.วา)" value={String(inq.area_wa ?? 0)} />
          <Field label="ประเภทเอกสารสิทธิ์" value={inq.title_deed_type ?? "-"} />
        </div>
      </div>

      {/* Price & notes */}
      <div style={{ marginBottom: 28 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: "#09418C", marginBottom: 14, textTransform: "uppercase", letterSpacing: 1 }}>ราคาและหมายเหตุ</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          <Field label="ราคาที่ต้องการขาย" value={formatPrice(inq.asking_price)} />
          <Field label="สถานะ" value={STATUS_MAP[inq.status]?.label ?? inq.status} />
          {inq.notes && <Field label="หมายเหตุ" value={inq.notes} full />}
        </div>
      </div>

      {/* Images */}
      {(() => {
        const imgs = (inq as LandInquiry & { images?: string[] }).images ?? [];
        return imgs.length > 0 ? (
          <div style={{ marginBottom: 28 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#09418C", marginBottom: 14, textTransform: "uppercase", letterSpacing: 1 }}>รูปภาพที่ดิน</div>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              {imgs.map((url: string, i: number) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img key={i} src={url} alt={`ที่ดิน ${i + 1}`} style={{ width: 160, height: 120, objectFit: "cover", borderRadius: 8, border: "1px solid #e5e7eb" }} />
              ))}
            </div>
          </div>
        ) : null;
      })()}

      {/* Footer */}
      <div style={{ borderTop: "1px solid #e5e7eb", paddingTop: 16, marginTop: 8, fontSize: 11, color: "#aaa", display: "flex", justifyContent: "space-between" }}>
        <span>Palm Springs — เอกสารภายใน</span>
        <span>พิมพ์เมื่อ {new Date().toLocaleDateString("th-TH", { day: "numeric", month: "long", year: "numeric" })}</span>
      </div>
    </div>
  );
}

function Field({ label, value, full }: { label: string; value: string; full?: boolean }) {
  return (
    <div style={full ? { gridColumn: "1 / -1" } : {}}>
      <div style={{ fontSize: 10, color: "#888", marginBottom: 4, fontWeight: 600 }}>{label}</div>
      <div style={{ fontSize: 13, fontWeight: 500, color: "#111", background: "#f9fafb", borderRadius: 6, padding: "8px 12px", border: "1px solid #e5e7eb" }}>
        {value}
      </div>
    </div>
  );
}

// ── InquiryCard ───────────────────────────────────────────────────────────────

function InquiryCard({ inquiry }: { inquiry: LandInquiry }) {
  const [expanded, setExpanded] = useState(false);
  const [exporting, setExporting] = useState(false);
  const templateRef = useRef<HTMLDivElement>(null);

  const handleExport = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!templateRef.current) return;
    setExporting(true);
    try {
      await exportInquiryPDF(inquiry, templateRef.current);
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-shadow hover:shadow-md">
      {/* Hidden PDF template */}
      <PdfTemplate inq={inquiry} templateRef={templateRef} />

      {/* Summary row */}
      <button
        onClick={() => setExpanded((p) => !p)}
        className="flex w-full items-start justify-between gap-4 px-6 py-4 text-left"
      >
        <div className="min-w-0 flex-1 grid grid-cols-2 gap-x-6 gap-y-1 sm:grid-cols-4">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wide text-gray-400">ชื่อ-นามสกุล</p>
            <p className="mt-0.5 truncate text-sm font-bold text-gray-900">{inquiry.first_name} {inquiry.last_name}</p>
          </div>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wide text-gray-400">โทรศัพท์</p>
            <p className="mt-0.5 text-sm font-medium text-gray-700">{inquiry.phone}</p>
          </div>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wide text-gray-400">จังหวัด</p>
            <p className="mt-0.5 text-sm font-medium text-gray-700">{inquiry.province ?? "-"}</p>
          </div>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wide text-gray-400">เนื้อที่</p>
            <p className="mt-0.5 text-sm font-medium text-gray-700">{formatArea(inquiry)}</p>
          </div>
        </div>
        <div className="flex shrink-0 flex-col items-end gap-2">
          <StatusBadge status={inquiry.status} />
          <span className="text-[11px] text-gray-400">{formatDate(inquiry.created_at)}</span>
          {expanded ? <ChevronUp size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />}
        </div>
      </button>

      {/* Expanded detail */}
      {expanded && (
        <div className="border-t border-gray-100 bg-gray-50/60 px-6 py-5">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {inquiry.email && <Detail icon={<Mail size={14} />} label="อีเมล" value={inquiry.email} />}
            {inquiry.district && <Detail icon={<MapPin size={14} />} label="อำเภอ/เขต" value={inquiry.district} />}
            {inquiry.land_address && <Detail icon={<MapPin size={14} />} label="ที่อยู่ที่ดิน" value={inquiry.land_address} className="sm:col-span-2 lg:col-span-3" />}
            <Detail icon={<DollarSign size={14} />} label="ราคาที่ต้องการขาย" value={formatPrice(inquiry.asking_price)} />
            {inquiry.title_deed_type && <Detail icon={<FileText size={14} />} label="ประเภทเอกสารสิทธิ์" value={inquiry.title_deed_type} />}
            <Detail icon={<Phone size={14} />} label="เนื้อที่รวม" value={formatArea(inquiry)} />
            {inquiry.notes && <Detail icon={<StickyNote size={14} />} label="หมายเหตุ" value={inquiry.notes} className="sm:col-span-2 lg:col-span-3" />}
          </div>

          {/* Images */}
          {(() => {
            const imgs = (inquiry as LandInquiry & { images?: string[] }).images ?? [];
            return imgs.length > 0 ? (
              <div className="mt-4">
                <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-gray-400">รูปภาพที่ดิน</p>
                <div className="flex flex-wrap gap-2">
                  {imgs.map((url: string, i: number) => (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img key={i} src={url} alt={`ที่ดิน ${i + 1}`} className="h-24 w-32 rounded-lg object-cover border border-gray-200" />
                  ))}
                </div>
              </div>
            ) : null;
          })()}

          {/* Per-record export button */}
          <div className="mt-5 flex justify-end">
            <Button
              variant="outline"
              size="sm"
              onClick={handleExport}
              disabled={exporting}
              className="gap-2 text-xs"
            >
              {exporting ? <Loader2 size={13} className="animate-spin" /> : <Download size={13} />}
              {exporting ? "กำลังสร้าง PDF..." : "Export PDF รายนี้"}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

function Detail({ icon, label, value, className }: { icon: React.ReactNode; label: string; value: string; className?: string }) {
  return (
    <div className={className}>
      <div className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-gray-400">
        <span className="text-gray-300">{icon}</span>
        {label}
      </div>
      <p className="mt-1 whitespace-pre-line text-sm font-medium text-gray-800">{value}</p>
    </div>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────

export default function LandInquiriesClient({ inquiries }: { inquiries: LandInquiry[] }) {
  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <p className="text-sm font-medium text-gray-500">
          ทั้งหมด <span className="font-bold text-gray-900">{inquiries.length}</span> รายการ
        </p>
      </div>

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
