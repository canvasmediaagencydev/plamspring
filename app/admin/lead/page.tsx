import { connectDB } from "@/lib/mongodb";
import { LeadSubmission } from "@/lib/models";
import { AdminHeader } from "@/app/components/admin/AdminHeader";
import LeadSubmissionsClient from "./LeadSubmissionsClient";

export const dynamic = "force-dynamic";
export const metadata = { title: "ข้อมูล Lead | Admin" };

export default async function AdminLeadPage() {
  await connectDB();
  const submissions = await LeadSubmission.find().sort({ created_at: -1 }).lean();
  return (
    <div>
      <AdminHeader title="ข้อมูล Lead" description="รายการข้อมูล Lead ที่ส่งมาจากเว็บไซต์" />
      <LeadSubmissionsClient submissions={JSON.parse(JSON.stringify(submissions))} />
    </div>
  );
}
