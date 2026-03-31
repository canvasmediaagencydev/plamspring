import Navbar from "../../components/Navbar";
import HeroSection from "../../components/HeroSectionServer";
import LandSection from "../../components/LandSection";
import FooterServer from "../../components/FooterServer";

export const metadata = {
  title: "เสนอขายที่ดิน | Palm Springs",
  description: "ติดต่อเสนอขายที่ดินให้กับ Palm Springs",
};

export default function LandPage() {
  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <LandSection />
      </main>
      <FooterServer />
    </>
  );
}
