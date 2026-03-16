import Navbar from "../../components/Navbar";
import HeroSection from "../../components/HeroSection";
import ContactForm from "../../components/ContactForm";
import ContactMap from "../../components/ContactMap";
import Footer from "../../components/Footer";

export const metadata = {
  title: "ติดต่อเรา | Palm Springs",
  description: "กรอกข้อมูลติดต่อ Palm Springs",
};

export default function ContactFormPage() {
  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <ContactForm />
        <ContactMap />
      </main>
      <Footer />
    </>
  );
}
