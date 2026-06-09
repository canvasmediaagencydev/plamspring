import { connectDB } from "@/lib/mongodb";
import { SiteSetting } from "@/lib/models";
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
    await connectDB();
    const doc = await SiteSetting.findOne({ key: "social_reels" }).lean();
    if (doc?.value) reels = doc.value as unknown as SocialReel[];
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
