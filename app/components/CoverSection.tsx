import Image from "next/image";

export default function CoverSection() {
  return (
    <section className="w-full">
      <Image
        src="/img/Home/plam springs cover page 1.svg"
        alt="Palm Springs cover"
        width={1920}
        height={1080}
        className="w-full"
        priority
      />
    </section>
  );
}
