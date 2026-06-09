import { connectDB } from "@/lib/mongodb";
import { SiteSetting } from "@/lib/models";
import HeroSection from "./HeroSection";

/**
 * Server-side wrapper that fetches hero images from site_settings
 * and passes them to the client HeroSection component.
 *
 * Desktop and mobile images are stored under separate keys so each
 * device can use an image cropped for its aspect ratio. Mobile falls
 * back to the desktop images (handled in HeroSection) when unset.
 */
export default async function HeroSectionServer() {
  await connectDB();
  const docs = await SiteSetting.find({ key: { $in: ["hero_images", "hero_images_mobile"] } }).lean();

  const read = (key: string): string[] => {
    const value = docs.find((row) => row.key === key)?.value;
    return Array.isArray(value) ? (value as string[]) : [];
  };

  return <HeroSection images={read("hero_images")} mobileImages={read("hero_images_mobile")} />;
}
