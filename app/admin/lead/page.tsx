import { createClient } from "@/lib/supabase/server";
import { AdminHeader } from "@/app/components/admin/AdminHeader";
import LeadSubmissionsClient from "./LeadSubmissionsClient";

export const dynamic = "force-dynamic";

export const metadata = { title: "ข้อมูล Lead | Admin" };

export default async function AdminLeadPage() {
  const supabase = await createClient();

  const { data: submissions } = await supabase
    .from("lead_submissions")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div>
      <AdminHeader
        title="ข้อมูล Lead"
        description="รายการข้อมูล Lead ที่ส่งมาจากเว็บไซต์"
      />
      <LeadSubmissionsClient submissions={submissions ?? []} />
    </div>
  );
}
