import { createClient } from "@/lib/supabase/server";
import { AdminHeader } from "@/app/components/admin/AdminHeader";
import Link from "next/link";
import { ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import NewProjectButton from "./NewProjectButton";

export default async function AdminProjectsDetailPage() {
  const supabase = await createClient();
  const { data: projects } = await supabase
    .from("project_pages")
    .select("*")
    .order("sort_order");

  return (
    <div>
      <AdminHeader
        title="จัดการโครงการ"
        description="แก้ไขรายละเอียดหน้าโครงการแต่ละโปรเจกต์"
        action={<NewProjectButton />}
      />

      {(projects ?? []).length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-200 bg-white py-20 text-center">
          <p className="text-sm font-medium text-gray-500">ยังไม่มีโครงการ</p>
          <p className="mt-1 text-xs text-gray-400">คลิก &quot;เพิ่มโครงการ&quot; เพื่อสร้างหน้าโครงการใหม่</p>
          <div className="mt-4">
            <NewProjectButton />
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {(projects ?? []).map((project) => (
            <div
              key={project.id}
              className="flex items-center gap-4 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm transition-shadow hover:shadow-md"
            >
              {/* Thumbnail */}
              <div className="relative h-16 w-24 shrink-0 overflow-hidden rounded-xl bg-gray-100">
                {project.hero_image_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={project.hero_image_url}
                    alt={project.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center">
                    <ImageIcon size={20} className="text-gray-300" />
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-bold text-gray-900">{project.name}</p>
                {project.subtitle && (
                  <p className="truncate text-xs text-gray-400">{project.subtitle}</p>
                )}
                {project.slug ? (
                  <p className="mt-0.5 truncate text-[10px] text-gray-300">/projects/{project.slug}</p>
                ) : (
                  <p className="mt-0.5 text-[10px] text-amber-400">⚠ ยังไม่มี slug</p>
                )}
              </div>

              {/* Status + action */}
              <div className="flex shrink-0 flex-col items-end gap-2">
                <span
                  className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                    project.is_published
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-100 text-gray-400"
                  }`}
                >
                  {project.is_published ? "เผยแพร่" : "ซ่อน"}
                </span>
                <Link href={`/admin/projects/${project.id}`}>
                  <Button size="sm" className="h-7 gap-1 px-3 text-xs">
                    แก้ไข
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
