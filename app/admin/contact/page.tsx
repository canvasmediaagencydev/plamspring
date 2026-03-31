import { createClient } from "@/lib/supabase/server";
import { AdminHeader } from "@/app/components/admin/AdminHeader";
import ContactSubmissionsClient from "./ContactSubmissionsClient";

export const dynamic = "force-dynamic";

export const metadata = { title: "ข้อมูลติดต่อ | Admin" };

export default async function AdminContactPage() {
  const supabase = await createClient();

  const { data: submissions } = await supabase
    .from("contact_submissions")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div>
      <AdminHeader
        title="ข้อมูลติดต่อ"
        description="รายการข้อมูลติดต่อที่ส่งมาจากเว็บไซต์"
      />
      <ContactSubmissionsClient submissions={submissions ?? []} />
    </div>
  );
}
