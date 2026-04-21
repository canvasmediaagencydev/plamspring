"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { AdminHeader } from "@/app/components/admin/AdminHeader";
import { ImageUploader } from "@/app/components/admin/ImageUploader";
import { FileUploader } from "@/app/components/admin/FileUploader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Plus, Trash2, ChevronDown, ChevronUp, Save, Waves, TreePine, Home, Shield, Camera, Dumbbell, Check, type LucideIcon } from "lucide-react";
import { revalidatePages } from "@/lib/revalidate";
import type { Tables } from "@/lib/types/database.types";
import type { Json } from "@/lib/types/database.types";

type Project = Tables<"project_pages">;

// ─── JSONB domain types ────────────────────────────────────────────────────────

interface HouseTypeDB {
  name: string;
  imageUrl: string;
  specs: { label: string; value: string }[];
}

interface FacilityDB {
  icon: string;
  name?: string;
  label?: string;
}

interface FacilityCardDB {
  linkedHouseName: string;
  image1: string;
  image2: string;
  facilities: FacilityDB[];
}

/**
 * Reads the `project_pages.facilities` JSON. Old rows stored a flat
 * `FacilityDB[]` plus `facility_image_1/2`; we wrap those into one unlinked
 * card so the admin can re-link them to specific house types.
 */
function normalizeFacilityCards(
  raw: unknown,
  legacyImage1: string | null,
  legacyImage2: string | null,
): FacilityCardDB[] {
  const arr = Array.isArray(raw) ? raw : [];
  const first = arr[0];
  const isNewShape =
    typeof first === "object" && first !== null && "facilities" in first;

  if (isNewShape) {
    return (arr as FacilityCardDB[]).map((c) => ({
      linkedHouseName: c.linkedHouseName ?? "",
      image1: c.image1 ?? "",
      image2: c.image2 ?? "",
      facilities: (c.facilities ?? []).map((f) => ({
        icon: f.icon,
        name: f.name ?? f.label ?? "",
      })),
    }));
  }

  const hasLegacy = arr.length > 0 || legacyImage1 || legacyImage2;
  if (!hasLegacy) return [];

  return [
    {
      linkedHouseName: "",
      image1: legacyImage1 ?? "",
      image2: legacyImage2 ?? "",
      facilities: (arr as FacilityDB[]).map((f) => ({
        icon: f.icon,
        name: f.name ?? f.label ?? "",
      })),
    },
  ];
}

const FACILITY_OPTIONS: { key: string; label: string; Icon: LucideIcon }[] = [
  { key: "pool",      label: "สระว่ายน้ำส่วนกลาง", Icon: Waves },
  { key: "park",      label: "สวนสาธารณะ",          Icon: TreePine },
  { key: "clubhouse", label: "คลับเฮาส์",            Icon: Home },
  { key: "security",  label: "รักษาความปลอดภัย",    Icon: Shield },
  { key: "cctv",      label: "กล้องวงจรปิด",         Icon: Camera },
  { key: "fitness",   label: "ฟิตเนส",               Icon: Dumbbell },
];

interface NearbyPlaceDB {
  distance: number;
  unit: string;
  name: string;
  category: string;
  details: string[];
}

// ─── Tab config ────────────────────────────────────────────────────────────────

type TabId = "hero" | "info" | "houses" | "facilities" | "location" | "map" | "gallery";

const TABS: { id: TabId; label: string }[] = [
  { id: "hero",        label: "หน้าปก" },
  { id: "info",        label: "ข้อมูลโครงการ" },
  { id: "houses",      label: "แบบบ้าน" },
  { id: "facilities",  label: "สิ่งอำนวยความสะดวก" },
  { id: "location",    label: "ทำเลที่ตั้ง" },
  { id: "map",         label: "แผนที่" },
  { id: "gallery",     label: "แกลเลอรี่" },
];


// ─── Helpers ──────────────────────────────────────────────────────────────────

function SaveRow({ saving, onSave }: { saving: boolean; onSave: () => void }) {
  return (
    <div className="flex justify-end pt-4">
      <Button onClick={onSave} disabled={saving}>
        <Save size={16} />
        {saving ? "กำลังบันทึก..." : "บันทึก"}
      </Button>
    </div>
  );
}

function SaveError({ msg }: { msg: string }) {
  return <p className="mt-2 text-sm text-red-600 bg-red-50 px-3 py-2 rounded-md">{msg}</p>;
}

function SaveSuccess({ msg }: { msg: string }) {
  return <p className="mt-2 text-sm text-green-700 bg-green-50 px-3 py-2 rounded-md">{msg}</p>;
}

// ─── Main component ───────────────────────────────────────────────────────────

export function ProjectDetailClient({
  project,
  backHref = "/admin/home/projects",
}: {
  project: Project;
  backHref?: string;
}) {
  const supabase = createClient();
  const [tab, setTab] = useState<TabId>("hero");

  // ── Basic info state ──
  const [projectName, setProjectName] = useState(project.name ?? "");
  const [projectSubtitle, setProjectSubtitle] = useState(project.subtitle ?? "");
  const [projectSlug, setProjectSlug] = useState(project.slug ?? "");

  // ── Publish state ──
  const [isPublished, setIsPublished] = useState(project.is_published ?? false);

  // ── Hero tab state ──
  const [heroImageUrl, setHeroImageUrl] = useState(project.hero_image_url ?? "");
  const [facebookUrl, setFacebookUrl] = useState(project.facebook_url ?? "");
  const [lineUrl, setLineUrl] = useState(project.line_url ?? "");
  const [youtubeUrl, setYoutubeUrl] = useState(project.youtube_url ?? "");
  const [websiteUrl, setWebsiteUrl] = useState(project.website_url ?? "");

  // ── Info tab state ──
  const [description, setDescription] = useState(project.description ?? "");
  const [highlights, setHighlights] = useState<string[]>(
    (project.highlights as string[]) ?? []
  );
  const [brochureUrl, setBrochureUrl] = useState(project.brochure_url ?? "");

  // ── Houses tab state ──
  const [houses, setHouses] = useState<HouseTypeDB[]>(
    (project.house_types as unknown as HouseTypeDB[]) ?? []
  );
  const [expandedHouse, setExpandedHouse] = useState<number | null>(null);

  // ── Facilities tab state ──
  const [facilityCards, setFacilityCards] = useState<FacilityCardDB[]>(() =>
    normalizeFacilityCards(
      project.facilities,
      project.facility_image_1,
      project.facility_image_2,
    ),
  );
  const [expandedCard, setExpandedCard] = useState<number | null>(null);

  // ── Location tab state ──
  const [nearbyPlaces, setNearbyPlaces] = useState<NearbyPlaceDB[]>(
    (project.nearby_places as unknown as NearbyPlaceDB[]) ?? []
  );
  const [expandedPlace, setExpandedPlace] = useState<number | null>(null);

  // ── Map tab state ──
  const [mapImageUrl, setMapImageUrl] = useState(project.map_image_url ?? "");
  const [mapEmbedUrl, setMapEmbedUrl] = useState(project.map_embed_url ?? "");

  // ── Gallery tab state ──
  const [galleryImages, setGalleryImages] = useState<string[]>(
    (project.gallery_images as unknown as string[]) ?? []
  );

  // ── Shared save state ──
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState<{ type: "ok" | "err"; text: string } | null>(null);

  const revalidate = async () => {
    const paths = ["/projects"];
    if (project.slug) paths.push(`/projects/${project.slug}`);
    await revalidatePages(paths);
  };

  const save = async (payload: Partial<Tables<"project_pages">>) => {
    setSaving(true);
    setSaveMsg(null);
    try {
      const { error } = await supabase
        .from("project_pages")
        .update({ ...payload, updated_at: new Date().toISOString() })
        .eq("id", project.id);
      if (error) throw error;
      await revalidate();
      setSaveMsg({ type: "ok", text: "บันทึกสำเร็จ" });
    } catch {
      setSaveMsg({ type: "err", text: "บันทึกไม่สำเร็จ กรุณาลองใหม่" });
    } finally {
      setSaving(false);
    }
  };

  // ── Tab save handlers ──

  const saveHero = () =>
    save({
      name: projectName.trim() || project.name,
      subtitle: projectSubtitle || null,
      slug: projectSlug.trim() || null,
      hero_image_url: heroImageUrl || null,
      is_published: isPublished,
    });

  const saveInfo = () =>
    save({
      description: description || null,
      highlights: highlights as unknown as Json,
      brochure_url: brochureUrl || null,
    });

  const saveHouses = () =>
    save({ house_types: houses as unknown as Json });

  const saveFacilities = () =>
    save({
      // The card shape holds its own images; drop the legacy columns so they
      // don't render stale data on the public page.
      facility_image_1: null,
      facility_image_2: null,
      facilities: facilityCards as unknown as Json,
    });

  const saveLocation = () =>
    save({ nearby_places: nearbyPlaces as unknown as Json });

  const saveMap = () =>
    save({
      map_image_url: mapImageUrl || null,
      map_embed_url: mapEmbedUrl || null,
    });

  const saveGallery = () =>
    save({ gallery_images: galleryImages as unknown as Json });

  // ── House helpers ──

  const updateHouse = (i: number, patch: Partial<HouseTypeDB>) => {
    const next = [...houses];
    next[i] = { ...next[i], ...patch };
    setHouses(next);
  };

  const addHouseSpec = (i: number) =>
    updateHouse(i, { specs: [...houses[i].specs, { label: "", value: "" }] });

  const updateHouseSpec = (hi: number, si: number, field: "label" | "value", val: string) => {
    const next = [...houses];
    const specs = [...next[hi].specs];
    specs[si] = { ...specs[si], [field]: val };
    next[hi] = { ...next[hi], specs };
    setHouses(next);
  };

  const removeHouseSpec = (hi: number, si: number) =>
    updateHouse(hi, { specs: houses[hi].specs.filter((_, j) => j !== si) });

  // ── NearbyPlace helpers ──

  const updatePlace = (i: number, patch: Partial<NearbyPlaceDB>) => {
    const next = [...nearbyPlaces];
    next[i] = { ...next[i], ...patch };
    setNearbyPlaces(next);
  };

  const addPlaceDetail = (i: number) =>
    updatePlace(i, { details: [...nearbyPlaces[i].details, ""] });

  const updatePlaceDetail = (pi: number, di: number, val: string) => {
    const next = [...nearbyPlaces];
    const details = [...next[pi].details];
    details[di] = val;
    next[pi] = { ...next[pi], details };
    setNearbyPlaces(next);
  };

  const removePlaceDetail = (pi: number, di: number) =>
    updatePlace(pi, { details: nearbyPlaces[pi].details.filter((_, j) => j !== di) });

  // ── Tab content renderers ──

  const renderHero = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader><CardTitle className="text-base">ข้อมูลพื้นฐาน</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-1.5">
            <Label>ชื่อโครงการ *</Label>
            <Input value={projectName} onChange={(e) => setProjectName(e.target.value)} placeholder="THE URBANA+ 6" />
          </div>
          <div className="space-y-1.5">
            <Label>Subtitle</Label>
            <Input value={projectSubtitle} onChange={(e) => setProjectSubtitle(e.target.value)} placeholder="by PALM SPRINGS" />
          </div>
          <div className="space-y-1.5">
            <Label>Slug (URL)</Label>
            <Input
              value={projectSlug}
              onChange={(e) => setProjectSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "-").replace(/-+/g, "-"))}
              placeholder="the-urbana-plus-6"
            />
            <p className="text-xs text-gray-400">URL: /projects/<strong>{projectSlug || "slug"}</strong></p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-base">รูป Hero</CardTitle></CardHeader>
        <CardContent>
          <ImageUploader
            bucket="project-detail-images"
            value={heroImageUrl}
            onChange={setHeroImageUrl}
            onClear={() => setHeroImageUrl("")}
            label="อัปโหลดรูป Hero"
          />
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-800">สถานะการแสดงผล</p>
              <p className="text-xs text-gray-400 mt-0.5">
                {isPublished ? "เผยแพร่บนเว็บไซต์แล้ว" : "ซ่อนจากเว็บไซต์"}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsPublished((v) => !v)}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none ${
                isPublished ? "bg-[#09418C]" : "bg-gray-200"
              }`}
            >
              <span
                className={`inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ${
                  isPublished ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
          </div>
        </CardContent>
      </Card>

      <SaveRow saving={saving} onSave={saveHero} />
    </div>
  );

  const renderInfo = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader><CardTitle className="text-base">คำอธิบายโครงการ</CardTitle></CardHeader>
        <CardContent>
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="คำอธิบายโครงการ..."
            rows={5}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">จุดเด่น (Highlights)</CardTitle>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setHighlights([...highlights, ""])}
            >
              <Plus size={14} /> เพิ่ม
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-2">
          {highlights.length === 0 && (
            <p className="text-sm text-gray-400">ยังไม่มีจุดเด่น</p>
          )}
          {highlights.map((item, i) => (
            <div key={i} className="flex gap-2">
              <Input
                value={item}
                onChange={(e) => {
                  const next = [...highlights];
                  next[i] = e.target.value;
                  setHighlights(next);
                }}
                placeholder="จุดเด่น..."
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="shrink-0"
                onClick={() => setHighlights(highlights.filter((_, j) => j !== i))}
              >
                <Trash2 size={14} />
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-base">ไฟล์ Brochure (PDF)</CardTitle></CardHeader>
        <CardContent>
          <FileUploader
            bucket="project-pdfs"
            value={brochureUrl}
            onChange={setBrochureUrl}
            onClear={() => setBrochureUrl("")}
            label="อัปโหลด Brochure PDF"
          />
        </CardContent>
      </Card>

      <SaveRow saving={saving} onSave={saveInfo} />
    </div>
  );

  const renderHouses = () => (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => {
            const newIdx = houses.length;
            setHouses([...houses, { name: "", imageUrl: "", specs: [] }]);
            setExpandedHouse(newIdx);
          }}
        >
          <Plus size={14} /> เพิ่มแบบบ้าน
        </Button>
      </div>

      {houses.length === 0 && (
        <p className="text-sm text-gray-400 text-center py-8">ยังไม่มีแบบบ้าน</p>
      )}

      {houses.map((house, hi) => (
        <Card key={hi}>
          <CardHeader className="cursor-pointer select-none" onClick={() => setExpandedHouse(expandedHouse === hi ? null : hi)}>
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-semibold">
                {house.name || `แบบบ้าน ${hi + 1}`}
              </CardTitle>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); setHouses(houses.filter((_, j) => j !== hi)); }}
                  className="rounded p-1 text-gray-400 hover:text-red-500 hover:bg-red-50"
                >
                  <Trash2 size={14} />
                </button>
                {expandedHouse === hi ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </div>
            </div>
          </CardHeader>

          {expandedHouse === hi && (
            <CardContent className="space-y-4 pt-0">
              <div className="space-y-1.5">
                <Label>ชื่อแบบบ้าน</Label>
                <Input
                  value={house.name}
                  onChange={(e) => updateHouse(hi, { name: e.target.value })}
                  placeholder="TWIN HOUSE A"
                />
              </div>

              <div className="space-y-1.5">
                <Label>รูปภาพแบบบ้าน</Label>
                <ImageUploader
                  bucket="project-detail-images"
                  value={house.imageUrl}
                  onChange={(url) => updateHouse(hi, { imageUrl: url })}
                  onClear={() => updateHouse(hi, { imageUrl: "" })}
                  label="อัปโหลดรูปแบบบ้าน"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>ข้อมูลจำเพาะ (Specs)</Label>
                  <Button type="button" variant="outline" size="sm" onClick={() => addHouseSpec(hi)}>
                    <Plus size={14} /> เพิ่ม
                  </Button>
                </div>
                {house.specs.map((spec, si) => (
                  <div key={si} className="flex gap-2">
                    <Input
                      value={spec.label}
                      onChange={(e) => updateHouseSpec(hi, si, "label", e.target.value)}
                      placeholder="3 ห้องนอน"
                      className="flex-1"
                    />
                    <Input
                      value={spec.value}
                      onChange={(e) => updateHouseSpec(hi, si, "value", e.target.value)}
                      placeholder="3 ห้องน้ำ"
                      className="flex-1"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="shrink-0"
                      onClick={() => removeHouseSpec(hi, si)}
                    >
                      <Trash2 size={14} />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          )}
        </Card>
      ))}

      <SaveRow saving={saving} onSave={saveHouses} />
    </div>
  );

  // ── Facility card helpers ──

  const updateCard = (i: number, patch: Partial<FacilityCardDB>) => {
    const next = [...facilityCards];
    next[i] = { ...next[i], ...patch };
    setFacilityCards(next);
  };

  const toggleCardFacility = (ci: number, key: string, defaultLabel: string) => {
    const card = facilityCards[ci];
    const active = card.facilities.some((f) => f.icon === key);
    updateCard(ci, {
      facilities: active
        ? card.facilities.filter((f) => f.icon !== key)
        : [...card.facilities, { icon: key, name: defaultLabel }],
    });
  };

  const updateCardFacilityName = (ci: number, key: string, name: string) => {
    const card = facilityCards[ci];
    updateCard(ci, {
      facilities: card.facilities.map((f) =>
        f.icon === key ? { ...f, name } : f,
      ),
    });
  };

  const renderFacilities = () => (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => {
            const newIdx = facilityCards.length;
            setFacilityCards([
              ...facilityCards,
              { linkedHouseName: "", image1: "", image2: "", facilities: [] },
            ]);
            setExpandedCard(newIdx);
          }}
        >
          <Plus size={14} /> เพิ่ม Card
        </Button>
      </div>

      {facilityCards.length === 0 && (
        <p className="text-sm text-gray-400 text-center py-8">
          ยังไม่มี card สิ่งอำนวยความสะดวก
        </p>
      )}

      {facilityCards.map((card, ci) => (
        <Card key={ci}>
          <CardHeader
            className="cursor-pointer select-none"
            onClick={() => setExpandedCard(expandedCard === ci ? null : ci)}
          >
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-semibold">
                Card {ci + 1}
                {card.linkedHouseName && (
                  <span className="ml-2 text-xs font-normal text-gray-400">
                    → {card.linkedHouseName}
                  </span>
                )}
              </CardTitle>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setFacilityCards(facilityCards.filter((_, j) => j !== ci));
                  }}
                  className="rounded p-1 text-gray-400 hover:text-red-500 hover:bg-red-50"
                >
                  <Trash2 size={14} />
                </button>
                {expandedCard === ci ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </div>
            </div>
          </CardHeader>

          {expandedCard === ci && (
            <CardContent className="space-y-4 pt-0">
              {/* Linked house dropdown */}
              <div className="space-y-1.5">
                <Label>ลิงก์กับแบบบ้าน</Label>
                <select
                  value={card.linkedHouseName}
                  onChange={(e) => updateCard(ci, { linkedHouseName: e.target.value })}
                  className="flex h-9 w-full rounded-md border border-gray-200 bg-white px-3 py-1 text-sm shadow-xs outline-none focus:border-primary"
                >
                  <option value="">— ไม่ระบุ —</option>
                  {houses.map((h, hi) => (
                    <option key={hi} value={h.name}>
                      {h.name || `แบบบ้าน ${hi + 1}`}
                    </option>
                  ))}
                </select>
                {houses.length === 0 && (
                  <p className="text-xs text-gray-400">
                    * เพิ่มแบบบ้านก่อนในแท็บ &quot;แบบบ้าน&quot;
                  </p>
                )}
              </div>

              {/* Floor plan images */}
              <div className="space-y-1.5">
                <Label>แปลนบ้าน</Label>
                <div className="flex gap-3">
                  <div className="flex-1 space-y-1">
                    <p className="text-[11px] text-gray-400">รูปที่ 1</p>
                    <ImageUploader
                      bucket="project-detail-images"
                      value={card.image1}
                      onChange={(url) => updateCard(ci, { image1: url })}
                      onClear={() => updateCard(ci, { image1: "" })}
                      label="อัปโหลด"
                    />
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="text-[11px] text-gray-400">รูปที่ 2</p>
                    <ImageUploader
                      bucket="project-detail-images"
                      value={card.image2}
                      onChange={(url) => updateCard(ci, { image2: url })}
                      onClear={() => updateCard(ci, { image2: "" })}
                      label="อัปโหลด"
                    />
                  </div>
                </div>
              </div>

              {/* Facility icon picker */}
              <div className="space-y-1.5">
                <Label>สิ่งอำนวยความสะดวก</Label>
                <div className="grid grid-cols-3 gap-2">
                  {FACILITY_OPTIONS.map(({ key, label, Icon }) => {
                    const isActive = card.facilities.some((f) => f.icon === key);
                    const activeFac = card.facilities.find((f) => f.icon === key);
                    return (
                      <div key={key} className="flex flex-col gap-1.5">
                        <button
                          type="button"
                          onClick={() => toggleCardFacility(ci, key, label)}
                          className={`group relative flex flex-col items-center gap-2.5 rounded-xl p-3 transition-all duration-200 ${
                            isActive
                              ? "bg-primary/8 ring-2 ring-primary/30 text-primary shadow-sm"
                              : "bg-gray-50 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                          }`}
                        >
                          {isActive && (
                            <span className="absolute right-1.5 top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-white">
                              <Check size={10} strokeWidth={3} />
                            </span>
                          )}
                          <Icon size={26} strokeWidth={1.25} />
                          <span className="text-center text-[10px] font-medium leading-tight">
                            {label}
                          </span>
                        </button>
                        {isActive && (
                          <input
                            value={activeFac?.name ?? label}
                            onChange={(e) =>
                              updateCardFacilityName(ci, key, e.target.value)
                            }
                            placeholder={label}
                            className="w-full rounded-lg border border-primary/20 bg-primary/5 px-2 py-1 text-center text-[10px] text-primary outline-none focus:border-primary/50"
                          />
                        )}
                      </div>
                    );
                  })}
                </div>
                <p className="text-[11px] text-gray-400">
                  กดการ์ดเพื่อเลือก • แก้ชื่อได้ใต้การ์ด
                </p>
              </div>
            </CardContent>
          )}
        </Card>
      ))}

      <SaveRow saving={saving} onSave={saveFacilities} />
    </div>
  );

  const renderLocation = () => (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => {
            const newIdx = nearbyPlaces.length;
            setNearbyPlaces([...nearbyPlaces, { distance: 0, unit: "กม.", name: "", category: "", details: [] }]);
            setExpandedPlace(newIdx);
          }}
        >
          <Plus size={14} /> เพิ่มสถานที่
        </Button>
      </div>

      {nearbyPlaces.length === 0 && (
        <p className="text-sm text-gray-400 text-center py-8">ยังไม่มีสถานที่ใกล้เคียง</p>
      )}

      {nearbyPlaces.map((place, pi) => (
        <Card key={pi}>
          <CardHeader className="cursor-pointer select-none" onClick={() => setExpandedPlace(expandedPlace === pi ? null : pi)}>
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-semibold">
                {place.name || `สถานที่ ${pi + 1}`}
                {place.distance > 0 && (
                  <span className="ml-2 text-xs font-normal text-gray-400">
                    ({place.distance} {place.unit})
                  </span>
                )}
              </CardTitle>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); setNearbyPlaces(nearbyPlaces.filter((_, j) => j !== pi)); }}
                  className="rounded p-1 text-gray-400 hover:text-red-500 hover:bg-red-50"
                >
                  <Trash2 size={14} />
                </button>
                {expandedPlace === pi ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </div>
            </div>
          </CardHeader>

          {expandedPlace === pi && (
            <CardContent className="space-y-3 pt-0">
              <div className="grid grid-cols-3 gap-2">
                <div className="space-y-1.5">
                  <Label>ระยะทาง</Label>
                  <Input
                    type="number"
                    value={place.distance}
                    onChange={(e) => updatePlace(pi, { distance: parseFloat(e.target.value) || 0 })}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>หน่วย</Label>
                  <Input
                    value={place.unit}
                    onChange={(e) => updatePlace(pi, { unit: e.target.value })}
                    placeholder="กม."
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>หมวดหมู่</Label>
                  <Input
                    value={place.category}
                    onChange={(e) => updatePlace(pi, { category: e.target.value })}
                    placeholder="ไลฟ์สไตล์"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label>ชื่อสถานที่หลัก</Label>
                <Input
                  value={place.name}
                  onChange={(e) => updatePlace(pi, { name: e.target.value })}
                  placeholder="เซ็นทรัลเฟสติวัล"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>สถานที่เพิ่มเติม</Label>
                  <Button type="button" variant="outline" size="sm" onClick={() => addPlaceDetail(pi)}>
                    <Plus size={14} /> เพิ่ม
                  </Button>
                </div>
                {place.details.map((detail, di) => (
                  <div key={di} className="flex gap-2">
                    <Input
                      value={detail}
                      onChange={(e) => updatePlaceDetail(pi, di, e.target.value)}
                      placeholder="ชื่อสถานที่..."
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="shrink-0"
                      onClick={() => removePlaceDetail(pi, di)}
                    >
                      <Trash2 size={14} />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          )}
        </Card>
      ))}

      <SaveRow saving={saving} onSave={saveLocation} />
    </div>
  );

  const renderMap = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader><CardTitle className="text-base">รูปแผนที่โครงการ</CardTitle></CardHeader>
        <CardContent>
          <ImageUploader
            bucket="project-detail-images"
            value={mapImageUrl}
            onChange={setMapImageUrl}
            onClear={() => setMapImageUrl("")}
            label="อัปโหลดรูปแผนที่"
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-base">Google Maps Embed URL</CardTitle></CardHeader>
        <CardContent>
          <div className="space-y-1.5">
            <Label>Embed URL</Label>
            <Input
              value={mapEmbedUrl}
              onChange={(e) => setMapEmbedUrl(e.target.value)}
              placeholder="https://www.google.com/maps/embed?pb=..."
            />
            <p className="text-xs text-gray-400">
              ไปที่ Google Maps → แชร์ → ฝังแผนที่ → คัดลอก URL จาก src=&quot;...&quot;
            </p>
          </div>
        </CardContent>
      </Card>

      <SaveRow saving={saving} onSave={saveMap} />
    </div>
  );

  const renderGallery = () => (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => setGalleryImages([...galleryImages, ""])}
        >
          <Plus size={14} /> เพิ่มรูป
        </Button>
      </div>

      {galleryImages.length === 0 && (
        <p className="text-sm text-gray-400 text-center py-8">ยังไม่มีรูปแกลเลอรี่</p>
      )}

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        {galleryImages.map((url, i) => (
          <div key={i} className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label className="text-xs text-gray-500">รูปที่ {i + 1}</Label>
              <button
                type="button"
                onClick={() => setGalleryImages(galleryImages.filter((_, j) => j !== i))}
                className="rounded p-0.5 text-gray-400 hover:text-red-500"
              >
                <Trash2 size={12} />
              </button>
            </div>
            <ImageUploader
              bucket="project-detail-images"
              value={url}
              onChange={(newUrl) => {
                const next = [...galleryImages];
                next[i] = newUrl;
                setGalleryImages(next);
              }}
              onClear={() => {
                const next = [...galleryImages];
                next[i] = "";
                setGalleryImages(next);
              }}
              label="อัปโหลด"
            />
          </div>
        ))}
      </div>

      <SaveRow saving={saving} onSave={saveGallery} />
    </div>
  );

  const tabContent: Record<TabId, () => React.ReactNode> = {
    hero: renderHero,
    info: renderInfo,
    houses: renderHouses,
    facilities: renderFacilities,
    location: renderLocation,
    map: renderMap,
    gallery: renderGallery,
  };

  return (
    <div>
      <AdminHeader
        title={`รายละเอียด: ${project.name}`}
        description="แก้ไขเนื้อหาหน้าโปรเจกต์"
        action={
          <Link href={backHref}>
            <Button variant="outline"><ArrowLeft size={16} />กลับ</Button>
          </Link>
        }
      />

      {/* Tab bar */}
      <div className="mb-6 flex flex-wrap gap-1 rounded-xl border border-gray-100 bg-gray-50 p-1">
        {TABS.map(({ id, label }) => (
          <button
            key={id}
            onClick={() => { setTab(id); setSaveMsg(null); }}
            className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-all ${
              tab === id
                ? "bg-white text-[#09418C] shadow-sm"
                : "text-gray-500 hover:text-gray-800"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="max-w-2xl">
        {tabContent[tab]()}
        {saveMsg && (
          saveMsg.type === "ok"
            ? <SaveSuccess msg={saveMsg.text} />
            : <SaveError msg={saveMsg.text} />
        )}
      </div>
    </div>
  );
}
