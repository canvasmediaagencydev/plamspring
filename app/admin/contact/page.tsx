import { connectDB } from "@/lib/mongodb";
import { ContactSubmission } from "@/lib/models";
import { AdminHeader } from "@/app/components/admin/AdminHeader";
import ContactSubmissionsClient from "./ContactSubmissionsClient";

export const dynamic = "force-dynamic";
export const metadata = { title: "ข้อมูลติดต่อ | Admin" };

export default async function AdminContactPage() {
  await connectDB();
  const submissions = await ContactSubmission.find().sort({ created_at: -1 }).lean();
  return (
    <div>
      <AdminHeader title="ข้อมูลติดต่อ" description="รายการข้อมูลติดต่อที่ส่งมาจากเว็บไซต์" />
      <ContactSubmissionsClient submissions={JSON.parse(JSON.stringify(submissions))} />
    </div>
  );
}
