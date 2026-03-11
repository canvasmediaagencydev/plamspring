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
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-8 py-12 md:grid-cols-3">

        {/* ── Col 1: Logo + Address ── */}
        <div className="flex flex-col gap-5">
          <Image
            src="/img/Home/footer logo.svg"
            alt="Palm Springs logo"
            width={220}
            height={60}
            className="h-auto w-52"
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
            href="#"
            className="flex w-fit items-center gap-3 rounded-full border-2 border-white/40 bg-white/10 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-white/20"
          >
            ติดต่อเรา
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#5b3fd4]">
              →
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
        <div className="flex flex-col gap-3">
          {/* Lottie beside tagline */}
          <div className="flex-col items-center gap-2">
              <p className="text-xl font-bold text-end italic leading-snug text-white">
              "เลือกปาล์มสปริงส์
              <br />
              เพื่อชีวิตที่ดีกว่า"
            </p>
            <div className="w-100 shrink-0">
              <DotLottieReact
                src="https://lottie.host/02a7a704-14af-40fb-95d1-1b2e6cfa3029/kOD28GwRIf.lottie"
                loop
                autoplay
              />
            </div>
          
          </div>
        </div>
      </div>
    </footer>
  );
}
