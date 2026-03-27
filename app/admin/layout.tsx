import { createClient } from "@/lib/supabase/server";
import { AdminSidebar } from "@/app/components/admin/AdminSidebar";

export const metadata = {
  title: "Admin | Palm Springs CMS",
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8f9fa] to-[#eef2f6]">
      {/* Fixed sidebar */}
      <div className="fixed inset-y-0 left-0 z-20 w-60">
        <AdminSidebar />
      </div>

      {/* Main area — pl-60 reserves sidebar space */}
      <div className="flex min-h-screen flex-col pl-60">
        {/* Top bar (Glassmorphism) */}
        <header className="sticky top-0 z-10 flex h-16 items-center border-b border-gray-200/50 bg-white/70 backdrop-blur-md px-8 shadow-[0_2px_12px_rgba(0,0,0,0.03)]">
          <div className="flex-1" />
          <div className="flex items-center gap-2.5 rounded-full bg-white px-3.5 py-1.5 shadow-sm border border-gray-100">
            <div className="relative flex h-2.5 w-2.5 items-center justify-center">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500"></span>
            </div>
            <span className="text-[13px] font-semibold text-[#09418C]">{user.email}</span>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-8">
          <div className="mx-auto max-w-6xl w-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
