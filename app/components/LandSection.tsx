import Image from "next/image";
import Link from "next/link";

export default function LandSection() {
  return (
    <section className="relative w-full overflow-hidden my-16 md:my-20">
      {/* Background image */}
      <Image
        src="/img/contactuscover.svg"
        alt="รับซื้อที่ดิน"
        width={1440}
        height={700}
        className="h-[500px] w-full object-cover md:h-[640px]"
        priority
      />

      {/* Gradient overlay — darker at bottom for depth */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary/30 via-primary/55 to-primary/80" />

      {/* Content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-6 px-6 text-center">
        {/* Decorative top line */}
        <div className="flex items-center gap-4">
          <div className="h-px w-12 bg-white/60 md:w-20" />
          <span className="text-xs font-semibold uppercase tracking-[0.3em] text-white/70">
            Palm Springs
          </span>
          <div className="h-px w-12 bg-white/60 md:w-20" />
        </div>

        {/* Main heading */}
        <h1 className="text-5xl font-extrabold leading-tight text-white drop-shadow-lg md:text-7xl">
          รับซื้อที่ดิน
        </h1>

        {/* Subtitle */}
        <p className="max-w-md text-sm leading-relaxed text-white/85 md:text-base">
          ติดต่อเสนอขายที่ดินให้กับอรสิรินได้
          <br />
          โดยการกรอกแบบฟอร์มออนไลน์
        </p>

        {/* CTA Button */}
        <Link
          href="#"
          className="group mt-2 flex items-center gap-3 rounded-full border-2 border-white bg-white/10 px-8 py-3.5 text-sm font-bold tracking-wide text-white backdrop-blur-sm transition-all duration-300 hover:bg-white hover:text-primary"
        >
          กรอกข้อมูลผ่าน GOOGLE FORMS
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-primary transition-all duration-300 group-hover:bg-primary group-hover:text-white">
            <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
              <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            </svg>
          </span>
        </Link>
      </div>
    </section>
  );
}
