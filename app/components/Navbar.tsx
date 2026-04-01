"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";

const NAV_LINKS = [
  { label: "HOME", href: "/" },
  { label: "ABOUT US", href: "/about" },
  { label: "PROJECTS", href: "/projects" },
  { label: "OUR FAMILY", href: "/our-family" },
  { label: "BLOG", href: "/blog" },
  { label: "CONTACT US", href: "/contact" },
];

type LangCode = "th" | "en" | "zh";

const LANGUAGES: { code: LangCode; label: string; googCode: string }[] = [
  { code: "th", label: "ไทย", googCode: "th" },
  { code: "en", label: "ENG", googCode: "en" },
  { code: "zh", label: "繁體", googCode: "zh-TW" },
];

// ── Cookie helpers ────────────────────────────────────────────────────────────

function getGoogtransCookie(): string | null {
  if (typeof document === "undefined") return null;
  for (const part of document.cookie.split(";")) {
    const [k, v] = part.trim().split("=");
    if (k === "googtrans") return decodeURIComponent(v ?? "");
  }
  return null;
}

function setGoogtransCookie(value: string) {
  const expires = new Date(Date.now() + 86_400_000).toUTCString();
  document.cookie = `googtrans=${encodeURIComponent(value)}; expires=${expires}; path=/`;
  const hostname = window.location.hostname;
  if (hostname !== "localhost") {
    const root = hostname.split(".").slice(-2).join(".");
    document.cookie = `googtrans=${encodeURIComponent(value)}; expires=${expires}; path=/; domain=.${root}`;
  }
}

function deleteGoogtransCookie() {
  const past = "Thu, 01 Jan 1970 00:00:00 UTC";
  const paths = ["/", ""];
  const hostname = window.location.hostname;
  const domains = ["", hostname, `.${hostname}`];
  if (hostname !== "localhost") {
    const root = hostname.split(".").slice(-2).join(".");
    domains.push(`.${root}`);
  }
  for (const path of paths) {
    for (const domain of domains) {
      let c = `googtrans=; expires=${past}`;
      if (path) c += `; path=${path}`;
      if (domain) c += `; domain=${domain}`;
      document.cookie = c;
    }
  }
}

function detectLang(): LangCode {
  // localStorage is the source of truth — persists across Google Translate cookie changes
  if (typeof localStorage !== "undefined") {
    const saved = localStorage.getItem("palm_lang") as LangCode | null;
    if (saved && ["th", "en", "zh"].includes(saved)) return saved;
  }
  // Fallback: read from cookie
  const val = getGoogtransCookie();
  if (!val) return "th";
  if (val.includes("/en")) return "en";
  if (val.includes("/zh")) return "zh";
  return "th";
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function Navbar() {
  const pathname = usePathname();
  const [activeLang, setActiveLang] = useState<LangCode>("th");
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  useEffect(() => {
    setActiveLang(detectLang());
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = isMobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isMobileOpen]);

  const currentLang = LANGUAGES.find((l) => l.code === activeLang);

  function switchLanguage(lang: (typeof LANGUAGES)[number]) {
    setIsLangOpen(false);
    if (lang.code === "th") {
      deleteGoogtransCookie();
      localStorage.removeItem("palm_lang");
    } else {
      setGoogtransCookie(`/th/${lang.googCode}`);
      localStorage.setItem("palm_lang", lang.code);
    }
    setActiveLang(lang.code);
    setTimeout(() => {
      window.location.href =
        window.location.pathname + "?lang=" + lang.code + "&t=" + Date.now();
    }, 100);
  }

  return (
    <>
      <nav className="fixed left-0 right-0 top-0 z-50 bg-white shadow-sm">
        <div className="mx-auto flex h-16 items-center justify-between px-4 md:h-20 md:px-10">
          {/* Logo */}
          <Link href="/" className="shrink-0">
            <Image
              src="/img/logo.svg"
              alt="Palm Springs Logo"
              width={172}
              height={53}
              priority
              className="h-8 w-auto md:h-12"
            />
          </Link>

          {/* Desktop nav links */}
          <ul className="hidden items-center gap-8 text-sm font-semibold tracking-wide text-primary lg:flex xl:gap-12">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="transition-colors hover:text-blue-400">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* Right side: lang switcher (desktop only) + hamburger */}
          <div className="flex items-center gap-3">
            {/* Language Switcher — desktop only */}
            <div className="relative hidden lg:block">
              <button
                onClick={() => setIsLangOpen((prev) => !prev)}
                className="flex items-center gap-1 rounded-full border border-primary px-3 py-1.5 text-sm font-semibold text-primary transition-colors hover:bg-primary hover:text-white"
              >
                <span suppressHydrationWarning>{currentLang?.label}</span>
                <svg
                  className={`h-4 w-4 transition-transform ${isLangOpen ? "rotate-180" : ""}`}
                  fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {isLangOpen && (
                <ul className="absolute right-0 mt-1 w-28 rounded-md bg-white py-1 shadow-lg ring-1 ring-black/10">
                  {LANGUAGES.map((lang) => (
                    <li key={lang.code}>
                      <button
                        onClick={() => switchLanguage(lang)}
                        className={`w-full px-4 py-2 text-left text-sm transition-colors hover:bg-gray-50 ${
                          activeLang === lang.code ? "font-semibold text-primary" : "text-gray-600"
                        }`}
                      >
                        {lang.label}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Hamburger — mobile only */}
            <button
              className="relative flex h-10 w-10 flex-col items-center justify-center gap-1.5 lg:hidden"
              onClick={() => setIsMobileOpen((v) => !v)}
              aria-label="Toggle menu"
            >
              <span className={`block h-0.5 w-6 bg-primary transition-all duration-300 ${isMobileOpen ? "translate-y-2 rotate-45" : ""}`} />
              <span className={`block h-0.5 w-6 bg-primary transition-all duration-300 ${isMobileOpen ? "opacity-0" : ""}`} />
              <span className={`block h-0.5 w-6 bg-primary transition-all duration-300 ${isMobileOpen ? "-translate-y-2 -rotate-45" : ""}`} />
            </button>
          </div>
        </div>
      </nav>

      {/* ── Mobile Full-Screen Drawer ── */}
      {/* Backdrop */}
      <div
        onClick={() => setIsMobileOpen(false)}
        className={`fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm transition-opacity duration-300 lg:hidden ${
          isMobileOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      />

      {/* Drawer panel — slides from right */}
      <div
        className={`fixed bottom-0 right-0 top-0 z-[70] w-full max-w-sm bg-[#09418C] transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] lg:hidden ${
          isMobileOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Decorative circles */}
    

        <div className="relative flex h-full flex-col px-8 pt-6 pb-10">
          {/* Top row: logo + close */}
          <div className="flex items-center justify-between">
            <Image
              src="/img/Home/footer logo.svg"
              alt="Palm Springs"
              width={140}
              height={40}
              className="h-auto w-32"
            />
            <button
              onClick={() => setIsMobileOpen(false)}
              aria-label="ปิดเมนู"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Divider */}
          <div className="mt-8 h-px w-full bg-white/15" />

          {/* Nav links */}
          <ul className="mt-6 flex flex-1 flex-col gap-1">
            {NAV_LINKS.map((link, i) => {
              const isActive = pathname === link.href;
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={() => setIsMobileOpen(false)}
                    className={`group flex items-center justify-between rounded-xl px-4 py-4 transition-all duration-200 ${
                      isActive
                        ? "bg-white/15 text-white"
                        : "text-white/70 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    <span className="text-lg font-bold tracking-wide">
                      {link.label}
                    </span>
                    <svg
                      className={`h-4 w-4 transition-transform duration-200 group-hover:translate-x-1 ${isActive ? "opacity-100" : "opacity-0 group-hover:opacity-60"}`}
                      fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* Bottom: language switcher */}
          <div className="mt-4 border-t border-white/15 pt-6">
            <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-white/40">
              Language
            </p>
            <div className="flex gap-2">
              {LANGUAGES.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => switchLanguage(lang)}
                  className={`rounded-full px-4 py-2 text-sm font-semibold transition-all duration-200 ${
                    activeLang === lang.code
                      ? "bg-white text-primary"
                      : "bg-white/10 text-white/70 hover:bg-white/20 hover:text-white"
                  }`}
                >
                  {lang.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
