"use client";

import { useState } from "react";
import Image, { type ImageProps } from "next/image";

const THUMBNAIL_VARIANTS = ["maxresdefault", "hqdefault", "mqdefault", "default"] as const;

function getThumbnailUrl(videoId: string, variant: (typeof THUMBNAIL_VARIANTS)[number]) {
  return `https://img.youtube.com/vi/${videoId}/${variant}.jpg`;
}

interface YouTubeThumbnailProps extends Omit<ImageProps, "src"> {
  videoId: string;
}

export default function YouTubeThumbnail({ videoId, alt, ...props }: YouTubeThumbnailProps) {
  const [variantIndex, setVariantIndex] = useState(0);

  return (
    <Image
      {...props}
      src={getThumbnailUrl(videoId, THUMBNAIL_VARIANTS[variantIndex])}
      alt={alt}
      onError={() => {
        setVariantIndex((current) => Math.min(current + 1, THUMBNAIL_VARIANTS.length - 1));
      }}
    />
  );
}
