import Navbar from "./components/Navbar";
import HeroSection from "./components/HeroSection";
import VideoSection from "./components/VideoSection";
import HomeTypeSection from "./components/HomeTypeSection";
import CoverSection from "./components/CoverSection";
import LifestyleSlider from "./components/LifestyleSlider";
import FeaturedVideoSection from "./components/FeaturedVideoSection";
import LoanCalculator from "./components/LoanCalculator";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <VideoSection />
        <HomeTypeSection />
        <CoverSection />
        <LifestyleSlider />
        <FeaturedVideoSection />
        <LoanCalculator />
      </main>
    </>
  );
}
