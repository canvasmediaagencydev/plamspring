import { createClient } from "@/lib/supabase/server";
import { AdminHeader } from "@/app/components/admin/AdminHeader";
import LandInquiriesClient from "./LandInquiriesClient";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "แบบฟอร์มที่ดิน | Admin",
};

export default async function AdminLandInquiriesPage() {
  const supabase = await createClient();

  const { data: inquiries } = await supabase
    .from("land_inquiries")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div>
      <AdminHeader
        title="แบบฟอร์มที่ดิน"
        description="รายการแบบฟอร์มเสนอขายที่ดินที่ได้รับจากเว็บไซต์"
      />
      <LandInquiriesClient inquiries={inquiries ?? []} />
    </div>
  );
}
