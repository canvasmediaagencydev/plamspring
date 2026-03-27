"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { AdminHeader } from "@/app/components/admin/AdminHeader";
import { Button } from "@/components/ui/button";
import { Plus, Pencil, Trash2, Eye, EyeOff, FileText, ImageIcon, Calendar } from "lucide-react";
import type { Tables } from "@/lib/types/database.types";

type Post = Tables<"posts">;

const TABS = [
  { key: "all" as const, label: "ทั้งหมด" },
  { key: "blog" as const, label: "Blog" },
  { key: "csr" as const, label: "CSR Projects" },
];

function formatDate(iso: string | null) {
  if (!iso) return null;
  return new Date(iso).toLocaleDateString("th-TH", { day: "numeric", month: "short", year: "2-digit" });
}

export default function AdminPostsPage() {
  const supabase = createClient();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"all" | "blog" | "csr">("all");

  useEffect(() => {
    supabase.from("posts").select("*").order("created_at", { ascending: false })
      .then(({ data }) => { setPosts(data ?? []); setLoading(false); });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleDelete = async (id: string) => {
    if (!confirm("ต้องการลบบทความนี้?")) return;
    await supabase.from("posts").delete().eq("id", id);
    setPosts((prev) => prev.filter((p) => p.id !== id));
  };

  const togglePublish = async (id: string, current: boolean) => {
    const updates = { is_published: !current, published_at: !current ? new Date().toISOString() : null };
    await supabase.from("posts").update(updates).eq("id", id);
    setPosts((prev) => prev.map((p) => p.id === id ? { ...p, ...updates } : p));
  };

  const count = (type: "blog" | "csr") => posts.filter((p) => p.type === type).length;
  const filtered = posts.filter((p) => activeTab === "all" || p.type === activeTab);

  return (
    <div>
      <AdminHeader
        title="Blog & CSR Posts"
        description="จัดการบทความ Blog และโครงการ CSR"
        action={
          <Link href="/admin/posts/new">
            <Button><Plus size={16} />เขียนบทความ</Button>
          </Link>
        }
      />

      {/* Stats */}
      <div className="mb-6 grid grid-cols-3 gap-4">
        {[
          { label: "ทั้งหมด", value: posts.length, bg: "bg-white/80 border border-gray-100/60 shadow-[0_4px_16px_rgba(0,0,0,0.02)]", text: "text-gray-900" },
          { label: "Blog", value: count("blog"), bg: "bg-gradient-to-br from-blue-50/50 to-white/80 border border-blue-100/50 shadow-[0_4px_16px_rgba(59,130,246,0.04)]", text: "text-[#09418C]" },
          { label: "CSR", value: count("csr"), bg: "bg-gradient-to-br from-green-50/50 to-white/80 border border-green-100/50 shadow-[0_4px_16px_rgba(34,197,94,0.04)]", text: "text-green-700" },
        ].map((s) => (
          <div key={s.label} className={`flex items-center justify-between rounded-[1.25rem] backdrop-blur-sm px-6 py-4 transition-transform duration-300 hover:-translate-y-0.5 ${s.bg}`}>
            <span className="text-[13px] font-bold text-gray-500 uppercase tracking-wider">{s.label}</span>
            <span className={`text-4xl font-black tracking-tight ${s.text}`}>{s.value}</span>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="mb-8 flex gap-1 rounded-[14px] bg-gray-100/60 p-1.5 w-max">
        {TABS.map((tab) => (
          <button key={tab.key} onClick={() => setActiveTab(tab.key)}
            className={`px-5 py-2 text-[13px] font-bold transition-all duration-300 rounded-[10px] ${
              activeTab === tab.key ? "bg-white text-gray-900 shadow-[0_2px_10px_rgba(0,0,0,0.04)] scale-100" : "text-gray-500 hover:text-gray-800 hover:bg-gray-200/50 scale-[0.98]"
            }`}>
            {tab.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1,2,3,4,5,6].map((i) => (
            <div key={i} className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
              <div className="aspect-video animate-pulse bg-gray-100" />
              <div className="p-4 space-y-2">
                <div className="h-4 w-3/4 animate-pulse rounded bg-gray-100" />
                <div className="h-3 w-full animate-pulse rounded bg-gray-100" />
                <div className="h-3 w-2/3 animate-pulse rounded bg-gray-100" />
              </div>
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-[2rem] border border-dashed border-gray-200 bg-white/50 backdrop-blur-sm py-24 text-center shadow-[0_8px_30px_rgb(0,0,0,0.01)]">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-[1.25rem] bg-gray-50 shadow-inner">
            <FileText size={28} className="text-gray-400" />
          </div>
          <p className="text-[15px] font-bold text-gray-600">ยังไม่มีบทความ</p>
          <p className="text-xs font-medium text-gray-400 mt-1">เริ่มต้นสร้างบทความ Blog หรือ CSR แรกของคุณ</p>
          <Link href="/admin/posts/new" className="mt-6">
            <Button variant="outline" size="sm" className="rounded-full px-5 py-4 shadow-sm font-semibold border-gray-200 hover:bg-gray-50 hover:text-[#09418C]"><Plus size={16} className="mr-1" />เขียนบทความแรก</Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((post) => (
            <div key={post.id}
              className="group flex flex-col overflow-hidden rounded-[1.5rem] border border-gray-100/60 bg-white/90 backdrop-blur-sm shadow-[0_8px_24px_rgba(0,0,0,0.03)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_40px_rgba(0,0,0,0.08)] hover:border-gray-200/60">
              {/* Cover image */}
              <div className="relative aspect-[16/10] overflow-hidden bg-gray-50/50 rounded-t-[1.5rem] m-1.5">
                {post.cover_image_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={post.cover_image_url} alt={post.title}
                    className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105" />
                ) : (
                  <div className="flex h-full w-full flex-col items-center justify-center gap-1">
                    <ImageIcon size={32} className="text-gray-200" />
                  </div>
                )}

                {/* Type badge */}
                <span className={`absolute left-3 top-3 rounded-full px-3 py-1 text-[10px] font-black tracking-wide shadow-sm backdrop-blur-md ${
                  post.type === "blog"
                    ? "bg-[#09418C]/90 text-white border border-[#09418C]/20"
                    : "bg-green-600/90 text-white border border-green-600/20"
                }`}>
                  {post.type === "blog" ? "BLOG" : "CSR"}
                </span>

                {/* Published status */}
                <span className={`absolute right-3 top-3 rounded-full px-3 py-1 text-[10px] font-bold shadow-sm backdrop-blur-md border ${
                  post.is_published ? "bg-white/80 text-green-700 border-green-100" : "bg-white/80 text-gray-500 border-gray-200"
                }`}>
                  {post.is_published ? "เผยแพร่แล้ว" : "ฉบับร่าง (Draft)"}
                </span>
              </div>

              {/* Content */}
              <div className="flex-1 p-5 flex flex-col">
                <h3 className="line-clamp-2 text-[15px] font-black leading-snug text-gray-900 group-hover:text-[#09418C] transition-colors">
                  {post.title}
                </h3>
                {post.excerpt && (
                  <p className="mt-2.5 line-clamp-2 text-[13px] font-medium leading-relaxed text-gray-500">
                    {post.excerpt}
                  </p>
                )}
                <div className="mt-auto pt-4 flex items-center gap-1.5 text-[11px] font-bold text-gray-400">
                  <Calendar size={12} className="text-gray-300" />
                  {post.published_at ? formatDate(post.published_at) : "ไม่ได้เผยแพร่"}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between border-t border-gray-100/60 bg-gray-50/30 px-5 py-3.5">
                <p className="max-w-[120px] truncate text-[11px] font-medium text-gray-400">/{post.slug}</p>
                <div className="flex items-center gap-1.5">
                  <button onClick={() => togglePublish(post.id, post.is_published)}
                    title={post.is_published ? "ซ่อน" : "เผยแพร่"}
                    className="rounded-xl p-2 text-gray-400 transition-all duration-300 hover:bg-white hover:text-gray-700 hover:shadow-sm">
                    {post.is_published ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                  <Link href={`/admin/posts/${post.id}`}>
                    <button className="rounded-xl p-2 text-gray-400 transition-all duration-300 hover:bg-white hover:text-[#09418C] hover:shadow-sm">
                      <Pencil size={16} />
                    </button>
                  </Link>
                  <button onClick={() => handleDelete(post.id)}
                    className="rounded-xl p-2 text-gray-400 transition-all duration-300 hover:bg-red-50 hover:text-red-500">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}

          {/* Add card */}
          <Link href="/admin/posts/new"
            className="group flex aspect-[16/10] sm:aspect-auto sm:h-full flex-col items-center justify-center gap-3 rounded-[1.5rem] border-2 border-dashed border-gray-200 bg-white/50 backdrop-blur-sm text-gray-400 transition-all duration-300 hover:border-[#09418C]/40 hover:bg-[#09418C]/5 hover:text-[#09418C] hover:shadow-md hover:-translate-y-1">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-100/80 transition-colors group-hover:bg-[#09418C]/10">
              <Plus size={24} className="text-gray-400 group-hover:text-[#09418C] transition-colors" />
            </div>
            <span className="text-[13px] font-bold tracking-wide">เขียนบทความใหม่</span>
          </Link>
        </div>
      )}
    </div>
  );
}
