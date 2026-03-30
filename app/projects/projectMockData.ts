import type { HouseType } from "../components/ProjectHouseSlider";
import type { Facility } from "../components/ProjectFacilities";
import type { NearbyPlace } from "../components/ProjectLocation";

export interface ProjectDetail {
  slug: string;
  name: string;
  subtitle: string;
  logoText: string;
  description: string;
  highlights: string[];
  downloadUrl: string;
  houseTypes: HouseType[];
  facilities: Facility[];
  nearbyPlaces: NearbyPlace[];
  mapEmbedUrl: string;
  socialLinks: {
    facebook?: string;
    line?: string;
    youtube?: string;
    website?: string;
  };
}

export const MOCK_PROJECTS: ProjectDetail[] = [
  {
    slug: "the-urbana-plus-6",
    name: "THE URBANA+ 6",
    subtitle: "by PALM SPRINGS",
    logoText: "THE URBANA+ 6",
    description:
      "โครงการบ้าน 2 ชั้น โดดเด่นกับความลงตัวของการออกแบบ\nและการจัดสรรพื้นที่ใช้สอย บ่อสร้าง - สันกำแพง",
    highlights: [
      "บ้าน 2 ชั้น ดีไซน์โมเดิร์น",
      "พื้นที่ใช้สอยกว้างขวาง",
      "ทำเลบ่อสร้าง - สันกำแพง",
      "สิ่งอำนวยความสะดวกครบครัน",
    ],
    downloadUrl: "#",
    houseTypes: [
      {
        name: "TWIN HOUSE A",
        specs: [
          { label: "3 ห้องนอน", value: "3 ห้องน้ำ" },
          { label: "ที่จอดรถ", value: "2 คัน" },
          { label: "ที่ดินเริ่มต้น", value: "35.0 ตรว." },
          { label: "พื้นที่ใช้สอย", value: "124 ตรม." },
          { label: "บ้านตัวอย่างที่ดิน", value: "40.50 ตรว." },
        ],
      },
      {
        name: "TWIN HOUSE B",
        specs: [
          { label: "3 ห้องนอน", value: "3 ห้องน้ำ" },
          { label: "ที่จอดรถ", value: "2 คัน" },
          { label: "ที่ดินเริ่มต้น", value: "39.9 ตรว." },
          { label: "พื้นที่ใช้สอย", value: "129 ตรม." },
          { label: "บ้านตัวอย่างที่ดิน", value: "44.30 ตรว." },
        ],
      },
      {
        name: "SINGLE HOUSE C",
        specs: [
          { label: "4 ห้องนอน", value: "3 ห้องน้ำ" },
          { label: "ที่จอดรถ", value: "2 คัน" },
          { label: "ที่ดินเริ่มต้น", value: "50.0 ตรว." },
          { label: "พื้นที่ใช้สอย", value: "168 ตรม." },
          { label: "บ้านตัวอย่างที่ดิน", value: "55.20 ตรว." },
        ],
      },
    ],
    facilities: [
      { icon: "pool", label: "สระว่ายน้ำส่วนกลาง" },
      { icon: "park", label: "สวนสาธารณะ" },
      { icon: "clubhouse", label: "คลับเฮาส์" },
      { icon: "security", label: "รักษาความปลอดภัย" },
      { icon: "cctv", label: "กล้องวงจรปิด" },
      { icon: "fitness", label: "ฟิตเนส" },
    ],
    nearbyPlaces: [
      { distance: 2.5, unit: "กม.", name: "ตลาดสดสันกำแพง", category: "การเดินทาง", details: ["ถ. สันกำแพงสายเก่า", "แยกบ่อสร้าง"] },
      { distance: 2.9, unit: "กม.", name: "เทสโก้โลตัส บ่อสร้าง", category: "ไลฟ์สไตล์", details: ["บิ๊กซี ดอนจั่น", "เซ็นทรัลเฟสติวัล เชียงใหม่"] },
      { distance: 2.9, unit: "กม.", name: "รร. สันกำแพง", category: "โรงเรียน", details: ["รร. มัธยมสันกำแพง"] },
      { distance: 7.1, unit: "กม.", name: "รพ. สันกำแพง", category: "โรงพยาบาล", details: ["รพ. กรุงเทพ"] },
    ],
    mapEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15127.4!2d99.05!3d18.78!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTjCsDQ2JzQ4LjAiTiA5OcKwMDMnMDAuMCJF!5e0!3m2!1sth!2sth!4v1!5m2!1sth!2sth",
    socialLinks: {
      facebook: "#",
      line: "#",
      youtube: "#",
      website: "#",
    },
  },
  {
    slug: "the-urbana-plus-5",
    name: "THE URBANA+ 5",
    subtitle: "by PALM SPRINGS",
    logoText: "THE URBANA+ 5",
    description:
      "โครงการบ้าน 2 ชั้น สไตล์โมเดิร์นทรอปิคอล\nพร้อมพื้นที่สีเขียวรอบโครงการ ดอนแก้ว - แม่ริม",
    highlights: [
      "บ้าน 2 ชั้น สไตล์ทรอปิคอล",
      "พื้นที่สีเขียวรอบโครงการ",
      "ทำเลดอนแก้ว - แม่ริม",
      "ใกล้ห้างสรรพสินค้าชั้นนำ",
    ],
    downloadUrl: "#",
    houseTypes: [
      {
        name: "TROPICAL A",
        specs: [
          { label: "3 ห้องนอน", value: "2 ห้องน้ำ" },
          { label: "ที่จอดรถ", value: "2 คัน" },
          { label: "ที่ดินเริ่มต้น", value: "40.0 ตรว." },
          { label: "พื้นที่ใช้สอย", value: "135 ตรม." },
          { label: "บ้านตัวอย่างที่ดิน", value: "45.00 ตรว." },
        ],
      },
      {
        name: "TROPICAL B",
        specs: [
          { label: "4 ห้องนอน", value: "3 ห้องน้ำ" },
          { label: "ที่จอดรถ", value: "2 คัน" },
          { label: "ที่ดินเริ่มต้น", value: "52.0 ตรว." },
          { label: "พื้นที่ใช้สอย", value: "175 ตรม." },
          { label: "บ้านตัวอย่างที่ดิน", value: "58.50 ตรว." },
        ],
      },
    ],
    facilities: [
      { icon: "pool", label: "สระว่ายน้ำส่วนกลาง" },
      { icon: "park", label: "สวนสาธารณะ" },
      { icon: "clubhouse", label: "คลับเฮาส์" },
      { icon: "security", label: "รักษาความปลอดภัย" },
      { icon: "cctv", label: "กล้องวงจรปิด" },
      { icon: "fitness", label: "ฟิตเนส" },
    ],
    nearbyPlaces: [
      { distance: 3.2, unit: "กม.", name: "เซ็นทรัล เชียงใหม่", category: "ไลฟ์สไตล์", details: ["เมญ่า", "พรอมเมนาดา"] },
      { distance: 4.0, unit: "กม.", name: "ตลาดดอนแก้ว", category: "การเดินทาง", details: ["ถ. เชียงใหม่-ฝาง"] },
      { distance: 5.5, unit: "กม.", name: "รร. ปรินส์รอแยลส์", category: "โรงเรียน", details: ["รร. มงฟอร์ต"] },
      { distance: 6.0, unit: "กม.", name: "รพ. นครพิงค์", category: "โรงพยาบาล", details: ["รพ. เชียงใหม่ราม"] },
    ],
    mapEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15125.5!2d98.95!3d18.85!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTjCsDUxJzAwLjAiTiA5OMKwNTcnMDAuMCJF!5e0!3m2!1sth!2sth!4v1!5m2!1sth!2sth",
    socialLinks: {
      facebook: "#",
      line: "#",
      youtube: "#",
    },
  },
  {
    slug: "baan-tarakeree-2",
    name: "บ้านตระการี 2",
    subtitle: "by PALM SPRINGS",
    logoText: "BAAN TARAKEREE 2",
    description:
      "บ้านเดี่ยว 2 ชั้น ดีไซน์ร่วมสมัย\nโอบล้อมด้วยธรรมชาติ สันทราย - แม่โจ้",
    highlights: [
      "บ้านเดี่ยว 2 ชั้น",
      "ดีไซน์ร่วมสมัย Contemporary",
      "ทำเลสันทราย - แม่โจ้",
      "ใกล้มหาวิทยาลัยแม่โจ้",
    ],
    downloadUrl: "#",
    houseTypes: [
      {
        name: "CONTEMPORARY A",
        specs: [
          { label: "3 ห้องนอน", value: "2 ห้องน้ำ" },
          { label: "ที่จอดรถ", value: "2 คัน" },
          { label: "ที่ดินเริ่มต้น", value: "50.0 ตรว." },
          { label: "พื้นที่ใช้สอย", value: "145 ตรม." },
          { label: "บ้านตัวอย่างที่ดิน", value: "55.00 ตรว." },
        ],
      },
      {
        name: "CONTEMPORARY B",
        specs: [
          { label: "4 ห้องนอน", value: "3 ห้องน้ำ" },
          { label: "ที่จอดรถ", value: "2 คัน" },
          { label: "ที่ดินเริ่มต้น", value: "60.0 ตรว." },
          { label: "พื้นที่ใช้สอย", value: "190 ตรม." },
          { label: "บ้านตัวอย่างที่ดิน", value: "65.00 ตรว." },
        ],
      },
    ],
    facilities: [
      { icon: "pool", label: "สระว่ายน้ำส่วนกลาง" },
      { icon: "park", label: "สวนสาธารณะ" },
      { icon: "clubhouse", label: "คลับเฮาส์" },
      { icon: "security", label: "รักษาความปลอดภัย" },
      { icon: "cctv", label: "กล้องวงจรปิด" },
      { icon: "fitness", label: "ฟิตเนส" },
    ],
    nearbyPlaces: [
      { distance: 1.5, unit: "กม.", name: "ม. แม่โจ้", category: "การเดินทาง", details: ["ถ. สันทราย-แม่โจ้"] },
      { distance: 3.0, unit: "กม.", name: "ตลาดสันทราย", category: "ไลฟ์สไตล์", details: ["แม็คโคร สันทราย"] },
      { distance: 2.5, unit: "กม.", name: "รร. สันทรายวิทยาคม", category: "โรงเรียน", details: ["รร. สันทราย"] },
      { distance: 5.0, unit: "กม.", name: "รพ. สันทราย", category: "โรงพยาบาล", details: ["รพ. ศูนย์เชียงใหม่"] },
    ],
    mapEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15124.0!2d98.97!3d18.89!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTjCsDUzJzI0LjAiTiA5OMKwNTgnMTIuMCJF!5e0!3m2!1sth!2sth!4v1!5m2!1sth!2sth",
    socialLinks: {
      facebook: "#",
      line: "#",
    },
  },
  {
    slug: "palm-village",
    name: "PALM VILLAGE",
    subtitle: "by PALM SPRINGS",
    logoText: "PALM VILLAGE",
    description:
      "โครงการทาวน์โฮม 2 ชั้น ราคาเริ่มต้นที่คุณเอื้อมถึง\nพร้อมสิ่งอำนวยความสะดวกครบครัน หนองหอย - เชียงใหม่",
    highlights: [
      "ทาวน์โฮม 2 ชั้น",
      "ราคาเริ่มต้นคุ้มค่า",
      "ทำเลหนองหอย - เชียงใหม่",
      "เดินทางสะดวกใกล้เมือง",
    ],
    downloadUrl: "#",
    houseTypes: [
      {
        name: "TOWNHOME A",
        specs: [
          { label: "2 ห้องนอน", value: "2 ห้องน้ำ" },
          { label: "ที่จอดรถ", value: "1 คัน" },
          { label: "ที่ดินเริ่มต้น", value: "18.0 ตรว." },
          { label: "พื้นที่ใช้สอย", value: "85 ตรม." },
          { label: "บ้านตัวอย่างที่ดิน", value: "20.00 ตรว." },
        ],
      },
      {
        name: "TOWNHOME B",
        specs: [
          { label: "3 ห้องนอน", value: "2 ห้องน้ำ" },
          { label: "ที่จอดรถ", value: "1 คัน" },
          { label: "ที่ดินเริ่มต้น", value: "21.0 ตรว." },
          { label: "พื้นที่ใช้สอย", value: "110 ตรม." },
          { label: "บ้านตัวอย่างที่ดิน", value: "23.50 ตรว." },
        ],
      },
    ],
    facilities: [
      { icon: "pool", label: "สระว่ายน้ำส่วนกลาง" },
      { icon: "park", label: "สวนสาธารณะ" },
      { icon: "clubhouse", label: "คลับเฮาส์" },
      { icon: "security", label: "รักษาความปลอดภัย" },
      { icon: "cctv", label: "กล้องวงจรปิด" },
      { icon: "fitness", label: "ฟิตเนส" },
    ],
    nearbyPlaces: [
      { distance: 2.0, unit: "กม.", name: "เซ็นทรัลเฟสติวัล", category: "ไลฟ์สไตล์", details: ["กาดสวนแก้ว", "พันธุ์ทิพย์"] },
      { distance: 1.8, unit: "กม.", name: "ตลาดหนองหอย", category: "การเดินทาง", details: ["ถ. มหิดล"] },
      { distance: 3.5, unit: "กม.", name: "รร. มงฟอร์ต", category: "โรงเรียน", details: ["รร. ปรินส์ฯ"] },
      { distance: 4.0, unit: "กม.", name: "รพ. มหาราช", category: "โรงพยาบาล", details: ["รพ. เชียงใหม่ราม"] },
    ],
    mapEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15127.8!2d98.99!3d18.77!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTjCsDQ2JzEyLjAiTiA5OMKwNTknMjQuMCJF!5e0!3m2!1sth!2sth!4v1!5m2!1sth!2sth",
    socialLinks: {
      facebook: "#",
      line: "#",
    },
  },
];

export function getProjectBySlug(slug: string): ProjectDetail | undefined {
  return MOCK_PROJECTS.find((p) => p.slug === slug);
}
