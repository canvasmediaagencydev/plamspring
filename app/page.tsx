import Navbar from "./components/Navbar";
import HeroSection from "./components/HeroSection";
import VideoSection from "./components/VideoSection";
import HomeTypeSection from "./components/HomeTypeSection";
import CoverSection from "./components/CoverSection";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <VideoSection />
        <HomeTypeSection />
        <CoverSection />
      </main>
    </>
  );
}
