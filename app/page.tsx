import Navbar from "./components/Navbar";
import HeroSection from "./components/HeroSectionServer";
import VideoSection from "./components/VideoSection";
import HomeTypeSection from "./components/HomeTypeSection";
import CoverSection from "./components/CoverSection";
import LifestyleSlider from "./components/LifestyleSlider";
import FeaturedVideoSection from "./components/FeaturedVideoSection";
import LoanCalculator from "./components/LoanCalculator";
import Footer from "./components/Footer";
import { createClient } from "@/lib/supabase/server";

export default async function Home() {
  const supabase = await createClient();

  const [settingsRes, projectsRes, lifestyleRes] = await Promise.all([
    supabase.from("site_settings").select("key, value"),
    supabase.from("projects").select("*").eq("is_published", true).order("sort_order"),
    supabase.from("lifestyle_slides").select("*").eq("is_published", true).order("sort_order"),
  ]);

  const settings = settingsRes.data ?? [];
  const getSetting = (key: string) => settings.find((s) => s.key === key)?.value as Record<string, unknown> | undefined;

  const homeVideosSetting = getSetting("home_videos") as { video1?: { youtube_url?: string; title?: string }; video2?: { youtube_url?: string; title?: string } } | undefined;
  const featuredVideoSetting = getSetting("featured_video") as { youtube_url?: string; title?: string } | undefined;
  const footerSetting = getSetting("footer");

  // Map to component-expected shape
  const homeVideos = [
    homeVideosSetting?.video1,
    homeVideosSetting?.video2,
  ]
    .filter((v) => v?.youtube_url)
    .map((v, i) => ({
      id: String(i + 1),
      title: v!.title ?? "",
      youtubeId: extractYouTubeId(v!.youtube_url!),
    }));

  const featuredVideo =
    featuredVideoSetting?.youtube_url
      ? {
          youtubeId: extractYouTubeId(featuredVideoSetting.youtube_url),
          title: featuredVideoSetting.title ?? "",
        }
      : null;

  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <VideoSection videos={homeVideos} />
        <HomeTypeSection projects={projectsRes.data ?? []} />
        <CoverSection />
        <LifestyleSlider slides={lifestyleRes.data ?? []} />
        <FeaturedVideoSection video={featuredVideo} />
        <LoanCalculator />
      </main>
      <Footer settings={footerSetting as Parameters<typeof Footer>[0]["settings"]} />
    </>
  );
}

/** Extract YouTube video ID from a full URL or bare ID string. */
function extractYouTubeId(input: string): string {
  const patterns = [
    /[?&]v=([^&#]+)/,
    /youtu\.be\/([^?&#]+)/,
    /youtube\.com\/embed\/([^?&#]+)/,
    /youtube\.com\/shorts\/([^?&#]+)/,
  ];
  for (const pattern of patterns) {
    const match = input.match(pattern);
    if (match) return match[1];
  }
  return input.trim(); // assume it's already an ID
}
