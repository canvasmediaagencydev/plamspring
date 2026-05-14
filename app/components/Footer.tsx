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

export interface FooterSettings {
  company_name?: string;
  address?: string;
  hours?: string;
  phone?: string;
  email?: string;
  facebook_url?: string;
  instagram_url?: string;
  line_url?: string;
  tiktok_url?: string;
  youtube_url?: string;
  map_url?: string;
}

interface FooterProps {
  settings?: FooterSettings;
}

const DEFAULT_SETTINGS: FooterSettings = {
  company_name: "Palm Springs",
  address: "199/1-2 หมู่ 5 ถ.มหิดล ต.หนองหอย\nอ.เมืองเชียงใหม่ จ.เชียงใหม่ 50000",
  hours: "ทุกวัน เวลา 9:00 - 18:00",
  phone: "053 105 000",
  email: "info@palmsprings.co.th",
  facebook_url: "#",
  instagram_url: "#",
  line_url: "#",
  tiktok_url: "#",
  youtube_url: "#",
};

export default function Footer({ settings }: FooterProps) {
  const s = { ...DEFAULT_SETTINGS, ...settings };

  const socials = [
    { icon: FaFacebookF, href: s.facebook_url || "#", label: "Facebook" },
    { icon: FaInstagram, href: s.instagram_url || "#", label: "Instagram" },
    { icon: FaLine, href: s.line_url || "#", label: "Line" },
    { icon: FaTiktok, href: s.tiktok_url || "#", label: "TikTok" },
    { icon: FaYoutube, href: s.youtube_url || "#", label: "YouTube" },
  ];

  return (
    <footer className="w-full bg-[#1a3a8c] text-white">

      {/* ── Mobile Layout (< md) ── */}
      <div className="md:hidden flex flex-col items-center gap-0 px-6 pt-10 pb-6">

        {/* Logo */}
        <Image
          src="/img/Home/footer logo.svg"
          alt="Palm Springs logo"
          width={220}
          height={60}
          className="h-auto w-36"
        />

        {/* Address */}
        {s.address && (
          <div className="mt-5 flex items-start gap-2 text-sm leading-relaxed text-white/80 text-center justify-center">
            <FaMapMarkerAlt className="mt-0.5 shrink-0 text-white/60" />
            <span style={{ whiteSpace: "pre-line" }}>{s.address}</span>
          </div>
        )}

        {/* Hours */}
        {s.hours && (
          <p className="mt-1.5 text-sm text-white/60">{s.hours}</p>
        )}

        {/* CTA Button */}
        <a
          href="/contact/form"
          className="mt-5 flex items-center gap-3 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-lg ring-2 ring-white/30 transition hover:opacity-90"
        >
          ติดต่อเรา
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white">
            <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" aria-hidden="true">
              <path d="M5 12h14M13 6l6 6-6 6" stroke="#09418C" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </span>
        </a>

        {/* Divider */}
        <div className="mt-7 w-full border-t border-white/15" />

        {/* Contact Info */}
        <div className="mt-6 flex flex-col items-center gap-3">
          {s.phone && (
            <a
              href={`tel:${s.phone.replace(/\s/g, "")}`}
              className="flex items-center gap-3 text-sm text-white/90 transition hover:text-white"
            >
              <FaPhone className="shrink-0 text-white/60" />
              {s.phone}
            </a>
          )}
          {s.email && (
            <a
              href={`mailto:${s.email}`}
              className="flex items-center gap-3 text-sm text-white/90 transition hover:text-white"
            >
              <FaEnvelope className="shrink-0 text-white/60" />
              {s.email}
            </a>
          )}
        </div>

        {/* Social Icons — min 44×44px touch targets */}
        <div className="mt-6 flex gap-2">
          {socials.map(({ icon: Icon, href, label }) => (
            <a
              key={label}
              href={href}
              aria-label={label}
              className="flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/25 active:scale-95"
            >
              <Icon size={18} />
            </a>
          ))}
        </div>

        {/* Tagline */}
        <p className="mt-7 text-center text-base font-bold italic leading-snug text-white">
          &ldquo;เลือกปาล์มสปริงส์<br />เพื่อชีวิตที่ดีกว่า&rdquo;
        </p>

        {/* Lottie — smaller on mobile */}
        <div className="w-48 mt-2">
          <DotLottieReact
            src="https://lottie.host/02a7a704-14af-40fb-95d1-1b2e6cfa3029/kOD28GwRIf.lottie"
            loop
            autoplay
          />
        </div>

        {/* Copyright */}
        <p className="mt-2 text-center text-xs text-white/40">
          &copy; 2019 - 2023 palm springs place co., ltd. all rights reserved.
        </p>
      </div>

      {/* ── Desktop Layout (md+) ── */}
      <div className="hidden md:grid mx-auto max-w-7xl grid-cols-3 gap-10 px-8 py-12">

        {/* Col 1: Logo + Address */}
        <div className="flex flex-col gap-4">
          <Image
            src="/img/Home/footer logo.svg"
            alt="Palm Springs logo"
            width={220}
            height={60}
            className="h-auto w-52"
          />

          {s.address && (
            <div className="flex items-start gap-2 text-sm leading-relaxed text-white/90">
              <FaMapMarkerAlt className="mt-0.5 shrink-0 text-white" />
              <span style={{ whiteSpace: "pre-line" }}>{s.address}</span>
            </div>
          )}

          {s.hours && <p className="text-sm text-white/80">{s.hours}</p>}

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

        {/* Col 2: Contact + Social */}
        <div className="flex flex-col gap-6">
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-white/60">
              Contact Information
            </p>
            <div className="space-y-2.5">
              {s.phone && (
                <a
                  href={`tel:${s.phone.replace(/\s/g, "")}`}
                  className="flex items-center gap-3 text-sm text-white/90 transition hover:text-white"
                >
                  <FaPhone className="shrink-0" />
                  {s.phone}
                </a>
              )}
              {s.email && (
                <a
                  href={`mailto:${s.email}`}
                  className="flex items-center gap-3 text-sm text-white/90 transition hover:text-white"
                >
                  <FaEnvelope className="shrink-0" />
                  {s.email}
                </a>
              )}
            </div>
          </div>

          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-white/60">
              Follow Us
            </p>
            <div className="flex gap-2.5">
              {socials.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/25"
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Col 3: Lottie + Tagline + Copyright */}
        <div className="relative">
          <p className="absolute right-0 top-0 z-10 text-right text-xl font-bold italic leading-snug text-white">
            &ldquo;เลือกปาล์มสปริงส์<br />เพื่อชีวิตที่ดีกว่า&rdquo;
          </p>
          <DotLottieReact
            src="https://lottie.host/02a7a704-14af-40fb-95d1-1b2e6cfa3029/kOD28GwRIf.lottie"
            loop
            autoplay
          />
          <p className="mt-1 text-xs text-white/50">
            &copy; 2019 - 2023 palm springs place co., ltd. all rights reserved.
          </p>
        </div>
      </div>

    </footer>
  );
}
