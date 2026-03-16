import Navbar from "../components/Navbar";
import HeroSection from "../components/HeroSection";
import OurFamilyWelcome from "../components/OurFamilyWelcome";
import OurFamilySlider from "../components/OurFamilySlider";
import OurFamilyVideos from "../components/OurFamilyVideos";
import OurFamilyGrid from "../components/OurFamilyGrid";
import Footer from "../components/Footer";

export const metadata = {
  title: "Our Family | Palm Springs",
  description: "Reviews and family stories from Palm Springs residents.",
};

export default function OurFamilyPage() {
  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <OurFamilyWelcome />
        <OurFamilySlider />
        <OurFamilyVideos />
        <OurFamilyGrid />
      </main>
      <Footer />
    </>
  );
}
