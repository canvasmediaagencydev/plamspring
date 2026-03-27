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
      <div className="mb-5 grid grid-cols-3 gap-3">
        {[
          { label: "ทั้งหมด", value: posts.length, bg: "bg-gray-50", text: "text-gray-800" },
          { label: "Blog", value: count("blog"), bg: "bg-blue-50", text: "text-blue-700" },
          { label: "CSR", value: count("csr"), bg: "bg-green-50", text: "text-green-700" },
        ].map((s) => (
          <div key={s.label} className={`flex items-center justify-between rounded-2xl ${s.bg} px-4 py-3`}>
            <span className="text-xs font-medium text-gray-500">{s.label}</span>
            <span className={`text-2xl font-bold ${s.text}`}>{s.value}</span>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="mb-5 flex gap-0.5 rounded-xl bg-gray-100 p-1">
        {TABS.map((tab) => (
          <button key={tab.key} onClick={() => setActiveTab(tab.key)}
            className={`flex-1 rounded-lg py-1.5 text-sm font-medium transition-all ${
              activeTab === tab.key ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"
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
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-200 bg-white py-20 text-center">
          <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-100">
            <FileText size={24} className="text-gray-400" />
          </div>
          <p className="text-sm font-medium text-gray-600">ยังไม่มีบทความ</p>
          <Link href="/admin/posts/new" className="mt-4">
            <Button variant="outline" size="sm"><Plus size={14} />เขียนบทความแรก</Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((post) => (
            <div key={post.id}
              className="group overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-shadow hover:shadow-md">
              {/* Cover image */}
              <div className="relative aspect-video overflow-hidden bg-gray-50">
                {post.cover_image_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={post.cover_image_url} alt={post.title}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" />
                ) : (
                  <div className="flex h-full w-full flex-col items-center justify-center gap-1">
                    <ImageIcon size={28} className="text-gray-200" />
                  </div>
                )}

                {/* Type badge */}
                <span className={`absolute left-2.5 top-2.5 rounded-full px-2.5 py-0.5 text-[10px] font-bold shadow-sm ${
                  post.type === "blog"
                    ? "bg-blue-500 text-white"
                    : "bg-green-500 text-white"
                }`}>
                  {post.type === "blog" ? "Blog" : "CSR"}
                </span>

                {/* Published status */}
                <span className={`absolute right-2.5 top-2.5 rounded-full px-2.5 py-0.5 text-[10px] font-semibold shadow-sm ${
                  post.is_published ? "bg-white/90 text-green-700" : "bg-white/90 text-gray-400"
                }`}>
                  {post.is_published ? "เผยแพร่" : "Draft"}
                </span>
              </div>

              {/* Content */}
              <div className="p-4">
                <h3 className="line-clamp-2 text-sm font-bold leading-snug text-gray-900">
                  {post.title}
                </h3>
                {post.excerpt && (
                  <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-gray-400">
                    {post.excerpt}
                  </p>
                )}
                {post.published_at && (
                  <div className="mt-2 flex items-center gap-1 text-[10px] text-gray-300">
                    <Calendar size={9} />
                    {formatDate(post.published_at)}
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between border-t border-gray-50 px-4 py-2.5">
                <p className="max-w-[120px] truncate text-[10px] text-gray-300">/{post.slug}</p>
                <div className="flex items-center gap-1">
                  <button onClick={() => togglePublish(post.id, post.is_published)}
                    title={post.is_published ? "ซ่อน" : "เผยแพร่"}
                    className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600">
                    {post.is_published ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                  <Link href={`/admin/posts/${post.id}`}>
                    <button className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-blue-50 hover:text-blue-600">
                      <Pencil size={14} />
                    </button>
                  </Link>
                  <button onClick={() => handleDelete(post.id)}
                    className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-500">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}

          {/* Add card */}
          <Link href="/admin/posts/new"
            className="flex aspect-video flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-gray-200 bg-white text-gray-400 transition-colors hover:border-violet-300 hover:bg-violet-50/30 hover:text-violet-500">
            <Plus size={24} />
            <span className="text-xs font-medium">เขียนบทความใหม่</span>
          </Link>
        </div>
      )}
    </div>
  );
}
