import Image from "next/image";
import Link from "next/link";

const CARDS = [
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
    href: "#careers-form",
  },
  {
    icon: "/icon/aboutus/Frame.svg",
    label: "เสนอขายที่ดิน",
    btnText: "กรอกข้อมูล",
    href: "/contact/land",
  },
];

export default function ContactCards() {
  return (
    <section className="w-full bg-white py-12 md:py-16">
      <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 px-6 sm:grid-cols-3 md:px-12">
        {CARDS.map((card) => (
          <div
            key={card.label}
            className="flex flex-col items-center gap-6 rounded-2xl bg-primary px-8 py-10"
          >
            {/* Icon */}
            <Image
              src={card.icon}
              alt={card.label}
              width={80}
              height={80}
              className="h-20 w-20 object-contain"
            />

            {/* Label */}
            <p className="text-xl font-bold text-white md:text-2xl">{card.label}</p>

            {/* Button */}
            <Link
              href={card.href}
              className="rounded-full border-2 border-white px-8 py-2.5 text-base font-semibold text-white transition-colors hover:bg-white hover:text-primary"
            >
              {card.btnText}
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
}
