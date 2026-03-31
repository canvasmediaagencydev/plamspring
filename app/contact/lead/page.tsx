import Navbar from "../../components/Navbar";
import HeroSection from "../../components/HeroSectionServer";
import LeadForm from "../../components/LeadForm";
import FooterServer from "../../components/FooterServer";

export const metadata = {
  title: "ติดต่อเรา | Palm Springs",
  description: "กรอกข้อมูลสอบถามและนัดชมโครงการ Palm Springs",
};

export default function LeadPage() {
  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <LeadForm />
      </main>
      <FooterServer />
    </>
  );
}
