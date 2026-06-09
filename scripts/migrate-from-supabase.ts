#!/usr/bin/env node
/**
 * scripts/migrate-from-supabase.ts
 *
 * Migrates all Supabase data (PostgreSQL + Storage) → MongoDB Atlas + Cloudflare R2.
 * Uses direct PostgreSQL connection — bypasses Supabase REST API egress quota.
 *
 * Run:
 *   npx tsx scripts/migrate-from-supabase.ts
 *
 * Safe to run multiple times — uses upserts throughout.
 */

import * as dns from "dns";
import * as fs from "fs";
import * as path from "path";
import * as https from "https";
import * as http from "http";

// Force IPv4 — Supabase direct host resolves to IPv6 which may be unreachable
dns.setDefaultResultOrder("ipv4first");

// Allow self-signed cert in Supabase pooler chain
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

// Load .env.local
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

import { Pool } from "pg";
import mongoose from "mongoose";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

// ─── Clients ──────────────────────────────────────────────────────────────────

const pg = new Pool({
  connectionString: process.env.SUPABASE_DB_URL,
  ssl: { rejectUnauthorized: false },
});

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
const SUPABASE_STORAGE_PREFIX = "https://dkdrfftuvroetapqrqbf.supabase.co/storage/v1/object/public/";

// ─── URL Cache ────────────────────────────────────────────────────────────────

const urlCache = new Map<string, string>();

// ─── Helpers ──────────────────────────────────────────────────────────────────

function fetchBuffer(url: string): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const mod = url.startsWith("https") ? https : http;
    mod.get(url, (res) => {
      if (res.statusCode !== 200) {
        reject(new Error(`HTTP ${res.statusCode}`));
        return;
      }
      const chunks: Buffer[] = [];
      res.on("data", (c: Buffer) => chunks.push(c));
      res.on("end", () => resolve(Buffer.concat(chunks)));
      res.on("error", reject);
    }).on("error", reject);
  });
}

function guessContentType(url: string): string {
  const ext = url.split("?")[0].split(".").pop()?.toLowerCase() ?? "";
  const map: Record<string, string> = {
    jpg: "image/jpeg", jpeg: "image/jpeg", png: "image/png",
    gif: "image/gif", webp: "image/webp", svg: "image/svg+xml",
    pdf: "application/pdf", mp4: "video/mp4", mov: "video/quicktime",
  };
  return map[ext] ?? "application/octet-stream";
}

async function migrateUrl(supabaseUrl: string): Promise<string> {
  if (urlCache.has(supabaseUrl)) return urlCache.get(supabaseUrl)!;

  const r2Key = supabaseUrl.replace(SUPABASE_STORAGE_PREFIX, "");
  try {
    const buffer = await fetchBuffer(supabaseUrl);
    await r2.send(new PutObjectCommand({
      Bucket: R2_BUCKET,
      Key: r2Key,
      Body: buffer,
      ContentType: guessContentType(supabaseUrl),
    }));
    const r2Url = `${R2_PUBLIC_URL}/${r2Key}`;
    urlCache.set(supabaseUrl, r2Url);
    process.stdout.write(` [R2✓]`);
    return r2Url;
  } catch (err) {
    console.warn(`\n    ⚠ URL migrate failed ${r2Key}: ${(err as Error).message}`);
    return supabaseUrl;
  }
}

async function replaceUrls(value: unknown): Promise<unknown> {
  if (typeof value === "string") {
    return value.startsWith(SUPABASE_STORAGE_PREFIX) ? migrateUrl(value) : value;
  }
  if (Array.isArray(value)) return Promise.all(value.map(replaceUrls));
  if (value !== null && typeof value === "object") {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
      out[k] = await replaceUrls(v);
    }
    return out;
  }
  return value;
}

// ─── MongoDB Models ───────────────────────────────────────────────────────────

const { Schema, model, models } = mongoose;
const sid = () => ({ type: String, default: () => crypto.randomUUID() });
const s = (req = false) => ({ type: String, default: req ? undefined : null });
const num = (d = 0) => ({ type: Number, default: d });
const bool = (d = true) => ({ type: Boolean, default: d });
const M = (n: string, sc: mongoose.Schema) => models[n] || model(n, sc);

const AwardModel        = M("Award",        new Schema({ _id: sid(), image_url: { type: String, default: "" }, description: { type: String, default: "" }, is_published: bool(), sort_order: num() }, { timestamps: { createdAt: "created_at", updatedAt: "updated_at" }, _id: false }));
const ContactClickModel = M("ContactClick", new Schema({ _id: sid(), type: { type: String, required: true }, clicked_at: { type: String, default: () => new Date().toISOString() } }, { _id: false }));
const ContactSubModel   = M("ContactSubmission", new Schema({ _id: sid(), name: s(true), email: s(true), phone: s(true), message: s(), status: { type: String, default: "new" }, created_at: { type: String, default: () => new Date().toISOString() } }, { _id: false }));
const LeadSubModel      = M("LeadSubmission", new Schema({ _id: sid(), name: s(true), email: s(true), phone: s(true), line_id: s(), budget: s(), detail: s(), visit_date: s(), visit_time: s(), status: { type: String, default: "new" }, created_at: { type: String, default: () => new Date().toISOString() } }, { _id: false }));
const LandInquiryModel  = M("LandInquiry", new Schema({ _id: sid(), first_name: s(true), last_name: s(true), phone: s(true), email: s(), province: s(), district: s(), land_address: s(), area_rai: { type: Number, default: null }, area_ngan: { type: Number, default: null }, area_wa: { type: Number, default: null }, asking_price: { type: Number, default: null }, title_deed_type: s(), images: { type: [String], default: [] }, pdf_url: s(), notes: s(), status: { type: String, default: "new" }, created_at: { type: String, default: () => new Date().toISOString() } }, { _id: false }));
const LifestyleModel    = M("LifestyleSlide", new Schema({ _id: sid(), house_image_url: { type: String, default: "" }, lifestyle_image_url: { type: String, default: "" }, tags: { type: [String], default: [] }, is_published: bool(), sort_order: num() }, { timestamps: { createdAt: "created_at", updatedAt: "updated_at" }, _id: false }));
const MilestoneModel    = M("Milestone", new Schema({ _id: sid(), title: s(true), year: s(true), description: s(), image_url: s(), sort_order: num() }, { timestamps: { createdAt: "created_at", updatedAt: "updated_at" }, _id: false }));
const OurFamilyModel    = M("OurFamilyImage", new Schema({ _id: sid(), image_url: { type: String, default: "" }, alt_text: s(), section: s(true), sort_order: num() }, { timestamps: { createdAt: "created_at", updatedAt: "updated_at" }, _id: false }));
const PostModel         = M("Post", new Schema({ _id: sid(), title: s(true), slug: { type: String, required: true }, content: { type: String, default: "" }, excerpt: s(), cover_image_url: s(), type: s(true), is_published: bool(false), published_at: s() }, { timestamps: { createdAt: "created_at", updatedAt: "updated_at" }, _id: false }));
const ProjectPageModel  = M("ProjectPage", new Schema({ _id: sid(), name: s(true), slug: s(), description: s(), subtitle: s(), hero_image_url: s(), gallery_images: { type: Schema.Types.Mixed, default: [] }, highlights: { type: Schema.Types.Mixed, default: [] }, facilities: { type: Schema.Types.Mixed, default: [] }, facility_image_1: s(), facility_image_2: s(), house_types: { type: Schema.Types.Mixed, default: [] }, nearby_places: { type: Schema.Types.Mixed, default: [] }, map_embed_url: s(), map_image_url: s(), brochure_url: s(), facebook_url: s(), line_url: s(), website_url: s(), youtube_url: s(), is_published: bool(false), sort_order: num() }, { timestamps: { createdAt: "created_at", updatedAt: "updated_at" }, _id: false }));
const ProjectModel      = M("Project", new Schema({ _id: sid(), name: s(true), subtitle: s(), image_url: { type: String, default: "" }, logo_url: s(), linked_project_page_id: s(), is_published: bool(), sort_order: num() }, { timestamps: { createdAt: "created_at", updatedAt: "updated_at" }, _id: false }));
const SiteSettingModel  = M("SiteSetting", new Schema({ key: { type: String, required: true, unique: true }, value: { type: Schema.Types.Mixed, default: null }, updated_at: { type: String, default: () => new Date().toISOString() } }));

// ─── URL fields per table ─────────────────────────────────────────────────────

const URL_FIELDS: Record<string, string[]> = {
  awards:               ["image_url"],
  contact_clicks:       [],
  contact_submissions:  [],
  lead_submissions:     [],
  land_inquiries:       ["images", "pdf_url"],
  lifestyle_slides:     ["house_image_url", "lifestyle_image_url"],
  milestones:           ["image_url"],
  our_family_images:    ["image_url"],
  posts:                ["cover_image_url", "content"],
  project_pages:        ["hero_image_url", "gallery_images", "house_types", "facilities", "facility_image_1", "facility_image_2", "map_image_url", "brochure_url"],
  projects:             ["image_url", "logo_url"],
  site_settings:        ["value"],
};

// ─── Table config ─────────────────────────────────────────────────────────────

const TABLES: Array<{
  table: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Model: any;
  upsertKey: string;
}> = [
  { table: "awards",               Model: AwardModel,        upsertKey: "_id" },
  { table: "contact_clicks",       Model: ContactClickModel, upsertKey: "_id" },
  { table: "contact_submissions",  Model: ContactSubModel,   upsertKey: "_id" },
  { table: "lead_submissions",     Model: LeadSubModel,      upsertKey: "_id" },
  { table: "land_inquiries",       Model: LandInquiryModel,  upsertKey: "_id" },
  { table: "lifestyle_slides",     Model: LifestyleModel,    upsertKey: "_id" },
  { table: "milestones",           Model: MilestoneModel,    upsertKey: "_id" },
  { table: "our_family_images",    Model: OurFamilyModel,    upsertKey: "_id" },
  { table: "posts",                Model: PostModel,          upsertKey: "_id" },
  { table: "project_pages",        Model: ProjectPageModel,  upsertKey: "_id" },
  { table: "projects",             Model: ProjectModel,       upsertKey: "_id" },
  { table: "site_settings",        Model: SiteSettingModel,  upsertKey: "key" },
];

// ─── Migration ────────────────────────────────────────────────────────────────

async function migrateTable(
  table: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Model: any,
  upsertKey: string
) {
  console.log(`\n── ${table}`);

  const { rows } = await pg.query(`SELECT * FROM public.${table}`);
  console.log(`   fetched ${rows.length} rows`);
  if (rows.length === 0) return;

  const urlFields = URL_FIELDS[table] ?? [];
  let ok = 0, fail = 0;

  for (const raw of rows) {
    try {
      const row = { ...raw };

      // Replace Supabase storage URLs with R2 URLs
      for (const field of urlFields) {
        if (row[field] != null) {
          row[field] = await replaceUrls(row[field]);
        }
      }

      // Build document — map Supabase `id` → Mongoose `_id`
      const doc: Record<string, unknown> = { ...row };
      if (upsertKey === "_id") {
        doc._id = row.id;
        delete doc.id;
      }

      const filter: Record<string, unknown> = { [upsertKey]: doc[upsertKey] };
      await Model.findOneAndUpdate(filter, { $set: doc }, {
        upsert: true, new: true, setDefaultsOnInsert: true,
      });
      process.stdout.write(".");
      ok++;
    } catch (err) {
      console.warn(`\n   ⚠ row ${raw.id ?? raw.key}: ${(err as Error).message}`);
      fail++;
    }
  }

  console.log(`\n   ✓ ${ok} upserted${fail ? `, ${fail} failed` : ""}`);
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log("═══════════════════════════════════════");
  console.log(" Supabase → MongoDB + R2 Migration");
  console.log(" (direct PostgreSQL — bypasses egress)");
  console.log("═══════════════════════════════════════");

  const required = ["SUPABASE_DB_URL", "MONGODB_URI", "R2_ENDPOINT", "R2_ACCESS_KEY_ID", "R2_SECRET_ACCESS_KEY", "R2_BUCKET", "R2_PUBLIC_URL"];
  for (const k of required) {
    if (!process.env[k]) throw new Error(`Missing env var: ${k}`);
  }

  process.stdout.write("Connecting to PostgreSQL...");
  await pg.query("SELECT 1");
  console.log(" ✓");

  process.stdout.write("Connecting to MongoDB...");
  await mongoose.connect(process.env.MONGODB_URI!);
  console.log(" ✓");

  for (const { table, Model, upsertKey } of TABLES) {
    await migrateTable(table, Model, upsertKey);
  }

  console.log("\n═══════════════════════════════════════");
  console.log(`  Done. URLs re-hosted to R2: ${urlCache.size}`);
  console.log("═══════════════════════════════════════\n");

  await pg.end();
  await mongoose.disconnect();
}

main().catch((err) => {
  console.error("\n✗ Migration failed:", err);
  process.exit(1);
});
