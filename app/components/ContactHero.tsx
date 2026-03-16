/** Centered illustration placeholder — swap src for real Lottie/image when ready */
export default function ContactHero() {
  return (
    <section className="w-full bg-white py-8 md:py-12">
      <div className="mx-auto flex max-w-lg items-center justify-center px-6">
        {/* Skeleton placeholder for illustration */}
        <div className="relative h-72 w-72 overflow-hidden rounded-full bg-gray-100 md:h-80 md:w-80">
          <div className="absolute inset-0 animate-pulse bg-gradient-to-br from-gray-100 via-gray-200 to-gray-100" />
        </div>
      </div>
    </section>
  );
}
