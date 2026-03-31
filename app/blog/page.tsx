import Navbar from "../components/Navbar";
import HeroSection from "../components/HeroSectionServer";
import BlogHeader from "../components/BlogHeader";
import BlogList from "../components/BlogList";
import FooterServer from "../components/FooterServer";
import { createClient } from "@/lib/supabase/server";

export const metadata = {
  title: "Blog | Palm Springs",
  description: "บทความต่างๆ จาก Palm Springs",
};

export default async function BlogPage() {
  const supabase = await createClient();

  const { data: posts } = await supabase
    .from("posts")
    .select("id, title, slug, excerpt, cover_image_url")
    .eq("type", "blog")
    .eq("is_published", true)
    .order("published_at", { ascending: false });

  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <BlogHeader />
        <BlogList posts={posts ?? []} />
      </main>
      <FooterServer />
    </>
  );
}
