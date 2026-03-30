"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Dialog } from "@/components/ui/dialog";

type LinkCard = {
  icon: string;
  label: string;
  btnText: string;
  href: string;
};

type ActionCard = {
  icon: string;
  label: string;
  btnText: string;
  action: "careers";
};

const CARDS: Array<LinkCard | ActionCard> = [
  {
    icon: "/icon/aboutus/Group.svg",
    label: "ติดต่อเรา",
    btnText: "กรอกข้อมูล",
    href: "/contact/form",
  },
  {
    icon: "/icon/aboutus/_x31_.svg",
    label: "ร่วมงานกับเรา",
    btnText: "สมัครงาน",
    action: "careers" as const,
  },
  {
    icon: "/icon/aboutus/Frame.svg",
    label: "เสนอขายที่ดิน",
    btnText: "กรอกข้อมูล",
    href: "/contact/land",
  },
];

export default function ContactCards() {
  const [isCareersOpen, setIsCareersOpen] = useState(false);

  return (
    <section className="w-full bg-white py-12 md:py-16">
      <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 px-6 sm:grid-cols-3 md:px-12">
        {CARDS.map((card) => (
          <div
            key={card.label}
            className="flex flex-col items-center gap-6 rounded-2xl bg-primary px-8 py-10 shadow-[0_8px_18px_rgba(9,65,140,0.18)]"
          >
            <Image
              src={card.icon}
              alt={card.label}
              width={80}
              height={80}
              className="h-20 w-20 object-contain"
            />

            <p className="text-center text-xl font-bold text-white md:text-2xl">{card.label}</p>

            {"href" in card ? (
              <Link
                href={card.href}
                className="rounded-full border-2 border-white px-8 py-2.5 text-base font-semibold text-white transition-colors hover:bg-white hover:text-primary"
              >
                {card.btnText}
              </Link>
            ) : (
              <button
                type="button"
                onClick={() => setIsCareersOpen(true)}
                className="cursor-pointer rounded-full border-2 border-white px-8 py-2.5 text-base font-semibold text-white transition-colors hover:bg-white hover:text-primary"
              >
                {card.btnText}
              </button>
            )}
          </div>
        ))}
      </div>

      <Dialog
        open={isCareersOpen}
        onClose={() => setIsCareersOpen(false)}
        title="ร่วมงานกับเรา"
        description="อัปเดตสถานะการเปิดรับสมัคร"
        size="sm"
      >
        <div className="space-y-3 text-center">
          <p className="text-lg font-semibold text-gray-900">ยังไม่เปิดรับสมัคร</p>
          <p className="text-sm leading-6 text-gray-500">
            หากมีตำแหน่งงานเปิดรับ ทีมงานจะประกาศผ่านช่องทางของบริษัทอีกครั้ง
          </p>
        </div>
      </Dialog>
    </section>
  );
}
