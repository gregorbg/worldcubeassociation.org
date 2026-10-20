import { cache } from "react";
import { serverClient } from "@/lib/wca/wcaAPI";

export const getRegulations = cache(async () => {
  return await serverClient.regulations();
});

export const getHistoricalRegulations = cache(async (version: string) => {
  return await serverClient.historicalRegulations({
    path: { version },
  });
});

export const getTranslatedRegulations = cache(async (language: string) => {
  return await serverClient.translatedRegulations({
    path: { language },
  });
});
