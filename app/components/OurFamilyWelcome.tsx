"use client";

import { DotLottieReact } from "@lottiefiles/dotlottie-react";

export default function OurFamilyWelcome() {
  return (
    <section className="w-full bg-white py-16 md:py-24">
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-10 px-6 md:flex-row md:items-center md:gap-16 md:px-12">
        {/* Left — text */}
        <div className="flex flex-col gap-5 md:flex-1">
          <h2 className="text-5xl font-extrabold leading-tight text-primary md:text-6xl">
            WELCOME
            <br />
            TO FAMILY
          </h2>
          <p className="max-w-sm text-base leading-relaxed text-primary/70 md:text-lg">
            ขอขอบพระคุณลูกค้า โครงการในการโอนกรรมสิทธิ์
            <br />
            และรับอบน้ำไปปัจจุบันประ หลาย...
          </p>
        </div>

        {/* Right — Lottie */}
        <div className="w-64 shrink-0 md:w-96">
          <DotLottieReact
            src="https://lottie.host/2c340b61-cfcb-4b3c-b1d4-9e21779c0eb1/fNKmzGxlt6.lottie"
            loop
            autoplay
          />
        </div>
      </div>
    </section>
  );
}
