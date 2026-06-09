// Shared TypeScript types (replaces lib/types/database.types.ts)

export interface Award {
  id: string; image_url: string; description: string
  is_published: boolean; sort_order: number
  created_at: string | null; updated_at: string | null
}

export interface ContactClick {
  id: string; type: string; clicked_at: string
}

export interface ContactSubmission {
  id: string; name: string; email: string; phone: string
  message: string | null; status: string; created_at: string
}

export interface LeadSubmission {
  id: string; name: string; email: string; phone: string
  line_id: string | null; budget: string | null; detail: string | null
  visit_date: string | null; visit_time: string | null; status: string; created_at: string
}

export interface LandInquiry {
  id: string; first_name: string; last_name: string; phone: string
  email: string | null; province: string | null; district: string | null
  land_address: string | null; area_rai: number | null; area_ngan: number | null
  area_wa: number | null; asking_price: number | null; title_deed_type: string | null
  images: string[]; pdf_url: string | null; notes: string | null
  status: string; created_at: string | null
}

export interface LifestyleSlide {
  id: string; house_image_url: string; lifestyle_image_url: string
  tags: string[]; is_published: boolean; sort_order: number
  created_at: string | null; updated_at: string | null
}

export interface Milestone {
  id: string; title: string; year: string; description: string | null
  image_url: string | null; sort_order: number
  created_at: string | null; updated_at: string | null
}

export interface OurFamilyImage {
  id: string; image_url: string; alt_text: string | null
  section: string; sort_order: number
  created_at: string | null; updated_at: string | null
}

export interface Post {
  id: string; title: string; slug: string; content: string; excerpt: string | null
  cover_image_url: string | null; type: string; is_published: boolean
  published_at: string | null; created_at: string | null; updated_at: string | null
}

export interface ProjectPage {
  id: string; name: string; slug: string | null; description: string | null; subtitle: string | null
  hero_image_url: string | null; gallery_images: unknown; highlights: unknown
  facilities: unknown; facility_image_1: string | null; facility_image_2: string | null
  house_types: unknown; nearby_places: unknown; map_embed_url: string | null
  map_image_url: string | null; brochure_url: string | null; facebook_url: string | null
  line_url: string | null; website_url: string | null; youtube_url: string | null
  is_published: boolean; sort_order: number; created_at: string | null; updated_at: string | null
}

export interface Project {
  id: string; name: string; subtitle: string | null; image_url: string
  logo_url: string | null; linked_project_page_id: string | null
  is_published: boolean; sort_order: number
  created_at: string | null; updated_at: string | null
  project_pages?: { slug: string | null } | null
}

export interface SiteSetting {
  key: string; value: unknown; updated_at: string | null
}
