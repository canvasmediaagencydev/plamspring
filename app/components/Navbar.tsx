"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";

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
  const expires = new Date(Date.now() + 86_400_000).toUTCString(); // 1 day
  document.cookie = `googtrans=${encodeURIComponent(value)}; expires=${expires}; path=/`;
  // Also set for root domain on production
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

// ── Detect active language from cookie ───────────────────────────────────────

function detectLang(): LangCode {
  const val = getGoogtransCookie();
  if (!val) return "th";
  if (val.includes("/en")) return "en";
  if (val.includes("/zh")) return "zh";
  return "th";
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function Navbar() {
  const [activeLang, setActiveLang] = useState<LangCode>("th");
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Sync with cookie on mount and poll for external changes
  useEffect(() => {
    setActiveLang(detectLang());
    const id = setInterval(() => setActiveLang(detectLang()), 1500);
    return () => clearInterval(id);
  }, []);

  const currentLang = LANGUAGES.find((l) => l.code === activeLang);

  function switchLanguage(lang: (typeof LANGUAGES)[number]) {
    setIsLangOpen(false);

    if (lang.code === "th") {
      deleteGoogtransCookie();
    } else {
      setGoogtransCookie(`/th/${lang.googCode}`);
    }

    setActiveLang(lang.code);

    // Reload to apply translation
    setTimeout(() => {
      window.location.href =
        window.location.pathname + "?lang=" + lang.code + "&t=" + Date.now();
    }, 100);
  }

  return (
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

        {/* Right side: lang switcher + hamburger */}
        <div className="flex items-center gap-3">
          {/* Language Switcher */}
          <div className="relative">
            <button
              onClick={() => setIsLangOpen((prev) => !prev)}
              className="flex items-center gap-1 rounded-full border border-primary px-3 py-1.5 text-sm font-semibold text-primary transition-colors hover:bg-primary hover:text-white"
            >
              <span suppressHydrationWarning>{currentLang?.label}</span>
              <svg
                className={`h-4 w-4 transition-transform ${isLangOpen ? "rotate-180" : ""}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
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
                        activeLang === lang.code
                          ? "font-semibold text-primary"
                          : "text-gray-600"
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
            className="flex h-9 w-9 flex-col items-center justify-center gap-1.5 lg:hidden"
            onClick={() => setIsMobileOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            <span
              className={`block h-0.5 w-6 bg-primary transition-all duration-300 ${
                isMobileOpen ? "translate-y-2 rotate-45" : ""
              }`}
            />
            <span
              className={`block h-0.5 w-6 bg-primary transition-all duration-300 ${
                isMobileOpen ? "opacity-0" : ""
              }`}
            />
            <span
              className={`block h-0.5 w-6 bg-primary transition-all duration-300 ${
                isMobileOpen ? "-translate-y-2 -rotate-45" : ""
              }`}
            />
          </button>
        </div>
      </div>

      {/* Mobile dropdown menu */}
      <div
        className={`overflow-hidden bg-white transition-all duration-300 lg:hidden ${
          isMobileOpen ? "max-h-96 border-t border-gray-100" : "max-h-0"
        }`}
      >
        <ul className="flex flex-col divide-y divide-gray-100 px-4">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                onClick={() => setIsMobileOpen(false)}
                className="block py-3 text-sm font-semibold tracking-wide text-primary transition-colors hover:text-blue-400"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
