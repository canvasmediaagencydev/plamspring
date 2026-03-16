import Navbar from "../../components/Navbar";
import HeroSection from "../../components/HeroSection";
import LeadForm from "../../components/LeadForm";
import Footer from "../../components/Footer";

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
      <Footer />
    </>
  );
}
