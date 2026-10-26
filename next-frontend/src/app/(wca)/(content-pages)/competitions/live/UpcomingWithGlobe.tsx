"use client";

import { HStack, Box } from "@chakra-ui/react";
import LiveCompetitionsTable from "./LiveCompetitionsTable";
import Map from "@/components/map/Map";
import { components } from "@/types/openapi";
import { useRef } from "react";
import { MapRef } from "react-map-gl/maplibre";
import { useT } from "@/lib/i18n/useI18n";

type CompetitionIndex = components["schemas"]["CompetitionIndex"];

export default function UpcomingWithGlobe({
  competitions,
}: {
  competitions: CompetitionIndex[];
}) {
  const { t } = useT();
  const mapRef = useRef<MapRef>(null);

  return (
    <HStack>
      <Box flex={2}>
        <LiveCompetitionsTable
          competitions={competitions}
          onRowHover={(comp) =>
            mapRef.current?.flyTo({
              center: [comp.longitude_degrees, comp.latitude_degrees],
              duration: 1000,
            })
          }
          t={t}
        />
      </Box>
      <Box flex={1}>
        <Map
          ref={mapRef}
          competitions={competitions}
          projection="globe"
          initialZoom={1.5}
        />
      </Box>
    </HStack>
  );
}
