import Navbar from "../components/Navbar";
import HeroSection from "../components/HeroSectionServer";
import ContactHero from "../components/ContactHero";
import ContactCards from "../components/ContactCards";
import FooterServer from "../components/FooterServer";

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
      <FooterServer />
    </>
  );
}
