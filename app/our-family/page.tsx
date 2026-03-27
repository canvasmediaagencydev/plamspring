import Navbar from "../components/Navbar";
import HeroSection from "../components/HeroSectionServer";
import OurFamilyWelcome from "../components/OurFamilyWelcome";
import OurFamilySlider from "../components/OurFamilySlider";
import OurFamilyVideos from "../components/OurFamilyVideos";
import OurFamilyGrid from "../components/OurFamilyGrid";
import Footer from "../components/Footer";
import { createClient } from "@/lib/supabase/server";

export const metadata = {
  title: "Our Family | Palm Springs",
  description: "Reviews and family stories from Palm Springs residents.",
};

export default async function OurFamilyPage() {
  const supabase = await createClient();

  const [settingsRes, sliderImagesRes, gridImagesRes] = await Promise.all([
    supabase.from("site_settings").select("key, value").in("key", ["our_family_videos", "footer"]),
    supabase.from("our_family_images").select("*").eq("section", "slider").order("sort_order"),
    supabase.from("our_family_images").select("*").eq("section", "grid").order("sort_order"),
  ]);

  const settings = settingsRes.data ?? [];
  const familyVideos = settings.find((s) => s.key === "our_family_videos")?.value as { video1?: { youtube_url?: string; title?: string }; video2?: { youtube_url?: string; title?: string } } | undefined;
  const footerSettings = settings.find((s) => s.key === "footer")?.value;

  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <OurFamilyWelcome />
        <OurFamilySlider images={sliderImagesRes.data ?? []} />
        <OurFamilyVideos
          video1={familyVideos?.video1}
          video2={familyVideos?.video2}
        />
        <OurFamilyGrid images={gridImagesRes.data ?? []} />
      </main>
      <Footer settings={footerSettings as Parameters<typeof Footer>[0]["settings"]} />
    </>
  );
}
