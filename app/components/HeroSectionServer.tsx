import { createClient } from "@/lib/supabase/server";
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
  const supabase = await createClient();
  const { data } = await supabase
    .from("site_settings")
    .select("key, value")
    .in("key", ["hero_images", "hero_images_mobile"]);

  const read = (key: string): string[] => {
    const value = data?.find((row) => row.key === key)?.value;
    return Array.isArray(value) ? (value as string[]) : [];
  };

  return <HeroSection images={read("hero_images")} mobileImages={read("hero_images_mobile")} />;
}
