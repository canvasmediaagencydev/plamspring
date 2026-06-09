import mongoose, { Schema, model, models } from "mongoose"

const str = (required = false) => ({ type: String, default: required ? undefined : null })
const strReq = () => ({ type: String, required: true })
const num = (def = 0) => ({ type: Number, default: def })
const bool = (def = true) => ({ type: Boolean, default: def })
const id = () => ({ type: String, default: () => crypto.randomUUID() })

// ─── Awards ──────────────────────────────────────────────────────────────────
const AwardSchema = new Schema({
  _id: id(), image_url: { type: String, default: "" },
  description: { type: String, default: "" },
  is_published: bool(), sort_order: num(),
}, { timestamps: { createdAt: "created_at", updatedAt: "updated_at" }, _id: false })
AwardSchema.virtual("id").get(function () { return this._id })
AwardSchema.set("toJSON", { virtuals: true })
export const Award = models.Award || model("Award", AwardSchema)

// ─── ContactClicks ────────────────────────────────────────────────────────────
const ContactClickSchema = new Schema({
  _id: id(), type: strReq(), clicked_at: { type: String, default: () => new Date().toISOString() },
}, { _id: false })
ContactClickSchema.virtual("id").get(function () { return this._id })
ContactClickSchema.set("toJSON", { virtuals: true })
export const ContactClick = models.ContactClick || model("ContactClick", ContactClickSchema)

// ─── ContactSubmissions ───────────────────────────────────────────────────────
const ContactSubmissionSchema = new Schema({
  _id: id(), name: strReq(), email: strReq(), phone: strReq(),
  message: str(), status: { type: String, default: "new" },
  created_at: { type: String, default: () => new Date().toISOString() },
}, { _id: false })
ContactSubmissionSchema.virtual("id").get(function () { return this._id })
ContactSubmissionSchema.set("toJSON", { virtuals: true })
export const ContactSubmission = models.ContactSubmission || model("ContactSubmission", ContactSubmissionSchema)

// ─── LeadSubmissions ──────────────────────────────────────────────────────────
const LeadSubmissionSchema = new Schema({
  _id: id(), name: strReq(), email: strReq(), phone: strReq(),
  line_id: str(), budget: str(), detail: str(),
  visit_date: str(), visit_time: str(), status: { type: String, default: "new" },
  created_at: { type: String, default: () => new Date().toISOString() },
}, { _id: false })
LeadSubmissionSchema.virtual("id").get(function () { return this._id })
LeadSubmissionSchema.set("toJSON", { virtuals: true })
export const LeadSubmission = models.LeadSubmission || model("LeadSubmission", LeadSubmissionSchema)

// ─── LandInquiries ────────────────────────────────────────────────────────────
const LandInquirySchema = new Schema({
  _id: id(), first_name: strReq(), last_name: strReq(), phone: strReq(),
  email: str(), province: str(), district: str(), land_address: str(),
  area_rai: { type: Number, default: null }, area_ngan: { type: Number, default: null },
  area_wa: { type: Number, default: null }, asking_price: { type: Number, default: null },
  title_deed_type: str(), images: { type: [String], default: [] },
  pdf_url: str(), notes: str(), status: { type: String, default: "new" },
  created_at: { type: String, default: () => new Date().toISOString() },
}, { _id: false })
LandInquirySchema.virtual("id").get(function () { return this._id })
LandInquirySchema.set("toJSON", { virtuals: true })
export const LandInquiry = models.LandInquiry || model("LandInquiry", LandInquirySchema)

// ─── LifestyleSlides ──────────────────────────────────────────────────────────
const LifestyleSlideSchema = new Schema({
  _id: id(), house_image_url: { type: String, default: "" },
  lifestyle_image_url: { type: String, default: "" },
  tags: { type: [String], default: [] }, is_published: bool(), sort_order: num(),
}, { timestamps: { createdAt: "created_at", updatedAt: "updated_at" }, _id: false })
LifestyleSlideSchema.virtual("id").get(function () { return this._id })
LifestyleSlideSchema.set("toJSON", { virtuals: true })
export const LifestyleSlide = models.LifestyleSlide || model("LifestyleSlide", LifestyleSlideSchema)

// ─── Milestones ───────────────────────────────────────────────────────────────
const MilestoneSchema = new Schema({
  _id: id(), title: strReq(), year: strReq(), description: str(), image_url: str(), sort_order: num(),
}, { timestamps: { createdAt: "created_at", updatedAt: "updated_at" }, _id: false })
MilestoneSchema.virtual("id").get(function () { return this._id })
MilestoneSchema.set("toJSON", { virtuals: true })
export const Milestone = models.Milestone || model("Milestone", MilestoneSchema)

// ─── OurFamilyImages ──────────────────────────────────────────────────────────
const OurFamilyImageSchema = new Schema({
  _id: id(), image_url: { type: String, default: "" }, alt_text: str(),
  section: strReq(), sort_order: num(),
}, { timestamps: { createdAt: "created_at", updatedAt: "updated_at" }, _id: false })
OurFamilyImageSchema.virtual("id").get(function () { return this._id })
OurFamilyImageSchema.set("toJSON", { virtuals: true })
export const OurFamilyImage = models.OurFamilyImage || model("OurFamilyImage", OurFamilyImageSchema)

// ─── Posts ────────────────────────────────────────────────────────────────────
const PostSchema = new Schema({
  _id: id(), title: strReq(), slug: { type: String, required: true, unique: true },
  content: { type: String, default: "" }, excerpt: str(), cover_image_url: str(),
  type: { type: String, required: true }, is_published: bool(false),
  published_at: str(),
}, { timestamps: { createdAt: "created_at", updatedAt: "updated_at" }, _id: false })
PostSchema.virtual("id").get(function () { return this._id })
PostSchema.set("toJSON", { virtuals: true })
export const Post = models.Post || model("Post", PostSchema)

// ─── ProjectPages ─────────────────────────────────────────────────────────────
const ProjectPageSchema = new Schema({
  _id: id(), name: strReq(), slug: str(), description: str(), subtitle: str(),
  hero_image_url: str(), gallery_images: { type: Schema.Types.Mixed, default: [] },
  highlights: { type: Schema.Types.Mixed, default: [] },
  facilities: { type: Schema.Types.Mixed, default: [] },
  facility_image_1: str(), facility_image_2: str(),
  house_types: { type: Schema.Types.Mixed, default: [] },
  nearby_places: { type: Schema.Types.Mixed, default: [] },
  map_embed_url: str(), map_image_url: str(), brochure_url: str(),
  facebook_url: str(), line_url: str(), website_url: str(), youtube_url: str(),
  is_published: bool(false), sort_order: num(),
}, { timestamps: { createdAt: "created_at", updatedAt: "updated_at" }, _id: false })
ProjectPageSchema.virtual("id").get(function () { return this._id })
ProjectPageSchema.set("toJSON", { virtuals: true })
export const ProjectPage = models.ProjectPage || model("ProjectPage", ProjectPageSchema)

// ─── Projects ─────────────────────────────────────────────────────────────────
const ProjectSchema = new Schema({
  _id: id(), name: strReq(), subtitle: str(), image_url: { type: String, default: "" },
  logo_url: str(), linked_project_page_id: str(), is_published: bool(), sort_order: num(),
}, { timestamps: { createdAt: "created_at", updatedAt: "updated_at" }, _id: false })
ProjectSchema.virtual("id").get(function () { return this._id })
ProjectSchema.set("toJSON", { virtuals: true })
export const Project = models.Project || model("Project", ProjectSchema)

// ─── SiteSettings ─────────────────────────────────────────────────────────────
const SiteSettingSchema = new Schema({
  key: { type: String, required: true, unique: true },
  value: { type: Schema.Types.Mixed, default: null },
  updated_at: { type: String, default: () => new Date().toISOString() },
})
SiteSettingSchema.set("toJSON", { virtuals: true })
export const SiteSetting = models.SiteSetting || model("SiteSetting", SiteSettingSchema)
