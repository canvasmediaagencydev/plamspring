import Navbar from "../components/Navbar";
import HeroSection from "../components/HeroSection";
import BlogHeader from "../components/BlogHeader";
import BlogList from "../components/BlogList";
import Footer from "../components/Footer";

export const metadata = {
  title: "Blog | Palm Springs",
  description: "บทความต่างๆ จาก Palm Springs",
};

export default function BlogPage() {
  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <BlogHeader />
        <BlogList />
      </main>
      <Footer />
    </>
  );
}
