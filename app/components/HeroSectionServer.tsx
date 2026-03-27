import { createClient } from "@/lib/supabase/server";
import HeroSection from "./HeroSection";

/**
 * Server-side wrapper that fetches hero images from site_settings
 * and passes them to the client HeroSection component.
 */
export default async function HeroSectionServer() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("site_settings")
    .select("value")
    .eq("key", "hero_images")
    .single();

  const images: string[] = Array.isArray(data?.value) ? (data.value as string[]) : [];

  return <HeroSection images={images} />;
}
