interface FamilyImage {
  id: string;
  image_url: string;
  alt_text: string | null;
}

interface OurFamilyGridProps {
  images?: FamilyImage[];
}

const SKELETON_COUNT = 6;

/** 3×N photo grid for Our Family review/testimonial photos */
export default function OurFamilyGrid({ images = [] }: OurFamilyGridProps) {
  const displayImages = images.length > 0 ? images : null;

  return (
    <section className="w-full bg-white py-6 pb-12 md:py-10 md:pb-16">
      <div className="mx-auto grid max-w-4xl grid-cols-3 gap-2 px-6 md:gap-3 md:px-12">
        {displayImages
          ? displayImages.map((img) => (
              <div key={img.id} className="relative aspect-square w-full overflow-hidden rounded-lg">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={img.image_url}
                  alt={img.alt_text ?? ""}
                  className="h-full w-full object-cover"
                />
              </div>
            ))
          : Array.from({ length: SKELETON_COUNT }).map((_, i) => (
              <div key={i} className="relative aspect-square w-full overflow-hidden rounded-lg bg-gray-200">
                <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200" />
              </div>
            ))}
      </div>
    </section>
  );
}
