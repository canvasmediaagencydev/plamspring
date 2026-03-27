"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { AdminHeader } from "@/app/components/admin/AdminHeader";
import { ImageUploader } from "@/app/components/admin/ImageUploader";
import { TiptapEditor } from "@/app/components/admin/TiptapEditor";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Save, ArrowLeft, Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import type { Tables } from "@/lib/types/database.types";
import { revalidatePages, REVALIDATE_PATHS } from "@/lib/revalidate";

type Post = Tables<"posts">;

interface PostFormProps {
  initial?: Partial<Post>;
  mode: "new" | "edit";
}

/** Auto-generate a URL-safe slug from Thai/English text. */
function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim()
    .substring(0, 80)
    + "-" + Date.now().toString(36);
}

export function PostForm({ initial = {}, mode }: PostFormProps) {
  const supabase = createClient();
  const router = useRouter();

  const [type, setType] = useState<"blog" | "csr">(
    (initial.type as "blog" | "csr") ?? "blog"
  );
  const [title, setTitle] = useState(initial.title ?? "");
  const [slug, setSlug] = useState(initial.slug ?? "");
  const [content, setContent] = useState(initial.content ?? "");
  const [excerpt, setExcerpt] = useState(initial.excerpt ?? "");
  const [coverImageUrl, setCoverImageUrl] = useState(initial.cover_image_url ?? "");
  const [isPublished, setIsPublished] = useState(initial.is_published ?? false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleTitleChange = (value: string) => {
    setTitle(value);
    if (mode === "new" && !slug) {
      setSlug(generateSlug(value));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) { setError("กรุณาใส่หัวข้อ"); return; }

    setSaving(true);
    setError("");

    try {
      const finalSlug = slug.trim() || generateSlug(title);
      const payload = {
        type,
        title: title.trim(),
        slug: finalSlug,
        content,
        excerpt: excerpt.trim() || null,
        cover_image_url: coverImageUrl || null,
        is_published: isPublished,
        published_at: isPublished ? (initial.published_at ?? new Date().toISOString()) : null,
        updated_at: new Date().toISOString(),
      };

      if (mode === "new") {
        const { error: err } = await supabase.from("posts").insert(payload);
        if (err) throw err;
      } else {
        const { error: err } = await supabase.from("posts").update(payload).eq("id", initial.id!);
        if (err) throw err;
      }
      await revalidatePages([...REVALIDATE_PATHS.posts]);
      router.push("/admin/posts");
      router.refresh();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "บันทึกไม่สำเร็จ";
      setError(msg.includes("duplicate") ? "Slug นี้ถูกใช้แล้ว กรุณาเปลี่ยน" : msg);
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <AdminHeader
        title={mode === "new" ? "เขียนบทความใหม่" : "แก้ไขบทความ"}
        action={
          <div className="flex gap-2">
            <Link href="/admin/posts">
              <Button type="button" variant="outline"><ArrowLeft size={16} />กลับ</Button>
            </Link>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsPublished((p) => !p)}
            >
              {isPublished ? <><EyeOff size={16} />ซ่อน Draft</> : <><Eye size={16} />เผยแพร่</>}
            </Button>
            <Button type="submit" disabled={saving}>
              <Save size={16} />
              {saving ? "กำลังบันทึก..." : "บันทึก"}
            </Button>
          </div>
        }
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Main content — 2/3 width */}
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardContent className="pt-6 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">หัวข้อ *</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder="ชื่อบทความ"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>เนื้อหา</Label>
                <TiptapEditor
                  value={content}
                  onChange={setContent}
                  placeholder="เขียนเนื้อหาบทความที่นี่..."
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar — 1/3 width */}
        <div className="space-y-4">
          <Card>
            <CardContent className="pt-6 space-y-4">
              <div className="space-y-2">
                <Label>ประเภท</Label>
                <Select
                  value={type}
                  onChange={(e) => setType(e.target.value as "blog" | "csr")}
                >
                  <option value="blog">Blog</option>
                  <option value="csr">CSR Projects</option>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="slug">Slug (URL)</Label>
                <Input
                  id="slug"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="blog-post-url"
                />
                <p className="text-xs text-gray-400">/blog/{slug || "..."}</p>
              </div>
              <div className="space-y-2">
                <Label>สถานะ</Label>
                <div className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium ${isPublished ? "bg-green-50 text-green-700" : "bg-gray-100 text-gray-600"}`}>
                  {isPublished ? <Eye size={14} /> : <EyeOff size={14} />}
                  {isPublished ? "เผยแพร่แล้ว" : "Draft (ยังไม่เผยแพร่)"}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6 space-y-4">
              <div className="space-y-2">
                <Label>รูปหน้าปก</Label>
                <ImageUploader
                  bucket="post-images"
                  value={coverImageUrl}
                  onChange={setCoverImageUrl}
                  onClear={() => setCoverImageUrl("")}
                />
              </div>
              <div className="space-y-2">
                <Label>สรุปย่อ (Excerpt)</Label>
                <Textarea
                  rows={3}
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  placeholder="สรุปสั้นๆ ของบทความ..."
                />
              </div>
            </CardContent>
          </Card>

          {error && <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-md">{error}</p>}
        </div>
      </div>
    </form>
  );
}
