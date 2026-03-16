import Navbar from "../../components/Navbar";
import HeroSection from "../../components/HeroSection";
import LandSection from "../../components/LandSection";
import Footer from "../../components/Footer";

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
      <Footer />
    </>
  );
}
