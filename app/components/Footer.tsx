"use client";

import Image from "next/image";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import {
  FaFacebookF,
  FaInstagram,
  FaTiktok,
  FaYoutube,
  FaLine,
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
} from "react-icons/fa";

const socials = [
  { icon: FaFacebookF, href: "#", label: "Facebook" },
  { icon: FaInstagram, href: "#", label: "Instagram" },
  { icon: FaLine, href: "#", label: "Line" },
  { icon: FaTiktok, href: "#", label: "TikTok" },
  { icon: FaYoutube, href: "#", label: "YouTube" },
];

export default function Footer() {
  return (
    <footer className="w-full bg-[#1a3a8c] text-white">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-6 py-10 sm:grid-cols-2 md:grid-cols-3 md:gap-10 md:px-8 md:py-12">

        {/* ── Col 1: Logo + Address ── */}
        <div className="flex flex-col gap-4">
          <Image
            src="/img/Home/footer logo.svg"
            alt="Palm Springs logo"
            width={220}
            height={60}
            className="h-auto w-40 md:w-52"
          />

          <div className="flex items-start gap-2 text-sm leading-relaxed text-white/90">
            <FaMapMarkerAlt className="mt-0.5 shrink-0 text-white" />
            <span>
              199/1-2 หมู่ 5 ถ.มหิดล ต.หนองหอย
              <br />
              อ.เมืองเชียงใหม่ จ.เชียงใหม่ 50000
            </span>
          </div>

          <p className="text-sm text-white/80">ทุกวัน เวลา 9:00 - 18:00</p>

          <a
            href="/contact"
            className="flex w-fit items-center gap-3 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-lg ring-2 ring-white/30 transition hover:opacity-90"
          >
            ติดต่อเรา
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white">
              <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" aria-hidden="true">
                <path d="M5 12h14M13 6l6 6-6 6" stroke="#09418C" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </span>
          </a>
        </div>

        {/* ── Col 2: Contact + Social ── */}
        <div className="flex flex-col gap-6">
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-white/60">
              Contact Information
            </p>
            <div className="space-y-2.5">
              <a
                href="tel:053105000"
                className="flex items-center gap-3 text-sm text-white/90 transition hover:text-white"
              >
                <FaPhone className="shrink-0" />
                053 105 000
              </a>
              <a
                href="mailto:info@palmsprings.co.th"
                className="flex items-center gap-3 text-sm text-white/90 transition hover:text-white"
              >
                <FaEnvelope className="shrink-0" />
                info@palmsprings.co.th
              </a>
            </div>
          </div>

          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-white/60">
              Follow Us
            </p>
            <div className="flex gap-3">
              {socials.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/25"
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* ── Col 3: Lottie + Tagline + Copyright ── */}
        <div className="flex flex-col gap-3 sm:col-span-2 md:col-span-1">
          <div className="flex items-center gap-2">
            <div className="w-36 shrink-0 md:w-44">
              <DotLottieReact
                src="https://lottie.host/02a7a704-14af-40fb-95d1-1b2e6cfa3029/kOD28GwRIf.lottie"
                loop
                autoplay
              />
            </div>
            <p className="text-lg font-bold italic leading-snug text-white md:text-xl">
              &ldquo;เลือกปาล์มสปริงส์
              <br />
              เพื่อชีวิตที่ดีกว่า&rdquo;
            </p>
          </div>

          <p className="text-xs text-white/50">
            &copy; 2019 - 2023 palm springs place co., ltd. all rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
