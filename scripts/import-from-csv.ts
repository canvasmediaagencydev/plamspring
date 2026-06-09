#!/usr/bin/env node
/**
 * scripts/import-from-csv.ts
 *
 * Reads Supabase CSV exports from scripts/*_rows.csv,
 * re-uploads all Supabase Storage images → Cloudflare R2,
 * and upserts everything into MongoDB Atlas.
 *
 * Run:
 *   npx tsx scripts/import-from-csv.ts
 */

import * as dns from "dns";
import * as fs from "fs";
import * as path from "path";
import * as https from "https";
import * as http from "http";
import { parse } from "csv-parse/sync";

dns.setDefaultResultOrder("ipv4first");

// ─── Load .env.local ──────────────────────────────────────────────────────────

const envPath = path.resolve(process.cwd(), ".env.local");
if (fs.existsSync(envPath)) {
  for (const line of fs.readFileSync(envPath, "utf-8").split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    let val = trimmed.slice(eq + 1).trim();
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1);
    }
    if (!process.env[key]) process.env[key] = val;
  }
}

import mongoose from "mongoose";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

// ─── R2 Client ────────────────────────────────────────────────────────────────

const r2 = new S3Client({
  region: "auto",
  endpoint: process.env.R2_ENDPOINT!,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
});
const R2_BUCKET = process.env.R2_BUCKET!;
const R2_PUBLIC_URL = process.env.R2_PUBLIC_URL!;
const SUPABASE_PREFIX = "https://dkdrfftuvroetapqrqbf.supabase.co/storage/v1/object/public/";

// ─── URL helpers ──────────────────────────────────────────────────────────────

const urlCache = new Map<string, string>();

function fetchBuffer(url: string): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const mod = url.startsWith("https") ? https : http;
    mod.get(url, (res) => {
      if (res.statusCode !== 200) { reject(new Error(`HTTP ${res.statusCode}`)); return; }
      const chunks: Buffer[] = [];
      res.on("data", (c: Buffer) => chunks.push(c));
      res.on("end", () => resolve(Buffer.concat(chunks)));
      res.on("error", reject);
    }).on("error", reject);
  });
}

function contentType(url: string): string {
  const ext = url.split("?")[0].split(".").pop()?.toLowerCase() ?? "";
  return ({ jpg: "image/jpeg", jpeg: "image/jpeg", png: "image/png", gif: "image/gif",
            webp: "image/webp", svg: "image/svg+xml", pdf: "application/pdf",
            mp4: "video/mp4", mov: "video/quicktime" } as Record<string, string>)[ext]
         ?? "application/octet-stream";
}

async function toR2(url: string): Promise<string> {
  if (!url || !url.startsWith(SUPABASE_PREFIX)) return url;
  if (urlCache.has(url)) return urlCache.get(url)!;
  const key = url.replace(SUPABASE_PREFIX, "");
  try {
    const buf = await fetchBuffer(url);
    await r2.send(new PutObjectCommand({ Bucket: R2_BUCKET, Key: key, Body: buf, ContentType: contentType(url) }));
    const r2url = `${R2_PUBLIC_URL}/${key}`;
    urlCache.set(url, r2url);
    process.stdout.write("↑");
    return r2url;
  } catch (e) {
    process.stdout.write("✗");
    return url; // keep original on failure
  }
}

async function walkUrls(v: unknown): Promise<unknown> {
  if (typeof v === "string") return toR2(v);
  if (Array.isArray(v)) return Promise.all(v.map(walkUrls));
  if (v && typeof v === "object") {
    const out: Record<string, unknown> = {};
    for (const [k, val] of Object.entries(v as Record<string, unknown>)) out[k] = await walkUrls(val);
    return out;
  }
  return v;
}

// ─── CSV helpers ──────────────────────────────────────────────────────────────

const CSV_DIR = path.resolve(process.cwd(), "scripts");

function readCsv(filename: string): Record<string, string>[] {
  const file = path.join(CSV_DIR, filename);
  if (!fs.existsSync(file)) { console.warn(`  ⚠ file not found: ${filename}`); return []; }
  return parse(fs.readFileSync(file, "utf-8"), { columns: true, skip_empty_lines: true, relax_quotes: true });
}

/** Try parsing a string as JSON; return original string on failure */
function tryJson(s: string): unknown {
  if (!s || s === "" || s === "null") return null;
  try { return JSON.parse(s); } catch { return s; }
}

/** Parse PostgreSQL array literal like {a,b,c} or JSON array */
function parseArray(s: string): string[] {
  if (!s || s === "" || s === "null") return [];
  if (s.startsWith("[")) { try { return JSON.parse(s); } catch { return []; } }
  if (s.startsWith("{")) return s.slice(1, -1).split(",").map(x => x.trim()).filter(Boolean);
  return [];
}

function toBool(s: string): boolean { return s === "true" || s === "t" || s === "1"; }
function toNum(s: string): number | null { const n = parseFloat(s); return isNaN(n) ? null : n; }
function toStr(s: string): string | null { return s === "" || s === "null" ? null : s; }

// ─── MongoDB Models ───────────────────────────────────────────────────────────

const { Schema, model, models } = mongoose;
const sid = () => ({ type: String, default: () => crypto.randomUUID() });
const s = (req = false) => ({ type: String, default: req ? undefined : null });
const Md = (n: string, sc: mongoose.Schema) => models[n] || model(n, sc);

const AwardModel       = Md("Award",             new Schema({ _id: sid(), image_url: s(), description: s(), is_published: { type: Boolean }, sort_order: { type: Number } }, { timestamps: { createdAt: "created_at", updatedAt: "updated_at" }, _id: false }));
const ClickModel       = Md("ContactClick",       new Schema({ _id: sid(), type: s(true), clicked_at: s() }, { _id: false }));
const ContactModel     = Md("ContactSubmission",  new Schema({ _id: sid(), name: s(true), email: s(true), phone: s(true), message: s(), status: s(), created_at: s() }, { _id: false }));
const LeadModel        = Md("LeadSubmission",     new Schema({ _id: sid(), name: s(true), email: s(true), phone: s(true), line_id: s(), budget: s(), detail: s(), visit_date: s(), visit_time: s(), status: s(), created_at: s() }, { _id: false }));
const LandModel        = Md("LandInquiry",        new Schema({ _id: sid(), first_name: s(true), last_name: s(true), phone: s(true), email: s(), province: s(), district: s(), land_address: s(), area_rai: { type: Number, default: null }, area_ngan: { type: Number, default: null }, area_wa: { type: Number, default: null }, asking_price: { type: Number, default: null }, title_deed_type: s(), images: { type: [String], default: [] }, pdf_url: s(), notes: s(), status: s(), created_at: s() }, { _id: false }));
const LifestyleModel   = Md("LifestyleSlide",     new Schema({ _id: sid(), house_image_url: s(), lifestyle_image_url: s(), tags: { type: [String], default: [] }, is_published: { type: Boolean }, sort_order: { type: Number } }, { timestamps: { createdAt: "created_at", updatedAt: "updated_at" }, _id: false }));
const MilestoneModel   = Md("Milestone",          new Schema({ _id: sid(), title: s(true), year: s(true), description: s(), image_url: s(), sort_order: { type: Number } }, { timestamps: { createdAt: "created_at", updatedAt: "updated_at" }, _id: false }));
const FamilyModel      = Md("OurFamilyImage",     new Schema({ _id: sid(), image_url: s(), alt_text: s(), section: s(true), sort_order: { type: Number } }, { timestamps: { createdAt: "created_at", updatedAt: "updated_at" }, _id: false }));
const PostModel        = Md("Post",               new Schema({ _id: sid(), title: s(true), slug: { type: String, required: true }, content: s(), excerpt: s(), cover_image_url: s(), type: s(true), is_published: { type: Boolean }, published_at: s() }, { timestamps: { createdAt: "created_at", updatedAt: "updated_at" }, _id: false }));
const ProjPageModel    = Md("ProjectPage",        new Schema({ _id: sid(), name: s(true), slug: s(), description: s(), subtitle: s(), hero_image_url: s(), gallery_images: { type: Schema.Types.Mixed, default: [] }, highlights: { type: Schema.Types.Mixed, default: [] }, facilities: { type: Schema.Types.Mixed, default: [] }, facility_image_1: s(), facility_image_2: s(), house_types: { type: Schema.Types.Mixed, default: [] }, nearby_places: { type: Schema.Types.Mixed, default: [] }, map_embed_url: s(), map_image_url: s(), brochure_url: s(), facebook_url: s(), line_url: s(), website_url: s(), youtube_url: s(), is_published: { type: Boolean }, sort_order: { type: Number } }, { timestamps: { createdAt: "created_at", updatedAt: "updated_at" }, _id: false }));
const ProjectModel     = Md("Project",            new Schema({ _id: sid(), name: s(true), subtitle: s(), image_url: s(), logo_url: s(), linked_project_page_id: s(), is_published: { type: Boolean }, sort_order: { type: Number } }, { timestamps: { createdAt: "created_at", updatedAt: "updated_at" }, _id: false }));
const SettingModel     = Md("SiteSetting",        new Schema({ key: { type: String, required: true, unique: true }, value: { type: Schema.Types.Mixed }, updated_at: s() }));

// ─── Table importers ──────────────────────────────────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function upsert(Model: any, filter: Record<string, unknown>, doc: Record<string, unknown>) {
  await Model.findOneAndUpdate(filter, { $set: doc }, { upsert: true, new: true, setDefaultsOnInsert: true });
}

async function importAwards() {
  const rows = readCsv("awards_rows.csv");
  for (const r of rows) {
    const doc = { _id: r.id, image_url: await toR2(r.image_url), description: toStr(r.description), is_published: toBool(r.is_published), sort_order: toNum(r.sort_order) ?? 0 };
    await upsert(AwardModel, { _id: r.id }, doc);
    process.stdout.write(".");
  }
}

async function importContactClicks() {
  const rows = readCsv("contact_clicks_rows.csv");
  for (const r of rows) {
    await upsert(ClickModel, { _id: r.id }, { _id: r.id, type: r.type, clicked_at: toStr(r.clicked_at) });
    process.stdout.write(".");
  }
}

async function importContactSubmissions() {
  const rows = readCsv("contact_submissions_rows.csv");
  for (const r of rows) {
    await upsert(ContactModel, { _id: r.id }, { _id: r.id, name: r.name, email: r.email, phone: r.phone, message: toStr(r.message), status: r.status || "new", created_at: toStr(r.created_at) });
    process.stdout.write(".");
  }
}

async function importLeadSubmissions() {
  const rows = readCsv("lead_submissions_rows.csv");
  for (const r of rows) {
    await upsert(LeadModel, { _id: r.id }, { _id: r.id, name: r.name, email: r.email, phone: r.phone, line_id: toStr(r.line_id), budget: toStr(r.budget), detail: toStr(r.detail), visit_date: toStr(r.visit_date), visit_time: toStr(r.visit_time), status: r.status || "new", created_at: toStr(r.created_at) });
    process.stdout.write(".");
  }
}

async function importLandInquiries() {
  const rows = readCsv("land_inquiries_rows.csv");
  for (const r of rows) {
    const images = await Promise.all(parseArray(r.images).map(toR2));
    const pdf_url = await toR2(r.pdf_url);
    await upsert(LandModel, { _id: r.id }, { _id: r.id, first_name: r.first_name, last_name: r.last_name, phone: r.phone, email: toStr(r.email), province: toStr(r.province), district: toStr(r.district), land_address: toStr(r.land_address), area_rai: toNum(r.area_rai), area_ngan: toNum(r.area_ngan), area_wa: toNum(r.area_wa), asking_price: toNum(r.asking_price), title_deed_type: toStr(r.title_deed_type), images, pdf_url, notes: toStr(r.notes), status: r.status || "new", created_at: toStr(r.created_at) });
    process.stdout.write(".");
  }
}

async function importLifestyleSlides() {
  const rows = readCsv("lifestyle_slides_rows.csv");
  for (const r of rows) {
    await upsert(LifestyleModel, { _id: r.id }, { _id: r.id, house_image_url: await toR2(r.house_image_url), lifestyle_image_url: await toR2(r.lifestyle_image_url), tags: parseArray(r.tags), is_published: toBool(r.is_published), sort_order: toNum(r.sort_order) ?? 0 });
    process.stdout.write(".");
  }
}

async function importMilestones() {
  const rows = readCsv("milestones_rows.csv");
  for (const r of rows) {
    await upsert(MilestoneModel, { _id: r.id }, { _id: r.id, title: r.title, year: r.year, description: toStr(r.description), image_url: await toR2(r.image_url), sort_order: toNum(r.sort_order) ?? 0 });
    process.stdout.write(".");
  }
}

async function importOurFamilyImages() {
  const rows = readCsv("our_family_images_rows.csv");
  for (const r of rows) {
    await upsert(FamilyModel, { _id: r.id }, { _id: r.id, image_url: await toR2(r.image_url), alt_text: toStr(r.alt_text), section: r.section, sort_order: toNum(r.sort_order) ?? 0 });
    process.stdout.write(".");
  }
}

async function importPosts() {
  const rows = readCsv("posts_rows.csv");
  for (const r of rows) {
    const content = await walkUrls(r.content) as string;
    const cover = await toR2(r.cover_image_url);
    await upsert(PostModel, { _id: r.id }, { _id: r.id, title: r.title, slug: r.slug, content: content || "", excerpt: toStr(r.excerpt), cover_image_url: cover, type: r.type, is_published: toBool(r.is_published), published_at: toStr(r.published_at) });
    process.stdout.write(".");
  }
}

async function importProjectPages() {
  const rows = readCsv("project_pages_rows.csv");
  for (const r of rows) {
    const jsonFields = ["highlights", "house_types", "facilities", "nearby_places", "gallery_images"] as const;
    const parsed: Record<string, unknown> = {};
    for (const f of jsonFields) {
      const raw = tryJson(r[f]);
      parsed[f] = await walkUrls(raw) ?? [];
    }
    await upsert(ProjPageModel, { _id: r.id }, {
      _id: r.id, name: r.name, slug: toStr(r.slug), description: toStr(r.description), subtitle: toStr(r.subtitle),
      hero_image_url: await toR2(r.hero_image_url), brochure_url: await toR2(r.brochure_url),
      facility_image_1: await toR2(r.facility_image_1), facility_image_2: await toR2(r.facility_image_2),
      map_image_url: await toR2(r.map_image_url), map_embed_url: toStr(r.map_embed_url),
      facebook_url: toStr(r.facebook_url), line_url: toStr(r.line_url), youtube_url: toStr(r.youtube_url), website_url: toStr(r.website_url),
      is_published: toBool(r.is_published), sort_order: toNum(r.sort_order) ?? 0,
      ...parsed,
    });
    process.stdout.write(".");
  }
}

async function importProjects() {
  const rows = readCsv("projects_rows.csv");
  for (const r of rows) {
    await upsert(ProjectModel, { _id: r.id }, { _id: r.id, name: r.name, subtitle: toStr(r.subtitle), image_url: await toR2(r.image_url), logo_url: await toR2(r.logo_url), linked_project_page_id: toStr(r.linked_project_page_id), is_published: toBool(r.is_published), sort_order: toNum(r.sort_order) ?? 0 });
    process.stdout.write(".");
  }
}

async function importSiteSettings() {
  const rows = readCsv("site_settings_rows.csv");
  for (const r of rows) {
    const value = await walkUrls(tryJson(r.value));
    await upsert(SettingModel, { key: r.key }, { key: r.key, value, updated_at: toStr(r.updated_at) });
    process.stdout.write(".");
  }
}

// ─── Main ─────────────────────────────────────────────────────────────────────

const STEPS: Array<{ name: string; fn: () => Promise<void> }> = [
  { name: "awards",               fn: importAwards },
  { name: "contact_clicks",       fn: importContactClicks },
  { name: "contact_submissions",  fn: importContactSubmissions },
  { name: "lead_submissions",     fn: importLeadSubmissions },
  { name: "land_inquiries",       fn: importLandInquiries },
  { name: "lifestyle_slides",     fn: importLifestyleSlides },
  { name: "milestones",           fn: importMilestones },
  { name: "our_family_images",    fn: importOurFamilyImages },
  { name: "posts",                fn: importPosts },
  { name: "project_pages",        fn: importProjectPages },
  { name: "projects",             fn: importProjects },
  { name: "site_settings",        fn: importSiteSettings },
];

async function main() {
  console.log("═══════════════════════════════════════");
  console.log(" CSV → MongoDB + R2 Import");
  console.log("═══════════════════════════════════════");

  const required = ["MONGODB_URI", "R2_ENDPOINT", "R2_ACCESS_KEY_ID", "R2_SECRET_ACCESS_KEY", "R2_BUCKET", "R2_PUBLIC_URL"];
  for (const k of required) { if (!process.env[k]) throw new Error(`Missing env var: ${k}`); }

  process.stdout.write("Connecting to MongoDB...");
  await mongoose.connect(process.env.MONGODB_URI!);
  console.log(" ✓\n");

  for (const { name, fn } of STEPS) {
    process.stdout.write(`── ${name.padEnd(22)}`);
    try {
      await fn();
      console.log(" ✓");
    } catch (e) {
      console.log(` ✗ ${(e as Error).message}`);
    }
  }

  console.log("\n═══════════════════════════════════════");
  console.log(`  Done. R2 uploads: ${urlCache.size}`);
  console.log("═══════════════════════════════════════\n");

  await mongoose.disconnect();
}

main().catch(err => { console.error("\n✗", err); process.exit(1); });
