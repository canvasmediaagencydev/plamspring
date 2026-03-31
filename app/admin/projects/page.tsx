import { createClient } from "@/lib/supabase/server";
import { AdminHeader } from "@/app/components/admin/AdminHeader";
import Link from "next/link";
import { ImageIcon, Pencil, Globe, EyeOff, AlertTriangle } from "lucide-react";
import NewProjectButton from "./NewProjectButton";
import { DeleteProjectButton } from "./DeleteProjectButton";

export const dynamic = "force-dynamic";

export default async function AdminProjectsPage() {
  const supabase = await createClient();
  const { data: projects } = await supabase
    .from("project_pages")
    .select("*")
    .order("sort_order");

  const list = projects ?? [];

  return (
    <div>
      <AdminHeader
        title="จัดการโครงการ"
        description={`${list.length} โครงการ · ${list.filter((p) => p.is_published).length} เผยแพร่แล้ว`}
        action={<NewProjectButton />}
      />

      {list.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-200 bg-white py-24 text-center">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-50 ring-1 ring-gray-100">
            <ImageIcon size={24} className="text-gray-300" />
          </div>
          <p className="text-sm font-semibold text-gray-500">ยังไม่มีโครงการ</p>
          <p className="mt-1 text-xs text-gray-400">คลิก &quot;เพิ่มโครงการ&quot; เพื่อสร้างหน้าโครงการใหม่</p>
          <div className="mt-6">
            <NewProjectButton />
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((project) => (
            <div
              key={project.id}
              className="group relative flex flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
            >
              {/* Hero image */}
              <div className="relative aspect-video w-full overflow-hidden bg-gray-50">
                {project.hero_image_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={project.hero_image_url}
                    alt={project.name}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center">
                    <ImageIcon size={32} className="text-gray-200" />
                  </div>
                )}

                {/* Status badge overlay */}
                <div className="absolute left-3 top-3">
                  {project.is_published ? (
                    <span className="flex items-center gap-1 rounded-full bg-emerald-500/90 px-2.5 py-1 text-[10px] font-bold text-white shadow backdrop-blur-sm">
                      <Globe size={9} />
                      เผยแพร่
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 rounded-full bg-black/40 px-2.5 py-1 text-[10px] font-bold text-white shadow backdrop-blur-sm">
                      <EyeOff size={9} />
                      ซ่อน
                    </span>
                  )}
                </div>

                {/* Edit overlay on hover */}
                <Link
                  href={`/admin/projects/${project.id}`}
                  className="absolute inset-0 flex items-center justify-center bg-black/0 opacity-0 transition-all duration-300 group-hover:bg-black/20 group-hover:opacity-100"
                >
                  <span className="flex items-center gap-2 rounded-xl bg-white/90 px-4 py-2 text-xs font-bold text-gray-800 shadow-lg backdrop-blur-sm">
                    <Pencil size={12} />
                    แก้ไขโครงการ
                  </span>
                </Link>
              </div>

              {/* Card body */}
              <div className="flex flex-1 flex-col p-4">
                <div className="flex-1">
                  <p className="truncate text-sm font-bold text-gray-900 leading-snug">
                    {project.name}
                  </p>
                  {project.subtitle && (
                    <p className="mt-0.5 truncate text-xs text-gray-400">
                      {project.subtitle}
                    </p>
                  )}
                  <div className="mt-2">
                    {project.slug ? (
                      <span className="inline-flex items-center gap-1 rounded-md bg-gray-50 px-2 py-0.5 text-[10px] font-medium text-gray-400 ring-1 ring-gray-100">
                        /projects/{project.slug}
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded-md bg-amber-50 px-2 py-0.5 text-[10px] font-medium text-amber-500 ring-1 ring-amber-100">
                        <AlertTriangle size={9} />
                        ยังไม่มี slug
                      </span>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="mt-4 flex items-center justify-between border-t border-gray-50 pt-3">
                  <DeleteProjectButton id={project.id} name={project.name} />
                  <Link
                    href={`/admin/projects/${project.id}`}
                    className="flex items-center gap-1.5 rounded-xl bg-[#09418C] px-4 py-2 text-xs font-semibold text-white shadow-sm transition-all hover:bg-[#0a52b3] hover:shadow-md"
                  >
                    <Pencil size={11} />
                    แก้ไข
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
