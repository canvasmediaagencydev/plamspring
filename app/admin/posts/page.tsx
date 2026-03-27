"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { AdminHeader } from "@/app/components/admin/AdminHeader";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Pencil, Trash2, Eye, EyeOff, FileText, ImageIcon } from "lucide-react";
import type { Tables } from "@/lib/types/database.types";

type Post = Tables<"posts">;

const TABS = [
  { key: "all" as const, label: "ทั้งหมด" },
  { key: "blog" as const, label: "Blog" },
  { key: "csr" as const, label: "CSR Projects" },
];

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

      {/* Stats row */}
      <div className="mb-5 grid grid-cols-3 gap-3">
        {[
          { label: "ทั้งหมด", value: posts.length, color: "text-gray-900" },
          { label: "Blog", value: count("blog"), color: "text-blue-600" },
          { label: "CSR", value: count("csr"), color: "text-green-600" },
        ].map((s) => (
          <Card key={s.label}>
            <CardContent className="flex items-center justify-between p-4">
              <span className="text-xs font-medium text-gray-500">{s.label}</span>
              <span className={`text-2xl font-bold ${s.color}`}>{s.value}</span>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Tabs */}
      <div className="mb-4 flex gap-0.5 rounded-lg bg-gray-100 p-1">
        {TABS.map((tab) => (
          <button key={tab.key} onClick={() => setActiveTab(tab.key)}
            className={`flex-1 rounded-md py-1.5 text-sm font-medium transition-all ${
              activeTab === tab.key ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"
            }`}>
            {tab.label}
          </button>
        ))}
      </div>

      {loading ? (
        <Card><CardContent className="pt-6 space-y-3">
          {[1,2,3].map((i) => <div key={i} className="h-16 animate-pulse rounded-lg bg-gray-100" />)}
        </CardContent></Card>
      ) : filtered.length === 0 ? (
        <Card><CardContent className="flex flex-col items-center justify-center py-16 text-center">
          <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
            <FileText size={22} className="text-gray-400" />
          </div>
          <p className="text-sm font-medium text-gray-600">ยังไม่มีบทความ</p>
          <Link href="/admin/posts/new" className="mt-4">
            <Button variant="outline" size="sm"><Plus size={14} />เขียนบทความแรก</Button>
          </Link>
        </CardContent></Card>
      ) : (
        <Card><CardContent className="p-0">
          <div className="divide-y divide-gray-100">
            {filtered.map((post) => (
              <div key={post.id} className="flex items-center gap-4 px-5 py-3.5 transition-colors hover:bg-gray-50/70">
                {post.cover_image_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={post.cover_image_url} alt="" className="h-11 w-16 shrink-0 rounded-lg object-cover" />
                ) : (
                  <div className="flex h-11 w-16 shrink-0 items-center justify-center rounded-lg bg-gray-100">
                    <ImageIcon size={16} className="text-gray-300" />
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                      post.type === "blog" ? "bg-blue-50 text-blue-700" : "bg-green-50 text-green-700"
                    }`}>
                      {post.type === "blog" ? "Blog" : "CSR"}
                    </span>
                    <p className="truncate text-sm font-semibold text-gray-900">{post.title}</p>
                  </div>
                  <p className="mt-0.5 truncate text-xs text-gray-400">/{post.slug}</p>
                </div>
                <Badge variant={post.is_published ? "success" : "secondary"}>
                  {post.is_published ? "เผยแพร่" : "Draft"}
                </Badge>
                <div className="flex items-center">
                  <button onClick={() => togglePublish(post.id, post.is_published)}
                    className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
                    title={post.is_published ? "ซ่อน" : "เผยแพร่"}>
                    {post.is_published ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                  <Link href={`/admin/posts/${post.id}`}>
                    <button className="rounded-lg p-1.5 text-gray-400 hover:bg-blue-50 hover:text-blue-600 transition-colors">
                      <Pencil size={15} />
                    </button>
                  </Link>
                  <button onClick={() => handleDelete(post.id)}
                    className="rounded-lg p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-500 transition-colors">
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </CardContent></Card>
      )}
    </div>
  );
}
