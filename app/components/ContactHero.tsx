import Image from "next/image";

export default function ContactHero() {
  return (
    <section className="w-full bg-white py-8 md:py-12">
      <div className="mx-auto flex max-w-lg items-center justify-center px-6">
        <div className="relative h-72 w-72 overflow-hidden rounded-full bg-[#F7FBFC] md:h-80 md:w-80">
          <Image
            src="/image 19.png"
            alt="ภาพประกอบหน้าติดต่อเรา"
            fill
            priority
            className="object-cover"
          />
        </div>
      </div>
    </section>
  );
}
