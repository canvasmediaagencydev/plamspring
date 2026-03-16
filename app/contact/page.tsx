import Navbar from "../components/Navbar";
import HeroSection from "../components/HeroSection";
import ContactHero from "../components/ContactHero";
import ContactCards from "../components/ContactCards";
import Footer from "../components/Footer";

export const metadata = {
  title: "Contact Us | Palm Springs",
  description: "ติดต่อเรา ร่วมงานกับเรา เสนอขายที่ดิน",
};

export default function ContactPage() {
  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <ContactHero />
        <ContactCards />
      </main>
      <Footer />
    </>
  );
}
