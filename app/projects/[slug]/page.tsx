import { notFound } from "next/navigation";
import { createClient, createStaticClient } from "@/lib/supabase/server";
import Navbar from "../../components/Navbar";
import FooterServer from "../../components/FooterServer";
import ProjectHero from "../../components/ProjectHero";
import ProjectInfo from "../../components/ProjectInfo";
import ProjectHousesAndFacilities, {
  type FacilityCard,
} from "../../components/ProjectHousesAndFacilities";
import ProjectGallery from "../../components/ProjectGallery";
import ProjectLocation from "../../components/ProjectLocation";
import ProjectMap from "../../components/ProjectMap";
import LoanCalculator from "../../components/LoanCalculator";
import type { HouseType } from "../../components/ProjectHouseSlider";
import type { Facility } from "../../components/ProjectFacilities";
import type { NearbyPlace } from "../../components/ProjectLocation";

/**
 * Reads `project_pages.facilities` and normalizes to the card-per-house shape.
 * Legacy rows stored a flat `Facility[]` with images on `facility_image_1/2`;
 * wrap them as a single unlinked card so the public page keeps working until
 * an admin re-saves the project.
 */
function normalizeFacilityCards(
  raw: unknown,
  legacyImage1: string | null,
  legacyImage2: string | null,
): FacilityCard[] {
  const arr = Array.isArray(raw) ? raw : [];
  const first = arr[0];
  const isNewShape =
    typeof first === "object" && first !== null && "facilities" in first;

  if (isNewShape) return arr as FacilityCard[];

  const hasLegacy = arr.length > 0 || legacyImage1 || legacyImage2;
  if (!hasLegacy) return [];

  return [
    {
      linkedHouseName: "",
      image1: legacyImage1 ?? "",
      image2: legacyImage2 ?? "",
      facilities: (arr as Facility[]).map((f) => ({
        icon: f.icon,
        name: f.name ?? f.label,
      })),
    },
  ];
}

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const supabase = createStaticClient();
  const { data } = await supabase
    .from("project_pages")
    .select("slug")
    .eq("is_published", true)
    .not("slug", "is", null);
  return (data ?? []).map((p) => ({ slug: p.slug! }));
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const supabase = createStaticClient();
  const { data } = await supabase
    .from("project_pages")
    .select("name, description")
    .eq("slug", slug)
    .single();
  if (!data) return {};
  return {
    title: `${data.name} | Palm Springs`,
    description: (data.description ?? "").replace(/\n/g, " "),
  };
}

export default async function ProjectDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: project } = await supabase
    .from("project_pages")
    .select("*")
    .eq("slug", slug)
    .eq("is_published", true)
    .single();

  if (!project) notFound();

  const houseTypes = (project.house_types as unknown as HouseType[]) ?? [];
  const facilityCards = normalizeFacilityCards(
    project.facilities,
    project.facility_image_1,
    project.facility_image_2,
  );
  const nearbyPlaces = (project.nearby_places as unknown as NearbyPlace[]) ?? [];
  const galleryImages = (project.gallery_images as unknown as string[]) ?? [];

  return (
    <>
      <Navbar />
      <main>
        <ProjectHero
          name={project.name}
          subtitle={project.subtitle ?? ""}
          heroImageUrl={project.hero_image_url ?? undefined}
          socialLinks={{
            facebook: project.facebook_url ?? undefined,
            line: project.line_url ?? undefined,
            youtube: project.youtube_url ?? undefined,
            website: project.website_url ?? undefined,
          }}
        />
        <ProjectInfo
          description={project.description ?? ""}
          highlights={(project.highlights as unknown as string[]) ?? []}
          downloadUrl={project.brochure_url ?? undefined}
        />
        <ProjectHousesAndFacilities houses={houseTypes} cards={facilityCards} />
        <ProjectLocation places={nearbyPlaces} />
        <ProjectMap
          projectName={project.name}
          mapEmbedUrl={project.map_embed_url ?? ""}
          mapImageUrl={project.map_image_url ?? undefined}
        />
        <ProjectGallery images={galleryImages.length > 0 ? galleryImages : undefined} />
        <LoanCalculator />
      </main>
      <FooterServer />
    </>
  );
}
