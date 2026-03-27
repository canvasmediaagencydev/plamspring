import Navbar from "../components/Navbar";
import HeroSection from "../components/HeroSectionServer";
import AboutContent from "../components/AboutContent";
import MilestoneSection from "../components/MilestoneSection";
import AwardsSection from "../components/AwardsSection";
import Footer from "../components/Footer";
import { createClient } from "@/lib/supabase/server";

export const metadata = {
  title: "About Us | Palm Springs",
  description: "Learn about Palm Springs – our history, vision, and mission.",
};

export default async function AboutPage() {
  const supabase = await createClient();

  const [milestonesRes, awardsRes, csrPostsRes, footerRes, aboutRes] = await Promise.all([
    supabase.from("milestones").select("*").order("sort_order"),
    supabase.from("awards").select("*").eq("is_published", true).order("sort_order"),
    supabase.from("posts").select("id, title, slug, cover_image_url, excerpt").eq("type", "csr").eq("is_published", true).order("published_at", { ascending: false }),
    supabase.from("site_settings").select("value").eq("key", "footer").single(),
    supabase.from("site_settings").select("value").eq("key", "about_content").single(),
  ]);

  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <AboutContent data={aboutRes.data?.value as Parameters<typeof AboutContent>[0]["data"]} />
        <MilestoneSection milestones={milestonesRes.data ?? []} />
        <AwardsSection
          awards={awardsRes.data ?? []}
          csrPosts={csrPostsRes.data ?? []}
        />
      </main>
      <Footer settings={footerRes.data?.value as Parameters<typeof Footer>[0]["settings"]} />
    </>
  );
}
