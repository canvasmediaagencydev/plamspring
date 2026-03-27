"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import {
  MessageCircle,
  FileText,
  FolderOpen,
  Trophy,
  Milestone,
  TrendingUp,
  Users,
  Eye,
  EyeOff,
  RefreshCw,
  Calculator,
} from "lucide-react";
import { FaFacebookMessenger, FaLine } from "react-icons/fa";

// ─── Types ───────────────────────────────────────────────────────────────────

interface ClicksByDay {
  date: string; // "YYYY-MM-DD"
  facebook: number;
  line: number;
  loan_contact: number;
}

interface DashboardData {
  totalClicks: number;
  facebookClicks: number;
  lineClicks: number;
  loanContactClicks: number;
  todayClicks: number;
  weekClicks: number;
  clicksByDay: ClicksByDay[];

  publishedPosts: number;
  draftPosts: number;
  publishedProjects: number;
  draftProjects: number;
  awardsCount: number;
  milestonesCount: number;
  familyImagesCount: number;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("th-TH", {
    day: "numeric",
    month: "short",
  });
}

function getLast7Days(): string[] {
  const days: string[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    days.push(d.toISOString().split("T")[0]);
  }
  return days;
}

// ─── Sub-components ──────────────────────────────────────────────────────────

function StatCard({
  icon,
  label,
  value,
  sub,
  color,
  bg,
}: {
  icon: React.ReactNode;
  label: string;
  value: number | string;
  sub?: string;
  color: string;
  bg: string;
}) {
  return (
    <div className="group flex items-center gap-5 rounded-3xl border border-gray-100/60 bg-white/80 backdrop-blur-sm p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:-translate-y-1 hover:shadow-[0_12px_40px_rgb(0,0,0,0.08)] transition-all duration-300">
      <div className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl ${bg} transition-transform duration-300 group-hover:scale-110`}>
        <span className={color}>{icon}</span>
      </div>
      <div className="min-w-0">
        <p className="text-[13px] font-semibold text-gray-400">{label}</p>
        <p className="mt-1 text-3xl font-black tracking-tight text-gray-800">{value}</p>
        {sub && <p className="mt-1 text-xs font-medium text-gray-400">{sub}</p>}
      </div>
    </div>
  );
}

function MiniBar({
  value,
  max,
  color,
}: {
  value: number;
  max: number;
  color: string;
}) {
  const pct = max === 0 ? 0 : Math.round((value / max) * 100);
  return (
    <div className="h-full w-full rounded-sm bg-gray-100">
      <div
        className={`h-full rounded-sm transition-all duration-500 ${color}`}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}

function ClickChart({ data }: { data: ClicksByDay[] }) {
  const maxTotal = Math.max(...data.map((d) => d.facebook + d.line), 1);

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-gray-700">ยอดคลิก 7 วันล่าสุด</h3>
          <p className="mt-0.5 text-xs text-gray-400">Facebook Messenger + LINE</p>
        </div>
        <div className="flex items-center gap-3 text-xs text-gray-500">
          <span className="flex items-center gap-1">
            <span className="inline-block h-2 w-2 rounded-full bg-[#0084FF]" />
            Facebook
          </span>
          <span className="flex items-center gap-1">
            <span className="inline-block h-2 w-2 rounded-full bg-[#06C755]" />
            LINE
          </span>
        </div>
      </div>

      {/* Chart bars */}
      <div className="flex h-36 items-end gap-2">
        {data.map((day) => {
          const total = day.facebook + day.line;
          const fbPct = total === 0 ? 0 : (day.facebook / total) * 100;
          const linePct = total === 0 ? 0 : (day.line / total) * 100;
          const barHeightPct = maxTotal === 0 ? 0 : (total / maxTotal) * 100;

          return (
            <div
              key={day.date}
              className="group relative flex flex-1 flex-col items-center gap-1"
            >
              {/* Tooltip */}
              <div className="absolute -top-8 left-1/2 hidden -translate-x-1/2 rounded-lg bg-gray-800 px-2 py-1 text-[10px] text-white shadow-md group-hover:flex whitespace-nowrap">
                FB: {day.facebook} · LINE: {day.line}
              </div>

              {/* Stacked bar */}
              <div
                className="w-full overflow-hidden rounded-t-md"
                style={{ height: `${barHeightPct}%`, minHeight: total > 0 ? 4 : 0 }}
              >
                {total > 0 ? (
                  <div className="flex h-full flex-col">
                    <div
                      className="w-full bg-[#0084FF]"
                      style={{ height: `${fbPct}%` }}
                    />
                    <div
                      className="w-full bg-[#06C755]"
                      style={{ height: `${linePct}%` }}
                    />
                  </div>
                ) : (
                  <div className="h-1 w-full rounded-t-md bg-gray-100" />
                )}
              </div>

              {/* Total label */}
              {total > 0 && (
                <span className="text-[9px] font-medium text-gray-500">{total}</span>
              )}

              {/* Date label */}
              <span className="mt-1 text-[9px] text-gray-400">{formatDate(day.date)}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ContentRow({
  icon,
  label,
  published,
  draft,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  published: number;
  draft: number;
  color: string;
}) {
  const total = published + draft;
  const pct = total === 0 ? 0 : Math.round((published / total) * 100);
  return (
    <div className="group flex items-center gap-4 py-3.5 border-b border-gray-50/80 last:border-0 hover:bg-gray-50/30 rounded-xl px-2 -mx-2 transition-colors">
      <span className={`shrink-0 flex h-8 w-8 items-center justify-center rounded-full bg-gray-50 transition-colors group-hover:bg-white ${color}`}>{icon}</span>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[13px] font-semibold text-gray-700">{label}</span>
          <span className="text-xs font-medium text-gray-400">{published}/{total}</span>
        </div>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-gray-100/80">
          <div
            className={`h-full rounded-full transition-all duration-700 ${color.replace("text-", "bg-")}`}
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>
      <div className="shrink-0 flex items-center gap-3 text-[11px] font-medium">
        <span className="flex items-center gap-1 text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
          <Eye size={12} /> {published}
        </span>
        {draft > 0 && (
          <span className="flex items-center gap-1 text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
            <EyeOff size={12} /> {draft}
          </span>
        )}
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshedAt, setRefreshedAt] = useState<Date>(new Date());

  const fetchData = async () => {
    setLoading(true);
    const supabase = createClient();
    const today = new Date().toISOString().split("T")[0];
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
    const last7Days = getLast7Days();

    const [
      { data: allClicks },
      { data: weeklyClicks },
      { data: todayClicks },
      { data: posts },
      { data: projects },
      { data: awards },
      { data: milestones },
      { data: familyImages },
    ] = await Promise.all([
      supabase.from("contact_clicks").select("type"),
      supabase.from("contact_clicks").select("type, clicked_at").gte("clicked_at", weekAgo),
      supabase
        .from("contact_clicks")
        .select("type")
        .gte("clicked_at", `${today}T00:00:00.000Z`),
      supabase.from("posts").select("is_published"),
      supabase.from("projects").select("is_published"),
      supabase.from("awards").select("id"),
      supabase.from("milestones").select("id"),
      supabase.from("our_family_images").select("id"),
    ]);

    // Click breakdowns
    const totalClicks = allClicks?.length ?? 0;
    const facebookClicks = allClicks?.filter((c) => c.type === "facebook").length ?? 0;
    const lineClicks = allClicks?.filter((c) => c.type === "line").length ?? 0;
    const loanContactClicks = allClicks?.filter((c) => c.type === "loan_contact").length ?? 0;
    const weekTotal = weeklyClicks?.length ?? 0;
    const todayTotal = todayClicks?.length ?? 0;

    // Build clicks-by-day for the chart (weeklyClicks already has clicked_at)
    const weeklyRaw = weeklyClicks ?? [];
    const clicksByDayFull: ClicksByDay[] = last7Days.map((date) => ({
      date,
      facebook: weeklyRaw.filter(
        (c) => c.type === "facebook" && c.clicked_at.startsWith(date)
      ).length,
      line: weeklyRaw.filter(
        (c) => c.type === "line" && c.clicked_at.startsWith(date)
      ).length,
      loan_contact: weeklyRaw.filter(
        (c) => c.type === "loan_contact" && c.clicked_at.startsWith(date)
      ).length,
    }));

    setData({
      totalClicks,
      facebookClicks,
      lineClicks,
      loanContactClicks,
      todayClicks: todayTotal,
      weekClicks: weekTotal,
      clicksByDay: clicksByDayFull,

      publishedPosts: posts?.filter((p) => p.is_published).length ?? 0,
      draftPosts: posts?.filter((p) => !p.is_published).length ?? 0,
      publishedProjects: projects?.filter((p) => p.is_published).length ?? 0,
      draftProjects: projects?.filter((p) => !p.is_published).length ?? 0,
      awardsCount: awards?.length ?? 0,
      milestonesCount: milestones?.length ?? 0,
      familyImagesCount: familyImages?.length ?? 0,
    });

    setRefreshedAt(new Date());
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-gray-400">
          <RefreshCw size={28} className="animate-spin" />
          <span className="text-sm">กำลังโหลดข้อมูล...</span>
        </div>
      </div>
    );
  }

  if (!data) return null;

  const contactTotal = data.facebookClicks + data.lineClicks + data.loanContactClicks;
  const fbPct = contactTotal === 0 ? 0 : Math.round((data.facebookClicks / contactTotal) * 100);
  const linePct = contactTotal === 0 ? 0 : Math.round((data.lineClicks / contactTotal) * 100);
  const loanPct = contactTotal === 0 ? 0 : 100 - fbPct - linePct;

  return (
    <div className="min-h-full pb-10">
      {/* Header */}
      <div className="mb-8 flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-gray-900 drop-shadow-sm">Dashboard</h1>
          <p className="mt-1.5 text-sm font-medium text-gray-500">
            ภาพรวมการใช้งานเว็บไซต์ Palm Springs
          </p>
        </div>
        <button
          onClick={fetchData}
          className="flex items-center gap-2 rounded-xl border border-gray-200/60 bg-white/80 backdrop-blur-sm px-4 py-2.5 text-xs font-semibold text-gray-600 shadow-[0_4px_12px_rgba(0,0,0,0.03)] transition-all hover:bg-white hover:-translate-y-0.5 hover:shadow-[0_6px_16px_rgba(0,0,0,0.06)]"
        >
          <RefreshCw size={14} className="hover:animate-spin" />
          รีเฟรชข้อมูล
        </button>
      </div>

      {/* KPI Cards */}
      <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          icon={<MessageCircle size={22} />}
          label="คลิกติดต่อทั้งหมด"
          value={data.totalClicks.toLocaleString()}
          sub="ตั้งแต่เริ่มต้น"
          color="text-[#09418C]"
          bg="bg-blue-50"
        />
        <StatCard
          icon={<TrendingUp size={22} />}
          label="คลิกสัปดาห์นี้"
          value={data.weekClicks}
          sub="7 วันล่าสุด"
          color="text-violet-600"
          bg="bg-violet-50"
        />
        <StatCard
          icon={<FaFacebookMessenger size={20} />}
          label="Facebook Messenger"
          value={data.facebookClicks}
          sub={`${fbPct}% ของทั้งหมด`}
          color="text-[#0084FF]"
          bg="bg-blue-50"
        />
        <StatCard
          icon={<FaLine size={20} />}
          label="LINE"
          value={data.lineClicks}
          sub={`${linePct}% ของทั้งหมด`}
          color="text-[#06C755]"
          bg="bg-green-50"
        />
      </div>

      {/* Loan Contact Card */}
      <div className="mb-8">
        <div className="group flex items-center gap-5 rounded-3xl border border-red-100/60 bg-gradient-to-r from-red-50/50 to-white/80 backdrop-blur-sm p-6 shadow-[0_8px_30px_rgb(227,30,36,0.06)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_40px_rgb(227,30,36,0.12)]">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white shadow-sm transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
            <Calculator size={24} className="text-[#e31e24]" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[13px] font-semibold text-gray-500">ปุ่มติดต่อเรา (หน้าคำนวณวงเงินกู้)</p>
            <div className="flex items-baseline gap-3 mt-1">
              <p className="text-3xl font-black tracking-tight text-gray-900">{data.loanContactClicks.toLocaleString()}</p>
              <p className="text-xs font-semibold text-[#e31e24] bg-red-50 px-2.5 py-1 rounded-full">{loanPct}% ของการติดต่อทั้งหมด</p>
            </div>
          </div>
          <div className="shrink-0 text-right">
            <div className="h-3 w-40 overflow-hidden rounded-full bg-gray-100 shadow-inner">
              <div
                className="h-full rounded-full bg-gradient-to-r from-[#e31e24] to-[#ff4d4f] transition-all duration-1000 ease-out"
                style={{ width: `${loanPct}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* 7-day bar chart — takes 2 columns */}
        <div className="lg:col-span-2 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-[2rem] bg-white/80 backdrop-blur-sm border border-gray-100/60 overflow-hidden p-1">
          <ClickChart data={data.clicksByDay} />
        </div>

        {/* FB vs LINE breakdown */}
        <div className="rounded-[2rem] border border-gray-100/60 bg-white/80 backdrop-blur-sm p-7 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col">
          <h3 className="mb-5 text-base font-bold text-gray-800">สัดส่วนช่องทาง</h3>

          {/* Donut-style bar */}
          <div className="mb-6 overflow-hidden rounded-full h-4 flex bg-gray-100 shadow-inner">
            <div className="h-full bg-gradient-to-r from-[#0084FF] to-[#00b4ff] transition-all duration-1000" style={{ width: `${fbPct}%` }} />
            <div className="h-full bg-gradient-to-r from-[#06C755] to-[#2ce075] transition-all duration-1000" style={{ width: `${linePct}%` }} />
            <div className="h-full bg-gradient-to-r from-[#e31e24] to-[#ff4d4f] transition-all duration-1000" style={{ width: `${loanPct}%` }} />
          </div>

          <div className="space-y-4 flex-1">
            <div className="flex items-center justify-between group">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 transition-colors group-hover:bg-[#0084FF] group-hover:text-white text-[#0084FF]">
                  <FaFacebookMessenger size={18} />
                </div>
                <span className="text-[13px] font-semibold text-gray-600">Facebook</span>
              </div>
              <div className="text-right">
                <div className="text-[15px] font-bold text-gray-900">{data.facebookClicks}</div>
                <div className="text-[11px] font-medium text-gray-400">{fbPct}%</div>
              </div>
            </div>

            <div className="flex items-center justify-between group">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-50 transition-colors group-hover:bg-[#06C755] group-hover:text-white text-[#06C755]">
                  <FaLine size={18} />
                </div>
                <span className="text-[13px] font-semibold text-gray-600">LINE</span>
              </div>
              <div className="text-right">
                <div className="text-[15px] font-bold text-gray-900">{data.lineClicks}</div>
                <div className="text-[11px] font-medium text-gray-400">{linePct}%</div>
              </div>
            </div>

            <div className="flex items-center justify-between group">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 transition-colors group-hover:bg-[#e31e24] group-hover:text-white text-[#e31e24]">
                  <Calculator size={18} />
                </div>
                <span className="text-[13px] font-semibold text-gray-600">ติดต่อ (กู้)</span>
              </div>
              <div className="text-right">
                <div className="text-[15px] font-bold text-gray-900">{data.loanContactClicks}</div>
                <div className="text-[11px] font-medium text-gray-400">{loanPct}%</div>
              </div>
            </div>
          </div>

          {/* Today highlight */}
          <div className="mt-6 rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100/50 px-5 py-4 border border-gray-100 flex items-center justify-between shadow-sm">
            <div>
              <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">คลิกวันนี้</p>
              <p className="text-3xl font-black text-gray-900 mt-0.5">{data.todayClicks}</p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#09418C] opacity-40"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-[#09418C]"></span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Content Overview */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Posts & Projects */}
        <div className="rounded-[2rem] border border-gray-100/60 bg-white/80 backdrop-blur-sm p-7 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
          <h3 className="mb-2 text-base font-bold text-gray-800">เนื้อหาเว็บไซต์</h3>
          <p className="mb-5 text-[13px] font-medium text-gray-400">
            แสดงสถานะ (เผยแพร่ / กำหนดการ) จำนวนรายการทั้งหมด
          </p>
          <div className="space-y-1">
            <ContentRow
              icon={<FileText size={16} />}
              label="Blog & CSR Posts"
              published={data.publishedPosts}
              draft={data.draftPosts}
              color="text-violet-500"
            />
            <ContentRow
              icon={<FolderOpen size={16} />}
              label="โครงการของเรา"
              published={data.publishedProjects}
              draft={data.draftProjects}
              color="text-[#09418C]"
            />
            <ContentRow
              icon={<Trophy size={16} />}
              label="รางวัล (Awards)"
              published={data.awardsCount}
              draft={0}
              color="text-amber-500"
            />
            <ContentRow
              icon={<Milestone size={16} />}
              label="เส้นทาง (Milestones)"
              published={data.milestonesCount}
              draft={0}
              color="text-teal-500"
            />
            <ContentRow
              icon={<Users size={16} />}
              label="Our Family รูปภาพ"
              published={data.familyImagesCount}
              draft={0}
              color="text-pink-500"
            />
          </div>
        </div>

        {/* Quick Links */}
        <div className="rounded-[2rem] border border-gray-100/60 bg-white/80 backdrop-blur-sm p-7 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col">
          <h3 className="mb-2 text-base font-bold text-gray-800">จัดการเนื้อหา</h3>
          <p className="mb-5 text-[13px] font-medium text-gray-400">ลิงก์ด่วนไปยังหน้าจัดการต่างๆ</p>
          <div className="grid grid-cols-2 gap-3 flex-1">
            {[
              { label: "Hero Slideshow", href: "/admin/home/hero", color: "bg-blue-50/70 text-blue-700 hover:bg-blue-600 hover:text-white" },
              { label: "วิดีโอหน้าแรก", href: "/admin/home/videos", color: "bg-violet-50/70 text-violet-700 hover:bg-violet-600 hover:text-white" },
              { label: "โครงการของเรา", href: "/admin/home/projects", color: "bg-[#09418C]/5 text-[#09418C] hover:bg-[#09418C] hover:text-white" },
              { label: "Blog & CSR", href: "/admin/posts", color: "bg-pink-50/70 text-pink-700 hover:bg-pink-600 hover:text-white" },
              { label: "About Us", href: "/admin/about/content", color: "bg-amber-50/70 text-amber-700 hover:bg-amber-500 hover:text-white" },
              { label: "Footer & Contact", href: "/admin/footer", color: "bg-teal-50/70 text-teal-700 hover:bg-teal-600 hover:text-white" },
              { label: "Our Family", href: "/admin/our-family", color: "bg-rose-50/70 text-rose-700 hover:bg-rose-600 hover:text-white" },
              { label: "Awards", href: "/admin/about/awards", color: "bg-orange-50/70 text-orange-700 hover:bg-orange-500 hover:text-white" },
            ].map(({ label, href, color }) => (
              <a
                key={href}
                href={href}
                className={`flex items-center justify-center text-center rounded-2xl px-3 py-4 text-[13px] font-bold transition-all duration-300 hover:shadow-md hover:-translate-y-1 ${color}`}
              >
                {label}
              </a>
            ))}
          </div>

          <div className="mt-6 flex items-center justify-between rounded-2xl bg-gray-50/80 px-5 py-4 border border-gray-100/80">
            <div>
              <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">อัปเดตข้อมูลล่าสุดเมื่อ</p>
              <p className="mt-1 text-[13px] font-semibold text-gray-700">
                {refreshedAt.toLocaleTimeString("th-TH", {
                  hour: "2-digit",
                  minute: "2-digit",
                  second: "2-digit",
                })} น.
              </p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100 shadow-inner">
              <div className="h-2.5 w-2.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
