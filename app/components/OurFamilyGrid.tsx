/** 3×2 skeleton photo grid for review/family photos */
export default function OurFamilyGrid() {
  return (
    <section className="w-full bg-white py-6 pb-12 md:py-10 md:pb-16">
      <div className="mx-auto grid max-w-4xl grid-cols-3 gap-2 px-6 md:gap-3 md:px-12">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="relative aspect-square w-full overflow-hidden rounded-lg bg-gray-200"
          >
            <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200" />
          </div>
        ))}
      </div>
    </section>
  );
}
