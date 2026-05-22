// lib/llms/site.ts
// Curated, bilingual (Thai + English) constants for the llms.txt files.
// Static-page descriptions are hand-written here; project/post entries are generated.

export const SITE_URL = "https://palmspringscm.com";

/** H1 line shared by both files. */
export const SITE_NAME = "Palm Springs (พาล์ม สปริงส์)";

/** Blockquote summary shared by both files. Sourced from site metadata. */
export const SITE_SUMMARY =
  "Palm Springs — เลือกปาล์มสปริงส์ เพื่อชีวิตที่ดีกว่า. " +
  "Palm Springs is a real-estate developer in Chiang Mai, Thailand, offering " +
  "housing projects, land services, and community living.";

/** Curated top-level pages with bilingual descriptions. */
export const STATIC_PAGES: ReadonlyArray<{ path: string; description: string }> = [
  { path: "/about", description: "เกี่ยวกับเรา / About the company and its story" },
  { path: "/our-family", description: "ครอบครัวของเรา / Our family of brands and people" },
  { path: "/projects", description: "โครงการทั้งหมด / All housing and community projects" },
  { path: "/blog", description: "บทความและข่าวสาร / Articles and news" },
  { path: "/sell-land", description: "ฝากขายที่ดิน / Submit land for sale with us" },
  { path: "/contact", description: "ติดต่อเรา / Contact information and enquiries" },
];
