"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  FileText, FolderOpen, Trophy, Milestone, Users, Eye, EyeOff,
  RefreshCw, Calculator, MapPin, ArrowUpRight, Activity, Inbox, Mail,
} from "lucide-react";
import { FaFacebookMessenger, FaLine } from "react-icons/fa";

interface ClicksByDay { date: string; facebook: number; line: number; loan_contact: number }
interface DashboardData {
  totalClicks: number; facebookClicks: number; lineClicks: number; loanContactClicks: number;
  todayClicks: number; weekClicks: number; clicksByDay: ClicksByDay[];
  publishedPosts: number; draftPosts: number; publishedProjects: number; draftProjects: number;
  awardsCount: number; milestonesCount: number; familyImagesCount: number;
  totalLandInquiries: number; newLandInquiries: number;
  totalContactSubmissions: number; newContactSubmissions: number;
}

function formatDate(iso: string) { return new Date(iso).toLocaleDateString("th-TH", { day: "numeric", month: "short" }) }

function KpiCard({ icon, label, value, sub, accent = false, badge }: { icon: React.ReactNode; label: string; value: number | string; sub?: string; accent?: boolean; badge?: React.ReactNode }) {
  return (
    <div className={`relative flex flex-col gap-4 rounded-2xl border p-6 transition-shadow hover:shadow-md ${accent ? "border-[#09418C]/20 bg-[#09418C] text-white" : "border-gray-100 bg-white text-gray-900"}`}>
      <div className="flex items-start justify-between">
        <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${accent ? "bg-white/15" : "bg-gray-50"}`}>
          <span className={accent ? "text-white" : "text-[#09418C]"}>{icon}</span>
        </div>
        {badge}
      </div>
      <div>
        <p className={`text-[13px] font-medium ${accent ? "text-white/70" : "text-gray-400"}`}>{label}</p>
        <p className={`mt-1 text-3xl font-bold tracking-tight ${accent ? "text-white" : "text-gray-900"}`}>{value}</p>
        {sub && <p className={`mt-1 text-xs ${accent ? "text-white/60" : "text-gray-400"}`}>{sub}</p>}
      </div>
    </div>
  )
}

const W = 520; const H = 140; const PAD = { top: 16, right: 16, bottom: 8, left: 8 };
interface LineConfig { key: keyof ClicksByDay; color: string; label: string; gradId: string }
const LINES: LineConfig[] = [
  { key: "facebook", color: "#0084FF", label: "Facebook", gradId: "grad-fb" },
  { key: "line", color: "#06C755", label: "LINE", gradId: "grad-line" },
  { key: "loan_contact", color: "#09418C", label: "ติดต่อขอกู้", gradId: "grad-loan" },
];
function toPoints(data: ClicksByDay[], key: keyof ClicksByDay, maxVal: number) {
  const n = data.length; const chartW = W - PAD.left - PAD.right; const chartH = H - PAD.top - PAD.bottom;
  return data.map((d, i) => { const x = PAD.left + (i / (n - 1)) * chartW; const v = (d[key] as number) ?? 0; const y = PAD.top + chartH - (maxVal === 0 ? 0 : (v / maxVal) * chartH); return { x, y, v } })
}
function smoothPath(pts: { x: number; y: number }[]) {
  if (pts.length < 2) return ""; let d = `M ${pts[0].x} ${pts[0].y}`;
  for (let i = 1; i < pts.length; i++) { const cp1x = pts[i-1].x + (pts[i].x - pts[i-1].x) / 2; d += ` C ${cp1x} ${pts[i-1].y}, ${cp1x} ${pts[i].y}, ${pts[i].x} ${pts[i].y}` }
  return d
}
function areaPath(pts: { x: number; y: number }[], bottom: number) { const line = smoothPath(pts); if (!line) return ""; return `${line} L ${pts[pts.length-1].x} ${bottom} L ${pts[0].x} ${bottom} Z` }
function ClickChart({ data }: { data: ClicksByDay[] }) {
  const maxVal = Math.max(...LINES.flatMap(({ key }) => data.map((d) => (d[key] as number) ?? 0)), 1);
  const bottom = H - PAD.bottom;
  return (
    <div>
      <div className="mb-5 flex items-center justify-between">
        <div><h3 className="text-sm font-semibold text-gray-800">ยอดคลิกติดต่อ 7 วันล่าสุด</h3><p className="mt-0.5 text-xs text-gray-400">แยกตามช่องทาง</p></div>
        <div className="flex items-center gap-4 text-[11px] font-medium text-gray-400">
          {LINES.map(({ color, label }) => (<span key={label} className="flex items-center gap-1.5"><span className="h-2 w-5 rounded-full" style={{ background: color }} />{label}</span>))}
        </div>
      </div>
      <div className="relative">
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ height: 180 }} overflow="visible">
          <defs>{LINES.map(({ color, gradId }) => (<linearGradient key={gradId} id={gradId} x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={color} stopOpacity="0.18" /><stop offset="100%" stopColor={color} stopOpacity="0" /></linearGradient>))}</defs>
          {[0, 0.25, 0.5, 0.75, 1].map((t) => { const y = PAD.top + (H - PAD.top - PAD.bottom) * (1 - t); return <line key={t} x1={PAD.left} y1={y} x2={W - PAD.right} y2={y} stroke="#f0f0f0" strokeWidth="1" /> })}
          {LINES.map(({ key, gradId }) => { const pts = toPoints(data, key, maxVal); return <path key={gradId} d={areaPath(pts, bottom)} fill={`url(#${gradId})`} /> })}
          {LINES.map(({ key, color }) => { const pts = toPoints(data, key, maxVal); return <path key={color} d={smoothPath(pts)} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /> })}
          {data.map((day, i) => (<g key={day.date}>{LINES.map(({ key, color }) => { const pts = toPoints(data, key, maxVal); const { x, y } = pts[i]; const v = (day[key] as number) ?? 0; if (v === 0) return null; return <circle key={key as string} cx={x} cy={y} r={3.5} fill="white" stroke={color} strokeWidth="2" /> })}</g>))}
          {data.map((day, i) => { const x = PAD.left + (i / (data.length - 1)) * (W - PAD.left - PAD.right); return <text key={day.date} x={x} y={H + 14} textAnchor="middle" fontSize="9" fill="#bbb">{formatDate(day.date)}</text> })}
          {LINES.map(({ key, color }) => { const pts = toPoints(data, key, maxVal); const last = pts[pts.length - 1]; const v = (data[data.length - 1][key] as number) ?? 0; if (v === 0) return null; return <text key={key as string} x={last.x + 6} y={last.y + 4} fontSize="9" fontWeight="600" fill={color}>{v}</text> })}
        </svg>
      </div>
    </div>
  )
}
function ContentRow({ icon, label, published, draft }: { icon: React.ReactNode; label: string; published: number; draft: number }) {
  const total = published + draft; const pct = total === 0 ? 0 : Math.round((published / total) * 100);
  return (
    <div className="flex items-center gap-3 py-3 border-b border-gray-50 last:border-0">
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gray-50 text-gray-500">{icon}</span>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1.5"><span className="text-[13px] font-medium text-gray-700">{label}</span><span className="text-xs text-gray-400">{published}/{total}</span></div>
        <div className="h-1 w-full overflow-hidden rounded-full bg-gray-100"><div className="h-full rounded-full bg-[#09418C] transition-all duration-700" style={{ width: `${pct}%` }} /></div>
      </div>
      <div className="shrink-0 flex items-center gap-1.5 text-[11px] font-medium">
        <span className="flex items-center gap-1 text-gray-500 bg-gray-50 px-2 py-0.5 rounded-full border border-gray-100"><Eye size={10} /> {published}</span>
        {draft > 0 && <span className="flex items-center gap-1 text-gray-400 bg-gray-50 px-2 py-0.5 rounded-full border border-gray-100"><EyeOff size={10} /> {draft}</span>}
      </div>
    </div>
  )
}
function QuickLink({ label, href }: { label: string; href: string }) {
  return (
    <Link href={href} className="group flex items-center justify-between rounded-xl border border-gray-100 bg-gray-50/60 px-4 py-3 text-[13px] font-medium text-gray-700 transition-all hover:border-[#09418C]/20 hover:bg-[#09418C]/5 hover:text-[#09418C]">
      <span>{label}</span><ArrowUpRight size={14} className="text-gray-300 transition-colors group-hover:text-[#09418C]" />
    </Link>
  )
}

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshedAt, setRefreshedAt] = useState<Date>(new Date());

  const fetchData = async () => {
    setLoading(true);
    const res = await fetch("/api/admin/dashboard");
    const json: DashboardData = await res.json();
    setData(json);
    setRefreshedAt(new Date());
    setLoading(false);
  };

  useEffect(() => { fetchData() }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (loading) return (
    <div className="flex h-64 items-center justify-center">
      <div className="flex flex-col items-center gap-3 text-gray-300"><RefreshCw size={24} className="animate-spin" /><span className="text-sm">กำลังโหลด...</span></div>
    </div>
  );
  if (!data) return null;

  const contactTotal = data.facebookClicks + data.lineClicks + data.loanContactClicks;
  const fbPct = contactTotal === 0 ? 0 : Math.round((data.facebookClicks / contactTotal) * 100);
  const linePct = contactTotal === 0 ? 0 : Math.round((data.lineClicks / contactTotal) * 100);
  const loanPct = contactTotal === 0 ? 0 : 100 - fbPct - linePct;

  return (
    <div className="min-h-full space-y-6 pb-12">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold tracking-tight text-gray-900">Dashboard</h1><p className="mt-1 text-sm text-gray-400">ภาพรวมการใช้งานเว็บไซต์ Palm Springs</p></div>
        <button onClick={fetchData} className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2 text-xs font-medium text-gray-500 shadow-sm transition-all hover:border-gray-300 hover:text-gray-700"><RefreshCw size={13} />รีเฟรช</button>
      </div>
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <KpiCard icon={<Activity size={20} />} label="คลิกติดต่อทั้งหมด" value={data.totalClicks.toLocaleString()} sub="ตั้งแต่เริ่มต้น" accent />
        <Link href="/admin/contact" className="block"><KpiCard icon={<Mail size={20} />} label="คนที่ติดต่อเข้ามา" value={data.totalContactSubmissions} sub={`รอดำเนินการ ${data.newContactSubmissions} รายการ`} badge={data.newContactSubmissions > 0 ? <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-[#09418C] px-1.5 text-[10px] font-bold text-white">{data.newContactSubmissions}</span> : undefined} /></Link>
        <Link href="/admin/land-inquiries" className="block"><KpiCard icon={<Inbox size={20} />} label="แบบฟอร์มที่ดิน" value={data.totalLandInquiries} sub={`รอดำเนินการ ${data.newLandInquiries} รายการ`} badge={data.newLandInquiries > 0 ? <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-[#09418C] px-1.5 text-[10px] font-bold text-white">{data.newLandInquiries}</span> : undefined} /></Link>
        <KpiCard icon={<Calculator size={20} />} label="จำนวน click ปุ่มติดต่อขอกู้" value={data.loanContactClicks} sub={`${loanPct}% ของการติดต่อ`} />
      </div>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm lg:col-span-2"><ClickChart data={data.clicksByDay} /></div>
        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm flex flex-col gap-5">
          <div><h3 className="text-sm font-semibold text-gray-800">ช่องทางการติดต่อ</h3><p className="mt-0.5 text-xs text-gray-400">สัดส่วนช่องทางทั้งหมด</p></div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100 flex">
            <div className="h-full bg-[#0084FF] transition-all duration-700" style={{ width: `${fbPct}%` }} />
            <div className="h-full bg-[#06C755] transition-all duration-700" style={{ width: `${linePct}%` }} />
            <div className="h-full bg-[#09418C] transition-all duration-700" style={{ width: `${loanPct}%` }} />
          </div>
          <div className="space-y-3">
            {[
              { Icon: FaFacebookMessenger, label: "Facebook Messenger", value: data.facebookClicks, pct: fbPct, color: "text-[#0084FF]", bg: "bg-[#0084FF]/8" },
              { Icon: FaLine, label: "LINE", value: data.lineClicks, pct: linePct, color: "text-[#06C755]", bg: "bg-[#06C755]/8" },
              { Icon: Calculator, label: "จำนวน click ปุ่มติดต่อขอกู้", value: data.loanContactClicks, pct: loanPct, color: "text-[#09418C]", bg: "bg-[#09418C]/8" },
            ].map(({ Icon, label, value, pct, color, bg }) => (
              <div key={label} className="flex items-center gap-3">
                <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${bg}`}><Icon size={15} className={color} /></div>
                <div className="flex-1 min-w-0"><p className="text-[12px] font-medium text-gray-600 truncate">{label}</p></div>
                <div className="text-right shrink-0"><p className="text-[13px] font-bold text-gray-800">{value.toLocaleString()}</p><p className="text-[10px] text-gray-400">{pct}%</p></div>
              </div>
            ))}
          </div>
          <div className="mt-auto rounded-xl border border-gray-100 bg-gray-50 px-4 py-3 flex items-center justify-between">
            <div><p className="text-[10px] font-medium uppercase tracking-widest text-gray-400">วันนี้</p><p className="text-2xl font-bold text-gray-900 mt-0.5">{data.todayClicks}</p></div>
            <span className="relative flex h-2.5 w-2.5"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#09418C] opacity-40" /><span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[#09418C]" /></span>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <h3 className="mb-1 text-sm font-semibold text-gray-800">สถานะเนื้อหา</h3>
          <p className="mb-5 text-xs text-gray-400">รายการที่เผยแพร่และแบบร่าง</p>
          <div className="space-y-0.5">
            <ContentRow icon={<FileText size={15} />} label="Blog & CSR" published={data.publishedPosts} draft={data.draftPosts} />
            <ContentRow icon={<FolderOpen size={15} />} label="โครงการ" published={data.publishedProjects} draft={data.draftProjects} />
            <ContentRow icon={<Trophy size={15} />} label="รางวัล" published={data.awardsCount} draft={0} />
            <ContentRow icon={<Milestone size={15} />} label="Milestones" published={data.milestonesCount} draft={0} />
            <ContentRow icon={<Users size={15} />} label="Our Family" published={data.familyImagesCount} draft={0} />
            <ContentRow icon={<MapPin size={15} />} label="แบบฟอร์มที่ดิน" published={data.totalLandInquiries} draft={0} />
          </div>
        </div>
        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm flex flex-col gap-3">
          <div className="mb-1"><h3 className="text-sm font-semibold text-gray-800">จัดการเนื้อหา</h3><p className="mt-0.5 text-xs text-gray-400">ลิงก์ด่วน</p></div>
          <div className="grid grid-cols-2 gap-2 flex-1">
            {[
              { label: "Hero Slideshow", href: "/admin/home/hero" },
              { label: "วิดีโอหน้าแรก", href: "/admin/home/videos" },
              { label: "โครงการของเรา", href: "/admin/home/projects" },
              { label: "Blog & CSR", href: "/admin/posts" },
              { label: "About Us", href: "/admin/about/content" },
              { label: "Footer & Contact", href: "/admin/footer" },
              { label: "Our Family", href: "/admin/our-family" },
              { label: "แบบฟอร์มที่ดิน", href: "/admin/land-inquiries" },
            ].map(({ label, href }) => (<QuickLink key={href} label={label} href={href} />))}
          </div>
          <div className="mt-1 flex items-center justify-between rounded-xl border border-gray-100 bg-gray-50 px-4 py-3">
            <div><p className="text-[10px] font-medium uppercase tracking-widest text-gray-400">อัปเดตเมื่อ</p><p className="mt-0.5 text-[13px] font-semibold text-gray-700">{refreshedAt.toLocaleTimeString("th-TH", { hour: "2-digit", minute: "2-digit", second: "2-digit" })} น.</p></div>
            <div className="h-2 w-2 rounded-full bg-green-400 shadow-[0_0_6px_rgba(74,222,128,0.7)]" />
          </div>
        </div>
      </div>
    </div>
  )
}
