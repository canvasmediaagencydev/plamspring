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
    <div className="min-h-screen bg-[#f5f6fa]">
      {/* Fixed sidebar */}
      <div className="fixed inset-y-0 left-0 z-20 w-60">
        <AdminSidebar />
      </div>

      {/* Main area — pl-60 reserves sidebar space */}
      <div className="flex min-h-screen flex-col pl-60">
        {/* Top bar */}
        <header className="sticky top-0 z-10 flex h-14 items-center border-b border-gray-200 bg-white px-6 shadow-sm">
          <div className="flex-1" />
          <div className="flex items-center gap-2 rounded-full bg-[#09418C]/10 px-3 py-1.5">
            <div className="h-2 w-2 rounded-full bg-green-500" />
            <span className="text-xs font-medium text-[#09418C]">{user.email}</span>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-8">
          <div className="mx-auto max-w-5xl w-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
