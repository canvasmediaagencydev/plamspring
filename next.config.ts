import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // Supabase Storage CDN
      {
        protocol: "https",
        hostname: "dkdrfftuvroetapqrqbf.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
      // YouTube thumbnails (used in VideoSection and FeaturedVideoSection)
      {
        protocol: "https",
        hostname: "img.youtube.com",
      },
    ],
  },
};

export default nextConfig;
