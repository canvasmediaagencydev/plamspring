"use client";

import { useState } from "react";
import ProjectHouseSlider, { type HouseType } from "./ProjectHouseSlider";
import ProjectFacilities, { type Facility } from "./ProjectFacilities";

export interface FacilityCard {
  linkedHouseName: string;
  image1: string;
  image2: string;
  facilities: Facility[];
}

interface Props {
  houses: HouseType[];
  cards: FacilityCard[];
}

export default function ProjectHousesAndFacilities({ houses, cards }: Props) {
  const [current, setCurrent] = useState(0);

  if (houses.length === 0) return null;

  const currentHouse = houses[current];
  const matchedCard =
    cards.find((c) => c.linkedHouseName && c.linkedHouseName === currentHouse.name) ??
    // Fallback: pre-migration legacy data stored a single unlinked card.
    cards.find((c) => !c.linkedHouseName);

  return (
    <>
      <ProjectHouseSlider
        houses={houses}
        current={current}
        onCurrentChange={setCurrent}
      />
      {matchedCard && (
        <ProjectFacilities
          facilities={matchedCard.facilities}
          image1={matchedCard.image1 || undefined}
          image2={matchedCard.image2 || undefined}
        />
      )}
    </>
  );
}
