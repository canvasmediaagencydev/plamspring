"use client";

import { DotLottieReact } from "@lottiefiles/dotlottie-react";

export default function BlogHeader() {
  return (
    <section className="w-full bg-white py-10 md:py-14">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 md:px-12">
        {/* Left — title */}
        <div className="flex flex-col gap-1">
          <h1 className="text-4xl font-extrabold text-primary md:text-5xl">BLOG</h1>
          <p className="text-base text-primary/70 md:text-lg">บทความต่างๆ</p>
        </div>

        {/* Right — Lottie */}
        <div className="w-40 shrink-0 md:w-90">
          <DotLottieReact
            src="https://lottie.host/30a0d054-d791-4f83-932a-7a9d3aeaa107/Dbx2V1RfVt.lottie"
            loop
            autoplay
          />
        </div>
      </div>
    </section>
  );
}
