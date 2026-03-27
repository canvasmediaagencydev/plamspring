"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import {
  Home,
  FileText,
  Users,
  Settings,
  LogOut,
  ChevronDown,
  ChevronRight,
  BookOpen,
  ExternalLink,
} from "lucide-react";
import { useState } from "react";

interface NavItem {
  label: string;
  href?: string;
  icon: React.ReactNode;
  children?: { label: string; href: string }[];
}

const NAV_ITEMS: NavItem[] = [
  {
    label: "หน้าแรก",
    icon: <Home size={16} />,
    children: [
      { label: "Hero Slideshow", href: "/admin/home/hero" },
      { label: "วิดีโอ", href: "/admin/home/videos" },
      { label: "โครงการของเรา", href: "/admin/home/projects" },
      { label: "ทำเลศักยภาพ", href: "/admin/home/lifestyle" },
    ],
  },
  {
    label: "About Us",
    icon: <BookOpen size={16} />,
    children: [
      { label: "History / Vision / Mission", href: "/admin/about/content" },
      { label: "Milestones", href: "/admin/about/milestones" },
      { label: "Awards", href: "/admin/about/awards" },
    ],
  },
  {
    label: "Our Family",
    href: "/admin/our-family",
    icon: <Users size={16} />,
  },
  {
    label: "Blog & CSR",
    href: "/admin/posts",
    icon: <FileText size={16} />,
  },
  {
    label: "Footer & Contact",
    href: "/admin/footer",
    icon: <Settings size={16} />,
  },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [expanded, setExpanded] = useState<string[]>(["หน้าแรก", "About Us"]);

  const toggleExpanded = (label: string) => {
    setExpanded((prev) =>
      prev.includes(label) ? prev.filter((l) => l !== label) : [...prev, label]
    );
  };

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/admin/login");
  };

  return (
    <aside className="flex h-full w-60 flex-col border-r border-gray-200 bg-white">
      {/* Logo */}
      <div className="flex items-center gap-2.5 border-b border-gray-100 px-5 py-4">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#09418C] text-white">
          <span className="text-xs font-bold">PS</span>
        </div>
        <div>
          <div className="text-sm font-bold text-[#09418C]">Palm Springs</div>
          <div className="text-[10px] text-gray-400">CMS Admin Panel</div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-3">
        <div className="space-y-0.5">
          {NAV_ITEMS.map((item) => {
            const isExpanded = expanded.includes(item.label);

            if (item.children) {
              const isActive = item.children.some((c) => pathname.startsWith(c.href));
              return (
                <div key={item.label}>
                  <button
                    onClick={() => toggleExpanded(item.label)}
                    className={cn(
                      "flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                      isActive ? "bg-[#09418C]/8 text-[#09418C]" : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                    )}
                  >
                    <span className={cn("shrink-0", isActive ? "text-[#09418C]" : "text-gray-400")}>
                      {item.icon}
                    </span>
                    <span className="flex-1 text-left">{item.label}</span>
                    <span className="text-gray-300">
                      {isExpanded ? <ChevronDown size={13} /> : <ChevronRight size={13} />}
                    </span>
                  </button>
                  {isExpanded && (
                    <div className="ml-4 mt-0.5 space-y-0.5 border-l border-gray-100 pl-3">
                      {item.children.map((child) => {
                        const isChildActive = pathname.startsWith(child.href);
                        return (
                          <Link
                            key={child.href}
                            href={child.href}
                            className={cn(
                              "block rounded-md px-3 py-1.5 text-xs transition-colors",
                              isChildActive
                                ? "bg-[#09418C] text-white font-medium"
                                : "text-gray-500 hover:bg-gray-100 hover:text-gray-800"
                            )}
                          >
                            {child.label}
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            }

            const isActive = pathname.startsWith(item.href!);
            return (
              <Link
                key={item.label}
                href={item.href!}
                className={cn(
                  "flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  isActive ? "bg-[#09418C]/8 text-[#09418C]" : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                )}
              >
                <span className={cn("shrink-0", isActive ? "text-[#09418C]" : "text-gray-400")}>
                  {item.icon}
                </span>
                {item.label}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Footer */}
      <div className="space-y-1 border-t border-gray-100 px-3 py-3">
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
        >
          <ExternalLink size={14} />
          ดูเว็บไซต์
        </a>
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-xs text-gray-400 transition-colors hover:bg-red-50 hover:text-red-500"
        >
          <LogOut size={14} />
          ออกจากระบบ
        </button>
      </div>
    </aside>
  );
}
