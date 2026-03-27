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
  LayoutDashboard,
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
    label: "Dashboard",
    href: "/admin/dashboard",
    icon: <LayoutDashboard size={16} />,
  },
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
    <aside className="flex h-full w-60 flex-col border-r border-gray-100 bg-white/80 backdrop-blur-xl shadow-[4px_0_24px_rgba(0,0,0,0.02)]">
      {/* Logo */}
      <div className="flex items-center gap-3 border-b border-gray-100/50 px-6 py-5">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#09418C] to-[#0a52b3] text-white shadow-[0_4px_10px_rgba(9,65,140,0.3)]">
          <span className="text-sm font-black tracking-wider">PS</span>
        </div>
        <div>
          <div className="text-[15px] font-black tracking-tight text-[#09418C]">Palm Springs</div>
          <div className="text-[10px] font-medium tracking-wide text-gray-400 uppercase">CMS Admin Panel</div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-4 py-5 scrollbar-hide">
        <div className="space-y-1">
          {NAV_ITEMS.map((item) => {
            const isExpanded = expanded.includes(item.label);

            if (item.children) {
              const isActive = item.children.some((c) => pathname.startsWith(c.href));
              return (
                <div key={item.label}>
                  <button
                    onClick={() => toggleExpanded(item.label)}
                    className={cn(
                      "group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-semibold transition-all duration-300",
                      isActive
                        ? "bg-[#09418C]/10 text-[#09418C] shadow-sm"
                        : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                    )}
                  >
                    <span className={cn("shrink-0 transition-colors duration-300", isActive ? "text-[#09418C]" : "text-gray-400 group-hover:text-gray-600")}>
                      {item.icon}
                    </span>
                    <span className="flex-1 text-left">{item.label}</span>
                    <span className={cn("transition-transform duration-300", isExpanded ? "rotate-180" : "")}>
                      <ChevronDown size={14} className={isActive ? "text-[#09418C]" : "text-gray-300 group-hover:text-gray-500"} />
                    </span>
                  </button>
                  <div
                    className={cn(
                      "grid transition-all duration-300 ease-in-out",
                      isExpanded ? "grid-rows-[1fr] opacity-100 mt-1 mb-2" : "grid-rows-[0fr] opacity-0"
                    )}
                  >
                    <div className="overflow-hidden">
                      <div className="ml-4 space-y-1 border-l-2 border-gray-100 pl-3 py-1">
                        {item.children.map((child) => {
                          const isChildActive = pathname.startsWith(child.href);
                          return (
                            <Link
                              key={child.href}
                              href={child.href}
                              className={cn(
                                "block rounded-lg px-3 py-2 text-xs font-medium transition-all duration-300 relative",
                                isChildActive
                                  ? "bg-white text-[#09418C] shadow-sm ring-1 ring-gray-100/50"
                                  : "text-gray-500 hover:bg-gray-50 hover:text-gray-800"
                              )}
                            >
                              {isChildActive && (
                                <span className="absolute -left-[14px] top-1/2 h-1.5 w-1.5 -translate-y-1/2 rounded-full bg-[#09418C]"></span>
                              )}
                              {child.label}
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              );
            }

            const isActive = pathname.startsWith(item.href!);
            return (
              <Link
                key={item.label}
                href={item.href!}
                className={cn(
                  "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-semibold transition-all duration-300 relative overflow-hidden",
                  isActive
                    ? "bg-[#09418C]/10 text-[#09418C] shadow-sm"
                    : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                )}
              >
                {isActive && (
                  <span className="absolute left-0 top-0 h-full w-1 bg-[#09418C] rounded-r-full"></span>
                )}
                <span className={cn("shrink-0 transition-colors duration-300", isActive ? "text-[#09418C]" : "text-gray-400 group-hover:text-gray-600")}>
                  {item.icon}
                </span>
                {item.label}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Footer */}
      <div className="space-y-1.5 border-t border-gray-100/50 px-4 py-4 bg-gray-50/50">
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 rounded-xl px-3 py-2 text-xs font-semibold text-gray-400 transition-all duration-300 hover:bg-white hover:text-gray-700 hover:shadow-sm ring-1 ring-transparent hover:ring-gray-100"
        >
          <ExternalLink size={14} />
          ดูเว็บไซต์
        </a>
        <button
          onClick={handleLogout}
          className="group flex w-full items-center gap-3 rounded-xl px-3 py-2 text-xs font-semibold text-gray-400 transition-all duration-300 hover:bg-red-50 hover:text-red-600"
        >
          <LogOut size={14} className="group-hover:text-red-500 transition-colors" />
          ออกจากระบบ
        </button>
      </div>
    </aside>
  );
}
