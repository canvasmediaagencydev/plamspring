import { createClient } from "@/lib/supabase/server";
import HomeCommunityReels from "./HomeCommunityReels";

type Platform = "tiktok" | "youtube" | "instagram";

interface SocialReel {
  hashtag: string;
  label: string;
  video_url: string;
  thumbnail_url: string;
  platform: Platform;
}

const DEFAULT_REELS: SocialReel[] = [
  { hashtag: "#PALMSPRINGS", label: "STORY", video_url: "", thumbnail_url: "", platform: "tiktok" },
  { hashtag: "#PALMSPRINGS", label: "LIFESTYLE", video_url: "", thumbnail_url: "", platform: "tiktok" },
  { hashtag: "#PALMSPRINGS", label: "COMMUNITY", video_url: "", thumbnail_url: "", platform: "youtube" },
  { hashtag: "#PALMSPRINGS", label: "PET FRIENDLY", video_url: "", thumbnail_url: "", platform: "instagram" },
];

export default async function HomeCommunitySection() {
  let reels: SocialReel[] = DEFAULT_REELS;
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("site_settings")
      .select("value")
      .eq("key", "social_reels")
      .single();
    if (data?.value) reels = data.value as unknown as SocialReel[];
  } catch {
    // use defaults
  }

  return (
    <section className="w-full bg-white py-10 md:py-14">
      <div className="mx-auto max-w-5xl px-6 md:px-12">

        {/* ── Social / Reel cards row ── */}
        <HomeCommunityReels reels={reels} />

      </div>
    </section>
  );
}
