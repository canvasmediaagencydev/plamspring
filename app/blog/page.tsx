import Navbar from "../components/Navbar";
import HeroSection from "../components/HeroSectionServer";
import BlogHeader from "../components/BlogHeader";
import BlogList from "../components/BlogList";
import Footer from "../components/Footer";
import { createClient } from "@/lib/supabase/server";

export const metadata = {
  title: "Blog | Palm Springs",
  description: "บทความต่างๆ จาก Palm Springs",
};

export default async function BlogPage() {
  const supabase = await createClient();

  const [postsRes, footerRes] = await Promise.all([
    supabase
      .from("posts")
      .select("id, title, slug, excerpt, cover_image_url")
      .eq("type", "blog")
      .eq("is_published", true)
      .order("published_at", { ascending: false }),
    supabase.from("site_settings").select("value").eq("key", "footer").single(),
  ]);

  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <BlogHeader />
        <BlogList posts={postsRes.data ?? []} />
      </main>
      <Footer settings={footerRes.data?.value as Parameters<typeof Footer>[0]["settings"]} />
    </>
  );
}
