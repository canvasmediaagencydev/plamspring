"use client";

import { useState } from "react";
import { FaFacebookMessenger, FaLine, FaCommentDots, FaTimes } from "react-icons/fa";

interface StickyContactProps {
  facebookMessengerUrl?: string;
  lineUrl?: string;
}

export default function StickyContact({
  facebookMessengerUrl = "https://m.me/palmsprings",
  lineUrl = "https://line.me/ti/p/~@palmsprings",
}: StickyContactProps) {
  const [open, setOpen] = useState(false);

  const contacts = [
    {
      icon: FaLine,
      label: "Line",
      href: lineUrl,
      bg: "bg-[#06C755]",
      hoverBg: "hover:bg-[#05b34c]",
    },
    {
      icon: FaFacebookMessenger,
      label: "Facebook Messenger",
      href: facebookMessengerUrl,
      bg: "bg-[#0084FF]",
      hoverBg: "hover:bg-[#0073e0]",
    },
  ];

  return (
    <div className="fixed bottom-6 right-5 z-50 flex flex-col items-center gap-3">
      {/* Expandable contact options */}
      <div
        className={`flex flex-col items-center gap-3 transition-all duration-300 ${
          open
            ? "pointer-events-auto translate-y-0 opacity-100"
            : "pointer-events-none translate-y-4 opacity-0"
        }`}
        aria-hidden={!open}
      >
        {contacts.map(({ icon: Icon, label, href, bg, hoverBg }) => (
          <a
            key={label}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={label}
            className={`flex h-12 w-12 items-center justify-center rounded-full shadow-lg transition-transform duration-200 hover:scale-110 ${bg} ${hoverBg} text-white`}
          >
            <Icon size={22} />
          </a>
        ))}
      </div>

      {/* Toggle button */}
      <button
        onClick={() => setOpen((prev) => !prev)}
        aria-label={open ? "ปิดช่องทางติดต่อ" : "เปิดช่องทางติดต่อ"}
        aria-expanded={open}
        className="flex h-14 w-14 items-center justify-center rounded-full bg-[#09418C] text-white shadow-xl transition-all duration-300 hover:scale-105 hover:bg-[#072f6b] active:scale-95"
      >
        <span className="relative flex h-6 w-6 items-center justify-center">
          <FaCommentDots
            size={24}
            className={`absolute transition-all duration-300 ${open ? "rotate-90 scale-0 opacity-0" : "rotate-0 scale-100 opacity-100"}`}
          />
          <FaTimes
            size={22}
            className={`absolute transition-all duration-300 ${open ? "rotate-0 scale-100 opacity-100" : "-rotate-90 scale-0 opacity-0"}`}
          />
        </span>
      </button>
    </div>
  );
}
