import { connectDB } from "@/lib/mongodb";
import { LandInquiry } from "@/lib/models";
import { AdminHeader } from "@/app/components/admin/AdminHeader";
import LandInquiriesClient from "./LandInquiriesClient";

export const dynamic = "force-dynamic";
export const metadata = { title: "แบบฟอร์มที่ดิน | Admin" };

export default async function AdminLandInquiriesPage() {
  await connectDB();
  const inquiries = await LandInquiry.find().sort({ created_at: -1 }).lean();
  return (
    <div>
      <AdminHeader title="แบบฟอร์มที่ดิน" description="รายการแบบฟอร์มเสนอขายที่ดินที่ได้รับจากเว็บไซต์" />
      <LandInquiriesClient inquiries={JSON.parse(JSON.stringify(inquiries))} />
    </div>
  );
}
