import Navbar from "../components/Navbar";
import HeroSection from "../components/HeroSection";
import AboutContent from "../components/AboutContent";
import MilestoneSection from "../components/MilestoneSection";
import AwardsSection from "../components/AwardsSection";
import Footer from "../components/Footer";

export const metadata = {
  title: "About Us | Palm Springs",
  description: "Learn about Palm Springs – our history, vision, and mission.",
};

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <AboutContent />
        <MilestoneSection />
        <AwardsSection />
      </main>
      <Footer />
    </>
  );
}
